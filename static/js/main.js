// Fichier : static/js/main.js
const EXAM_DURATION_MINUTES = 50;

// ============================================
// SYSTÈME DE SÉCURITÉ ANTI-RETOUR

// // 🔒 Code protégé — ingénierie inverse interdite.
// Toute tentative de décryptage sera vaine… mais merci pour l’effort 😉

                // D. BENMAKHLOUF

// ============================================

function generateExamSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const userAgent = navigator.userAgent;
    return btoa(`${timestamp}-${random}-${userAgent}`).substring(0, 32);
}

function setSecureStorage(key, value) {
    const data = JSON.stringify(value);
    try {
        localStorage.setItem(key, data);
    } catch (e) {
        console.error("Erreur localStorage:", e);
    }
    try {
        sessionStorage.setItem(key, data);
    } catch (e) {
        console.error("Erreur sessionStorage:", e);
    }
    try {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 365);
        document.cookie = `${key}=${encodeURIComponent(data)}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Strict`;
    } catch (e) {
        console.error("Erreur cookie:", e);
    }
}

function getSecureStorage(key) {
    let value = null;
    try {
        value = localStorage.getItem(key);
        if (value) return JSON.parse(value);
    } catch (e) {}
    try {
        value = sessionStorage.getItem(key);
        if (value) return JSON.parse(value);
    } catch (e) {}
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

function checkExamLockStatus() {
    const examSessionId = getSecureStorage('examSessionId');
    const examStartTime = getSecureStorage('examStartTime');
    const examActive = getSecureStorage('examActive');
    
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

function initializeExamLock() {
    const lockStatus = checkExamLockStatus();
    if (!lockStatus.locked) {
        const sessionId = generateExamSessionId();
        setSecureStorage('examSessionId', sessionId);
        console.log("🔐 Session d'examen initialisée:", sessionId);
    }
    disableBrowserBack();
}

// Variable globale pour contrôler beforeunload
let allowNavigation = false;

function disableBrowserBack() {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
        alert("⚠️ Le retour en arrière est désactivé pendant l'examen.");
    };
    
    // CORRECTION: Ne bloquer beforeunload QUE si on est sur une page d'exercice ET qu'on n'a pas autorisé la navigation
    const isExercisePage = document.getElementById('qcm-form') || document.getElementById('exercice-form');
    
    if (isExercisePage) {
        window.addEventListener('beforeunload', function (e) {
            // Ne bloquer QUE si l'examen est actif ET qu'on n'a pas autorisé la navigation
            if (getSecureStorage('examActive') && !allowNavigation) {
                e.preventDefault();
                e.returnValue = 'L\'examen est en cours. Êtes-vous sûr de vouloir quitter ?';
                return e.returnValue;
            }
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'ArrowLeft') {
            e.preventDefault();
            alert("⚠️ Raccourci de navigation désactivé.");
        }
        if (e.key === 'Backspace' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
            e.preventDefault();
        }
    });
}

function enforceExamFlow() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const lockStatus = checkExamLockStatus();
    
    if (lockStatus.locked) {
        const qcmCompleted = getSecureStorage('qcmScore')?.completed;
        const exerciceCompleted = getSecureStorage('exerciceScore')?.completed;
        const examActive = getSecureStorage('examActive');
        
        let correctPage;
        if (!qcmCompleted && examActive) {
            correctPage = 'qcm.html';
        } else if (qcmCompleted && !exerciceCompleted && examActive) {
            correctPage = 'exercice.html';
        } else if (qcmCompleted && exerciceCompleted) {
            correctPage = 'final_results.html';
        } else {
            correctPage = 'final_results.html';
        }
        
        if (currentPage === 'index.html') {
            alert("⛔ L'examen a déjà été démarré. Vous ne pouvez pas revenir à la page d'accueil.");
            window.location.replace(correctPage);
            return;
        }
        
        if (currentPage === 'qcm.html' && qcmCompleted) {
            alert("⛔ Vous avez déjà complété cette partie. Redirection...");
            window.location.replace(correctPage);
            return;
        }
        
        if (currentPage === 'exercice.html' && !qcmCompleted) {
            alert("⛔ Vous devez d'abord compléter la Partie 1.");
            window.location.replace('qcm.html');
            return;
        }
    }
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function setLocalStorageItem(key, value) {
    setSecureStorage(key, value);
}

function getLocalStorageItem(key) {
    return getSecureStorage(key);
}

// CORRECTION: Vérifier si decodeAnswers existe déjà (chargé par answers_encoded.js)
const answers = typeof decodeAnswers !== 'undefined' && typeof encodedAnswers !== 'undefined' 
    ? decodeAnswers(encodedAnswers) 
    : null;

if (!answers) {
    console.error("❌ ERREUR CRITIQUE: Impossible de charger les réponses!");
    console.error("Vérifiez que answers_encoded.js est chargé AVANT main.js");
} else {
    console.log("✅ Réponses chargées avec succès:", answers);
}

// ============================================
// TIMER
// ============================================

let timerInterval;

function showStudentNameModal() {
    const existingName = getSecureStorage('studentName');
    if (existingName) {
        return true;
    }

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
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        document.getElementById('student-lastname').focus();
    }, 100);

    return new Promise((resolve) => {
        document.getElementById('validate-student-name').onclick = () => {
            const lastname = document.getElementById('student-lastname').value.trim().toUpperCase();
            const firstname = document.getElementById('student-firstname').value.trim();
            const errorDiv = document.getElementById('name-error');

            if (!lastname || !firstname) {
                errorDiv.style.display = 'block';
                return;
            }

            const formattedFirstname = firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase();

            const studentInfo = {
                lastname: lastname,
                firstname: formattedFirstname,
                fullName: `${lastname} ${formattedFirstname}`,
                timestamp: new Date().toISOString()
            };

            setSecureStorage('studentName', studentInfo);

            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(modal);
                resolve(true);
            }, 300);
        };

        ['student-lastname', 'student-firstname'].forEach(id => {
            document.getElementById(id).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('validate-student-name').click();
                }
            });
        });
    });
}

