// Fichier : static/js/correction_data.js
// Corrections pour la Partie 1 (Exercice d'Optimisation - Outils Mathématiques)
const qcmCorrections = [
    {
        id: "qcm_q1",
        question: "1. Soit la fonction $f(t) = 5e^{-2t} + 3$ modélisant la décroissance d'un paramètre. Lorsque $t$ tend vers l'infini, la valeur stable de ce paramètre est :",
        correctAnswerId: "option_B",
        explanation: "Lorsque $t \\to +\\infty$, $e^{-2t} \\to 0$. Donc, $f(t) \\to 5(0) + 3 = 3$.",
        options: [
            { id: "option_A", text: "$0$" },
            { id: "option_B", text: "$3$" },
            { id: "option_C", text: "$5$" },
            { id: "option_D", text: "$+\\infty$" }
        ]
    },
    {
        id: "qcm_q2",
        question: "2. La dérivée de la fonction $g(x) = \\ln(2x+1)$, qui pourrait représenter l'efficacité d'un algorithme, est :",
        correctAnswerId: "option_B",
        explanation: "On utilise la formule $(\\ln(u))' = \\frac{u'}{u}$. Ici $u = 2x+1$, donc $u' = 2$. Ainsi, $g'(x) = \\frac{2}{2x+1}$.",
        options: [
            { id: "option_A", text: "$g'(x) = \\frac{1}{2x+1}$" },
            { id: "option_B", text: "$g'(x) = \\frac{2}{2x+1}$" },
            { id: "option_C", text: "$g'(x) = 2\\ln(2x+1)$" },
            { id: "option_D", text: "$g'(x) = \\frac{1}{x}$" }
        ]
    },
    {
        id: "qcm_q3",
        question: "3. Si une fonction $h(x)$ modélisant le coût unitaire d'une ressource est décroissante sur l'intervalle $[a, b]$, alors pour tout $x \\in [a, b]$ (où $x$ est la quantité produite) :",
        correctAnswerId: "option_C",
        explanation: "Une fonction est décroissante si et seulement si sa dérivée est négative ou nulle sur l'intervalle.",
        options: [
            { id: "option_A", text: "$h'(x) > 0$" },
            { id: "option_B", text: "$h'(x) < 0$" },
            { id: "option_C", text: "$h'(x) \\leq 0$" },
            { id: "option_D", text: "$h'(x) = 0$" }
        ]
    },
    {
        id: "qcm_q4",
        question: "4. L'intégrale $\\int_1^2 (3x^2 + 2x) dx$ pourrait représenter l'énergie consommée entre deux états d'un système. Sa valeur est :",
        correctAnswerId: "option_B",
        explanation: "Une primitive de $3x^2 + 2x$ est $x^3 + x^2$.<br>$[x^3 + x^2]_1^2 = (2^3 + 2^2) - (1^3 + 1^2) = (8 + 4) - (1 + 1) = 12 - 2 = 10$.",
        options: [
            { id: "option_A", text: "$7$" },
            { id: "option_B", text: "$10$" },
            { id: "option_C", text: "$12$" },
            { id: "option_D", text: "$14$" }
        ]
    },
    {
        id: "qcm_q5",
        question: "5. La formule de la valeur moyenne d'une fonction $f$ sur l'intervalle $[a, b]$ est un outil pour déterminer la performance moyenne d'un système sur une période donnée :",
        correctAnswerId: "option_C",
        explanation: "C'est la définition standard de la valeur moyenne d'une fonction continue sur un intervalle.",
        options: [
            { id: "option_A", text: "$\\frac{f(b) - f(a)}{b - a}$" },
            { id: "option_B", text: "$\\int_a^b f(x) dx$" },
            { id: "option_C", text: "$\\frac{1}{b - a} \\int_a^b f(x) dx$" },
            { id: "option_D", text: "$f\\left(\\frac{a+b}{2}\\right)$" }
        ]
    },
    {
        id: "qcm_q6",
        question: "6. Si $f(x) = x^3 - 6x^2 + 9x - 1$ modélise la complexité d'une tâche informatique en fonction d'un paramètre $x$, alors $f'(x)$ est :",
        correctAnswerId: "option_A",
        explanation: "On utilise les règles de dérivation : $(x^n)' = nx^{n-1}$ et $(cx)' = c$.<br>$f'(x) = 3x^2 - 6(2x) + 9(1) - 0 = 3x^2 - 12x + 9$.",
        options: [
            { id: "option_A", text: "$3x^2 - 12x + 9$" },
            { id: "option_B", text: "$3x^2 - 12x$" },
            { id: "option_C", text: "$x^2 - 6x + 9$" },
            { id: "option_D", text: "$3x^2 - 6x + 9$" }
        ]
    },
    {
        id: "qcm_q7",
        question: "7. Pour la fonction $f(t) = 2 + 3e^{-0.5t}$ modélisant la mémoire utilisée par une application, la mémoire au lancement ($t=0$) est :",
        correctAnswerId: "option_C",
        explanation: "On calcule $f(0) = 2 + 3e^{-0.5 \\times 0} = 2 + 3e^0 = 2 + 3(1) = 5 \\text{ Go}$.",
        options: [
            { id: "option_A", text: "$2 \\text{ Go}$" },
            { id: "option_B", text: "$3 \\text{ Go}$" },
            { id: "option_C", text: "$5 \\text{ Go}$" },
            { id: "option_D", text: "$0 \\text{ Go}$" }
        ]
    },
    {
        "id": "qcm_q_integrale_info",
        "question": "La fonction $f(t) = 5t^2 + 2t$ représente le débit de transfert (en Go/s) d’un serveur en fonction du temps $t$ (en secondes). Quelle est la quantité totale de données transférées entre $t = 0$ et $t = 3$ s ?",
        "correctAnswerId": "option_B",
        "explanation": "La quantité totale de données transférées est donnée par l'intégrale du débit sur l'intervalle :\n\n$\\int_0^3 (5t^2 + 2t) \\, dt = [\\frac{5}{3}t^3 + t^2]_0^3 = (\\frac{5}{3} \\cdot 27 + 9) - 0 = 45 + 9 = 54$ Go.\nDonc la valeur correcte est 54 Go.",
        "help": "Rappelez-vous que pour calculer la quantité totale de données transférées, vous devez intégrer le débit par rapport au temps. Commencez par trouver une primitive de $f(t)$, puis appliquez la formule de l'intégrale définie $\\int_a^b f(t) dt = F(b) - F(a)$.",
        "options": [
            { "id": "option_A", "text": "50 Go" },
            { "id": "option_B", "text": "54 Go" },
            { "id": "option_C", "text": "60 Go" },
            { "id": "option_D", "text": "48 Go" }
        ]
    },
    {
        id: "qcm_q9",
        question: "9. L'équation de la tangente à la courbe de $y = x^2$ au point d'abscisse $x=1$ peut représenter la variation linéaire approximative d'une mesure. Son équation est :",
        correctAnswerId: "option_C",
        explanation: "L'équation de la tangente est $y = f'(a)(x-a) + f(a)$.<br>Ici $f(x)=x^2$, $f'(x)=2x$. Au point $x=1$: $f(1) = 1^2 = 1$. $f'(1) = 2(1) = 2$.<br>Donc $y = 2(x-1) + 1 = 2x - 2 + 1 = 2x - 1$.",
        options: [
            { id: "option_A", text: "$y = 2x + 1$" },
            { id: "option_B", text: "$y = x + 1$" },
            { id: "option_C", text: "$y = 2x - 1$" },
            { id: "option_D", text: "$y = x - 1$" }
        ]
    },
    {
        id: "qcm_q10",
        question: "10. Pour $x > 0$, une primitive de la fonction $f(x) = \\frac{1}{x}$, utilisée par exemple pour le calcul de l'entropie, est :",
        correctAnswerId: "option_A",
        explanation: "La fonction $\\ln(x)$ est la primitive de $\\frac{1}{x}$ pour $x > 0$. La question précise $x>0$ donc pas de valeur absolue.",
        options: [
            { id: "option_A", text: "$\\ln(x)$" },
            { id: "option_B", text: "$-\\frac{1}{x^2}$" },
            { id: "option_C", text: "$e^x$" },
            { id: "option_D", text: "$x \\ln(x) - x$" }
        ]
    },
    {
        id: "qcm_q11",
        question: "11. La limite de la fonction $f(x) = \\frac{e^x - 1}{x}$ quand $x \\to 0$ est un cas d'indétermination courant en analyse de croissance. Sa valeur est :",
        correctAnswerId: "option_B",
        explanation: "C'est une limite de référence ou peut être calculée en utilisant la règle de l'Hôpital : $\\lim_{x \\to 0} \\frac{e^x - 1}{x} = \\lim_{x \\to 0} \\frac{(e^x - 1)'}{x'} = \\lim_{x \\to 0} \\frac{e^x}{1} = e^0 = 1$.",
        options: [
            { id: "option_A", text: "$0$" },
            { id: "option_B", text: "$1$" },
            { id: "option_C", text: "$e$" },
            { id: "option_D", text: "$+\\infty$" }
        ]
    },
    {
        id: "qcm_q12",
        question: "12. La dérivée de la fonction $f(t) = t \\cdot e^{-t}$ (modélisant une réponse impulsionnelle d'un système) est :",
        correctAnswerId: "option_B",
        explanation: "On utilise la règle de dérivation du produit $(uv)' = u'v + uv'$.<br>Ici $u=t \\implies u'=1$ et $v=e^{-t} \\implies v'=-e^{-t}$.<br>$f'(t) = 1 \\cdot e^{-t} + t \\cdot (-e^{-t}) = e^{-t} - t e^{-t} = e^{-t}(1-t)$.",
        options: [
            { id: "option_A", text: "$e^{-t}$" },
            { id: "option_B", text: "$e^{-t}(1-t)$" },
            { id: "option_C", text: "$-e^{-t}$" },
            { id: "option_D", text: "$-t e^{-t}$" }
        ]
    },
    {
        id: "qcm_q13",
        question: "13. Une primitive de la fonction $f(x) = x e^{x^2}$ (apparaissant dans le calcul d'une probabilité continue) est :",
        correctAnswerId: "option_B",
        explanation: "On utilise une substitution. Soit $u = x^2$, alors $du = 2x dx$, ce qui implique $x dx = \\frac{1}{2} du$.<br>L'intégrale devient $\\int e^u \\frac{1}{2} du = \\frac{1}{2} e^u + C$.<br>En remplaçant $u$ par $x^2$, on obtient $\\frac{1}{2}e^{x^2} + C$.",
        options: [
            { id: "option_A", text: "$e^{x^2}$" },
            { id: "option_B", text: "$\\frac{1}{2}e^{x^2}$" },
            { id: "option_C", text: "$x^2 e^{x^2}$" },
            { id: "option_D", text: "$2x e^{x^2}$" }
        ]
    },
    {
        id: "qcm_q14",
        question: "14. L'intégrale $\\int_0^{\\pi} \\sin(x) dx$, utilisée pour calculer l'aire sous une courbe de signal, est égale à :",
        correctAnswerId: "option_C",
        explanation: "Une primitive de $\\sin(x)$ est $-\\cos(x)$.<br>$[-\\cos(x)]_0^{\\pi} = (-\\cos(\\pi)) - (-\\cos(0)) = (-(-1)) - (-1) = 1 + 1 = 2$.",
        options: [
            { id: "option_A", text: "$0$" },
            { id: "option_B", text: "$1$" },
            { id: "option_C", text: "$2$" },
            { id: "option_D", text: "$\\pi$" }
        ]
    },
    {
        id: "qcm_q15",
        question: "15. Si $f(x) = x^4 - 4x^3$ représente une fonction de coût, la dérivée seconde $f''(x)$ (utile pour déterminer les points d'inflexion) est :",
        correctAnswerId: "option_B",
        explanation: "D'abord, la première dérivée : $f'(x) = 4x^3 - 12x^2$.<br>Ensuite, la seconde dérivée : $f''(x) = (4x^3 - 12x^2)' = 12x^2 - 24x$.",
        options: [
            { id: "option_A", text: "$4x^3 - 12x^2$" },
            { id: "option_B", text: "$12x^2 - 24x$" },
            { id: "option_C", text: "$12x^2 - 12x$" },
            { id: "option_D", text: "$4x^3 - 12x$" }
        ]
    },
    {
        id: "qcm_q16",
        question: "16. La solution générale de l'équation différentielle $y' = 2y$ (modélisant une croissance exponentielle de données) est de la forme :",
        correctAnswerId: "option_B",
        explanation: "Les solutions des équations différentielles de la forme $y' = ay$ sont $y = Ce^{ax}$, où $C$ est une constante arbitraire. Ici $a=2$, donc $y = Ce^{2x}$.",
        options: [
            { id: "option_A", text: "$y = Ce^x$" },
            { id: "option_B", text: "$y = Ce^{2x}$" },
            { id: "option_C", text: "$y = 2Ce^x$" },
            { id: "option_D", text: "$y = C/e^{2x}$" }
        ]
    },
    {
        "id": "qcm_q17",
        "question": "17. Dans un réseau informatique, on modélise la performance $P$ en fonction du nombre de connexions actives $n$ par la relation $P = k n^3$, où $k$ est une constante. Quelle est la dérivée $P'(n)$, c’est-à-dire la variation instantanée des performances par rapport au nombre de connexions ?",
        "correctAnswerId": "option_B",
        "explanation": "La dérivée de $P = k n^3$ par rapport à $n$ est $P'(n) = \\frac{d}{dn}(k n^3) = 3 k n^2$. Cela représente la variation instantanée des performances en fonction du nombre de connexions actives.",
        "options": [
            { "id": "option_A", "text": "$k n^2$" },
            { "id": "option_B", "text": "$3k n^2$" },
            { "id": "option_C", "text": "$k n^3$" },
            { "id": "option_D", "text": "$6k n$" }
        ]
    },
    {
        id: "qcm_q18",
        question: "18. Une primitive de $f(x) = \\frac{1}{x+3}$ pour $x > -3$ (utile pour calculer l'accumulation d'un certain phénomène) est :",
        correctAnswerId: "option_B",
        explanation: "Une primitive de $\\frac{1}{u}$ est $\\ln(|u|)$. Puisque $x > -3$, $x+3 > 0$, donc la valeur absolue n'est pas nécessaire : $\\ln(x+3)$.",
        options: [
            { id: "option_A", text: "$\\frac{-1}{(x+3)^2}$" },
            { id: "option_B", text: "$\\ln(x+3)$" },
            { id: "option_C", text: "$\\ln(x) + 3$" },
            { id: "option_D", text: "$x\\ln(x+3)$" }
        ]
    },
    {
        id: "qcm_q19",
        question: "19. Si $\\int_0^3 f(x) dx = 5$ et $\\int_3^5 f(x) dx = 7$, ces valeurs représentant des contributions partielles, alors la contribution totale $\\int_0^5 f(x) dx$ est égale à :",
        correctAnswerId: "option_C",
        explanation: "Par la propriété d'additivité des intégrales : $\\int_a^c f(x) dx = \\int_a^b f(x) dx + \\int_b^c f(x) dx$.<br>Donc $\\int_0^5 f(x) dx = \\int_0^3 f(x) dx + \\int_3^5 f(x) dx = 5 + 7 = 12$.",
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
        correctAnswerId: "option_B",
        explanation: "La valeur moyenne $M = \\frac{1}{b-a} \\int_a^b f(x) dx$.<br>$M = \\frac{1}{3-0} \\int_0^3 x^2 dx = \\frac{1}{3} [\\frac{x^3}{3}]_0^3$<br>$M = \\frac{1}{3} \\left( \\frac{3^3}{3} - \\frac{0^3}{3} \\right) = \\frac{1}{3} \\times 9 = 3$.",
        options: [
            { id: "option_A", text: "$1$" },
            { id: "option_B", text: "$3$" },
            { id: "option_C", text: "$6$" },
            { id: "option_D", text: "$9$" }
        ]
    }
];
const exerciceCorrectionsPartA = [
    {
        id: "exercice_q1a",
        question: "1.a. Quelle est la température du composant au moment de l'allumage ($t=0$) ?",
        correctAnswerId: "option_C",
        explanation: "Pour $t=0$, $T(0) = 20 + 30e^{-0.1 \\times 0} = 20 + 30e^0 = 20 + 30(1) = 50 \\text{ °C}$.",
        options: [
            { id: "option_A", text: "$20 \\text{ °C}$" },
            { id: "option_B", text: "$30 \\text{ °C}$" },
            { id: "option_C", text: "$50 \\text{ °C}$" },
            { id: "option_D", text: "$0 \\text{ °C}$" }
        ]
    },
    {
        id: "exercice_q1b",
        question: "1.b. Comment interprétez-vous concrètement cette température initiale ?",
        correctAnswerId: "option_A",
        explanation: "La température calculée pour $t=0$ représente la température du composant au tout début de son fonctionnement, c'est-à-dire au moment de son démarrage.",
        options: [
            { id: "option_A", text: "C'est la température du composant avant tout fonctionnement, au moment de son démarrage." },
            { id: "option_B", text: "C'est la température ambiante de l'environnement du composant." },
            { id: "option_C", text: "C'est la température maximale que le composant peut atteindre." },
            { id: "option_D", text: "C'est une valeur théorique sans signification physique." }
        ]
    },
    {
        id: "exercice_q2a",
        question: "2.a. Quelle est la dérivée $T'(t)$ de la fonction $T(t) = 20 + 30e^{-0.1t}$ ?",
        correctAnswerId: "option_D",
        explanation: "La fonction est de la forme $T(t) = C + A e^{kt}$. Sa dérivée est $T'(t) = A k e^{kt}$.<br>Ici $C=20$, $A=30$, $k=-0.1$.<br>$T'(t) = 30 \\times (-0.1)e^{-0.1t} = -3e^{-0.1t}$.",
        options: [
            { id: "option_A", text: "$T'(t) = 30e^{-0.1t}$" },
            { id: "option_B", text: "$T'(t) = -0.1e^{-0.1t}$" },
            { id: "option_C", text: "$T'(t) = 20 - 3e^{-0.1t}$" },
            { id: "option_D", text: "$T'(t) = -3e^{-0.1t}$" }
        ]
    },
    {
        id: "exercice_q2b",
        question: "2.b. Quel est le signe de $T'(t)$ pour $t \\geq 0$ ?",
        correctAnswerId: "option_B",
        explanation: "Pour tout $t \\geq 0$, $e^{-0.1t}$ est une exponentielle, donc toujours positive ($e^{-0.1t} > 0$).<br>Par conséquent, $T'(t) = -3e^{-0.1t}$ est toujours négatif ($T'(t) < 0$) car il est multiplié par $-3$.",
        options: [
            { id: "option_A", text: "Toujours positif." },
            { id: "option_B", text: "Toujours négatif." },
            { id: "option_C", text: "Positif puis négatif." },
            { id: "option_D", text: "Négatif puis positif." }
        ]
    },
    {
        id: "exercice_q2c",
        question: "2.c. En déduisez-vous les variations de la fonction $T$ sur $[0, +\\infty[$ :",
        correctAnswerId: "option_B",
        explanation: "Puisque la dérivée $T'(t)$ est toujours négative sur l'intervalle $[0, +\\infty[$, la fonction $T$ est strictement décroissante sur cet intervalle.",
        options: [
            { id: "option_A", text: "La fonction $T$ est strictement croissante." },
            { id: "option_B", text: "La fonction $T$ est strictement décroissante." },
            { id: "option_C", text: "La fonction $T$ est d'abord croissante, puis décroissante." },
            { id: "option_D", text: "La fonction $T$ est constante." }
        ]
    },
    {
        id: "exercice_q2d",
        question: "2.d. Quelle est la limite de $T(t)$ lorsque $t$ tend vers $+ \\infty$ ?",
        correctAnswerId: "option_D",
        explanation: "Lorsque $t \\to +\\infty$, l'exposant $-0.1t \\to -\\infty$.<br>Par conséquent, $e^{-0.1t} \\to 0$.<br>Donc $\\lim_{t \\to +\\infty} T(t) = 20 + 30(0) = 20$.",
        options: [
            { id: "option_A", text: "$+\\infty$" },
            { id: "option_B", text: "$30$" },
            { id: "option_C", text: "$50$" },
            { id: "option_D", text: "$20$" }
        ]
    },
    {
        id: "exercice_q2e",
        question: "2.e. Comment interprétez-vous concrètement cette limite ?",
        correctAnswerId: "option_C",
        explanation: "La limite de $T(t)$ étant $20 \\text{ °C}$ signifie qu'à long terme, la température du composant va tendre à se stabiliser autour de cette valeur (qui peut être la température ambiante par exemple).",
        options: [
            { id: "option_A", text: "À long terme, la température du composant devient infinie." },
            { id: "option_B", text: "La température du composant se stabilise à $30 \\text{ °C}$." },
            { id: "option_C", text: "À long terme, la température du composant se stabilise à $20 \\text{ °C}$." },
            { id: "option_D", text: "La température du composant continue de chuter indéfiniment." }
        ]
    },
    {
        id: "exercice_q3a",
        question: "3.a. Calculez la température moyenne du composant pendant les 10 premières heures de son fonctionnement (valeur approchée à $10^{-2}$ près) :",
        correctAnswerId: "option_B",
        explanation: "La température moyenne $M = \\frac{1}{10-0} \\int_0^{10} (20 + 30e^{-0.1t}) dt$.<br>Une primitive de $20 + 30e^{-0.1t}$ est $20t + 30 \\frac{e^{-0.1t}}{-0.1} = 20t - 300e^{-0.1t}$.<br>$M = \\frac{1}{10} [20t - 300e^{-0.1t}]_0^{10}$<br>$M = \\frac{1}{10} \\left[ (20 \\times 10 - 300e^{-0.1 \\times 10}) - (20 \\times 0 - 300e^{-0.1 \\times 0}) \\right]$<br>$M = \\frac{1}{10} \\left[ (200 - 300e^{-1}) - (0 - 300e^0) \\right]$<br>$M = \\frac{1}{10} \\left[ 200 - 300e^{-1} + 300 \\right]$<br>$M = \\frac{1}{10} \\left[ 500 - 300e^{-1} \\right]$<br>$M = 50 - 30e^{-1} \\approx 50 - 30 \\times 0.367879 \\approx 50 - 11.03637 \\approx 38.96363$.<br>La température moyenne est d'environ $38.96 \\text{ °C}$.",
        options: [
            { id: "option_A", text: "$25.70 \\text{ °C}$" },
            { id: "option_B", text: "$38.96 \\text{ °C}$" },
            { id: "option_C", text: "$42.50 \\text{ °C}$" },
            { id: "option_D", text: "$50.00 \\text{ °C}$" }
        ]
    },
    {
        id: "exercice_q3b",
        question: "3.b. Comment interprétez-vous concrètement cette valeur moyenne ?",
        correctAnswerId: "option_C",
        explanation: "La valeur moyenne représente la température constante qu'aurait eue le composant pendant cette période pour avoir un effet thermique global équivalent à la température variable réelle. C'est une moyenne intégrale sur l'intervalle de temps.",
        options: [
            { id: "option_A", text: "C'est la température que le composant atteindrait après 10 heures." },
            { id: "option_B", text: "C'est la température maximale atteinte pendant cette période." },
            { id: "option_C", text: "C'est la température constante qu'aurait eue le composant pour dégager la même quantité d'énergie thermique sur les 10 premières heures." },
            { id: "option_D", text: "C'est la température la plus faible enregistrée sur les 10 premières heures." }
        ]
    }
];

