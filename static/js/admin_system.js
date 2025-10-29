// Fichier : static/js/admin_system.js
// Système d'administration avec tracking et réinitialisation

// // 🔒 Code protégé — ingénierie inverse interdite.
// Toute tentative de décryptage sera clairement identifier 😉
// CHAQUE CLIQUE EST ENREGISTRE MEME L'OUVERTURE DE LA CONSOLE VIA F12 ou shift ctrl C😉

                // D. BENMAKHLOUF

// ============================================
// CONFIGURATION ADMIN (OBFUSQUÉE LEGEREMENT)
// ============================================

// Code admin obfusqué avec algorithme personnalisé
// Méthode : XOR + Base64 + Rotation + Inversion
const ADMIN_CODE_ENCRYPTED = (() => {
    const parts = ['Qz', 'FG', 'Vj', 'Mg', 'Aw', 'Mj', 'U0', 'FE', 'TU', 'lO'];
    const key = [13, 7, 19, 3, 11, 17, 5, 23, 9, 15];
    return parts.map((p, i) => String.fromCharCode(p.charCodeAt(0) ^ key[i]) + 
                                String.fromCharCode(p.charCodeAt(1) ^ key[i])).join('');
})();

function decryptAdminCode(encrypted) {
    try {
        // Étape 1: Inversion
        const reversed = encrypted.split('').reverse().join('');
        
        // Étape 2: Rotation Caesar -3
        const rotated = reversed.split('').map(char => {
            if (char.match(/[A-Z]/)) {
                return String.fromCharCode(((char.charCodeAt(0) - 65 - 3 + 26) % 26) + 65);
            } else if (char.match(/[a-z]/)) {
                return String.fromCharCode(((char.charCodeAt(0) - 97 - 3 + 26) % 26) + 97);
            } else if (char.match(/[0-9]/)) {
                return String.fromCharCode(((char.charCodeAt(0) - 48 - 3 + 10) % 10) + 48);
            }
            return char;
        }).join('');
        
        // Étape 3: XOR avec clé
        const xorKey = 42;
        const xored = rotated.split('').map(char => 
            String.fromCharCode(char.charCodeAt(0) ^ xorKey)
        ).join('');
        
        // Étape 4: Base64 decode
        return atob(xored);
    } catch (e) {
        return null;
    }
}

// Fonction pour générer le code crypté (à utiliser une seule fois)
function _encryptAdminCode(plainCode) {
    // NE PAS APPELER - JUSTE POUR RÉFÉRENCE
    const base64 = btoa(plainCode);
    const xorKey = 42;
    const xored = base64.split('').map(char => 
        String.fromCharCode(char.charCodeAt(0) ^ xorKey)
    ).join('');
    const rotated = xored.split('').map(char => {
        if (char.match(/[A-Z]/)) {
            return String.fromCharCode(((char.charCodeAt(0) - 65 + 3) % 26) + 65);
        } else if (char.match(/[a-z]/)) {
            return String.fromCharCode(((char.charCodeAt(0) - 97 + 3) % 26) + 97);
        } else if (char.match(/[0-9]/)) {
            return String.fromCharCode(((char.charCodeAt(0) - 48 + 3) % 10) + 48);
        }
        return char;
    }).join('');
    return rotated.split('').reverse().join('');
}

// Vérifier si l'utilisateur est admin
function isAdminAuthenticated() {
    const adminSession = getSecureStorage('adminAuthenticated');
    if (!adminSession) return false;
    
    // Vérifier que la session n'a pas expiré (30 minutes)
    const now = Date.now();
    if (now - adminSession.timestamp > 30 * 60 * 1000) {
        removeSecureStorage('adminAuthenticated');
        return false;
    }
    
    return adminSession.authenticated === true;
}

// Authentifier l'admin
function authenticateAdmin(code) {
    // Code réel: CIEL2025ADMIN
    const validCode = "CIEL2025ADMIN"; // En production, utiliser decryptAdminCode(ADMIN_CODE_ENCRYPTED)
    if (code === validCode) {
        setSecureStorage('adminAuthenticated', {
            authenticated: true,
            timestamp: Date.now(),
            sessionId: Math.random().toString(36).substring(2, 15)
        });
        return true;
    }
    return false;
}

// Déconnecter l'admin
function logoutAdmin() {
    removeSecureStorage('adminAuthenticated');
    logUserAction('ADMIN_LOGOUT', {});
    alert('🔓 Déconnexion réussie !');
}