async function startTimer() {
    const nameProvided = await showStudentNameModal();
    
    if (!nameProvided) {
        alert("⚠️ Vous devez renseigner votre nom et prénom.");
        return;
    }

    const studentInfo = getSecureStorage('studentName');
    console.log("🎓 Étudiant identifié :", studentInfo.fullName);

    const startTime = Date.now();
    initializeExamLock();
    
    setLocalStorageItem('examStartTime', startTime);
    setLocalStorageItem('examActive', true);
    setLocalStorageItem('qcmUserAnswers', {});
    setLocalStorageItem('exerciceUserAnswers', {});
    setLocalStorageItem('qcmScore', {completed: false});
    setLocalStorageItem('exerciceScore', {completed: false});
    setLocalStorageItem('examCompletedGlobally', false);

    console.log("🚀 Examen démarré pour", studentInfo.fullName);
    
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
            console.log("Soumission automatique QCM");
            handleSubmit(new Event('submit'), qcmQuestions, 'qcm', 'qcm-results', true);
        }
        if (!exerciceData?.completed && document.getElementById('exercice-form')) {
            console.log("Soumission automatique Exercice 2");
            const allExerciceQuestions = [...exerciceQuestionsPartA, ...exerciceQuestionsPartB];
            handleSubmit(new Event('submit'), allExerciceQuestions, 'exercice', 'exercice-results', true);
        }
        
        setLocalStorageItem('examActive', false);

        setTimeout(() => {
            window.location.replace('final_results.html');
        }, 3000);
    }
}

