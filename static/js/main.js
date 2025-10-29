// Fichier : static/js/main.js
const EXAM_DURATION_MINUTES = 50; // Durée de l'épreuve en minutes
// Les totaux de questions sont maintenant définis dans qcm_data.js et exercice_data.js
// pour une meilleure cohérence avec les données.

// --- Fonctions utilitaires localStorage ---
function setLocalStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error("Erreur d'écriture dans localStorage :", e);
    }
}

function getLocalStorageItem(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error("Erreur de lecture dans localStorage :", e);
        return null;
    }
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

function startTimer() {
    const startTime = Date.now();
    setLocalStorageItem('examStartTime', startTime);
    setLocalStorageItem('examActive', true);
    // Initialiser les réponses stockées pour chaque partie vide au démarrage de l'examen
    setLocalStorageItem('qcmUserAnswers', {});
    setLocalStorageItem('exerciceUserAnswers', {});
    // Marquer les parties comme non complétées au début
    setLocalStorageItem('qcmScore', {completed: false});
    setLocalStorageItem('exerciceScore', {completed: false});
    setLocalStorageItem('examCompletedGlobally', false); // Réinitialiser le statut global

    window.location.href = 'qcm.html'; // Redirige vers la première partie de l'examen
}

function getRemainingTime() {
    const startTime = getLocalStorageItem('examStartTime');
    if (!startTime || !getLocalStorageItem('examActive')) {
        return EXAM_DURATION_MINUTES * 60; // Durée totale si pas démarré ou terminé
    }
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Temps écoulé en secondes
    const remainingTime = (EXAM_DURATION_MINUTES * 60) - elapsedTime;
    return Math.max(0, remainingTime); // Ne jamais retourner un temps négatif
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer-display');
    if (!timerDisplay) return;

    const remainingSeconds = getRemainingTime();
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerDisplay.textContent = `Temps restant : ${formattedTime}`;

    if (remainingSeconds <= 0 && getLocalStorageItem('examActive')) { // Exécuter une seule fois à la fin du timer
        timerDisplay.textContent = "Temps écoulé ! Soumission automatique...";
        clearInterval(timerInterval);

        // Soumettre automatiquement les parties non complétées
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
        
        setLocalStorageItem('examActive', false); // L'examen est terminé

        setTimeout(() => {
            window.location.href = 'final_results.html'; // Redirige après un court délai
        }, 3000); // Laisse le temps au message de s'afficher
    }
}

function initializeTimer() {
    const examActive = getLocalStorageItem('examActive');
    const timerDisplay = document.getElementById('timer-display');

    if (examActive) {
        updateTimerDisplay(); // Affiche le temps restant immédiatement
        if (!timerInterval) {
            timerInterval = setInterval(updateTimerDisplay, 1000);
        }
    } else if (timerDisplay) {
        // Si l'examen n'est pas actif (par ex. page actualisée après fin), affiche 00:00 ou temps écoulé
        const remainingSecondsAtLoad = getRemainingTime(); // Cela peut être 0 ou le temps initial
        if (getLocalStorageItem('examStartTime') && remainingSecondsAtLoad <= 0) {
             timerDisplay.textContent = "Temps écoulé !";
        } else {
            // Afficher le temps initial si l'examen n'a pas été démarré et que c'est une page d'examen
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
        console.warn(`Avertissement: Le tableau de questions pour le conteneur "${containerId}" est vide ou non défini. Aucune question ne sera affichée.`);
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

        // Désactiver les options si une réponse est déjà stockée OU si la partie est déjà complétée
        if (storedUserAnswers[question.id] || partCompleted) {
            disableQuestion(question.id, questionDiv);
        } else {
            // Ajouter un écouteur d'événements pour le clic unique si la question n'est pas déjà répondue et la partie non soumise
            const inputs = questionDiv.querySelectorAll(`input[name="${question.id}"]`);
            inputs.forEach(input => {
                input.addEventListener('change', function() {
                    if (this.checked) {
                        let currentAnswers = getLocalStorageItem(`${answersCategory}UserAnswers`) || {};
                        currentAnswers[question.id] = this.value;
                        setLocalStorageItem(`${answersCategory}UserAnswers`, currentAnswers);
                        disableQuestion(question.id, questionDiv); // Désactive les options après le clic
                    }
                });
            });
        }
    });

    MathJax.Hub.Queue(["Typeset", MathJax.Hub, container]);
}


