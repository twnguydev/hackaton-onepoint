from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
import os
import json
import requests
app = Flask(__name__)

CORS(app)  # Activer CORS pour toutes les routes

# Utiliser http://ollama:11434 comme OLLAMA_HOST si aucune variable d'environnement n'est définie
OLLAMA_HOST = os.environ.get('OLLAMA_HOST', 'http://ollama:11434')

def get_json_data(dir_name, file_name):
    try:
        json_dir_path = os.path.join(os.path.dirname(__file__), dir_name)
        json_file_name = file_name

        with open(os.path.join(json_dir_path, json_file_name), 'r') as file:
            data = json.load(file)

        return data

    except Exception as e:
        app.logger.error(f"Error loading JSON file: {str(e)}")
        return None

@app.route('/', methods=['GET'])
def index():
    return {
        "roadTraffic": {
            "horary_traffic": get_json_data("json-traffic", "trafic_marseille_heure_20241003_111756.json"),
            "daily_traffic": get_json_data("json-traffic", "trafic_marseille_jour_20241003_111821.json")
        },
        "airportTraffic": {
            "weakly_traffic": get_json_data("json-aeroport", "donnees_aeroport_semaine_20241003_114505.json"),
            "monthly_traffic": get_json_data("json-aeroport", "donnees_aeroport_mois_20241003_114515.json")
        },
        "weatherData": {
            "marseille": {
                "temperature": get_json_data("json-weather", "results_average_temp_2020_2022_marseille.json"),
                "humidity": get_json_data("json-weather", "results_humidity_2020_2022_marseille.json"),
                "rain": get_json_data("json-weather", "results_rain_2020_2022_marseille.json"),
                "wind": get_json_data("json-weather", "results_vent_2020_2022_marseille_kmh.json"),
            },
            "fos": {
                "temperature": get_json_data("json-weather", "results_average_temp_2020_2022_fos.json"),
                "humidity": get_json_data("json-weather", "results_humidity_2020_2022_fos.json"),
                "rain": get_json_data("json-weather", "results_rain_2020_2022_fos.json"),
                "wind": get_json_data("json-weather", "results_vent_2020_2022_fos_kmh.json"),
            }
        },
        "pollutantData": {
            "quarter_hour_pollutant": get_json_data("json-pollutant", "donnees_polluants_quart-dheure_20241003_145537.json"),
            "horary_pollutant": get_json_data("json-pollutant", "donnees_polluants_heure_20241003_145552.json"),
            "daily_pollutant": get_json_data("json-pollutant", "donnees_polluants_jour_20241003_145545.json")
        }
    }

@app.route('/prompt', methods=['POST'])
def prompt():
    try:
        data = request.json
        user_message = data.get('prompt', '')

        if not user_message:
            return jsonify({'error': 'No prompt provided'}), 400

        # Envoyer la requête à Ollama via HTTP avec le modèle orca-mini
        ollama_url = f"{OLLAMA_HOST}/api/generate"
        payload = {
            "model": "orca-mini",  # Changer le modèle ici
            "messages": [
                {
                    'role': 'user',
                    'content': user_message,
                }
            ]
        }

        # Log la requête envoyée
        app.logger.info(f"Sending request to Ollama: {payload}")

        # Effectuer la requête HTTP POST
        response = requests.post(ollama_url, json=payload)

        # Log la réponse
        app.logger.info(f"Ollama response status: {response.status_code}")
        app.logger.info(f"Ollama response data: {response.text}")

        # Si la requête réussit, retourner la réponse
        if response.status_code == 200:
            response_data = response.json()
            return jsonify({'response': response_data['message']['content']}), 200
        else:
            return jsonify({'error': 'Error communicating with Ollama API'}), response.status_code

    except Exception as e:
        app.logger.error(f"Error in prompt route: {str(e)}")
        return jsonify({'error': 'An error occurred while processing your request: ' + str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
