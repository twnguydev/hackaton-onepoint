import csv
import json
import os
from datetime import datetime
from collections import defaultdict
import subprocess

variables = {
    "01": "SO2", "02": "NO", "03": "NO2", "12": "NOx",
    "24": "PM10", "39": "PM2.5", "68": "PM1"
}

def traiter_donnees_csv(nom_fichier):
    donnees = defaultdict(lambda: defaultdict(lambda: defaultdict(lambda: defaultdict(list))))

    with open(nom_fichier, 'r') as fichier_csv:
        lecteur_csv = csv.DictReader(fichier_csv)
        
        for ligne in lecteur_csv:
            date = datetime.strptime(ligne['date'], "%Y-%m-%dT%H:%M:%S%z")
            jour = date.date().isoformat()
            heure = date.hour
            minute = (date.minute // 15) * 15
            
            for code, nom in variables.items():
                if code in ligne and ligne[code]:
                    donnees[jour][heure][minute][nom].append(float(ligne[code]))

    return donnees

def calculer_moyennes(donnees, niveau):
    if niveau == "quart-dheure":
        return calculer_moyennes_quart_dheure(donnees)
    elif niveau == "heure":
        return calculer_moyennes_heure(donnees)
    elif niveau == "jour":
        return calculer_moyennes_jour(donnees)
    else:
        raise ValueError("Niveau invalide. Choisissez 'quart-dheure', 'heure' ou 'jour'.")

def calculer_moyennes_quart_dheure(donnees):
    return {
        jour: {
            heure: {
                minute: {
                    nom: sum(valeurs) / len(valeurs)
                    for nom, valeurs in polluants.items()
                }
                for minute, polluants in minutes.items()
            }
            for heure, minutes in heures.items()
        }
        for jour, heures in donnees.items()
    }

def calculer_moyennes_heure(donnees):
    moyennes = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    for jour, heures in donnees.items():
        for heure, minutes in heures.items():
            for minute, polluants in minutes.items():
                for nom, valeurs in polluants.items():
                    moyennes[jour][heure][nom].extend(valeurs)
    
    return {
        jour: {
            heure: {
                nom: sum(valeurs) / len(valeurs)
                for nom, valeurs in polluants.items()
            }
            for heure, polluants in heures.items()
        }
        for jour, heures in moyennes.items()
    }

def calculer_moyennes_jour(donnees):
    moyennes = defaultdict(lambda: defaultdict(list))
    for jour, heures in donnees.items():
        for heure, minutes in heures.items():
            for minute, polluants in minutes.items():
                for nom, valeurs in polluants.items():
                    moyennes[jour][nom].extend(valeurs)
    
    return {
        jour: {
            nom: sum(valeurs) / len(valeurs)
            for nom, valeurs in polluants.items()
        }
        for jour, polluants in moyennes.items()
    }

def generer_json(donnees):
    return json.dumps(donnees, indent=2)

def sauvegarder_json(donnees, niveau):
    # Créer le dossier 'json-pollutant' s'il n'existe pas
    dossier = 'json-pollutant'
    if not os.path.exists(dossier):
        os.makedirs(dossier)
    
    # Générer le nom du fichier avec la date et l'heure actuelles
    nom_fichier = f"donnees_polluants_{niveau}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    
    # Chemin complet du fichier
    chemin_fichier = os.path.join(dossier, nom_fichier)
    
    # Sauvegarder le fichier JSON
    with open(chemin_fichier, 'w') as fichier_json:
        json.dump(donnees, fichier_json, indent=2)
    
    return chemin_fichier

def envoyer_a_ollama(donnees_json):
    # Appel à Ollama via la ligne de commande
    try:
        command = ["ollama", "run", "llama2", "-p", f"Analyse des données polluantes: {donnees_json}"]
        result = subprocess.run(command, capture_output=True, text=True)
        
        if result.returncode == 0:
            return result.stdout
        else:
            return f"Erreur lors de l'exécution d'Ollama : {result.stderr}"
    except Exception as e:
        return f"Erreur lors de l'appel à Ollama : {e}"

def main():
    nom_fichier = "../back/Dataset/AtmoSud - Observations/FR00019.csv"
    donnees = traiter_donnees_csv(nom_fichier)

    niveau = input("Entrez le niveau de détail souhaité (quart-dheure, heure, jour) : ").lower()
    
    try:
        moyennes = calculer_moyennes(donnees, niveau)
        chemin_fichier = sauvegarder_json(moyennes, niveau)
        print(f"Les données ont été sauvegardées dans '{chemin_fichier}'")
        
        # Générer le JSON pour Ollama
        donnees_json = generer_json(moyennes)
        rapport = envoyer_a_ollama(donnees_json)
        print(f"Rapport d'Ollama : {rapport}")
    except ValueError as e:
        print(f"Erreur : {e}")

if __name__ == "__main__":
    main()
