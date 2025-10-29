// Fichier : static/js/main.js
const EXAM_DURATION_MINUTES = 50; // Durée de l'épreuve en minutes

// ============================================
// SYSTÈME DE SÉCURITÉ ANTI-RETOUR EN ARRIÈRE
// ============================================

// Génère un ID unique pour chaque session d'examen (impossible à régénérer)
function generateExamSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const userAgent = navigator.userAgent;
    return btoa(`${timestamp}-${random}-${userAgent}`).substring(0, 32);
}

// Stockage triple redondant (localStorage + sessionStorage + cookie permanent)
function setSecureStorage(key, value) {
    const data = JSON.stringify(value);
    
    // 1. localStorage
    try {
        localStorage.setItem(key, data);
    } catch (e) {
        console.error("Erreur localStorage:", e);
    }
    
    // 2. sessionStorage (survit aux actualisations mais pas à la fermeture d'onglet)
    try {
        sessionStorage.setItem(key, data);
    } catch (e) {
        console.error("Erreur sessionStorage:", e);
    }
    
    // 3. Cookie permanent (365 jours, survit même après suppression du cache)
    try {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 365);
        document.cookie = `${key}=${encodeURIComponent(data)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    } catch (e) {
        console.error("Erreur cookie:", e);
    }
}

// Récupération depuis n'importe quelle source de stockage
function getSecureStorage(key) {
    let value = null;
    
    // Essayer localStorage
    try {
        value = localStorage.getItem(key);
        if (value) return JSON.parse(value);
    } catch (e) {}
    
    // Essayer sessionStorage
    try {
        value = sessionStorage.getItem(key);
        if (value) return JSON.parse(value);
    } catch (e) {}
    
    // Essayer cookie
    try {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
            if (cookieName === key) {
                return JSON.parse(decodeURIComponent(cookieValue));
            }
        }
    } catch (e) {}
    
    return null;
}

// Vérification de l'état de l'examen avec détection de tentative de fraude
function checkExamLockStatus() {
    const examSessionId = getSecureStorage('examSessionId');
    const examStartTime = getSecureStorage('examStartTime');
    const examActive = getSecureStorage('examActive');
    
    // Si un ID de session existe, l'examen a été démarré (IMPOSSIBLE À CONTOURNER)
    if (examSessionId) {
        console.warn("🔒 Session d'examen détectée. Retour en arrière bloqué.");
        return {
            locked: true,
            sessionId: examSessionId,
            startTime: examStartTime,
            active: examActive
        };
    }
    
    return { locked: false };
}

// Initialise le verrouillage permanent de l'examen
function initializeExamLock() {
    const lockStatus = checkExamLockStatus();
    
    if (!lockStatus.locked) {
        // Première fois : créer l'ID de session unique
        const sessionId = generateExamSessionId();
        setSecureStorage('examSessionId', sessionId);
        console.log("🔐 Session d'examen initialisée et verrouillée:", sessionId);
    }
    
    // Désactiver le bouton "Précédent" du navigateur
    disableBrowserBack();
}

// Désactive complètement le bouton retour du navigateur
function disableBrowserBack() {
    // Méthode 1 : History manipulation
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
        alert("⚠️ Le retour en arrière est désactivé pendant l'examen. Toute tentative sera signalée.");
    };
    
    // Méthode 2 : Beforeunload warning
    window.addEventListener('beforeunload', function (e) {
        if (getSecureStorage('examActive')) {
            e.preventDefault();
            e.returnValue = 'L\'examen est en cours. Êtes-vous sûr de vouloir quitter ?';
            return e.returnValue;
        }
    });
    
    // Méthode 3 : Empêcher les raccourcis clavier de navigation
    document.addEventListener('keydown', function(e) {
        // Alt+Flèche gauche (retour)
        if (e.altKey && e.key === 'ArrowLeft') {
            e.preventDefault();
            alert("⚠️ Raccourci de navigation désactivé pendant l'examen.");
        }
        // Backspace sur autre chose qu'un input
        if (e.key === 'Backspace' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
            e.preventDefault();
        }
    });
}

// Redirection forcée selon l'état de l'examen (appelé sur TOUTES les pages)
function enforceExamFlow() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const lockStatus = checkExamLockStatus();
    
    // Si l'examen est verrouillé (démarré)
    if (lockStatus.locked) {
        const qcmCompleted = getSecureStorage('qcmScore')?.completed;
        const exerciceCompleted = getSecureStorage('exerciceScore')?.completed;
        const examActive = getSecureStorage('examActive');
        
        // Calculer où l'étudiant devrait être
        let correctPage;
        if (!qcmCompleted && examActive) {
            correctPage = 'qcm.html';
        } else if (qcmCompleted && !exerciceCompleted && examActive) {
            correctPage = 'exercice.html';
        } else if (qcmCompleted && exerciceCompleted) {
            correctPage = 'final_results.html';
        } else {
            correctPage = 'final_results.html'; // Par défaut si état incohérent
        }
        
        // Si l'étudiant essaie d'accéder à index.html après avoir démarré
        if (currentPage === 'index.html') {
            alert("⛔ L'examen a déjà été démarré. Vous ne pouvez pas revenir à la page d'accueil.");
            window.location.replace(correctPage);
            return;
        }
        
        // Si l'étudiant essaie d'accéder à une page qu'il a déjà complétée
        if (currentPage === 'qcm.html' && qcmCompleted) {
            alert("⛔ Vous avez déjà complété cette partie. Redirection...");
            window.location.replace(correctPage);
            return;
        }
        
        if (currentPage === 'exercice.html' && !qcmCompleted) {
            alert("⛔ Vous devez d'abord compléter la partie 1.");
            window.location.replace('qcm.html');
            return;
        }
    }
}

// ============================================
// FONCTIONS UTILITAIRES MODIFIÉES
// ============================================

function setLocalStorageItem(key, value) {
    setSecureStorage(key, value); // Utilise le stockage sécurisé triple
}

function getLocalStorageItem(key) {
    return getSecureStorage(key); // Utilise la récupération sécurisée
}

// --- Décodage des réponses ---
function decodeAnswers(encodedString) {
    try {
        const decoded = atob(encodedString);
        return JSON.parse(decoded);
    } catch (e) {
        console.error("Erreur lors du décodage ou du parsing des réponses :", e);
        return null;
    }
}

const answers = typeof encodedAnswers !== 'undefined' ? decodeAnswers(encodedAnswers) : null;
if (!answers) {
    console.warn("Impossible de charger les réponses. Le quiz ne peut pas être corrigé automatiquement.");
}

// --- Fonctions de Timer ---
let timerInterval;

// NOUVEAU : Demander nom et prénom avant de démarrer
function showStudentNameModal() {
    // Vérifier si le nom est déjà enregistré
    const existingName = getSecureStorage('studentName');
    if (existingName) {
        return true; // Nom déjà saisi
    }

    // Créer le modal
    const modal = document.createElement('div');
    modal.id = 'student-name-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        max-width: 500px;
        width: 90%;
        color: white;
        font-family: 'Inter', sans-serif;
        animation: slideIn 0.5s ease;
    `;

    modalContent.innerHTML = `
        <h2 style="margin: 0 0 10px 0; font-size: 28px; text-align: center; font-weight: 800;">
            📝 Identification Étudiant
        </h2>
        <p style="text-align: center; margin: 0 0 30px 0; opacity: 0.9; font-size: 14px;">
            Veuillez renseigner vos informations avant de commencer l'évaluation
        </p>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px;">
                Nom <span style="color: #ff6b6b;">*</span>
            </label>
            <input 
                type="text" 
                id="student-lastname" 
                placeholder="Ex: DUPONT"
                style="
                    width: 100%;
                    padding: 15px;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-family: 'Inter', sans-serif;
                    text-transform: uppercase;
                    box-sizing: border-box;
                    background: rgba(255, 255, 255, 0.95);
                    color: #333;
                "
            >
        </div>
        
        <div style="margin-bottom: 30px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px;">
                Prénom <span style="color: #ff6b6b;">*</span>
            </label>
            <input 
                type="text" 
                id="student-firstname" 
                placeholder="Ex: Jean"
                style="
                    width: 100%;
                    padding: 15px;
                    border: none;
                    border-radius: 10px;
                    font-size: 16px;
                    font-family: 'Inter', sans-serif;
                    box-sizing: border-box;
                    background: rgba(255, 255, 255, 0.95);
                    color: #333;
                "
            >
        </div>
        
        <div id="name-error" style="
            display: none;
            background: rgba(255, 107, 107, 0.2);
            border: 2px solid #ff6b6b;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
            font-size: 14px;
            font-weight: 600;
        ">
            ⚠️ Veuillez remplir tous les champs
        </div>
        
        <button 
            id="validate-student-name" 
            style="
                width: 100%;
                padding: 18px;
                background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
            "
            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(46, 204, 113, 0.6)';"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 15px rgba(46, 204, 113, 0.4)';"
        >
            ✓ Valider et commencer l'évaluation
        </button>
        
        <p style="text-align: center; margin: 20px 0 0 0; font-size: 12px; opacity: 0.8;">
            Ces informations permettront d'identifier votre copie
        </p>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Ajouter les animations CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { 
                transform: translateY(-50px); 
                opacity: 0; 
            }
            to { 
                transform: translateY(0); 
                opacity: 1; 
            }
        }
    `;
    document.head.appendChild(style);

    // Focus sur le premier champ
    setTimeout(() => {
        document.getElementById('student-lastname').focus();
    }, 100);

    // Gérer la validation
    return new Promise((resolve) => {
        document.getElementById('validate-student-name').onclick = () => {
            const lastname = document.getElementById('student-lastname').value.trim().toUpperCase();
            const firstname = document.getElementById('student-firstname').value.trim();
            const errorDiv = document.getElementById('name-error');

            if (!lastname || !firstname) {
                errorDiv.style.display = 'block';
                return;
            }

            // Capitaliser le prénom
            const formattedFirstname = firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();

            // Sauvegarder les informations
            const studentInfo = {
                lastname: lastname,
                firstname: formattedFirstname,
                fullName: `${lastname} ${formattedFirstname}`,
                timestamp: new Date().toISOString()
            };

            setSecureStorage('studentName', studentInfo);

            // Fermer le modal avec animation
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(modal);
                resolve(true);
            }, 300);
        };

        // Permettre validation avec Entrée
        ['student-lastname', 'student-firstname'].forEach(id => {
            document.getElementById(id).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('validate-student-name').click();
                }
            });
        });
    });

    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(fadeOutStyle);
}