function handleSubmit(event, questionsArray, answersCategory, resultsDivId, autoSubmit = false) {
    event.preventDefault();

    // Ajouter une boîte de dialogue de confirmation UNIQUEMENT si ce n'est PAS une soumission automatique
    if (!autoSubmit) {
        const confirmSubmission = confirm("Êtes-vous sûr(e) de vouloir soumettre ? Une fois soumis, vous ne pourrez plus modifier vos réponses pour cette partie.");
        if (!confirmSubmission) {
            return; // Annuler la soumission si l'utilisateur annule
        }
    }

    // Vérifier si le temps est écoulé pour éviter la soumission manuelle après la fin
    if (!autoSubmit && getRemainingTime() <= 0) {
        alert("Le temps est écoulé ! Vos réponses ont été soumises automatiquement.");
        window.location.href = 'final_results.html';
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

        // Si la question n'a pas été répondue sur cette soumission mais qu'une réponse est stockée, utilisez-la
        if (!userAnswerId && userAnswersForStorage[question.id]) {
            userAnswerId = userAnswersForStorage[question.id];
        } else if (userAnswerId) { // Si une nouvelle réponse est sélectionnée, mettez à jour le stockage
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

        // Désactiver TOUTES les options de la question, même celles non sélectionnées
        if (inputsForQuestionDiv) {
             disableQuestion(question.id, inputsForQuestionDiv);
        }
    });

    const totalQuestions = questionsArray.length;
    const totalScoreDiv = document.createElement('div');
    totalScoreDiv.classList.add('score-summary');
    totalScoreDiv.innerHTML = `<p><strong>Score pour cette partie : ${score} / ${totalQuestions}</strong></p>`;
    resultsDiv.prepend(totalScoreDiv);

    // Mettre à jour les réponses stockées (incluant celles éventuellement auto-soumises)
    setLocalStorageItem(`${answersCategory}UserAnswers`, userAnswersForStorage);

    // Stocker le score final pour cette partie
    setLocalStorageItem(`${answersCategory}Score`, {
        rawScore: score,
        totalQuestions: totalQuestions,
        detailedResults: detailedResults,
        completed: true // Marque cette partie comme complétée
    });

    // Cacher le bouton de soumission après que la partie est soumise
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

    let qcmScoreData = getLocalStorageItem('qcmScore');
    let exerciceScoreData = getLocalStorageItem('exerciceScore');

    let totalCorrect = 0;
    let totalPossible = 0;

    // Récupère le nombre total de questions des données JS
    const totalQCMQuestions = qcmQuestions ? qcmQuestions.length : 0;
    const totalExerciceQuestionsCombined = (exerciceQuestionsPartA ? exerciceQuestionsPartA.length : 0) + (exerciceQuestionsPartB ? exerciceQuestionsPartB.length : 0);

    if (qcmScoreData && qcmScoreData.completed) {
        totalCorrect += qcmScoreData.rawScore;
        totalPossible += totalQCMQuestions; // Utilise le total réel des questions
        qcmFinalScoreDiv.innerHTML = `<p><strong>Partie 1 (Exercice d'Optimisation - Maths - Info) :</strong> ${qcmScoreData.rawScore} / ${totalQCMQuestions} correctes.</p>`;
    } else {
        totalPossible += totalQCMQuestions; // Inclut les questions non répondues dans le total possible
        qcmFinalScoreDiv.innerHTML = `<p><strong>Partie 1 (Exercice d'Optimisation - Maths - Info) :</strong> Non complétée ou non soumise.</p>`;
    }

    if (exerciceScoreData && exerciceScoreData.completed) {
        totalCorrect += exerciceScoreData.rawScore;
        totalPossible += totalExerciceQuestionsCombined; // Utilise le total réel des questions
        exerciceFinalScoreDiv.innerHTML = `<p><strong>Partie 2 (Température d'un composant informatique) :</strong> ${exerciceScoreData.rawScore} / ${totalExerciceQuestionsCombined} correctes.</p>`;
    } else {
        totalPossible += totalExerciceQuestionsCombined; // Inclut les questions non répondues dans le total possible
        exerciceFinalScoreDiv.innerHTML = `<p><strong>Partie 2 (Température d'un composant informatique) :</strong> Non complétée ou non soumise.</p>`;
    }

    // Vérifie si toutes les parties sont complétées pour afficher le score final et le bouton PDF
    const allPartsCompleted = (qcmScoreData?.completed && exerciceScoreData?.completed);
    setLocalStorageItem('examCompletedGlobally', allPartsCompleted); // Met à jour le statut global

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


// --- Fonction de génération du contenu PDF ---
function generatePdfContent() {
    let contentHtml = `
        <div style="font-family: 'Arial', sans-serif; color: #000; line-height: 1.5;">
            <!-- En-tête du document -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 3px solid #007bff;">
                <h1 style="color: #007bff; margin: 0 0 8px 0; font-size: 22px; font-weight: bold;">Evaluation Maths_Infos - Correction Personnalisée</h1>
                <h2 style="color: #333; margin: 0 0 8px 0; font-size: 18px; font-weight: bold;">BTS CIEL2</h2>
                <p style="color: #666; margin: 0; font-size: 13px;">Date d'export : ${new Date().toLocaleDateString('fr-FR')}</p>
            </div>
    `;

    // --- Score Global ---
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

    // Encadré du score global
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
    } else {
        contentHtml += `
            <div style="background-color: #f8d7da; padding: 18px; border-radius: 8px; margin-bottom: 25px; border: 2px solid #dc3545;">
                <h2 style="color: #721c24; margin: 0 0 8px 0; font-size: 16px; text-align: center;">⚠️ Épreuve non complétée</h2>
                <p style="color: #721c24; margin: 0; font-size: 13px; text-align: center;">Veuillez soumettre toutes les parties pour un score global.</p>
            </div>
        `;
    }

    // --- Détail Exercice 1 (QCM) ---
    contentHtml += `
        <div style="margin-bottom: 25px;">
            <h2 style="color: #007bff; border-bottom: 3px solid #007bff; padding: 8px 0; margin: 20px 0 15px 0; font-size: 16px; font-weight: bold;">
                📝 Partie 1 : Exercice d'Optimisation - Outils Mathématiques
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
        contentHtml += `<p style="color: #666; font-style: italic; font-size: 11px; margin: 10px 0;">Aucune réponse enregistrée pour l'Exercice 1.</p>`;
    }
    contentHtml += `</div>`;

    // --- Détail Exercice 2 (Température) ---
    contentHtml += `
        <div style="margin-top: 25px; page-break-before: auto;">
            <h2 style="color: #007bff; border-bottom: 3px solid #007bff; padding: 8px 0; margin: 20px 0 15px 0; font-size: 16px; font-weight: bold;">
                🌡️ Partie 2 : Exercice d'Étude de la Température d'un Composant
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
        contentHtml += `<p style="color: #666; font-style: italic; font-size: 11px; margin: 10px 0;">Aucune réponse enregistrée pour l'Exercice 2.</p>`;
    }
    contentHtml += `</div></div>`;

    return contentHtml;
}

