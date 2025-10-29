# Fichier : tools/encode_answers.py
import json
import base64
import os

def create_obfuscated_answers(qcm_answers, exercice_answers, output_file):
    """
    Crée un encodage plus simple mais efficace.
    Utilise Base64 + rotation + fragmentation.
    """
    
    all_answers = {
        "qcm": qcm_answers,
        "exercice": exercice_answers
    }
    
    # Convertir en JSON
    json_data = json.dumps(all_answers)
    
    # Étape 1 : Base64
    base64_encoded = base64.b64encode(json_data.encode('utf-8')).decode('utf-8')
    
    # Étape 2 : Rotation simple des caractères (décalage ASCII)
    shift = 7
    rotated = ''.join(chr((ord(char) + shift) % 256) for char in base64_encoded)
    
    # Étape 3 : Inversion
    inverted = rotated[::-1]
    
    # Étape 4 : Re-encodage Base64
    final_encoded = base64.b64encode(inverted.encode('latin-1')).decode('utf-8')
    
    # Étape 5 : Fragmentation
    fragment_size = len(final_encoded) // 3
    fragment1 = final_encoded[:fragment_size]
    fragment2 = final_encoded[fragment_size:fragment_size*2]
    fragment3 = final_encoded[fragment_size*2:]
    
    # Génération du code JavaScript
    js_content = f"""// ============================================
// SYSTÈME DE RÉPONSES SÉCURISÉ
// Multi-couches: Base64 + Rotation + Inversion
// ============================================

const _0xf1 = '{fragment1}';
const _0xf2 = '{fragment2}';
const _0xf3 = '{fragment3}';
const _0xshift = {shift};

function _0xdecode() {{
    try {{
        // Étape 1 : Reconstruction
        const combined = _0xf1 + _0xf2 + _0xf3;
        
        // Étape 2 : Décodage Base64
        const decoded1 = atob(combined);
        
        // Étape 3 : Inversion
        const reversed = decoded1.split('').reverse().join('');
        
        // Étape 4 : Rotation inverse
        let unrotated = '';
        for (let i = 0; i < reversed.length; i++) {{
            const charCode = reversed.charCodeAt(i);
            const newCharCode = (charCode - _0xshift + 256) % 256;
            unrotated += String.fromCharCode(newCharCode);
        }}
        
        // Étape 5 : Décodage Base64 final
        const final = atob(unrotated);
        
        return final;
    }} catch (e) {{
        console.error('Erreur décodage:', e);
        return null;
    }}
}}

// ============================================
// FONCTION PUBLIQUE
// ============================================

function decodeAnswers(dummyParam) {{
    try {{
        const decoded = _0xdecode();
        if (!decoded) {{
            console.error('❌ Décodage a retourné null');
            return null;
        }}
        return JSON.parse(decoded);
    }} catch(e) {{
        console.error('❌ Erreur JSON.parse:', e);
        return null;
    }}
}}

// Variable globale pour compatibilité
const encodedAnswers = "_OBFUSCATED_";

// Export alternatif
window.getAnswers = function() {{
    return decodeAnswers();
}};

// ============================================
// AUTO-TEST AU CHARGEMENT
// ============================================

console.log('%c🔐 Système de réponses chargé', 'color: green; font-weight: bold;');

(function() {{
    const testAnswers = decodeAnswers();
    if (testAnswers && testAnswers.qcm && testAnswers.exercice) {{
        console.log('%c✅ Réponses validées:', 'color: green; font-weight: bold;', {{
            qcm: Object.keys(testAnswers.qcm).length + ' questions',
            exercice: Object.keys(testAnswers.exercice).length + ' questions'
        }});
    }} else {{
        console.error('%c❌ ERREUR: Réponses invalides!', 'color: red; font-weight: bold;');
        console.log('Détails:', testAnswers);
    }}
}})();
"""
    
    # Créer le dossier si nécessaire
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    return output_file

if __name__ == "__main__":
    print("=" * 60)
    print("🔐 GÉNÉRATEUR DE RÉPONSES SÉCURISÉES")
    print("=" * 60)
    
    # Réponses QCM (Exercice 1)
    qcm_answers = {
        "qcm_q1": "option_B", 
        "qcm_q2": "option_B", 
        "qcm_q3": "option_C", 
        "qcm_q4": "option_B", 
        "qcm_q5": "option_C", 
        "qcm_q6": "option_A", 
        "qcm_q7": "option_C", 
        "qcm_q8": "option_B", 
        "qcm_q9": "option_C", 
        "qcm_q10": "option_A", 
        "qcm_q11": "option_B", 
        "qcm_q12": "option_B", 
        "qcm_q13": "option_B", 
        "qcm_q14": "option_C", 
        "qcm_q15": "option_B",
        "qcm_q16": "option_B", 
        "qcm_q17": "option_B", 
        "qcm_q18": "option_B", 
        "qcm_q19": "option_C", 
        "qcm_q20": "option_B",
    }
    
    # Réponses Exercice 2
    exercice_answers = {
        "exercice_q1a": "option_A", 
        "exercice_q1b": "option_A", 
        "exercice_q2a": "option_A", 
        "exercice_q2b": "option_A", 
        "exercice_q2c": "option_A", 
        "exercice_q2d": "option_C", 
        "exercice_q2e": "option_C", 
        "exercice_q3a": "option_B", 
        "exercice_q3b": "option_C", 
        "exercice_q4a": "option_A", 
        "exercice_q5a": "option_C", 
        "exercice_q5b": "option_B",
    }
    
    print(f"\n📊 Statistiques:")
    print(f"   - Questions QCM: {len(qcm_answers)}")
    print(f"   - Questions Exercice: {len(exercice_answers)}")
    print(f"   - Total: {len(qcm_answers) + len(exercice_answers)} questions")
    
    # Déterminer le chemin de sortie
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    if os.path.basename(script_dir) == "tools":
        output_path = os.path.join(script_dir, "..", "static", "js", "answers_encoded.js")
    else:
        output_path = os.path.join(script_dir, "static", "js", "answers_encoded.js")
    
    output_path = os.path.normpath(output_path)
    
    print(f"\n📂 Chemin de sortie:")
    print(f"   {output_path}")
    
    # Génération
    print(f"\n🔄 Génération en cours...")
    created_file = create_obfuscated_answers(qcm_answers, exercice_answers, output_path)
    
    # Vérification
    if os.path.exists(created_file):
        file_size = os.path.getsize(created_file)
        print(f"\n✅ Fichier créé avec succès!")
        print(f"   📍 Emplacement: {os.path.abspath(created_file)}")
        print(f"   📦 Taille: {file_size} octets")
        print(f"\n💡 Utilisation:")
        print(f"   const answers = decodeAnswers(encodedAnswers);")
        print(f"\n🔒 Protection:")
        print(f"   - Base64 (double)")
        print(f"   - Rotation ASCII (shift={7})")
        print(f"   - Inversion de chaîne")
        print(f"   - Fragmentation en 3 parties")
        print(f"\n⚠️  Chargez answers_encoded.js AVANT main.js!")
    else:
        print(f"\n❌ ERREUR: Fichier non créé!")
        print(f"   Vérifiez: {os.path.dirname(created_file)}")
    
    print("\n" + "=" * 60)