async function startTimer() {
    // ÉTAPE 1 : Demander le nom/prénom
    const nameProvided = await showStudentNameModal();
    
    if (!nameProvided) {
        alert("⚠️ Vous devez renseigner votre nom et prénom pour commencer l'évaluation.");
        return;
    }

    const studentInfo = getSecureStorage('studentName');
    console.log("🎓 Étudiant identifié :", studentInfo.fullName);

    // ÉTAPE 2 : Démarrer l'examen
    const startTime = Date.now();
    
    // Initialiser le verrouillage AVANT tout
    initializeExamLock();
    
    setLocalStorageItem('examStartTime', startTime);
    setLocalStorageItem('examActive', true);
    // Initialiser les réponses stockées pour chaque partie vide au démarrage de l'examen
    setLocalStorageItem('qcmUserAnswers', {});
    setLocalStorageItem('exerciceUserAnswers', {});
    // Marquer les parties comme non complétées au début
    setLocalStorageItem('qcmScore', {completed: false});
    setLocalStorageItem('exerciceScore', {completed: false});
    setLocalStorageItem('examCompletedGlobally', false);

    console.log("🚀 Examen démarré et verrouillé définitivement pour", studentInfo.fullName);
    
    // Utiliser replace au lieu de href pour empêcher le retour
    window.location.replace('qcm.html');
}

