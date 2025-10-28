# Fichier : tools/encode_answers.py
import base64
import json

def encode_answers(qcm_answers, exercice_answers, output_file):
    """
    Encode les réponses QCM et d'exercice en Base64 et les écrit dans un fichier JS.
    """
    all_answers = {
        "qcm": qcm_answers,
        "exercice": exercice_answers
    }
    json_data = json.dumps(all_answers)
    encoded_data = base64.b64encode(json_data.encode('utf-8')).decode('utf-8')

    js_content = f"const encodedAnswers = '{encoded_data}';"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f"Réponses encodées et écrites dans {output_file}")

if __name__ == "__main__":
    qcm_answers = {
        "qcm_q1": "option_B", "qcm_q2": "option_B", "qcm_q3": "option_C", "qcm_q4": "option_B", "qcm_q5": "option_C",
        "qcm_q6": "option_A", "qcm_q7": "option_C", "qcm_q8": "option_B", "qcm_q9": "option_C", "qcm_q10": "option_A",
        "qcm_q11": "option_B", "qcm_q12": "option_B", "qcm_q13": "option_B", "qcm_q14": "option_C", "qcm_q15": "option_B",
        "qcm_q16": "option_B", "qcm_q17": "option_B", "qcm_q18": "option_B", "qcm_q19": "option_C", "qcm_q20": "option_B",
    }
    exercice_answers = {
        "exercice_q1a": "option_C", "exercice_q1b": "option_A", "exercice_q2a": "option_D", "exercice_q2b": "option_B",
        "exercice_q2c": "option_B", "exercice_q2d": "option_D", "exercice_q2e": "option_C", "exercice_q3a": "option_B",
        "exercice_q3b": "option_C", "exercice_q4a": "option_C", "exercice_q5a": "option_A", "exercice_q5b": "option_B",
    }
    output_path = "../static/js/answers_encoded.js"
    encode_answers(qcm_answers, exercice_answers, output_path)