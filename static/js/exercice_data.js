// Fichier : static/js/exercice_data.js
// Définition des questions de l'exercice (maintenant en QCM)

const exerciceQuestionsPartA = [
    {
        id: "exercice_q1a",
        text: "1.a. Quelle est la température du composant au moment de l'allumage ($t=0$) ?",
        options: [
            { id: "option_A", text: "$20 \\text{ °C}$" },
            { id: "option_B", text: "$30 \\text{ °C}$" },
            { id: "option_C", text: "$50 \\text{ °C}$" },
            { id: "option_D", text: "$0 \\text{ °C}$" }
        ]
    },
    {
        id: "exercice_q1b",
        text: "1.b. Comment interprétez-vous concrètement cette température initiale ?",
        options: [
            { id: "option_A", text: "C'est la température du composant avant tout fonctionnement, au moment de son démarrage." },
            { id: "option_B", text: "C'est la température ambiante de l'environnement du composant." },
            { id: "option_C", text: "C'est la température maximale que le composant peut atteindre." },
            { id: "option_D", text: "C'est une valeur théorique sans signification physique." }
        ]
    },
    {
        id: "exercice_q2a",
        text: "2.a. Quelle est la dérivée $T'(t)$ de la fonction $T(t) = 50 - 30e^{-0.1t}$ ?",
        options: [
            { id: "option_A", text: "$T'(t) = 3e^{-0.1t}$" },
            { id: "option_B", text: "$T'(t) = -3e^{-0.1t}$" },
            { id: "option_C", text: "$T'(t) = 30e^{-0.1t}$" },
            { id: "option_D", text: "$T'(t) = -0.1e^{-0.1t}$" }
        ]
    },
    {
        id: "exercice_q2b",
        text: "2.b. Quel est le signe de $T'(t)$ pour $t \\geq 0$ ?",
        options: [
            { id: "option_A", text: "Toujours positif." },
            { id: "option_B", text: "Toujours négatif." },
            { id: "option_C", text: "Positif puis négatif." },
            { id: "option_D", text: "Négatif puis positif." }
        ]
    },
    {
        id: "exercice_q2c",
        text: "2.c. En déduisez-vous les variations de la fonction $T$ sur $[0, +\\infty[$ :",
        options: [
            { id: "option_A", text: "La fonction $T$ est strictement croissante." },
            { id: "option_B", text: "La fonction $T$ est strictement décroissante." },
            { id: "option_C", text: "La fonction $T$ est d'abord croissante, puis décroissante." },
            { id: "option_D", text: "La fonction $T$ est constante." }
        ]
    },
    {
        id: "exercice_q2d",
        text: "2.d. Quelle est la limite de $T(t)$ lorsque $t$ tend vers $+ \\infty$ ?",
        options: [
            { id: "option_A", text: "$+\\infty$" },
            { id: "option_B", text: "$30$" },
            { id: "option_C", text: "$50$" },
            { id: "option_D", text: "$20$" }
        ]
    },
    {
        id: "exercice_q2e",
        text: "2.e. Comment interprétez-vous concrètement cette limite ?",
        options: [
            { id: "option_A", text: "À long terme, la température du composant devient infinie." },
            { id: "option_B", text: "La température du composant se stabilise à $30 \\text{ °C}$." },
            { id: "option_C", text: "À long terme, la température du composant se stabilise à $50 \\text{ °C}$." },
            { id: "option_D", text: "La température du composant continue de chuter indéfiniment." }
        ]
    },
    {
        id: "exercice_q3a",
        text: "3.a. Calculez la température moyenne du composant pendant les 10 premières heures de son fonctionnement (valeur approchée à $10^{-2}$ près) :",
        options: [
            { id: "option_A", text: "$23.68 \\text{ °C}$" },
            { id: "option_B", text: "$25.70 \\text{ °C}$" },
            { id: "option_C", text: "$38.96 \\text{ °C}$" },
            { id: "option_D", text: "$50.00 \\text{ °C}$" }
        ]
    },
    {
        id: "exercice_q3b",
        text: "3.b. Comment interprétez-vous concrètement cette valeur moyenne ?",
        options: [
            { id: "option_A", text: "C'est la température constante qu'aurait eue le composant pour dégager la même quantité d'énergie thermique sur les 10 premières heures." },
            { id: "option_B", text: "C'est la température maximale atteinte pendant cette période." },
            { id: "option_C", text: "C'est la température que le composant atteindrait après 10 heures." },
            { id: "option_D", text: "C'est la température la plus faible enregistrée sur les 10 premières heures." }
        ]
    }
];

const exerciceQuestionsPartB = [
    {
        id: "exercice_q4a",
        text: "1. À partir de quel temps $t$ (en heures, valeur approchée à $10^{-2}$ près) la température du composant devient-elle supérieure ou égale à $45^{\\circ}\\text{C}$ ?",
        options: [
            { id: "option_A", text: "$t \\approx 6.93 \\text{ h}$" },
            { id: "option_B", text: "$t \\approx 10.00 \\text{ h}$" },
            { id: "option_C", text: "$t \\approx 8.00 \\text{ h}$" },
            { id: "option_D", text: "$t \\approx 7.50 \\text{ h}$" }
        ]
    },
    {
        id: "exercice_q5a",
        text: "2.a. Parmi les fonctions suivantes, laquelle pourrait être une modélisation alternative $S(t)$ respectant $S(0) = T(0)$ et $S(t) \\to 50$ lorsque $t \\to +\\infty$ ?",
        options: [
            { id: "option_A", text: "$S(t) = 50 - \\frac{30}{1 + 0.1t}$" },
            { id: "option_B", text: "$S(t) = 20 + 30t$" },
            { id: "option_C", text: "$S(t) = 20 + 30(1-e^{-0.1 t}$)" },
            { id: "option_D", text: "$S(t) = 20 + 30\\sin(t)$" }
        ]
    },
    {
        id: "exercice_q5b",
        text: "2.b. Quel est un avantage principal de la modélisation exponentielle $T(t)$ par rapport à une modélisation du type $S(t) = 50 - \\frac{30}{1 + kt}$ pour un phénomène de chauffage ?",
        options: [
            { id: "option_A", text: "Elle est plus facile à calculer sans calculatrice." },
            { id: "option_B", text: "Elle est souvent plus fidèle aux lois physiques de chauffage (Loi de Newton)." },
            { id: "option_C", text: "Elle atteint sa limite plus rapidement." },
            { id: "option_D", text: "Elle permet des températures négatives." }
        ]
    }
];

const totalExerciceQuestions = exerciceQuestionsPartA.length + exerciceQuestionsPartB.length;