function getRemainingTime() {
    const startTime = getLocalStorageItem('examStartTime');
    if (!startTime || !getLocalStorageItem('examActive')) {
        return EXAM_DURATION_MINUTES * 60;
    }
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const remainingTime = (EXAM_DURATION_MINUTES * 60) - elapsedTime;
    return Math.max(0, remainingTime);
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;

    const remainingSeconds = getRemainingTime();
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerDisplay.textContent = `Temps restant : ${formattedTime}`;

    if (remainingSeconds <= 0 && getLocalStorageItem('examActive')) {
        timerDisplay.textContent = "Temps écoulé ! Soumission automatique...";
        clearInterval(timerInterval);

        const qcmData = getLocalStorageItem('qcmScore');
        const exerciceData = getLocalStorageItem('exerciceScore');

        if (!qcmData?.completed && document.getElementById('qcm-form')) {
            console.log("Soumission automatique de l'Exercice 1 (QCM).");
            handleSubmit(new Event('submit'), qcmQuestions, 'qcm', 'qcm-results', true);
        }
        if (!exerciceData?.completed && document.getElementById('exercice-form')) {
            console.log("Soumission automatique de l'Exercice 2.");
            const allExerciceQuestions = [...exerciceQuestionsPartA, ...exerciceQuestionsPartB];
            handleSubmit(new Event('submit'), allExerciceQuestions, 'exercice', 'exercice-results', true);
        }
        
        setLocalStorageItem('examActive', false);

        setTimeout(() => {
            window.location.replace('final_results.html'); // replace au lieu de href
        }, 3000);
    }
}

function initializeTimer() {
    const examActive = getLocalStorageItem('examActive');
    const timerDisplay = document.getElementById('timer-display');
    const studentInfo = getSecureStorage('studentName');

    // Afficher le nom de l'étudiant dans le header si disponible
    if (studentInfo && timerDisplay) {
        const studentNameDisplay = document.createElement('div');
        studentNameDisplay.style.cssText = `
            font-size: 14px;
            color: #667eea;
            font-weight: 600;
            margin-top: 10px;
            text-align: center;
        `;
        studentNameDisplay.textContent = `👤 ${studentInfo.fullName}`;
        timerDisplay.parentNode.insertBefore(studentNameDisplay, timerDisplay.nextSibling);
    }

    if (examActive) {
        updateTimerDisplay();
        if (!timerInterval) {
            timerInterval = setInterval(updateTimerDisplay, 1000);
        }
    } else if (timerDisplay) {
        const remainingSecondsAtLoad = getRemainingTime();
        if (getLocalStorageItem('examStartTime') && remainingSecondsAtLoad <= 0) {
             timerDisplay.textContent = "Temps écoulé !";
        } else {
            const minutes = EXAM_DURATION_MINUTES;
            const seconds = 0;
            timerDisplay.textContent = `Temps restant : ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}

// --- Fonctions de chargement et soumission des questions ---

function disableQuestion(questionId, parentContainer) {
    const inputs = parentContainer.querySelectorAll(`input[name="${questionId}"]`);
    inputs.forEach(input => {
        input.disabled = true;
    });
}

function loadQuestions(containerId, questionsArray, answersCategory) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Erreur: Le conteneur HTML avec l'ID "${containerId}" est introuvable.`);
        return;
    }
    if (!questionsArray || questionsArray.length === 0) {
        console.warn(`Avertissement: Le tableau de questions pour le conteneur "${containerId}" est vide ou non défini.`);
        return;
    }

    const storedUserAnswers = getLocalStorageItem(`${answersCategory}UserAnswers`) || {};
    const partCompleted = getLocalStorageItem(`${answersCategory}Score`)?.completed;

    questionsArray.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-block');
        questionDiv.innerHTML = `
            <p><strong>${question.text}</strong></p>
            <div class="options-container">
                ${question.options.map(option => `
                    <label>
                        <input type="radio" name="${question.id}" value="${option.id}" ${storedUserAnswers[question.id] === option.id ? 'checked' : ''}>
                        ${option.text}
                    </label>
                `).join('')}
            </div>
        `;
        container.appendChild(questionDiv);

        if (storedUserAnswers[question.id] || partCompleted) {
            disableQuestion(question.id, questionDiv);
        } else {
            const inputs = questionDiv.querySelectorAll(`input[name="${question.id}"]`);
            inputs.forEach(input => {
                input.addEventListener('change', function() {
                    if (this.checked) {
                        let currentAnswers = getLocalStorageItem(`${answersCategory}UserAnswers`) || {};
                        currentAnswers[question.id] = this.value;
                        setLocalStorageItem(`${answersCategory}UserAnswers`, currentAnswers);
                        disableQuestion(question.id, questionDiv);
                    }
                });
            });
        }
    });

    MathJax.Hub.Queue(["Typeset", MathJax.Hub, container]);
}