// ============================================
// SYSTÈME DE TRACKING DES ACTIONS
// ============================================

function logUserAction(action, details = {}) {
    const logs = getSecureStorage('userActivityLogs') || [];
    
    const logEntry = {
        timestamp: new Date().toISOString(),
        action: action,
        details: details,
        page: window.location.pathname.split('/').pop() || 'index.html',
        userAgent: navigator.userAgent.substring(0, 100),
        sessionId: getSecureStorage('examSessionId')
    };
    
    logs.push(logEntry);
    
    // Garder seulement les 500 dernières actions
    if (logs.length > 500) {
        logs.splice(0, logs.length - 500);
    }
    
    setSecureStorage('userActivityLogs', logs);
}

// Tracker automatique des événements importants
function initializeActivityTracking() {
    // Track page load
    logUserAction('PAGE_LOAD', {
        referrer: document.referrer
    });
    
    // Track clicks sur les boutons importants
    document.addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.tagName === 'BUTTON' || target.classList.contains('button')) {
            logUserAction('BUTTON_CLICK', {
                buttonText: target.textContent.substring(0, 50),
                buttonId: target.id
            });
        }
        
        // Track réponses aux questions
        if (target.tagName === 'INPUT' && target.type === 'radio') {
            logUserAction('ANSWER_SELECTED', {
                questionId: target.name,
                answerId: target.value
            });
        }
    });
    
    // Track tentatives de retour en arrière
    let backAttempts = 0;
    window.addEventListener('popstate', () => {
        backAttempts++;
        logUserAction('BACK_BUTTON_ATTEMPT', {
            attempts: backAttempts
        });
    });
    
    // Track temps passé sur la page
    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        logUserAction('PAGE_LEAVE', {
            timeSpent: timeSpent
        });
    });
    
    // Track visibilité de la page (détection de triche potentielle)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            logUserAction('TAB_HIDDEN', {
                examActive: getSecureStorage('examActive')
            });
        } else {
            logUserAction('TAB_VISIBLE', {
                examActive: getSecureStorage('examActive')
            });
        }
    });
    
    // Track copier/coller (suspicion de triche)
    document.addEventListener('copy', () => {
        logUserAction('COPY_DETECTED', {});
    });
    
    document.addEventListener('paste', () => {
        logUserAction('PASTE_DETECTED', {});
    });
    
    // Track tentatives d'ouverture de la console développeur
    const devtoolsCheck = () => {
        const threshold = 160;
        if (window.outerWidth - window.innerWidth > threshold || 
            window.outerHeight - window.innerHeight > threshold) {
            logUserAction('DEVTOOLS_SUSPECTED', {
                widthDiff: window.outerWidth - window.innerWidth,
                heightDiff: window.outerHeight - window.innerHeight
            });
        }
    };
    setInterval(devtoolsCheck, 5000);
}

// ============================================
// INTERFACE ADMIN
// ============================================

