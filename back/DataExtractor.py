import os
import pandas as pd
import json

class DataExtractor:
    def __init__(self, base_path="/dataset"):
        self.base_path = base_path

    def list_files(self):
        """
        Liste tous les fichiers dans le répertoire dataset et ses sous-répertoires.
        """
        files_list = []
        for root, dirs, files in os.walk(self.base_path):
            for file in files:
                if file.endswith(".csv") or file.endswith(".json"):
                    files_list.append(os.path.join(root, file))
        return files_list

    def load_csv(self, file_path):
        """
        Charge un fichier CSV et le retourne sous forme de DataFrame.
        """
        try:
            return pd.read_csv(file_path)
        except Exception as e:
            print(f"Erreur lors du chargement du fichier CSV {file_path}: {e}")
            return None

    def load_json(self, file_path):
        """
        Charge un fichier JSON et le retourne sous forme de DataFrame.
        """
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
            return pd.json_normalize(data)  # Normaliser les données JSON imbriquées
        except Exception as e:
            print(f"Erreur lors du chargement du fichier JSON {file_path}: {e}")
            return None

    def extract_all_data(self):
        """
        Extrait et charge les données de tous les fichiers CSV et JSON dans /dataset.
        Retourne une liste de DataFrames.
        """
        dataframes = []
        files_list = self.list_files()
        
        for file in files_list:
            if file.endswith(".csv"):
                df = self.load_csv(file)
            elif file.endswith(".json"):
                df = self.load_json(file)
            else:
                continue
            
            if df is not None:
                dataframes.append(df)
        
        return dataframes

    def extract_by_directory(self, directory_name):
        """
        Extrait les données d'un répertoire spécifique.
        """
        specific_dir_path = os.path.join(self.base_path, directory_name)
        dataframes = []
        
        if os.path.exists(specific_dir_path):
            for root, _, files in os.walk(specific_dir_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    if file.endswith(".csv"):
                        df = self.load_csv(file_path)
                    elif file.endswith(".json"):
                        df = self.load_json(file_path)
                    else:
                        continue
                    
                    if df is not None:
                        dataframes.append(df)
        
        return dataframes

    def get(self, file_type, file_name, key):
        """
        Récupère les données basées sur le type de fichier (csv ou json), le nom de fichier, et la clé.
        Pour un CSV, la clé correspond à une colonne. Pour un JSON, la clé correspond à un champ.
        """
        file_path = os.path.join(self.base_path, file_name)
        
        if not os.path.exists(file_path):
            print(f"Le fichier {file_name} n'existe pas.")
            return None

        if file_type == "csv":
            df = self.load_csv(file_path)
            if df is not None:
                if key in df.columns:
                    return df[key]
                else:
                    print(f"La colonne {key} n'existe pas dans le fichier {file_name}.")
                    return None

        elif file_type == "json":
            df = self.load_json(file_path)
            if df is not None:
                if key in df.columns:
                    return df[key]
                else:
                    print(f"La clé {key} n'existe pas dans le fichier JSON {file_name}.")
                    return None
        else:
            print(f"Type de fichier {file_type} non supporté.")
            return None
