// Fichier : static/js/qcm_data.js
// Questions pour l'Exercice 1 : Optimisation - Outils Mathématiques

const qcmQuestions = [
    {
        id: "qcm_q1",
        text: "1. Soit la fonction $f(t) = 5e^{-2t} + 3$ modélisant la décroissance d'un paramètre. Lorsque $t$ tend vers l'infini, la valeur stable (limite) de ce paramètre est :",
        options: [
            { id: "option_A", text: "$0$" },
            { id: "option_B", text: "$3$" },
            { id: "option_C", text: "$5$" },
            { id: "option_D", text: "$+\\infty$" }
        ]
    },
    {
        id: "qcm_q2",
        text: "2. La dérivée de la fonction $g(x) = \\ln(2x+1)$, qui pourrait représenter l'efficacité d'un algorithme, est :",
        options: [
            { id: "option_A", text: "$g'(x) = \\frac{1}{2x+1}$" },
            { id: "option_B", text: "$g'(x) = \\frac{2}{2x+1}$" },
            { id: "option_C", text: "$g'(x) = 2\\ln(2x+1)$" },
            { id: "option_D", text: "$g'(x) = \\frac{1}{x}$" }
        ]
    },
    {
        id: "qcm_q3",
        text: "3. Si une fonction $h(x)$ modélisant le coût unitaire d'une ressource est décroissante sur l'intervalle $[a, b]$, alors pour tout $x \\in [a, b]$ (où $x$ est la quantité produite) :",
        options: [
            { id: "option_A", text: "$h'(x) > 0$" },
            { id: "option_B", text: "$h'(x) < 0$" },
            { id: "option_C", text: "$h'(x) \\leq 0$" },
            { id: "option_D", text: "$h'(x) = 0$" }
        ]
    },
    {
        id: "qcm_q4",
        text: "4. L'intégrale $\\int_1^2 (3x^2 + 2x) dx$ pourrait représenter l'énergie consommée entre deux états d'un système. Sa valeur est :",
        options: [
            { id: "option_A", text: "$7$" },
            { id: "option_B", text: "$10$" },
            { id: "option_C", text: "$12$" },
            { id: "option_D", text: "$14$" }
        ]
    },
    {
        id: "qcm_q5",
        text: "5. La formule de la valeur moyenne d'une fonction $f$ sur l'intervalle $[a, b]$ est un outil pour déterminer la performance moyenne d'un système sur une période donnée :",
        options: [
            { id: "option_A", text: "$\\frac{f(b) - f(a)}{b - a}$" },
            { id: "option_B", text: "$\\int_a^b f(x) dx$" },
            { id: "option_C", text: "$\\frac{1}{b - a} \\int_a^b f(x) dx$" },
            { id: "option_D", text: "$f\\left(\\frac{a+b}{2}\\right)$" }
        ]
    },
    {
        id: "qcm_q6",
        text: "6. Si $f(x) = x^3 - 6x^2 + 9x - 1$ modélise la complexité d'une tâche informatique en fonction d'un paramètre $x$, alors $f'(x)$ est :",
        options: [
            { id: "option_A", text: "$3x^2 - 12x + 9$" },
            { id: "option_B", text: "$3x^2 - 12x$" },
            { id: "option_C", text: "$x^2 - 6x + 9$" },
            { id: "option_D", text: "$3x^2 - 6x + 9$" }
        ]
    },
    {
        id: "qcm_q7",
        text: "7. Pour la fonction $f(t) = 2 + 3e^{-0.5t}$ modélisant la mémoire utilisée par une application, la mémoire au lancement ($t=0$) est :",
        options: [
            { id: "option_A", text: "$2 \\text{ Go}$" },
            { id: "option_B", text: "$3 \\text{ Go}$" },
            { id: "option_C", text: "$5 \\text{ Go}$" },
            { id: "option_D", text: "$0 \\text{ Go}$" }
        ]
    },
    {

            "id": "qcm_q8",
            "text": "8. La fonction $f(t) = 5t^2 + 2t$ représente le débit de transfert (en Go/s) d’un serveur en fonction du temps $t$ (en secondes). Quelle est la quantité totale de données transférées entre $t = 0$ et $t = 3$ s ?\n\nIndice :\nPour trouver la quantité totale de données, vous devez calculer l'intégrale du débit sur l'intervalle de temps donné.",
            "options": [
                { "id": "option_A", "text": "50 Go" },
                { "id": "option_B", "text": "54 Go" },
                { "id": "option_C", "text": "60 Go" },
                { "id": "option_D", "text": "48 Go" }
            ]
        

    },
    {
        id: "qcm_q9",
        text: "9. L'équation de la tangente à la courbe de $y = x^2$ au point d'abscisse $x=1$ peut représenter la variation linéaire approximative d'une mesure. Son équation est :",
        options: [
            { id: "option_A", text: "$y = 2x + 1$" },
            { id: "option_B", text: "$y = x + 1$" },
            { id: "option_C", text: "$y = 2x - 1$" },
            { id: "option_D", text: "$y = x - 1$" }
        ]
    },
    {
        id: "qcm_q10",
        text: "10. Pour $x > 0$, une primitive de la fonction $f(x) = \\frac{1}{x}$, utilisée par exemple pour le calcul de l'entropie, est :",
        options: [
            { id: "option_A", text: "$\\ln(x)$" },
            { id: "option_B", text: "$-\\frac{1}{x^2}$" },
            { id: "option_C", text: "$e^x$" },
            { id: "option_D", text: "$x \\ln(x) - x$" }
        ]
    },
    {
        id: "qcm_q11",
        text: "11. La limite de la fonction $f(x) = \\frac{e^x - 1}{x}$ quand $x \\to 0$ est un cas d'indétermination courant en analyse de croissance. Sa valeur est :",
        options: [
            { id: "option_A", text: "$0$" },
            { id: "option_B", text: "$1$" },
            { id: "option_C", text: "$e$" },
            { id: "option_D", text: "$+\\infty$" }
        ]
    },
    {
        id: "qcm_q12",
        text: "12. La dérivée de la fonction $f(t) = t \\cdot e^{-t}$ (modélisant une réponse impulsionnelle d'un système) est :",
        options: [
            { id: "option_A", text: "$e^{-t}$" },
            { id: "option_B", text: "$e^{-t}(1-t)$" },
            { id: "option_C", text: "$-e^{-t}$" },
            { id: "option_D", text: "$-t e^{-t}$" }
        ]
    },
    {
        id: "qcm_q13",
        text: "13. Une primitive de la fonction $f(x) = x e^{x^2}$ (apparaissant dans le calcul d'une probabilité continue) est :",
        options: [
            { id: "option_A", text: "$e^{x^2}$" },
            { id: "option_B", text: "$\\frac{1}{2}e^{x^2}$" },
            { id: "option_C", text: "$x^2 e^{x^2}$" },
            { id: "option_D", text: "$2x e^{x^2}$" }
        ]
    },
    {
        id: "qcm_q14",
        text: "14. L'intégrale $\\int_0^{\\pi} \\sin(x) dx$, utilisée pour calculer l'aire sous une courbe de signal, est égale à :",
        options: [
            { id: "option_A", text: "$0$" },
            { id: "option_B", text: "$1$" },
            { id: "option_C", text: "$2$" },
            { id: "option_D", text: "$\\pi$" }
        ]
    },
    {
        id: "qcm_q15",
        text: "15. Si $f(x) = x^4 - 4x^3$ représente une fonction de coût, la dérivée seconde $f''(x)$ (utile pour déterminer les points d'inflexion) est :",
        options: [
            { id: "option_A", text: "$4x^3 - 12x^2$" },
            { id: "option_B", text: "$12x^2 - 24x$" },
            { id: "option_C", text: "$12x^2 - 12x$" },
            { id: "option_D", text: "$4x^3 - 12x$" }
        ]
    },
    {
        id: "qcm_q16",
        text: "16. La solution générale de l'équation différentielle $y' = 2y$ (modélisant une croissance exponentielle de données) est de la forme :",
        options: [
            { id: "option_A", text: "$y = \\lambda e^x$" },
            { id: "option_B", text: "$y = \\lambda e^{2x}$" },
            { id: "option_C", text: "$y = 2\\lambda e^x$" },
            { id: "option_D", text: "$y = \\lambda / e^{2x}$" }

        ]
    },
    {
        id: "qcm_q17",
        id: "qcm_q17",
        text: "17. Dans un réseau informatique, on modélise la performance $P$ en fonction du nombre de connexions actives $n$ par la relation $P = k n^3$, où $k$ est une constante. Quelle est la dérivée $P'(n)$, c’est-à-dire la variation instantanée des performances par rapport au nombre de connexions ?",
        options: [
            { id: "option_A", text: "$k n^2$" },
            { id: "option_B", text: "$3k n^2$" },   
            { id: "option_C", text: "$k n^3$" },
            { id: "option_D", text: "$6k n$" }
        ]
    },
    {
        id: "qcm_q18",
        text: "18. Une primitive de $f(x) = \\frac{1}{x+3}$ pour $x > -3$ (utile pour calculer l'accumulation d'un certain phénomène) est :",
        options: [
            { id: "option_A", text: "$\\frac{-1}{(x+3)^2}$" },
            { id: "option_B", text: "$\\ln(x+3)$" },
            { id: "option_C", text: "$\\ln(x) + 3$" },
            { id: "option_D", text: "$x\\ln(x+3)$" }
        ]
    },
    {
        id: "qcm_q19",
        text: "19. Si $\\int_0^3 f(x) dx = 5$ et $\\int_3^5 f(x) dx = 7$, ces valeurs représentant des contributions partielles, alors la contribution totale $\\int_0^5 f(x) dx$ est égale à :",
        options: [
            { id: "option_A", text: "$2$" },
            { id: "option_B", text: "$5$" },
            { id: "option_C", text: "$12$" },
            { id: "option_D", text: "$35$" }
        ]
    },
    {
        id: "qcm_q20",
        text: "20. Quelle est la valeur moyenne de la fonction $f(x) = x^2$ sur l'intervalle $[0, 3]$, un indicateur de performance moyenne ?",
        options: [
            { id: "option_A", text: "$1$" },
            { id: "option_B", text: "$3$" },
            { id: "option_C", text: "$6$" },
            { id: "option_D", text: "$9$" }
        ]
    }
];