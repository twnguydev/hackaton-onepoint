import csv
import json
import os
from datetime import datetime
from collections import defaultdict

def lire_donnees_aeroport(nom_fichier):
    donnees_aeroport = defaultdict(lambda: defaultdict(lambda: {"arrivees": 0, "departs": 0}))
    
    with open(nom_fichier, 'r') as fichier_csv:
        lecteur_csv = csv.reader(fichier_csv)
        next(lecteur_csv)  # Ignorer l'en-tête si présent
        
        for ligne in lecteur_csv:
            timestamp = int(ligne[0])
            date = datetime.fromtimestamp(timestamp)
            jour = date.strftime("%Y-%m-%d")
            arrivees = int(ligne[1])
            departs = int(ligne[2])
            
            donnees_aeroport[jour]["arrivees"] = arrivees
            donnees_aeroport[jour]["departs"] = departs
    
    return donnees_aeroport

def calculer_moyennes(donnees, niveau):
    if niveau == "jour":
        return donnees
    elif niveau == "semaine":
        return calculer_moyennes_semaine(donnees)
    elif niveau == "mois":
        return calculer_moyennes_mois(donnees)
    else:
        raise ValueError("Niveau invalide. Choisissez 'jour', 'semaine' ou 'mois'.")

def calculer_moyennes_semaine(donnees):
    moyennes_semaine = defaultdict(lambda: {"arrivees": [], "departs": []})
    for date_str, valeurs in donnees.items():
        date = datetime.strptime(date_str, "%Y-%m-%d")
        semaine = date.strftime("%Y-W%W")
        moyennes_semaine[semaine]["arrivees"].append(valeurs["arrivees"])
        moyennes_semaine[semaine]["departs"].append(valeurs["departs"])
    
    return {
        semaine: {
            "arrivees": int(round(sum(valeurs["arrivees"]) / len(valeurs["arrivees"]))),
            "departs": int(round(sum(valeurs["departs"]) / len(valeurs["departs"])))
        }
        for semaine, valeurs in moyennes_semaine.items()
    }

def calculer_moyennes_mois(donnees):
    moyennes_mois = defaultdict(lambda: {"arrivees": [], "departs": []})
    for date_str, valeurs in donnees.items():
        mois = date_str[:7]  # YYYY-MM
        moyennes_mois[mois]["arrivees"].append(valeurs["arrivees"])
        moyennes_mois[mois]["departs"].append(valeurs["departs"])
    
    return {
        mois: {
            "arrivees": int(round(sum(valeurs["arrivees"]) / len(valeurs["arrivees"]))),
            "departs": int(round(sum(valeurs["departs"]) / len(valeurs["departs"])))
        }
        for mois, valeurs in moyennes_mois.items()
    }

def sauvegarder_json(donnees, niveau):
    dossier = 'json-aeroport'
    if not os.path.exists(dossier):
        os.makedirs(dossier)
    
    nom_fichier = f"donnees_aeroport_{niveau}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    chemin_fichier = os.path.join(dossier, nom_fichier)
    
    with open(chemin_fichier, 'w') as fichier_json:
        json.dump(donnees, fichier_json, indent=2)
    
    return chemin_fichier

def main():
    nom_fichier = "../back/Dataset/LFML airport/airport_traffic.csv"  # Assurez-vous que ce fichier existe
    donnees_aeroport = lire_donnees_aeroport(nom_fichier)

    niveau = input("Entrez le niveau de détail souhaité (jour, semaine, mois) : ").lower()
    
    try:
        moyennes = calculer_moyennes(donnees_aeroport, niveau)
        chemin_fichier = sauvegarder_json(moyennes, niveau)
        print(f"Les données de l'aéroport ont été sauvegardées dans '{chemin_fichier}'")
    except ValueError as e:
        print(f"Erreur : {e}")

if __name__ == "__main__":
    main()