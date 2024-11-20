import csv
import json
import os
from datetime import datetime
from collections import defaultdict

def lire_trafic_marseille(nom_fichier):
    trafic_marseille = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
    
    with open(nom_fichier, 'r') as fichier_csv:
        lecteur_csv = csv.reader(fichier_csv, delimiter=';')
        next(lecteur_csv)  # Ignorer l'en-tête
        
        for ligne in lecteur_csv:
            date = datetime.strptime(ligne[1], "%Y-%m-%d")
            jour = date.strftime("%Y-%m-%d")
            heure = int(ligne[2])
            minute = 0  # Comme les données sont horaires, on met 0 pour les minutes
            trafic = int(ligne[8])  # ITV_Marseille est à l'index 8
            
            trafic_marseille[jour][heure][minute].append(trafic)
    
    return trafic_marseille

def calculer_moyennes(donnees, niveau):
    if niveau == "heure":
        return calculer_moyennes_heure(donnees)
    elif niveau == "jour":
        return calculer_moyennes_jour(donnees)
    else:
        raise ValueError("Niveau invalide. Choisissez 'heure' ou 'jour'.")

def calculer_moyennes_quart_dheure(donnees):
    # Comme les données sont horaires, on retourne simplement les données telles quelles
    return {
        jour: {
            heure: {
                0: sum(valeurs) / len(valeurs) for minute, valeurs in minutes.items()
            }
            for heure, minutes in heures.items()
        }
        for jour, heures in donnees.items()
    }

def calculer_moyennes_heure(donnees):
    # Les données sont déjà horaires, donc on retourne simplement les moyennes par heure
    return {
        jour: {
            heure: sum(valeurs[0]) / len(valeurs[0]) for heure, valeurs in heures.items()
        }
        for jour, heures in donnees.items()
    }

def calculer_moyennes_jour(donnees):
    moyennes = defaultdict(list)
    for jour, heures in donnees.items():
        for heure, minutes in heures.items():
            moyennes[jour].extend(minutes[0])
    
    return {
        jour: sum(valeurs) / len(valeurs) for jour, valeurs in moyennes.items()
    }

def generer_json(donnees):
    return json.dumps(donnees, indent=2)

def sauvegarder_json(donnees, niveau):
    dossier = 'json-traffic'
    if not os.path.exists(dossier):
        os.makedirs(dossier)
    
    nom_fichier = f"trafic_marseille_{niveau}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    chemin_fichier = os.path.join(dossier, nom_fichier)
    
    with open(chemin_fichier, 'w') as fichier_json:
        json.dump(donnees, fichier_json, indent=2)
    
    return chemin_fichier

def main():
    nom_fichier = "../back/Dataset/CEREMA 1/data_Agglo_horaire.csv"
    trafic_marseille = lire_trafic_marseille(nom_fichier)

    niveau = input("Entrez le niveau de détail souhaité (heure, jour) : ").lower()
    
    try:
        moyennes = calculer_moyennes(trafic_marseille, niveau)
        chemin_fichier = sauvegarder_json(moyennes, niveau)
        print(f"Les données de trafic ont été sauvegardées dans '{chemin_fichier}'")
    except ValueError as e:
        print(f"Erreur : {e}")

if __name__ == "__main__":
    main()