function createAdminPanel() {
    // Vérifier si le panneau existe déjà
    if (document.getElementById('admin-panel-overlay')) {
        return;
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'admin-panel-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-y: auto;
        padding: 20px;
    `;
    
    const panel = document.createElement('div');
    panel.style.cssText = `
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 15px;
        padding: 30px;
        max-width: 900px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        color: #fff;
        font-family: 'Inter', sans-serif;
    `;
    
    const examData = {
        sessionId: getSecureStorage('examSessionId'),
        startTime: getSecureStorage('examStartTime'),
        examActive: getSecureStorage('examActive'),
        qcmScore: getSecureStorage('qcmScore'),
        exerciceScore: getSecureStorage('exerciceScore'),
        qcmAnswers: getSecureStorage('qcmUserAnswers'),
        exerciceAnswers: getSecureStorage('exerciceUserAnswers'),
        studentInfo: getSecureStorage('studentName')
    };
    
    const logs = getSecureStorage('userActivityLogs') || [];
    const recentLogs = logs.slice(-20).reverse();
    
    // Statistiques
    const totalActions = logs.length;
    const backAttempts = logs.filter(l => l.action === 'BACK_BUTTON_ATTEMPT').length;
    const tabSwitches = logs.filter(l => l.action === 'TAB_HIDDEN').length;
    const devtoolsAttempts = logs.filter(l => l.action === 'DEVTOOLS_SUSPECTED').length;
    const copySuspicions = logs.filter(l => l.action === 'COPY_DETECTED' || l.action === 'PASTE_DETECTED').length;
    
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 2px solid #e74c3c; padding-bottom: 15px;">
            <h2 style="margin: 0; color: #e74c3c; font-size: 28px;">
                🛡️ Panneau Administrateur
            </h2>
            <div style="display: flex; gap: 10px;">
                <button id="logout-admin-btn" style="
                    background: #f39c12;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 14px;
                ">🔓 Déconnexion</button>
                <button id="close-admin-panel" style="
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 16px;
                ">✖ Fermer</button>
            </div>
        </div>
        
        <!-- Info Session Admin -->
        <div style="background: rgba(243, 156, 18, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #f39c12;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 14px;">
                    <strong>👨‍💼 Session Admin Active</strong>
                    <br>
                    <span style="opacity: 0.8; font-size: 12px;">
                        Connecté depuis ${Math.floor((Date.now() - getSecureStorage('adminAuthenticated')?.timestamp) / 60000)} min
                        | Session expire dans ${30 - Math.floor((Date.now() - getSecureStorage('adminAuthenticated')?.timestamp) / 60000)} min
                    </span>
                </div>
            </div>
        </div>
        
        <!-- Informations Étudiant -->
        ${examData.studentInfo ? `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px; color: white;">
            <h3 style="margin-top: 0; font-size: 20px;">👤 Étudiant Identifié</h3>
            <div style="font-size: 24px; font-weight: bold; text-align: center; margin: 10px 0;">
                ${examData.studentInfo.fullName}
            </div>
            <div style="text-align: center; font-size: 12px; opacity: 0.9;">
                Identifié le : ${new Date(examData.studentInfo.timestamp).toLocaleString('fr-FR')}
            </div>
        </div>
        ` : `
        <div style="background: rgba(231,76,60,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #e74c3c; color: white;">
            <h3 style="margin-top: 0; color: #e74c3c;">⚠️ Aucun Étudiant Identifié</h3>
            <p style="margin: 0; color: #ecf0f1;">L'étudiant n'a pas encore saisi son nom et prénom</p>
        </div>
        `}
        
        <!-- Informations Session -->
        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #3498db; margin-top: 0;">📊 Informations Session</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                <div><strong>ID Session :</strong> ${examData.sessionId || 'Non démarré'}</div>
                <div><strong>Examen actif :</strong> ${examData.examActive ? '✅ Oui' : '❌ Non'}</div>
                <div><strong>Heure début :</strong> ${examData.startTime ? new Date(examData.startTime).toLocaleString('fr-FR') : 'N/A'}</div>
                <div><strong>Temps écoulé :</strong> ${examData.startTime ? Math.floor((Date.now() - examData.startTime) / 60000) + ' min' : 'N/A'}</div>
                <div><strong>Partie 1 complétée :</strong> ${examData.qcmScore?.completed ? '✅ Oui' : '❌ Non'}</div>
                <div><strong>Partie 2 complétée :</strong> ${examData.exerciceScore?.completed ? '✅ Oui' : '❌ Non'}</div>
            </div>
        </div>
        
        <!-- Statistiques d'activité suspecte -->
        <div style="background: rgba(231,76,60,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px; border: 2px solid #e74c3c;">
            <h3 style="color: #e74c3c; margin-top: 0;">⚠️ Détection d'Activités Suspectes</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; font-size: 14px;">
                <div style="text-align: center; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold; color: ${backAttempts > 0 ? '#e74c3c' : '#2ecc71'};">${backAttempts}</div>
                    <div style="font-size: 12px; margin-top: 5px;">Retours arrière</div>
                </div>
                <div style="text-align: center; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold; color: ${tabSwitches > 5 ? '#e74c3c' : '#f39c12'};">${tabSwitches}</div>
                    <div style="font-size: 12px; margin-top: 5px;">Changements onglet</div>
                </div>
                <div style="text-align: center; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold; color: ${devtoolsAttempts > 0 ? '#e74c3c' : '#2ecc71'};">${devtoolsAttempts}</div>
                    <div style="font-size: 12px; margin-top: 5px;">Console ouverte</div>
                </div>
                <div style="text-align: center; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px;">
                    <div style="font-size: 24px; font-weight: bold; color: ${copySuspicions > 0 ? '#e74c3c' : '#2ecc71'};">${copySuspicions}</div>
                    <div style="font-size: 12px; margin-top: 5px;">Copier/Coller</div>
                </div>
            </div>
        </div>
        
        <!-- Scores détaillés -->
        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #2ecc71; margin-top: 0;">📝 Scores Détaillés</h3>
            <div style="font-size: 14px;">
                <div style="margin-bottom: 10px;">
                    <strong>Partie 1 :</strong> ${examData.qcmScore ? `${examData.qcmScore.rawScore}/${examData.qcmScore.totalQuestions}` : 'Non complété'}
                </div>
                <div>
                    <strong>Partie 2 :</strong> ${examData.exerciceScore ? `${examData.exerciceScore.rawScore}/${examData.exerciceScore.totalQuestions}` : 'Non complété'}
                </div>
            </div>
        </div>
        
        <!-- Journal d'activité -->
        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="color: #f39c12; margin-top: 0;">📜 Dernières Actions (${totalActions} total)</h3>
            <div style="max-height: 250px; overflow-y: auto; font-size: 12px; font-family: 'Courier New', monospace;">
                ${recentLogs.map(log => `
                    <div style="padding: 8px; margin-bottom: 5px; background: rgba(0,0,0,0.3); border-radius: 5px; border-left: 3px solid ${getActionColor(log.action)};">
                        <strong>${new Date(log.timestamp).toLocaleTimeString('fr-FR')}</strong> - 
                        <span style="color: ${getActionColor(log.action)};">${log.action}</span>
                        ${log.details && Object.keys(log.details).length > 0 ? `<br><span style="color: #95a5a6; font-size: 11px;">${JSON.stringify(log.details)}</span>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Actions admin -->
        <div style="background: rgba(231,76,60,0.1); padding: 20px; border-radius: 10px; border: 2px solid #e74c3c;">
            <h3 style="color: #e74c3c; margin-top: 0;">⚡ Actions Administrateur</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <button id="export-logs-btn" style="
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 14px;
                ">📥 Exporter les logs (JSON)</button>
                
                <button id="clear-logs-btn" style="
                    background: #f39c12;
                    color: white;
                    border: none;
                    padding: 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 14px;
                ">🗑️ Effacer les logs</button>
                
                <button id="reset-exam-btn" style="
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 14px;
                    grid-column: span 2;
                ">🔄 RÉINITIALISER L'ÉVALUATION COMPLÈTE</button>
            </div>
        </div>
    `;
    
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
    
    // Event listeners
    document.getElementById('close-admin-panel').onclick = () => {
        document.body.removeChild(overlay);
    };
    
    document.getElementById('logout-admin-btn').onclick = () => {
        if (confirm('🔓 Voulez-vous vraiment vous déconnecter du panneau admin ?')) {
            logoutAdmin();
            document.body.removeChild(overlay);
        }
    };
    
    document.getElementById('export-logs-btn').onclick = exportLogs;
    document.getElementById('clear-logs-btn').onclick = clearLogs;
    document.getElementById('reset-exam-btn').onclick = resetExam;
}

function getActionColor(action) {
    const colors = {
        'PAGE_LOAD': '#3498db',
        'BUTTON_CLICK': '#2ecc71',
        'ANSWER_SELECTED': '#9b59b6',
        'BACK_BUTTON_ATTEMPT': '#e74c3c',
        'TAB_HIDDEN': '#e67e22',
        'TAB_VISIBLE': '#1abc9c',
        'DEVTOOLS_SUSPECTED': '#c0392b',
        'COPY_DETECTED': '#e74c3c',
        'PASTE_DETECTED': '#e74c3c',
        'PAGE_LEAVE': '#95a5a6'
    };
    return colors[action] || '#ecf0f1';
}

function exportLogs() {
    const logs = getSecureStorage('userActivityLogs') || [];
    const examData = {
        sessionId: getSecureStorage('examSessionId'),
        startTime: getSecureStorage('examStartTime'),
        examActive: getSecureStorage('examActive'),
        qcmScore: getSecureStorage('qcmScore'),
        exerciceScore: getSecureStorage('exerciceScore'),
        exportDate: new Date().toISOString()
    };
    
    const exportData = {
        examInfo: examData,
        activityLogs: logs,
        totalActions: logs.length
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam_logs_${examData.sessionId || 'no_session'}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('✅ Logs exportés avec succès !');
}

function clearLogs() {
    if (confirm('⚠️ Êtes-vous sûr de vouloir effacer tous les logs ?\n\nCette action est irréversible.')) {
        setSecureStorage('userActivityLogs', []);
        alert('✅ Logs effacés !');
        document.getElementById('admin-panel-overlay').remove();
        createAdminPanel();
    }
}

function resetExam() {
    if (confirm('⚠️⚠️⚠️ ATTENTION ⚠️⚠️⚠️\n\nVous êtes sur le point de RÉINITIALISER COMPLÈTEMENT l\'évaluation.\n\nCela va effacer :\n- Toutes les réponses\n- Les scores\n- La session d\'examen\n- Le timer\n- Le nom de l\'étudiant\n- Les logs d\'activité\n\nCette action est IRRÉVERSIBLE.\n\nÊtes-vous ABSOLUMENT SÛR ?')) {
        if (confirm('DERNIÈRE CONFIRMATION : Tapez OK pour confirmer la réinitialisation totale.')) {
            // Effacer toutes les données
            const keysToRemove = [
                'examSessionId',
                'examStartTime',
                'examActive',
                'qcmUserAnswers',
                'exerciceUserAnswers',
                'qcmScore',
                'exerciceScore',
                'examCompletedGlobally',
                'userActivityLogs',
                'studentName',  // Nouveau : effacer le nom de l'étudiant
                'adminAuthenticated'  // Déconnecter l'admin aussi
            ];
            
            keysToRemove.forEach(key => {
                removeSecureStorage(key);
            });
            
            alert('✅ Évaluation complètement réinitialisée !\n\nRedirection vers la page d\'accueil...');
            window.location.replace('index.html');
        }
    }
}

function removeSecureStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {}
    try {
        sessionStorage.removeItem(key);
    } catch (e) {}
    try {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    } catch (e) {}
}

// ============================================
// BOUTON ADMIN DISCRET AVEC INDICATEUR DE CONNEXION
// ============================================

function createAdminButton() {
    const button = document.createElement('div');
    button.id = 'admin-access-button';
    button.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 15px;
        height: 15px;
        background: rgba(231, 76, 60, 0.3);
        border-radius: 50%;
        cursor: pointer;
        z-index: 99998;
        transition: all 0.3s ease;
    `;
    
    // Vérifier si admin est connecté et changer la couleur
    function updateButtonState() {
        if (isAdminAuthenticated()) {
            button.style.background = 'rgba(46, 204, 113, 0.5)'; // Vert si connecté
            button.style.boxShadow = '0 0 10px rgba(46, 204, 113, 0.7)';
        } else {
            button.style.background = 'rgba(231, 76, 60, 0.3)'; // Rouge si déconnecté
            button.style.boxShadow = 'none';
        }
    }
    
    updateButtonState();
    setInterval(updateButtonState, 1000); // Vérifier toutes les secondes
    
    button.addEventListener('mouseenter', () => {
        if (isAdminAuthenticated()) {
            button.style.background = 'rgba(46, 204, 113, 0.9)';
        } else {
            button.style.background = 'rgba(231, 76, 60, 0.8)';
        }
        button.style.width = '25px';
        button.style.height = '25px';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.width = '15px';
        button.style.height = '15px';
        updateButtonState();
    });
    
    button.addEventListener('click', showAdminLogin);
    
    document.body.appendChild(button);
}

function showAdminLogin() {
    if (isAdminAuthenticated()) {
        createAdminPanel();
        return;
    }
    
    const code = prompt('🔐 Code administrateur requis :');
    if (!code) return;
    
    if (authenticateAdmin(code)) {
        alert('✅ Authentification réussie !');
        logUserAction('ADMIN_LOGIN_SUCCESS', {});
        createAdminPanel();
    } else {
        alert('❌ Code incorrect !');
        logUserAction('ADMIN_LOGIN_FAILED', { attemptedCode: code.substring(0, 3) + '***' });
    }
}

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le tracking
    initializeActivityTracking();
    
    // Créer le bouton admin
    setTimeout(createAdminButton, 2000);
    
    // Logs obfusqués pour la console
    const logs = [
        '%c🛡️ Système d\'administration actif',
        'color: #e74c3c; font-size: 14px; font-weight: bold;',
        '%cProtection multicouche activée',
        'color: #95a5a6; font-size: 12px;'
    ];
    console.log(logs[0], logs[1]);
    console.log(logs[2], logs[3]);
    
    // Ne plus afficher le code crypté dans la console
    // console.log('%cCode admin crypté : ' + ADMIN_CODE_ENCRYPTED, 'color: #95a5a6; font-size: 12px;');
});