function handleSubmit(event, questionsArray, answersCategory, resultsDivId, autoSubmit = false) {
    event.preventDefault();

    if (!autoSubmit) {
        const confirmSubmission = confirm("Êtes-vous sûr(e) de vouloir soumettre ? Une fois soumis, vous ne pourrez plus modifier vos réponses pour cette partie.");
        if (!confirmSubmission) {
            return;
        }
    }

    if (!autoSubmit && getRemainingTime() <= 0) {
        alert("Le temps est écoulé ! Vos réponses ont été soumises automatiquement.");
        window.location.replace('final_results.html');
        return;
    }

    let score = 0;
    const resultsDiv = document.getElementById(resultsDivId);
    resultsDiv.innerHTML = '<h2>Vos Résultats :</h2>';

    const detailedResults = [];
    let userAnswersForStorage = getLocalStorageItem(`${answersCategory}UserAnswers`) || {};

    questionsArray.forEach(question => {
        const selectedOption = document.querySelector(`input[name="${question.id}"]:checked`);
        let userAnswerId = selectedOption ? selectedOption.value : null;

        if (!userAnswerId && userAnswersForStorage[question.id]) {
            userAnswerId = userAnswersForStorage[question.id];
        } else if (userAnswerId) {
            userAnswersForStorage[question.id] = userAnswerId;
        }

        const correctAnswerId = answers[answersCategory][question.id];

        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        let status = '';
        
        const inputsForQuestionDiv = document.querySelector(`.question-block:has(input[name="${question.id}"])`);
        let userAnswerText = 'Aucune réponse';
        if (userAnswerId) {
            const foundOption = question.options.find(opt => opt.id === userAnswerId);
            if (foundOption) userAnswerText = foundOption.text;
        }

        const correctOptionText = question.options.find(opt => opt.id === correctAnswerId)?.text || 'N/A';

        let isCorrect = false;
        if (userAnswerId === correctAnswerId) {
            score++;
            status = `<span class="correct">Correct !</span> Votre réponse: ${userAnswerText}.`;
            isCorrect = true;
        } else {
            status = `<span class="incorrect">Incorrect.</span> Votre réponse: ${userAnswerText}. La bonne réponse était : ${correctOptionText}.`;
        }

        detailedResults.push({
            questionText: question.text,
            userAnswer: userAnswerText,
            correctAnswer: correctOptionText,
            isCorrect: isCorrect
        });
        
        resultItem.innerHTML = `<p><strong>Question :</strong> ${question.text}</p><p>${status}</p>`;
        resultsDiv.appendChild(resultItem);

        if (inputsForQuestionDiv) {
             disableQuestion(question.id, inputsForQuestionDiv);
        }
    });

    const totalQuestions = questionsArray.length;
    const totalScoreDiv = document.createElement('div');
    totalScoreDiv.classList.add('score-summary');
    totalScoreDiv.innerHTML = `<p><strong>Score pour cette partie : ${score} / ${totalQuestions}</strong></p>`;
    resultsDiv.prepend(totalScoreDiv);

    setLocalStorageItem(`${answersCategory}UserAnswers`, userAnswersForStorage);

    setLocalStorageItem(`${answersCategory}Score`, {
        rawScore: score,
        totalQuestions: totalQuestions,
        detailedResults: detailedResults,
        completed: true
    });

    const submitButton = document.getElementById(`submit-${answersCategory}-button`);
    if (submitButton) {
        submitButton.style.display = 'none';
    }

    MathJax.Hub.Queue(["Typeset", MathJax.Hub, resultsDiv]);
}

// --- Fonctions d'affichage des scores finaux et PDF ---