function initializeTimer() {
    const examActive = getLocalStorageItem('examActive');
    const timerDisplay = document.getElementById('timer-display');
    const studentInfo = getSecureStorage('studentName');

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

// ============================================
// CHARGEMENT ET SOUMISSION DES QUESTIONS
// ============================================

function disableQuestion(questionId, parentContainer) {
    const inputs = parentContainer.querySelectorAll(`input[name="${questionId}"]`);
    inputs.forEach(input => {
        input.disabled = true;
    });
}

function loadQuestions(containerId, questionsArray, answersCategory) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Conteneur "${containerId}" introuvable.`);
        return;
    }
    if (!questionsArray || questionsArray.length === 0) {
        console.warn(`Questions vides pour "${containerId}".`);
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

    if (typeof MathJax !== 'undefined' && MathJax.Hub) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, container]);
    }
}

function handleSubmit(event, questionsArray, answersCategory, resultsDivId, autoSubmit = false) {
    event.preventDefault();

    console.log("🔄 handleSubmit appelé pour:", answersCategory);
    console.log("📊 Réponses disponibles:", answers);

    if (!answers) {
        alert("❌ ERREUR: Les réponses ne sont pas chargées. Vérifiez que answers_encoded.js est bien inclus.");
        console.error("answers est null ou undefined");
        return;
    }

    if (!autoSubmit) {
        const confirmSubmission = confirm("Êtes-vous sûr(e) de vouloir soumettre ?");
        if (!confirmSubmission) {
            return;
        }
    }

    if (!autoSubmit && getRemainingTime() <= 0) {
        alert("Le temps est écoulé !");
        window.location.replace('final_results.html');
        return;
    }

    let score = 0;
    const resultsDiv = document.getElementById(resultsDivId);
    
    if (!resultsDiv) {
        console.error(`❌ Div de résultats "${resultsDivId}" introuvable!`);
        return;
    }
    
    resultsDiv.innerHTML = '<h2>Vos Résultats :</h2>';
    resultsDiv.style.display = 'block'; // CORRECTION: Forcer l'affichage

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
        
        const inputsForQuestionDiv = document.querySelector(`.question-block:has(input[name="${question.id}"])`);
        let userAnswerText = 'Aucune réponse';
        if (userAnswerId) {
            const foundOption = question.options.find(opt => opt.id === userAnswerId);
            if (foundOption) userAnswerText = foundOption.text;
        }

        const correctOptionText = question.options.find(opt => opt.id === correctAnswerId)?.text || 'N/A';

        let isCorrect = false;
        let status = '';
        if (userAnswerId === correctAnswerId) {
            score++;
            status = `<span class="correct">✓ Correct !</span> Votre réponse: ${userAnswerText}.`;
            isCorrect = true;
        } else {
            status = `<span class="incorrect">✗ Incorrect.</span> Votre réponse: ${userAnswerText}. La bonne réponse: ${correctOptionText}.`;
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
    totalScoreDiv.innerHTML = `<p><strong>Score: ${score} / ${totalQuestions}</strong></p>`;
    resultsDiv.prepend(totalScoreDiv);

    setLocalStorageItem(`${answersCategory}UserAnswers`, userAnswersForStorage);

    setLocalStorageItem(`${answersCategory}Score`, {
        rawScore: score,
        totalQuestions: totalQuestions,
        detailedResults: detailedResults,
        completed: true
    });

    console.log("✅ Score sauvegardé:", answersCategory, score);

    const submitButton = document.getElementById(`submit-${answersCategory}-button`);
    if (submitButton) {
        submitButton.style.display = 'none';
    }

    // NOUVEAU : Afficher les boutons de navigation appropriés
    if (answersCategory === 'qcm') {
        createNextExerciseButton();
    } else if (answersCategory === 'exercice') {
        createFinalResultsButton();
    }

    if (typeof MathJax !== 'undefined' && MathJax.Hub) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, resultsDiv]);
    }
    
    // CORRECTION: Scroll automatique vers les résultats
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// BOUTON NAVIGATION VERS EXERCICE 2
// ============================================

function createNextExerciseButton() {
    // Vérifier si le bouton existe déjà
    if (document.getElementById('next-exercise-button')) {
        return;
    }

    // Trouver le lien "Retour au menu principal" et le cacher
    const backLinks = document.querySelectorAll('.back-link');
    backLinks.forEach(link => {
        link.style.display = 'none';
    });

    // Créer le nouveau bouton
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'next-exercise-container';
    buttonContainer.style.cssText = `
        text-align: center;
        margin: 40px auto;
        padding: 30px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        max-width: 600px;
    `;

    buttonContainer.innerHTML = `
        <div style="color: white; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800;">
                ✅ Exercice 1 terminé !
            </h3>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">
                Votre score a été enregistré. Passez maintenant à l'Exercice 2.
            </p>
        </div>
        <button 
            id="next-exercise-button"
            style="
                padding: 18px 40px;
                background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                font-family: 'Inter', sans-serif;
            "
            onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 20px rgba(46, 204, 113, 0.6)';"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 15px rgba(46, 204, 113, 0.4)';"
        >
            ➡️ Passer à l'Exercice 2
        </button>
    `;

    // Insérer après les résultats
    const resultsDiv = document.getElementById('qcm-results');
    if (resultsDiv && resultsDiv.parentNode) {
        resultsDiv.parentNode.insertBefore(buttonContainer, resultsDiv.nextSibling);
    }

    // Ajouter l'événement de clic
    const nextButton = document.getElementById('next-exercise-button');
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            // IMPORTANT: Autoriser la navigation pour éviter le popup
            allowNavigation = true;
            
            // Animation de transition
            nextButton.innerHTML = '⏳ Chargement...';
            nextButton.disabled = true;
            nextButton.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
            
            setTimeout(() => {
                window.location.replace('exercice.html');
            }, 500);
        });
    }
}

// ============================================
// BOUTON NAVIGATION VERS RÉSULTATS FINAUX
// ============================================

function createFinalResultsButton() {
    // Vérifier si le bouton existe déjà
    if (document.getElementById('final-results-button')) {
        return;
    }

    // Trouver et cacher le lien "Retour au menu principal"
    const backLinks = document.querySelectorAll('.back-link');
    backLinks.forEach(link => {
        link.style.display = 'none';
    });

    // Créer le bouton
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'final-results-container';
    buttonContainer.style.cssText = `
        text-align: center;
        margin: 40px auto;
        padding: 30px;
        background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(46, 204, 113, 0.3);
        max-width: 600px;
    `;

    buttonContainer.innerHTML = `
        <div style="color: white; margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800;">
                🎉 Exercice 2 terminé !
            </h3>
            <p style="margin: 0; font-size: 16px; opacity: 0.9;">
                Félicitations ! Vous avez terminé l'évaluation complète.
            </p>
        </div>
        <button 
            id="final-results-button"
            style="
                padding: 18px 40px;
                background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(243, 156, 18, 0.4);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                font-family: 'Inter', sans-serif;
            "
            onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 20px rgba(243, 156, 18, 0.6)';"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 15px rgba(243, 156, 18, 0.4)';"
        >
            📊 Accéder à votre score final
        </button>
    `;

    // Insérer après les résultats
    const resultsDiv = document.getElementById('exercice-results');
    if (resultsDiv && resultsDiv.parentNode) {
        resultsDiv.parentNode.insertBefore(buttonContainer, resultsDiv.nextSibling);
    }

    // Ajouter l'événement de clic
    const finalButton = document.getElementById('final-results-button');
    if (finalButton) {
        finalButton.addEventListener('click', () => {
            // IMPORTANT: Autoriser la navigation
            allowNavigation = true;
            
            // Animation
            finalButton.innerHTML = '⏳ Calcul du score...';
            finalButton.disabled = true;
            finalButton.style.background = 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
            
            setTimeout(() => {
                window.location.replace('final_results.html');
            }, 800);
        });
    }
}

// ============================================
// AFFICHAGE RÉSULTATS FINAUX
// ============================================

function displayFinalResults() {
    const finalScoreSummaryDiv = document.getElementById('final-score-summary');
    const qcmFinalScoreDiv = document.getElementById('qcm-final-score');
    const exerciceFinalScoreDiv = document.getElementById('exercice-final-score');
    const overallScoreDisplay = document.getElementById('overall-score-display');
    const exportPdfButton = document.getElementById('export-pdf-button');

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
        qcmFinalScoreDiv.innerHTML = `<p><strong>Partie 1:</strong> ${qcmScoreData.rawScore} / ${totalQCMQuestions}</p>`;
    } else {
        totalPossible += totalQCMQuestions;
        qcmFinalScoreDiv.innerHTML = `<p><strong>Partie 1:</strong> Non complétée</p>`;
    }

    if (exerciceScoreData && exerciceScoreData.completed) {
        totalCorrect += exerciceScoreData.rawScore;
        totalPossible += totalExerciceQuestionsCombined;
        exerciceFinalScoreDiv.innerHTML = `<p><strong>Partie 2:</strong> ${exerciceScoreData.rawScore} / ${totalExerciceQuestionsCombined}</p>`;
    } else {
        totalPossible += totalExerciceQuestionsCombined;
        exerciceFinalScoreDiv.innerHTML = `<p><strong>Partie 2:</strong> Non complétée</p>`;
    }

    const allPartsCompleted = (qcmScoreData?.completed && exerciceScoreData?.completed);
    setLocalStorageItem('examCompletedGlobally', allPartsCompleted);

    if (allPartsCompleted) {
        const finalScoreOutOf20 = (totalCorrect / totalPossible) * 20;
        overallScoreDisplay.innerHTML = `<p><strong>Total: ${totalCorrect} / ${totalPossible}</strong></p>
                                        <p class="score-summary">Note finale: <strong>${finalScoreOutOf20.toFixed(2)} / 20</strong></p>`;
        exportPdfButton.classList.remove('button-disabled');
    } else {
        overallScoreDisplay.innerHTML = `
            <p><strong>Total: ${totalCorrect} / ${totalPossible}</strong></p>
            <p>Complétez les deux exercices pour obtenir votre note finale.</p>`;
        exportPdfButton.classList.add('button-disabled');
    }
}

// ============================================
// EXPORT PDF
// ============================================

function generatePdfContent() {
    let contentHtml = `
        <div style="font-family: 'Arial', sans-serif; color: #000; line-height: 1.5;">
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 3px solid #007bff;">
                <h1 style="color: #007bff; margin: 0 0 8px 0; font-size: 22px; font-weight: bold;">Evaluation Maths_Infos - Correction</h1>
                <h2 style="color: #333; margin: 0 0 8px 0; font-size: 18px; font-weight: bold;">BTS CIEL2</h2>
                <p style="color: #666; margin: 0; font-size: 13px;">Date: ${new Date().toLocaleDateString('fr-FR')}</p>
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
            <div style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); padding: 18px; border-radius: 8px; margin-bottom: 25px; border: 2px solid #28a745;">
                <div style="text-align: center;">
                    <div style="font-size: 16px; color: #155724; font-weight: bold; margin-bottom: 8px;">Note: ${finalScoreOutOf20.toFixed(2)} / 20</div>
                    <div style="font-size: 13px; color: #155724;">Total: <strong>${totalCorrect} / ${totalPossible}</strong></div>
                </div>
            </div>
        `;
    }

    contentHtml += `
        <div style="margin-bottom: 25px;">
            <h2 style="color: #007bff; border-bottom: 3px solid #007bff; padding: 8px 0; margin: 20px 0 15px 0; font-size: 16px; font-weight: bold;">
                Partie 1: Optimisation
            </h2>
            <p style="font-weight: bold; margin: 0 0 15px 0; font-size: 13px;">Score: ${qcmScoreData?.rawScore || 0} / ${totalQCMQuestions}</p>
    `;
    
    if (qcmScoreData && qcmScoreData.detailedResults && qcmScoreData.detailedResults.length > 0) {
        qcmScoreData.detailedResults.forEach((res, index) => {
            const bgColor = res.isCorrect ? '#d4edda' : '#f8d7da';
            const borderColor = res.isCorrect ? '#28a745' : '#dc3545';
            const icon = res.isCorrect ? '✓' : '✗';

            contentHtml += `
                <div style="margin-bottom: 12px; padding: 10px 12px; background-color: ${bgColor}; 
                            border-left: 4px solid ${borderColor}; border-radius: 4px;">
                    <p style="font-weight: bold; margin: 0 0 6px 0; font-size: 12px;">
                        <span style="color: ${borderColor};">${icon}</span> Q${index + 1}: ${res.questionText}
                    </p>
                    <p style="margin: 4px 0 4px 20px; font-size: 11px;">
                        <strong>Votre réponse:</strong> ${res.userAnswer}
                    </p>
                    <p style="margin: 4px 0 4px 20px; font-size: 11px;">
                        <strong>Réponse correcte:</strong> ${res.correctAnswer}
                    </p>
                </div>
            `;
        });
    } else {
        contentHtml += `<p style="color: #666; font-style: italic; font-size: 11px;">Aucune réponse.</p>`;
    }
    contentHtml += `</div>`;

    contentHtml += `
        <div style="margin-top: 25px;">
            <h2 style="color: #007bff; border-bottom: 3px solid #007bff; padding: 8px 0; margin: 20px 0 15px 0; font-size: 16px; font-weight: bold;">
                Partie 2: Température
            </h2>
            <p style="font-weight: bold; margin: 0 0 15px 0; font-size: 13px;">Score: ${exerciceScoreData?.rawScore || 0} / ${totalExerciceQuestionsCombined}</p>
    `;
    
    if (exerciceScoreData && exerciceScoreData.detailedResults && exerciceScoreData.detailedResults.length > 0) {
        exerciceScoreData.detailedResults.forEach((res, index) => {
            const bgColor = res.isCorrect ? '#d4edda' : '#f8d7da';
            const borderColor = res.isCorrect ? '#28a745' : '#dc3545';
            const icon = res.isCorrect ? '✓' : '✗';

            contentHtml += `
                <div style="margin-bottom: 12px; padding: 10px 12px; background-color: ${bgColor}; 
                            border-left: 4px solid ${borderColor}; border-radius: 4px;">
                    <p style="font-weight: bold; margin: 0 0 6px 0; font-size: 12px;">
                        <span style="color: ${borderColor};">${icon}</span> Q${index + 1}: ${res.questionText}
                    </p>
                    <p style="margin: 4px 0 4px 20px; font-size: 11px;">
                        <strong>Votre réponse:</strong> ${res.userAnswer}
                    </p>
                    <p style="margin: 4px 0 4px 20px; font-size: 11px;">
                        <strong>Réponse correcte:</strong> ${res.correctAnswer}
                    </p>
                </div>
            `;
        });
    } else {
        contentHtml += `<p style="color: #666; font-style: italic; font-size: 11px;">Aucune réponse.</p>`;
    }
    contentHtml += `</div></div>`;

    return contentHtml;
}

function exportToPdf() {
    if (typeof html2pdf === 'undefined') {
        alert("Erreur: html2pdf non chargé.");
        return;
    }

    const element = document.createElement('div');
    element.innerHTML = generatePdfContent();
    element.style.cssText = `
        width: 210mm;
        margin: 0 auto;
        padding: 15mm;
        font-family: Arial;
        font-size: 11pt;
        color: #000;
        background: #fff;
    `;

    document.body.appendChild(element);

    const loadingMessage = document.createElement('div');
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
    loadingMessage.innerHTML = '📄 Génération PDF...';
    document.body.appendChild(loadingMessage);

    const opt = {
        margin: [15, 15, 20, 15],
        filename: `Evaluation_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
        .from(element)
        .set(opt)
        .save()
        .then(() => {
            loadingMessage.innerHTML = '✓ PDF téléchargé !';
            loadingMessage.style.background = 'linear-gradient(135deg, #28a745 0%, #218838 100%)';
            setTimeout(() => {
                document.body.removeChild(loadingMessage);
            }, 2500);
        })
        .finally(() => {
            document.body.removeChild(element);
        });
}

