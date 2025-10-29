// ============================================
// SYSTÈME DE RÉPONSES SÉCURISÉ
// Multi-couches: Base64 + Rotation + Inversion

// // 🔒 Code protégé — ingénierie inverse interdite.
// Toute tentative de décryptage sera clairement identifier 😉
// CHAQUE CLIQUE EST ENREGISTRE MEME L'OUVERTURE DE LA CONSOLE VIA F12 ou shift ctrl C😉

                // D. BENMAKHLOUF

               // OBFUSCATION LEGERE...
// ============================================

const _0xf1 = 'QDh1UEpAc2l9c05rfkB0UG52cVBwXVtqbV05YHdVdGpzb19hcEhKU3BUN198QF5oN0k6aXBIcFZwTF5Vf0BdYXFzOWCAXU5sc1FKUHpQWlhtPDlpd1lPan1RSlA9UFpgN0w6X3NVXmhxUV9hO110UG5+cFBLQHNpfXNOa35AdFBudnFQcFVbam1dOWB3VXRqc29fYXBISlNwUDdffEBeaDdJOmlwSHBWcEw5VH9AXWFxczlggF1ObHNRSlB6UIBYbTw5aXdZT2p9UUpQPVBaYYBMOl9zVV5ocVFfYTtddFBufnBQS0BzaX1zTmt+QHRQbnZxUHJRW2ptXTlgd1V0anNvX2FwSEpTcEw3X3xAXmg3STppcEhwVnBUdFR/QF1hcXM5YIBdTmxzUUpQelBaWG08OWl3WU9qfVFKUD1QcGCATDpfc1VeaHFRX2E7XXRQbn5wUElAc2l9c05rfkB0UG52cVBvUVtq';
const _0xf2 = 'bV05YHdVdGpzb19hcEhKU3BMN198QF5oN0k6aXBIcFZwUF5Uf0BdYXFzOWCAXU5sc1FKUHpQWlhtPDlpd1lPan1RSlA9UFpgf0w6X3NVXmhxUV9hO110UD5JcFZwXDlgd1V0anNvX2FwSEpTQFFwWG08OWl3WU9qfVFKUD1QSlSATDpfe1VeanBISlNwVDdffEBeaDdJOmlwSHBWcHJbVH9AXWlxTXVQbn5wUEpAc2l9c05rfkB0UG52cVA7TFtqbTg5YH9RSlB6UHBYbTw5aXdZT2p9UUpQPVCAVX9MOl97VV5qcEhKU3BQN198QF5oN0k6aXBIcFZwYFtUf0BdaXFNdVBufnBQSkBzaX1zTmt+QHRQbnZxUDhMW2ptODlgf1FKUHpQgFhtPDlpd1lPan1RSlA9UEpVf0w6X3tVXmpwSEpTcFA3X3xAXmg3STppcEhwVnBUW1R/QF1pcU11UG5+cFBKQHNp';
const _0xf3 = 'fXNOa35AdFBudnFQgExbam04OWB/UUpQelBwWG08OWl3WU9qfVFKUD1QWlR/TDpfe1VeanBISlNwTDdffEBeaDdJOmlwSHBWcEhbVH9AXWlxTXVQbn5wUEtAc2l9c05rfkB0UG52cVA8TDpfe1VeanBISlNwUDdffEBeaDdJOmlwSHBWcG5bam04OWB/UUpQelCAWG08OWl3WU9qfVFKUD1QgFV/QF1pcU11UG5+cFBJQHNpfXNOa35AdFBudnFQOUw6X3tVXmpwSEpTcFQ3X3xAXmg3STppcEhwVnBcW2ptODlgf1FKUHpQcFhtPDlpd1lPan1RSlA9UEpVf0BdaXFNdVBufnBQS0BzaX1zTmt+QHRQbnZxUIFMOl97VV5qcEhKU3BQN198QF5oN0k6aXBIcFZwUFtqbTg5YH9RSlB6UHBYbTw5aXdZT2p9UUpQPVBaVH9AXWlxTXVQPklwVnA3OWB/UYBs';
const _0xshift = 7;

function _0xdecode() {
    try {
        // Étape 1 : Reconstruction
        const combined = _0xf1 + _0xf2 + _0xf3;
        
        // Étape 2 : Décodage Base64
        const decoded1 = atob(combined);
        
        // Étape 3 : Inversion
        const reversed = decoded1.split('').reverse().join('');
        
        // Étape 4 : Rotation inverse
        let unrotated = '';
        for (let i = 0; i < reversed.length; i++) {
            const charCode = reversed.charCodeAt(i);
            const newCharCode = (charCode - _0xshift + 256) % 256;
            unrotated += String.fromCharCode(newCharCode);
        }
        
        // Étape 5 : Décodage Base64 final
        const final = atob(unrotated);
        
        return final;
    } catch (e) {
        console.error('Erreur décodage:', e);
        return null;
    }
}

// ============================================
// FONCTION PUBLIQUE
// ============================================

function decodeAnswers(dummyParam) {
    try {
        const decoded = _0xdecode();
        if (!decoded) {
            console.error('❌ Décodage a retourné null');
            return null;
        }
        return JSON.parse(decoded);
    } catch(e) {
        console.error('❌ Erreur JSON.parse:', e);
        return null;
    }
}

// Variable globale pour compatibilité
const encodedAnswers = "_OBFUSCATED_";

// Export alternatif
window.getAnswers = function() {
    return decodeAnswers();
};

// ============================================
// AUTO-TEST AU CHARGEMENT
// ============================================

console.log('%c🔐 Système de réponses chargé', 'color: green; font-weight: bold;');

(function() {
    const testAnswers = decodeAnswers();
    if (testAnswers && testAnswers.qcm && testAnswers.exercice) {
        console.log('%c✅ Réponses validées:', 'color: green; font-weight: bold;', {
            qcm: Object.keys(testAnswers.qcm).length + ' questions',
            exercice: Object.keys(testAnswers.exercice).length + ' questions'
        });
    } else {
        console.error('%c❌ ERREUR: Réponses invalides!', 'color: red; font-weight: bold;');
        console.log('Détails:', testAnswers);
    }
})();