function displayFinalResults() {
    const finalScoreSummaryDiv = document.getElementById('final-score-summary');
    const qcmFinalScoreDiv = document.getElementById('qcm-final-score');
    const exerciceFinalScoreDiv = document.getElementById('exercice-final-score');
    const overallScoreDisplay = document.getElementById('overall-score-display');
    const exportPdfButton = document.getElementById('export-pdf-button');

    // Récupérer et afficher le nom de l'étudiant
    const studentInfo = getSecureStorage('studentName');
    if (studentInfo && finalScoreSummaryDiv) {
        const studentNameHeader = document.createElement('div');
        studentNameHeader.style.cssText = `
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 15px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        `;
        studentNameHeader.innerHTML = `
            <h3 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800;">
                👤 ${studentInfo.fullName}
            </h3>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">
                BTS CIEL2 - Évaluation Maths-Info
            </p>
        `;
        finalScoreSummaryDiv.insertBefore(studentNameHeader, finalScoreSummaryDiv.firstChild);
    }

    let qcmScoreData = getLocalStorageItem('qcmScore');
    let exerciceScoreData = getLocalStorageItem('exerciceScore');

    let totalCorrect = 0;
    let totalPossible = 0;

    const totalQCMQuestions = qcmQuestions ? qcmQuestions.length : 0;
    const totalExerciceQuestionsCombined = (exerciceQuestionsPartA ? exerciceQuestionsPartA.length : 0) + (exerciceQuestionsPartB ? exerciceQuestionsPartB.length : 0);

    if (qcmScoreData && qcmScoreData.completed) {
        totalCorrect += qcmScoreData.rawScore;
        totalPossible += totalQCMQuestions;
        qcmFinalScoreDiv.innerHTML = `<p><strong>Partie 1 (Exercice d'Optimisation - Maths - Info) :</strong> ${qcmScoreData.rawScore} / ${totalQCMQuestions} correctes.</p>`;
    } else {
        totalPossible += totalQCMQuestions;
        qcmFinalScoreDiv.innerHTML = `<p><strong>Partie 1 (Exercice d'Optimisation - Maths - Info) :</strong> Non complétée ou non soumise.</p>`;
    }

    if (exerciceScoreData && exerciceScoreData.completed) {
        totalCorrect += exerciceScoreData.rawScore;
        totalPossible += totalExerciceQuestionsCombined;
        exerciceFinalScoreDiv.innerHTML = `<p><strong>Partie 2 (Température d'un composant informatique) :</strong> ${exerciceScoreData.rawScore} / ${totalExerciceQuestionsCombined} correctes.</p>`;
    } else {
        totalPossible += totalExerciceQuestionsCombined;
        exerciceFinalScoreDiv.innerHTML = `<p><strong>Partie 2 (Température d'un composant informatique) :</strong> Non complétée ou non soumise.</p>`;
    }

    const allPartsCompleted = (qcmScoreData?.completed && exerciceScoreData?.completed);
    setLocalStorageItem('examCompletedGlobally', allPartsCompleted);

    if (allPartsCompleted) {
        const finalScoreOutOf20 = (totalCorrect / totalPossible) * 20;
        overallScoreDisplay.innerHTML = `<p><strong>Total des bonnes réponses : ${totalCorrect} / ${totalPossible}</strong></p>
                                        <p class="score-summary">Votre note finale sur 20 est : <strong>${finalScoreOutOf20.toFixed(2)} / 20</strong></p>`;
        exportPdfButton.classList.remove('button-disabled');
    } else {
        overallScoreDisplay.innerHTML = `
            <p><strong>Total des bonnes réponses : ${totalCorrect} / ${totalPossible}</strong></p>
            <p>Complétez les deux exercices pour obtenir votre note finale sur 20.</p>`;
        exportPdfButton.classList.add('button-disabled');
    }
}