const exerciceCorrectionsPartB = [
    {
        id: "exercice_q4a",
        question: "1. À partir de quel temps $t$ (en heures, valeur approchée à $10^{-2}$ près) la température du composant devient-elle inférieure ou égale à $22^{\\circ}\\text{C}$ ?",
        correctAnswerId: "option_C",
        explanation: "Nous cherchons $t$ tel que $T(t) \\leq 22$.<br>$20 + 30e^{-0.1t} \\leq 22$<br>$30e^{-0.1t} \\leq 2$<br>$e^{-0.1t} \\leq \\frac{2}{30} = \\frac{1}{15}$<br>On applique la fonction $\\ln$ (qui est croissante) :<br>$\\ln(e^{-0.1t}) \\leq \\ln\\left(\\frac{1}{15}\\right)$<br>$-0.1t \\leq -\\ln(15)$<br>On multiplie par $-10$ (et on inverse le sens de l'inégalité) :<br>$t \\geq 10 \\ln(15)$<br>Avec une calculatrice : $10 \\ln(15) \\approx 10 \\times 2.70805 \\approx 27.0805$.<br>Donc $t \\approx 27.08 \\text{ h}$.",
        options: [
            { id: "option_A", text: "$t \\approx 18.23 \\text{ h}$" },
            { id: "option_B", text: "$t \\approx 20.00 \\text{ h}$" },
            { id: "option_C", text: "$t \\approx 27.08 \\text{ h}$" },
            { id: "option_D", text: "$t \\approx 30.00 \\text{ h}$" }
        ]
    },
    {
        id: "exercice_q5a",
        question: "2.a. Parmi les fonctions suivantes, laquelle pourrait être une modélisation alternative $S(t)$ respectant $S(0) = T(0)$ et $S(t) \\to 20$ lorsque $t \\to +\\infty$ ?",
        correctAnswerId: "option_A",
        explanation: "Vérifions les conditions pour $S(t) = 20 + \\frac{30}{1 + 0.1t}$ :<br>Au démarrage ($t=0$) : $S(0) = 20 + \\frac{30}{1 + 0.1 \\times 0} = 20 + \\frac{30}{1} = 50$. Condition $S(0)=T(0)$ respectée.<br>Comportement asymptotique ($t \\to +\\infty$) : Quand $t \\to +\\infty$, $1 + 0.1t \\to +\\infty$, donc $\\frac{30}{1 + 0.1t} \\to 0$. Par conséquent, $S(t) \\to 20$. Condition asymptotique respectée.<br>Les autres fonctions ne respectent pas les deux conditions simultanément.",
        options: [
            { id: "option_A", text: "$S(t) = 20 + \\frac{30}{1 + 0.1t}$" },
            { id: "option_B", text: "$S(t) = 20 + 30t$" },
            { id: "option_C", text: "$S(t) = 50 - 30e^{-0.1t}$" },
            { id: "option_D", "text": "$S(t) = 20 + 30\\sin(t)$" }
        ]
    },
    {
        id: "exercice_q5b",
        question: "2.b. Quel est un avantage principal de la modélisation exponentielle $T(t)$ par rapport à une modélisation du type $S(t) = 20 + \\frac{30}{1 + kt}$ pour un phénomène de refroidissement ?",
        correctAnswerId: "option_B",
        explanation: "La loi de refroidissement de Newton établit que le taux de perte de chaleur d'un objet est proportionnel à la différence de température entre l'objet et son environnement. Cette loi conduit naturellement à une modélisation exponentielle, rendant la fonction $T(t)$ plus représentative physiquement pour ces phénomènes.",
        options: [
            { id: "option_A", text: "Elle est plus facile à calculer sans calculatrice." },
            { id: "option_B", text: "Elle est souvent plus fidèle aux lois physiques de refroidissement (Loi de Newton)." },
            { id: "option_C", text: "Elle atteint sa limite plus rapidement." },
            { id: "option_D", text: "Elle permet des températures négatives." }
        ]
    }
];