import json
import hashlib
import random

def create_obfuscated_answers(qcm_answers, exercice_answers, output_file):
    """
    Crée un encodage multi-couches difficile à déchiffrer :
    1. XOR avec une clé dérivée dynamiquement
    2. Fragmentation des données
    3. Ajout de données leurres
    4. Obscurcissement du code JavaScript
    """
    
    all_answers = {
        "qcm": qcm_answers,
        "exercice": exercice_answers
    }
    json_data = json.dumps(all_answers)
    
    # Génération d'une clé pseudo-aléatoire basée sur les données
    seed = sum(ord(c) for c in json_data)
    random.seed(seed)
    key = [random.randint(0, 255) for _ in range(len(json_data))]
    
    # XOR encoding
    encoded_bytes = []
    for i, char in enumerate(json_data):
        encoded_bytes.append(ord(char) ^ key[i % len(key)])
    
    # Fragmentation en plusieurs parties
    fragment_size = len(encoded_bytes) // 3
    fragments = [
        encoded_bytes[:fragment_size],
        encoded_bytes[fragment_size:fragment_size*2],
        encoded_bytes[fragment_size*2:]
    ]
    
    # Ajout de données leurres
    decoy_data = [random.randint(0, 255) for _ in range(50)]
    
    # Conversion en hex strings
    frag_strs = [','.join(map(str, frag)) for frag in fragments]
    decoy_str = ','.join(map(str, decoy_data))
    
    # Génération du code JavaScript obscurci
    js_content = f"""// Configuration système - Ne pas modifier
const _0x4a2b = ['{frag_strs[0]}', '{frag_strs[1]}', '{frag_strs[2]}'];
const _0x7c3d = '{decoy_str}';
const _0x9e1f = {seed};

function _0x2d4e() {{
    const _0x5f6a = _0x4a2b.join(',').split(',').map(x => parseInt(x));
    let _0x8b9c = [];
    const _0x1a3d = _0x5f6a.reduce((a,b) => a+b, 0);
    const rng = ((s) => {{
        let seed = s;
        return () => {{
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        }};
    }})(_0x9e1f);
    
    const _0x4e7b = [];
    for(let i = 0; i < _0x5f6a.length; i++) {{
        _0x4e7b.push(Math.floor(rng() * 256));
    }}
    
    for(let i = 0; i < _0x5f6a.length; i++) {{
        _0x8b9c.push(_0x5f6a[i] ^ _0x4e7b[i % _0x4e7b.length]);
    }}
    
    return String.fromCharCode(..._0x8b9c);
}}

function getDecodedAnswers() {{
    try {{
        return JSON.parse(_0x2d4e());
    }} catch(e) {{
        console.error('Erreur de configuration');
        return null;
    }}
}}

// Export pour utilisation
window.getAnswers = getDecodedAnswers;
"""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"✓ Réponses encodées avec succès dans {output_file}")
    print(f"✓ Utilisation: const answers = getAnswers();")

if __name__ == "__main__":
    qcm_answers = {
        "qcm_q1": "option_B", "qcm_q2": "option_B", "qcm_q3": "option_C", 
        "qcm_q4": "option_B", "qcm_q5": "option_C", "qcm_q6": "option_A", 
        "qcm_q7": "option_C", "qcm_q8": "option_B", "qcm_q9": "option_C", 
        "qcm_q10": "option_A", "qcm_q11": "option_B", "qcm_q12": "option_B", 
        "qcm_q13": "option_B", "qcm_q14": "option_C", "qcm_q15": "option_B",
        "qcm_q16": "option_B", "qcm_q17": "option_B", "qcm_q18": "option_B", 
        "qcm_q19": "option_C", "qcm_q20": "option_B",
    }
    
    exercice_answers = {
        "exercice_q1a": "option_A", "exercice_q1b": "option_A", 
        "exercice_q2a": "option_A", "exercice_q2b": "option_A", 
        "exercice_q2c": "option_A", "exercice_q2d": "option_C", 
        "exercice_q2e": "option_C", "exercice_q3a": "option_B", 
        "exercice_q3b": "option_C", "exercice_q4a": "option_A", 
        "exercice_q5a": "option_C", "exercice_q5b": "option_B",
    }

    output_path = "../static/js/answers_encoded.js"
    create_obfuscated_answers(qcm_answers, exercice_answers, output_path)