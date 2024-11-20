export interface Station {
    id_station: string;
    nom_station: string;
    departement_id: string;
    adresse: string;
    latitude: number;
    longitude: number;
    // date_debut_mesure: string;
    // date_fin_mesure: string;
    variables: {
        [key: string]: string;
    };
}