// --- Fonction d'export PDF avec pagination ---
function exportToPdf() {
    // Vérifier que html2pdf est disponible
    if (typeof html2pdf === 'undefined') {
        alert("Erreur : La bibliothèque html2pdf n'est pas chargée. Veuillez actualiser la page.");
        console.error("html2pdf n'est pas défini. Vérifiez que html2pdf.bundle.min.js est bien chargé.");
        return;
    }

    console.log("✓ html2pdf est disponible");

    // Créer l'élément temporaire
    const element = document.createElement('div');
    element.innerHTML = generatePdfContent();
    element.id = 'pdf-content-to-render';
    
    // Styles pour le conteneur principal
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

    // Message de chargement
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

    // Fonction d'export
    const doExport = () => {
        const filename = `Evaluation_Maths_Infos_Correction_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`;
        
        const opt = {
            margin: [15, 15, 20, 15], // [top, left, bottom, right] en mm - Plus d'espace en bas pour la pagination
            filename: filename,
            image: { 
                type: 'jpeg', 
                quality: 0.98 
            },
            html2canvas: { 
                scale: 2,
                logging: false,
                dpi: 300,
                letterRendering: true,
                useCORS: true,
                backgroundColor: '#ffffff',
                windowWidth: 794, // Largeur A4 en pixels à 96 DPI
                windowHeight: 1123 // Hauteur A4 en pixels à 96 DPI
            },
            jsPDF: { 
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { 
                mode: ['avoid-all', 'css', 'legacy'],
                before: '.page-break-before',
                after: '.page-break-after',
                avoid: ['.no-break', 'div[style*="page-break-inside: avoid"]']
            }
        };

        html2pdf()
            .from(element)
            .set(opt)
            .toPdf()
            .get('pdf')
            .then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages();
                
                // Ajouter la numérotation des pages
                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);
                    pdf.setFontSize(9);
                    pdf.setTextColor(100);
                    
                    // Numéro de page en bas à droite
                    const pageText = `Page ${i} / ${totalPages}`;
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();
                    
                    pdf.text(pageText, pageWidth - 25, pageHeight - 10, { align: 'right' });
                    
                    // Nom du document en bas à gauche
                    pdf.text('Evaluation Maths_Infos - Correction Personnalisée', 15, pageHeight - 10);
                }
            })
            .save()
            .then(() => {
                console.log("✓ PDF généré avec succès :", filename);
                loadingMessage.innerHTML = '✓ PDF téléchargé avec succès !<br><span style="font-size: 14px; font-weight: normal;">Vérifiez vos téléchargements</span>';
                loadingMessage.style.background = 'linear-gradient(135deg, #28a745 0%, #218838 100%)';
                setTimeout(() => {
                    if (document.body.contains(loadingMessage)) {
                        document.body.removeChild(loadingMessage);
                    }
                }, 2500);
            })
            .catch((error) => {
                console.error("✗ Erreur lors de la génération du PDF:", error);
                loadingMessage.innerHTML = '✗ Erreur lors de la génération<br><span style="font-size: 14px; font-weight: normal;">Consultez la console (F12)</span>';
                loadingMessage.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
                alert("Erreur lors de la génération du PDF. Consultez la console (F12) pour plus de détails.");
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

    // Attendre MathJax si disponible
    if (typeof MathJax !== 'undefined' && MathJax.Hub) {
        console.log("Attente du rendu MathJax...");
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, element, doExport]);
    } else {
        console.log("MathJax non disponible, export direct");
        setTimeout(doExport, 100); // Petit délai pour s'assurer que le DOM est prêt
    }
}