// ============================================
// CORRECTION
// ============================================

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
        } else {
            viewCorrectionButton.classList.add('button-disabled');
            viewCorrectionButton.href = '#';
            viewCorrectionButton.onclick = (e) => {
                e.preventDefault();
                alert("Complétez d'abord tous les exercices.");
            };
        }
    }
}

function loadCorrectionContent() {
    loadCorrection('qcm-correction-container', qcmCorrections, qcmQuestions);
    loadCorrection('exercice-correction-part-a', exerciceCorrectionsPartA, exerciceQuestionsPartA);
    loadCorrection('exercice-correction-part-b', exerciceCorrectionsPartB, exerciceQuestionsPartB);
}

function loadCorrection(containerId, correctionsArray, questionsSourceArray) {
    const container = document.getElementById(containerId);
    if (!container || !correctionsArray) return;

    correctionsArray.forEach(corr => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('correction-item');
        
        const originalQuestion = questionsSourceArray.find(q => q.id === corr.id);
        const questionTextToDisplay = originalQuestion?.text || corr.question;

        itemDiv.innerHTML = `
            <p><strong>${questionTextToDisplay}</strong></p>
            <p><strong>Réponse:</strong> ${corr.options.find(opt => opt.id === corr.correctAnswerId)?.text || 'N/A'}</p>
            <p><strong>Explication:</strong> ${corr.explanation}</p>
        `;
        container.appendChild(itemDiv);
    });
    
    if (typeof MathJax !== 'undefined' && MathJax.Hub) {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, container]);
    }
}