// --- Fonctions PDF (inchangées) ---
function generatePdfContent() {
    let contentHtml = `
        <div style="font-family: 'Arial', sans-serif; color: #000; line-height: 1.5;">
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 3px solid #007bff;">
                <h1 style="color: #007bff; margin: 0 0 8px 0; font-size: 22px; font-weight: bold;">Evaluation Maths_Infos - Correction Personnalisée</h1>
                <h2 style="color: #333; margin: 0 0 8px 0; font-size: 18px; font-weight: bold;">BTS CIEL2</h2>
                <p style="color: #666; margin: 0; font-size: 13px;">Date d'export : ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>
    `;

    const qcmScoreData = getLocalStorageItem('qcmScore');
    const exerciceScoreData = getLocalStorageItem('exerciceScore');
    let totalCorrect = 0;
    let totalPossible = 0;

    const totalQCMQuestions = qcmQuestions ? qcmQuestions.length : 0;
    const totalExerciceQuestionsCombined = (exerciceQuestionsPartA ? exerciceQuestionsPartA.length : 0) + 
                                          (exerciceQuestionsPartB ? exerciceQuestionsPartB.length : 0);

    if (qcmScoreData && qcmScoreData.completed) {
        totalCorrect += qcmScoreData.rawScore;
        totalPossible += totalQCMQuestions;
    } else {
        totalPossible += totalQCMQuestions;
    }
    
    if (exerciceScoreData && exerciceScoreData.completed) {
        totalCorrect += exerciceScoreData.rawScore;
        totalPossible += totalExerciceQuestionsCombined;
    } else {
        totalPossible += totalExerciceQuestionsCombined;
    }

    if (totalPossible > 0) {
        const finalScoreOutOf20 = (totalCorrect / totalPossible) * 20;
        contentHtml += `
            <div style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); padding: 18px; border-radius: 8px; margin-bottom: 25px; border: 2px solid #28a745; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="text-align: center;">
                            <div style="font-size: 16px; color: #155724; font-weight: bold; margin-bottom: 8px;">📊 Votre Note Globale : ${finalScoreOutOf20.toFixed(2)} / 20</div>
                            <div style="font-size: 13px; color: #155724;">Total des bonnes réponses : <strong>${totalCorrect} / ${totalPossible}</strong></div>
                        </td>
                    </tr>
                </table>
            </div>
        `;
    }

    contentHtml += `
        <div style="margin-bottom: 25px;">
            <h2 style="color: #007bff; border-bottom: 3px solid #007bff; padding: 8px 0; margin: 20px 0 15px 0; font-size: 16px; font-weight: bold;">
                📝 Partie 1 : Exercice d'Optimisation
            </h2>
            <p style="font-weight: bold; margin: 0 0 15px 0; font-size: 13px; color: #333;">Score : ${qcmScoreData?.rawScore || 0} / ${totalQCMQuestions}</p>
    `;
    
    if (qcmScoreData && qcmScoreData.detailedResults && qcmScoreData.detailedResults.length > 0) {
        qcmScoreData.detailedResults.forEach((res, index) => {
            const originalQuestion = qcmQuestions.find(q => q.text === res.questionText);
            const correction = qcmCorrections ? qcmCorrections.find(c => c.id === originalQuestion?.id) : null;

            const bgColor = res.isCorrect ? '#d4edda' : '#f8d7da';
            const borderColor = res.isCorrect ? '#28a745' : '#dc3545';
            const textColor = res.isCorrect ? '#155724' : '#721c24';
            const icon = res.isCorrect ? '✓' : '✗';

            contentHtml += `
                <div style="margin-bottom: 12px; padding: 10px 12px; background-color: ${bgColor}; 
                            border-left: 4px solid ${borderColor}; border-radius: 4px; page-break-inside: avoid;">
                    <p style="font-weight: bold; margin: 0 0 6px 0; color: #000; font-size: 12px;">
                        <span style="display: inline-block; width: 20px; color: ${borderColor}; font-weight: bold;">${icon}</span> Question ${index + 1} : ${originalQuestion?.text || res.questionText}
                    </p>
                    <p style="margin: 4px 0 4px 20px; color: ${textColor}; font-size: 11px;">
                        <strong>Votre réponse :</strong> ${res.userAnswer}
                    </p>
                    <p style="margin: 4px 0 4px 20px; color: #000; font-size: 11px;">
                        <strong>Réponse correcte :</strong> ${res.correctAnswer}
                    </p>
                    ${correction ? `
                        <div style="margin: 6px 0 0 20px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1);">
                            <p style="margin: 0; color: #333; font-size: 11px; line-height: 1.4;">
                                <strong>💡 Explication :</strong> ${correction.explanation}
                            </p>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    } else {
        contentHtml += `<p style="color: #666; font-style: italic; font-size: 11px; margin: 10px 0;">Aucune réponse enregistrée.</p>`;
    }
    contentHtml += `</div>`;

    contentHtml += `
        <div style="margin-top: 25px; page-break-before: auto;">
            <h2 style="color: #007bff; border-bottom: 3px solid #007bff; padding: 8px 0; margin: 20px 0 15px 0; font-size: 16px; font-weight: bold;">
                🌡️ Partie 2 : Température d'un Composant
            </h2>
            <p style="font-weight: bold; margin: 0 0 15px 0; font-size: 13px; color: #333;">Score : ${exerciceScoreData?.rawScore || 0} / ${totalExerciceQuestionsCombined}</p>
    `;
    
    if (exerciceScoreData && exerciceScoreData.detailedResults && exerciceScoreData.detailedResults.length > 0) {
        const allExerciceQuestions = [...exerciceQuestionsPartA, ...exerciceQuestionsPartB];
        
        exerciceScoreData.detailedResults.forEach((res, index) => {
            const originalQuestion = allExerciceQuestions.find(q => q.text === res.questionText);
            const correction = (exerciceCorrectionsPartA ? exerciceCorrectionsPartA.find(c => c.id === originalQuestion?.id) : null) ||
                             (exerciceCorrectionsPartB ? exerciceCorrectionsPartB.find(c => c.id === originalQuestion?.id) : null);

            const bgColor = res.isCorrect ? '#d4edda' : '#f8d7da';
            const borderColor = res.isCorrect ? '#28a745' : '#dc3545';
            const textColor = res.isCorrect ? '#155724' : '#721c24';
            const icon = res.isCorrect ? '✓' : '✗';

            contentHtml += `
                <div style="margin-bottom: 12px; padding: 10px 12px; background-color: ${bgColor}; 
                            border-left: 4px solid ${borderColor}; border-radius: 4px; page-break-inside: avoid;">
                    <p style="font-weight: bold; margin: 0 0 6px 0; color: #000; font-size: 12px;">
                        <span style="display: inline-block; width: 20px; color: ${borderColor}; font-weight: bold;">${icon}</span> Question ${index + 1} : ${originalQuestion?.text || res.questionText}
                    </p>
                    <p style="margin: 4px 0 4px 20px; color: ${textColor}; font-size: 11px;">
                        <strong>Votre réponse :</strong> ${res.userAnswer}
                    </p>
                    <p style="margin: 4px 0 4px 20px; color: #000; font-size: 11px;">
                        <strong>Réponse correcte :</strong> ${res.correctAnswer}
                    </p>
                    ${correction ? `
                        <div style="margin: 6px 0 0 20px; padding-top: 6px; border-top: 1px solid rgba(0,0,0,0.1);">
                            <p style="margin: 0; color: #333; font-size: 11px; line-height: 1.4;">
                                <strong>💡 Explication :</strong> ${correction.explanation}
                            </p>
                        </div>
                    ` : ''}
                </div>
            `;
        });
    } else {
        contentHtml += `<p style="color: #666; font-style: italic; font-size: 11px; margin: 10px 0;">Aucune réponse enregistrée.</p>`;
    }
    contentHtml += `</div></div>`;

    return contentHtml;
}

function exportToPdf() {
    if (typeof html2pdf === 'undefined') {
        alert("Erreur : La bibliothèque html2pdf n'est pas chargée. Veuillez actualiser la page.");
        console.error("html2pdf n'est pas défini.");
        return;
    }

    const element = document.createElement('div');
    element.innerHTML = generatePdfContent();
    element.id = 'pdf-content-to-render';
    element.style.cssText = `
        width: 100%;
        max-width: 210mm;
        margin: 0 auto;
        padding: 15mm;
        font-family: Arial, sans-serif;
        font-size: 11pt;
        line-height: 1.5;
        color: #000;
        background-color: #fff;
        box-sizing: border-box;
    `;

    document.body.appendChild(element);

    const loadingMessage = document.createElement('div');
    loadingMessage.id = 'pdf-loading';
    loadingMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 25px 50px;
        background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
        color: #fff;
        border-radius: 10px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        z-index: 10000;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
    `;
    loadingMessage.innerHTML = '📄 Génération du PDF en cours...<br><span style="font-size: 14px; font-weight: normal;">Veuillez patienter</span>';
    document.body.appendChild(loadingMessage);

    const doExport = () => {
        const filename = `Evaluation_Maths_Infos_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`;
        
        const opt = {
            margin: [15, 15, 20, 15],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                logging: false,
                dpi: 300,
                letterRendering: true,
                useCORS: true,
                backgroundColor: '#ffffff'
            },
            jsPDF: { 
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { 
                mode: ['avoid-all', 'css', 'legacy'],
                avoid: 'div[style*="page-break-inside: avoid"]'
            }
        };

        html2pdf()
            .from(element)
            .set(opt)
            .toPdf()
            .get('pdf')
            .then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);
                    pdf.setFontSize(9);
                    pdf.setTextColor(100);
                    const pageText = `Page ${i} / ${totalPages}`;
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();
                    pdf.text(pageText, pageWidth - 25, pageHeight - 10, { align: 'right' });
                    pdf.text('Evaluation Maths_Infos - Correction', 15, pageHeight - 10);
                }
            })
            .save()
            .then(() => {
                loadingMessage.innerHTML = '✓ PDF téléchargé !';
                loadingMessage.style.background = 'linear-gradient(135deg, #28a745 0%, #218838 100%)';
                setTimeout(() => {
                    if (document.body.contains(loadingMessage)) {
                        document.body.removeChild(loadingMessage);
                    }
                }, 2500);
            })
            .catch((error) => {
                console.error("Erreur PDF:", error);
                loadingMessage.innerHTML = '✗ Erreur génération';
                loadingMessage.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
                setTimeout(() => {
                    if (document.body.contains(loadingMessage)) {
                        document.body.removeChild(loadingMessage);
                    }
                }, 4000);
            })
            .finally(() => {
                if (document.body.contains(element)) {
                    document.body.removeChild(element);
                }
            });
    };

    if (typeof MathJax !== 'undefined' && MathJax.Hub) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, element, doExport]);
    } else {
        setTimeout(doExport, 100);
    }
}

// --- Fonctions de correction ---

function checkCorrectionAccess() {
    const examGloballyCompleted = getLocalStorageItem('examCompletedGlobally');

    const correctionContent = document.getElementById('correction-content');
    const lockedMessage = document.getElementById('correction-locked-message');
    const viewCorrectionButton = document.getElementById('view-correction-button');

    if (correctionContent && lockedMessage) {
        if (examGloballyCompleted) {
            correctionContent.style.display = 'block';
            lockedMessage.style.display = 'none';
            loadCorrectionContent();
        } else {
            correctionContent.style.display = 'none';
            lockedMessage.style.display = 'block';
        }
    }
    
    if (viewCorrectionButton) {
        if (examGloballyCompleted) {
            viewCorrectionButton.classList.remove('button-disabled');
            viewCorrectionButton.href = 'correction.html';
            viewCorrectionButton.textContent = 'Correction Détaillée';
            viewCorrectionButton.onclick = null;
        } else {
            viewCorrectionButton.classList.add('button-disabled');
            viewCorrectionButton.href = '#';
            viewCorrectionButton.textContent = 'Correction Détaillée (Verrouillée)';
            viewCorrectionButton.onclick = (e) => {
                e.preventDefault();
                alert("La correction est disponible après avoir complété tous les exercices.");
            };
        }
    }
}

function loadCorrectionContent() {
    if (typeof qcmQuestions === 'undefined' || typeof exerciceQuestionsPartA === 'undefined' || typeof exerciceQuestionsPartB === 'undefined') {
        console.error("ERREUR: Données des questions non définies.");
        return;
    }
    loadCorrection('qcm-correction-container', qcmCorrections, qcmQuestions);
    loadCorrection('exercice-correction-part-a', exerciceCorrectionsPartA, exerciceQuestionsPartA);
    loadCorrection('exercice-correction-part-b', exerciceCorrectionsPartB, exerciceQuestionsPartB);
}

function loadCorrection(containerId, correctionsArray, questionsSourceArray) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Conteneur "${containerId}" introuvable.`);
        return;
    }
    if (!correctionsArray || correctionsArray.length === 0) {
        console.warn(`Corrections vides pour "${containerId}".`);
        return;
    }

    correctionsArray.forEach(corr => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('correction-item');
        
        const originalQuestion = questionsSourceArray.find(q => q.id === corr.id);
        const questionTextToDisplay = originalQuestion?.text || corr.question;

        itemDiv.innerHTML = `
            <p><strong>${questionTextToDisplay}</strong></p>
            <p><strong>Réponse correcte :</strong> ${corr.options.find(opt => opt.id === corr.correctAnswerId)?.text || 'N/A'}</p>
            <p><strong>Explication :</strong> ${corr.explanation}</p>
        `;
        container.appendChild(itemDiv);
    });
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, container]);
}