function exportToPdf() {
    // Vérifier que html2pdf est disponible
    if (typeof html2pdf === 'undefined') {
        alert("Erreur : La bibliothèque html2pdf n'est pas chargée. Veuillez actualiser la page.");
        console.error("html2pdf n'est pas défini. Vérifiez que html2pdf.bundle.min.js est bien chargé.");
        return;
    }

    console.log("✓ html2pdf est disponible");
    console.log("Données QCM:", getLocalStorageItem('qcmScore'));
    console.log("Données Exercice:", getLocalStorageItem('exerciceScore'));

    // Créer l'élément temporaire
    const element = document.createElement('div');
    element.innerHTML = generatePdfContent();
    element.id = 'pdf-content-to-render';
    
    // Styles pour le rendu
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.fontSize = '12px';
    element.style.lineHeight = '1.6';
    element.style.color = '#000';
    element.style.backgroundColor = '#fff';

    document.body.appendChild(element);

    // Message de chargement
    const loadingMessage = document.createElement('div');
    loadingMessage.id = 'pdf-loading';
    loadingMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px 40px;
        background-color: #007bff;
        color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        z-index: 10000;
        font-size: 16px;
        font-weight: bold;
    `;
    loadingMessage.textContent = '📄 Génération du PDF en cours...';
    document.body.appendChild(loadingMessage);

    // Fonction d'export
    const doExport = () => {
        const filename = `Evaluation_Maths_Infos${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`;
        
        const opt = {
            margin: [10, 10, 10, 10],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                logging: false,
                dpi: 192,
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
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf()
            .from(element)
            .set(opt)
            .save()
            .then(() => {
                console.log("✓ PDF généré avec succès :", filename);
                loadingMessage.textContent = '✓ PDF téléchargé avec succès !';
                loadingMessage.style.backgroundColor = '#28a745';
                setTimeout(() => {
                    if (document.body.contains(loadingMessage)) {
                        document.body.removeChild(loadingMessage);
                    }
                }, 2000);
            })
            .catch((error) => {
                console.error("✗ Erreur lors de la génération du PDF:", error);
                loadingMessage.textContent = '✗ Erreur lors de la génération';
                loadingMessage.style.backgroundColor = '#dc3545';
                alert("Erreur lors de la génération du PDF. Consultez la console (F12) pour plus de détails.");
                setTimeout(() => {
                    if (document.body.contains(loadingMessage)) {
                        document.body.removeChild(loadingMessage);
                    }
                }, 3000);
            })
            .finally(() => {
                if (document.body.contains(element)) {
                    document.body.removeChild(element);
                }
            });
    };

    // Attendre MathJax si disponible
    if (typeof MathJax !== 'undefined' && MathJax.Hub) {
        console.log("Attente du rendu MathJax...");
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, element, doExport]);
    } else {
        console.log("MathJax non disponible, export direct");
        doExport();
    }
}


// --- Fonctions de chargement et affichage des corrections (modifiées) ---

function checkCorrectionAccess() {
    const examGloballyCompleted = getLocalStorageItem('examCompletedGlobally');

    const correctionContent = document.getElementById('correction-content');
    const lockedMessage = document.getElementById('correction-locked-message');
    const viewCorrectionButton = document.getElementById('view-correction-button');

    if (correctionContent && lockedMessage) { // Si nous sommes sur la page correction.html
        if (examGloballyCompleted) {
            correctionContent.style.display = 'block';
            lockedMessage.style.display = 'none';
            loadCorrectionContent(); // Charge le contenu de la correction
        } else {
            correctionContent.style.display = 'none';
            lockedMessage.style.display = 'block';
        }
    }
    
    if (viewCorrectionButton) { // Si nous sommes sur index.html
        if (examGloballyCompleted) {
            viewCorrectionButton.classList.remove('button-disabled');
            viewCorrectionButton.href = 'correction.html';
            viewCorrectionButton.textContent = 'Correction Détaillée';
            viewCorrectionButton.onclick = null; // Supprime l'alerte onclick si activé
        } else {
            viewCorrectionButton.classList.add('button-disabled');
            viewCorrectionButton.href = '#';
            viewCorrectionButton.textContent = 'Correction Détaillée (Verrouillée)';
            viewCorrectionButton.onclick = (e) => {
                e.preventDefault();
                alert("La correction est disponible uniquement après avoir complété et soumis tous les exercices de l'épreuve.");
            };
        }
    }
}

function loadCorrectionContent() {
    if (typeof qcmQuestions === 'undefined' || typeof exerciceQuestionsPartA === 'undefined' || typeof exerciceQuestionsPartB === 'undefined') {
        console.error("ERREUR CRITIQUE: Les données des questions (qcm_data.js ou exercice_data.js) ne sont pas définies lors du chargement des corrections.");
        return;
    }
    loadCorrection('qcm-correction-container', qcmCorrections, qcmQuestions);
    loadCorrection('exercice-correction-part-a', exerciceCorrectionsPartA, exerciceQuestionsPartA);
    loadCorrection('exercice-correction-part-b', exerciceCorrectionsPartB, exerciceQuestionsPartB);
}


function loadCorrection(containerId, correctionsArray, questionsSourceArray) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Erreur: Le conteneur de correction HTML avec l'ID "${containerId}" est introuvable.`);
        return;
    }
    if (!correctionsArray || correctionsArray.length === 0) {
        console.warn(`Avertissement: Le tableau de corrections pour le conteneur "${containerId}" est vide ou non défini.`);
        return;
    }

    correctionsArray.forEach(corr => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('correction-item');
        
        const originalQuestion = questionsSourceArray.find(q => q.id === corr.id);
        const questionTextToDisplay = originalQuestion?.text || corr.question; // Utilise le texte original complet si disponible

        itemDiv.innerHTML = `
            <p><strong>${questionTextToDisplay}</strong></p>
            <p><strong>Réponse correcte :</strong> ${corr.options.find(opt => opt.id === corr.correctAnswerId)?.text || 'N/A'}</p>
            <p><strong>Explication :</strong> ${corr.explanation}</p>
        `;
        container.appendChild(itemDiv);
    });
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, container]);
}