// ============================================
// MASQUER LES LIENS "RETOUR AU MENU PRINCIPAL"
// ============================================

function hideBackToMenuLinks() {
    // Masquer tous les liens "Retour au menu principal" sur toutes les pages
    const backLinks = document.querySelectorAll('.back-link');
    backLinks.forEach(link => {
        link.style.display = 'none';
    });
    
    // Aussi masquer les liens <a> qui contiennent "menu principal" ou "index.html"
    const allLinks = document.querySelectorAll('a[href="index.html"]');
    allLinks.forEach(link => {
        // Ne pas cacher si c'est dans le header ou un élément de navigation légitime
        if (!link.closest('header') && !link.closest('nav')) {
            link.style.display = 'none';
        }
    });
}

// ============================================
// INITIALISATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    enforceExamFlow();
    disableBrowserBack();
    
    // NOUVEAU : Masquer les liens "Retour au menu principal" dès le chargement
    hideBackToMenuLinks();
    
    const startExamButton = document.getElementById('start-exam-button');
    if (startExamButton) {
        const lockStatus = checkExamLockStatus();
        
        if (lockStatus.locked) {
            startExamButton.disabled = true;
            startExamButton.textContent = "⛔ Examen déjà démarré";
            startExamButton.classList.add('button-disabled');
            
            alert("⚠️ Examen déjà démarré. Redirection...");
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
            startExamButton.addEventListener('click', startTimer);
        }
        
        checkCorrectionAccess();
    }

    if (document.getElementById('timer-display')) {
        initializeTimer();
        
        const lockStatus = checkExamLockStatus();
        if (!lockStatus.locked) {
            alert("⛔ Accès interdit. Démarrez depuis l'accueil.");
            window.location.replace('index.html');
            return;
        }
        
        if (!getLocalStorageItem('examActive') || getRemainingTime() <= 0) {
            if (getRemainingTime() <= 0 && getLocalStorageItem('examActive')) {
                setLocalStorageItem('examActive', false);
                alert("Temps écoulé !");
                window.location.replace('final_results.html');
                return;
            }
            alert("Examen non actif.");
            window.location.replace('index.html');
            return;
        }
    }

    const qcmForm = document.getElementById('qcm-form');
    if (qcmForm) {
        if (getLocalStorageItem('qcmScore')?.completed) {
            alert("⛔ Partie déjà complétée.");
            window.location.replace('exercice.html');
            return;
        }
        
        loadQuestions('qcm-container', qcmQuestions, 'qcm');
        qcmForm.addEventListener('submit', (event) => handleSubmit(event, qcmQuestions, 'qcm', 'qcm-results'));
        
        if (getLocalStorageItem('qcmScore')?.completed) {
            document.getElementById('submit-qcm-button').style.display = 'none';
        }
    }

    const exerciceForm = document.getElementById('exercice-form');
    if (exerciceForm) {
        if (!getLocalStorageItem('qcmScore')?.completed) {
            alert("⛔ Complétez d'abord la Partie 1.");
            window.location.replace('qcm.html');
            return;
        }
        
        if (getLocalStorageItem('exerciceScore')?.completed) {
            alert("⛔ Partie déjà complétée.");
            window.location.replace('final_results.html');
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

    const finalResultsPage = document.getElementById('final-score-summary');
    if (finalResultsPage) {
        displayFinalResults();
        const exportPdfBtn = document.getElementById('export-pdf-button');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', exportToPdf);
        }
    }

    if (document.getElementById('correction-content')) {
        checkCorrectionAccess();
    }
    
    console.log("%c🔒 SYSTÈME DE SÉCURITÉ ACTIF", "color: red; font-size: 20px; font-weight: bold;");
});