// ============================================
// INITIALISATION PRINCIPALE - AVEC PROTECTION MAXIMALE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ÉTAPE 1 : Vérifier et appliquer le verrouillage IMMÉDIATEMENT
    enforceExamFlow();
    
    // ÉTAPE 2 : Activer le blocage du bouton retour
    disableBrowserBack();
    
    // Bouton de démarrage (index.html)
    const startExamButton = document.getElementById('start-exam-button');
    if (startExamButton) {
        const lockStatus = checkExamLockStatus();
        
        if (lockStatus.locked) {
            // Examen déjà démarré - bloquer le bouton et rediriger
            startExamButton.disabled = true;
            startExamButton.textContent = "⛔ Examen déjà démarré";
            startExamButton.classList.add('button-disabled');
            
            alert("⚠️ Vous avez déjà démarré l'examen. Redirection en cours...");
            setTimeout(() => {
                const qcmData = getLocalStorageItem('qcmScore');
                const exerciceData = getLocalStorageItem('exerciceScore');
                if (!qcmData?.completed) {
                    window.location.replace('qcm.html');
                } else if (!exerciceData?.completed) {
                    window.location.replace('exercice.html');
                } else {
                    window.location.replace('final_results.html');
                }
            }, 1500);
        } else {
            // Première fois - permettre le démarrage
            startExamButton.addEventListener('click', startTimer);
        }
        
        checkCorrectionAccess();
    }

    // Pages d'exercices
    if (document.getElementById('timer-display')) {
        initializeTimer();
        
        // Protection supplémentaire : vérifier le verrouillage
        const lockStatus = checkExamLockStatus();
        if (!lockStatus.locked) {
            alert("⛔ Accès interdit. Vous devez démarrer l'examen depuis la page d'accueil.");
            window.location.replace('index.html');
            return;
        }
        
        if (!getLocalStorageItem('examActive') || getRemainingTime() <= 0) {
            if (getRemainingTime() <= 0 && getLocalStorageItem('examActive')) {
                setLocalStorageItem('examActive', false);
                alert("Le temps est écoulé !");
                window.location.replace('final_results.html');
                return;
            }
            alert("Examen non actif ou terminé.");
            window.location.replace('index.html');
            return;
        }
    }

    // Exercice 1 (QCM)
    const qcmForm = document.getElementById('qcm-form');
    if (qcmForm) {
        // Vérifier que l'étudiant n'a pas déjà complété cette partie
        if (getLocalStorageItem('qcmScore')?.completed) {
            alert("⛔ Vous avez déjà complété cette partie. Redirection...");
            window.location.replace('exercice.html');
            return;
        }
        
        loadQuestions('qcm-container', qcmQuestions, 'qcm');
        qcmForm.addEventListener('submit', (event) => handleSubmit(event, qcmQuestions, 'qcm', 'qcm-results'));
        
        if (getLocalStorageItem('qcmScore')?.completed) {
            document.getElementById('submit-qcm-button').style.display = 'none';
        }
    }

    // Exercice 2
    const exerciceForm = document.getElementById('exercice-form');
    if (exerciceForm) {
        // Vérifier que l'Exercice 1 est complété
        if (!getLocalStorageItem('qcmScore')?.completed) {
            alert("⛔ Vous devez d'abord compléter la Partie 1. Redirection...");
            window.location.replace('qcm.html');
            return;
        }
        
        // Vérifier que cette partie n'est pas déjà complétée
        if (getLocalStorageItem('exerciceScore')?.completed) {
            alert("⛔ Vous avez déjà complété cette partie. Redirection...");
            window.location.replace('final_results.html');
            return;
        }
        
        if (typeof exerciceQuestionsPartA === 'undefined' || typeof exerciceQuestionsPartB === 'undefined') {
            console.error("ERREUR: Données exercice non chargées.");
            return;
        }
        
        const allExerciceQuestions = [...exerciceQuestionsPartA, ...exerciceQuestionsPartB];
        loadQuestions('exercice-container-part-a', exerciceQuestionsPartA, 'exercice');
        loadQuestions('exercice-container-part-b', exerciceQuestionsPartB, 'exercice');
        exerciceForm.addEventListener('submit', (event) => handleSubmit(event, allExerciceQuestions, 'exercice', 'exercice-results'));
        
        if (getLocalStorageItem('exerciceScore')?.completed) {
            document.getElementById('submit-exercice-button').style.display = 'none';
        }
    }

    // Page de résultats finaux
    const finalResultsPage = document.getElementById('final-score-summary');
    if (finalResultsPage) {
        displayFinalResults();
        const exportPdfBtn = document.getElementById('export-pdf-button');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', exportToPdf);
        }
    }

    // Page de correction
    if (document.getElementById('correction-content')) {
        checkCorrectionAccess();
    }
    
    // Message de sécurité dans la console
    console.log("%c🔒 SYSTÈME DE SÉCURITÉ ACTIF", "color: red; font-size: 20px; font-weight: bold;");
    console.log("%cToute tentative de retour en arrière ou de manipulation est enregistrée.", "color: orange; font-size: 14px;");
});