// --- Initialisation au chargement de la page ---

document.addEventListener('DOMContentLoaded', () => {
    // Gérer le bouton de démarrage de l'épreuve sur index.html
    const startExamButton = document.getElementById('start-exam-button');
    if (startExamButton) {
        startExamButton.addEventListener('click', startTimer);
        // Si l'examen est déjà actif ou terminé, désactiver le bouton de démarrage
        if (getLocalStorageItem('examActive') || (getLocalStorageItem('examStartTime') && getRemainingTime() <= 0)) {
            startExamButton.disabled = true;
            startExamButton.textContent = "Épreuve déjà démarrée ou terminée";
            startExamButton.classList.add('button-disabled');
            // Rediriger si l'examen est actif pour éviter de rester sur la page d'accueil
            if (getLocalStorageItem('examActive')) {
                 setTimeout(() => {
                    const qcmData = getLocalStorageItem('qcmScore');
                    const exerciceData = getLocalStorageItem('exerciceScore');
                    if (!qcmData?.completed) {
                        window.location.href = 'qcm.html';
                    } else if (!exerciceData?.completed) {
                        window.location.href = 'exercice.html';
                    } else {
                        window.location.href = 'final_results.html';
                    }
                }, 500);
            }
        }
        checkCorrectionAccess(); // Vérifie l'accès à la correction depuis index.html
    }


    // Pages d'exercices (qcm.html et exercice.html)
    // Initialiser le timer sur les pages d'exercices
    if (document.getElementById('timer-display')) {
        initializeTimer();
        // Empêcher l'accès si l'examen n'est pas actif (protection URL directe) OU si le temps est écoulé
        if (!getLocalStorageItem('examActive') || getRemainingTime() <= 0) {
            // Si le temps est écoulé et la page encore active, soumettre et rediriger
            if (getRemainingTime() <= 0 && getLocalStorageItem('examActive')) {
                 setLocalStorageItem('examActive', false); // Marquer comme inactif
                 // Les soumissions automatiques se feront via updateTimerDisplay
                 alert("Le temps est écoulé ! Vos réponses ont été soumises automatiquement.");
                 window.location.href = 'final_results.html';
                 return;
            }
            // Si pas actif du tout ou juste après un temps écoulé sans auto-submit (refresh)
            alert("Veuillez démarrer l'épreuve depuis le menu principal ou l'épreuve est terminée.");
            window.location.href = 'index.html';
            return;
        }
    }


    // Exercice 1 (ancien QCM)
    const qcmForm = document.getElementById('qcm-form');
    if (qcmForm) {
        loadQuestions('qcm-container', qcmQuestions, 'qcm');
        qcmForm.addEventListener('submit', (event) => handleSubmit(event, qcmQuestions, 'qcm', 'qcm-results'));
        // Cacher le bouton de soumission si la partie est déjà complétée
        if (getLocalStorageItem('qcmScore')?.completed) {
            document.getElementById('submit-qcm-button').style.display = 'none';
        }
    }

    // Exercice 2 (ancien Exercice Complet)
    const exerciceForm = document.getElementById('exercice-form');
    if (exerciceForm) {
        if (typeof exerciceQuestionsPartA === 'undefined' || typeof exerciceQuestionsPartB === 'undefined') {
            console.error("ERREUR CRITIQUE: 'exerciceQuestionsPartA' ou 'exerciceQuestionsPartB' n'est pas défini. Le fichier 'exercice_data.js' n'a probablement pas été chargé correctement ou contient une erreur de syntaxe.");
            fetch('static/js/exercice_data.js')
                .then(response => response.text())
                .then(text => console.log("Contenu de exercice_data.js :\n", text))
                .catch(error => console.error("Erreur lors de la lecture de exercice_data.js :", error));
            return;
        }
        const allExerciceQuestions = [...exerciceQuestionsPartA, ...exerciceQuestionsPartB];
        loadQuestions('exercice-container-part-a', exerciceQuestionsPartA, 'exercice');
        loadQuestions('exercice-container-part-b', exerciceQuestionsPartB, 'exercice');
        exerciceForm.addEventListener('submit', (event) => handleSubmit(event, allExerciceQuestions, 'exercice', 'exercice-results'));
         // Cacher le bouton de soumission si la partie est déjà complétée
        if (getLocalStorageItem('exerciceScore')?.completed) {
            document.getElementById('submit-exercice-button').style.display = 'none';
        }
    }

    // Final Results Page
    const finalResultsPage = document.getElementById('final-score-summary');
    if (finalResultsPage) {
        displayFinalResults();
        const exportPdfBtn = document.getElementById('export-pdf-button');
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', exportToPdf);
        }
    }

    // Correction Page
    if (document.getElementById('correction-content')) {
        checkCorrectionAccess();
    }
});