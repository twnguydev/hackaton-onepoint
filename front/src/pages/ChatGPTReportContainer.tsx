import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ChatGPTReportContainer = ({ pollutantData, selectedPollutant, startDate, endDate }) => {
    const API_KEY = '';
    const [report, setReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const reportRef = useRef(null);

    const handleDownloadPDF = async () => {
        const input = reportRef.current;
        const pdf = new jsPDF('p', 'pt', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margins = 40;

        const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
            logging: false,
            scrollY: -window.scrollY
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdfWidth - 2 * margins;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', margins, position + margins, imgWidth, imgHeight);
        heightLeft -= (pdfHeight - 2 * margins);

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margins, position + margins, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - 2 * margins);
        }

        pdf.save('rapport-environnemental.pdf');
    };

    const getOpenAIResponse = async (messages) => {
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 4095,
                temperature: 1,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error calling OpenAI API:", error.response ? error.response.data : error.message);
            throw error;
        }
    };

    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const dataForPrompt = pollutantData.map(item => `${item.date}: ${item[selectedPollutant]}`).join(', ');
            
            const messages = [
                { role: "system", content: "Vous êtes un expert en analyse de données environnementales spécialisé dans la qualité de l'air, travaillant pour le Port Maritime Marseille-Fos. Votre tâche est de produire des rapports analytiques détaillés, techniques et professionnels en HTML." },
                { role: "user", content: `Préparez un rapport en HTML analytique détaillé et technique sur l'évolution du polluant ${selectedPollutant} entre ${startDate} et ${endDate} pour le Port Maritime Marseille-Fos. Voici les données : ${dataForPrompt}.
            
            Voici les normes européennes pour les polluants atmosphériques :
            
            | Polluant      | Norme Européenne                   |
            |---------------|------------------------------------|
            | SO2           | 125 µg/m³ (max 3 fois/an)          |
            | NO2           | 200 µg/m³ (max 18 fois/an)         |
            | PM10          | 50 µg/m³ (max 35 fois/an)          |
            | PM2.5         | 25 µg/m³ (valeur cible annuelle)   |
            | O3            | 180 µg/m³ (max 25 jours/an)        |
            | NO            | Pas de norme spécifique            |
            | NOx           | Pas de norme journalière spécifique|
            | PM1           | Pas de norme spécifique            |
            | CO            | 10 mg/m³ (valeur limite sur 8h)    |
            
            Veuillez structurer votre rapport comme suit :
            
            1. Résumé exécutif
                - Synthèse des principales conclusions et recommandations
            
            2. Introduction
                - Contexte de l'étude : situation géographique, importance du port, enjeux environnementaux
                - Objectifs de l'analyse : préciser les buts spécifiques de l'étude du polluant ${selectedPollutant}
            
            3. Méthodologie
                - Description détaillée des méthodes de collecte et d'analyse des données
                - Précisions sur les instruments de mesure utilisés et leur précision
                - Explication des méthodes statistiques employées pour l'analyse des tendances
            
            4. Analyse des données
                - Tendances générales : évolution des concentrations sur la période étudiée
                - Inclure des calculs statistiques (moyennes, médianes, écarts-types)
                - Analyser les variations saisonnières et journalières si pertinent
                - Identification et analyse des pics de pollution
                - Détailler les épisodes de pollution majeurs (dates, durées, intensités)
                - Analyser les conditions météorologiques associées aux pics
                - Comparaison avec les normes en vigueur
                - Confronter les données aux normes européennes fournies
                - Calculer le nombre de dépassements des seuils réglementaires
            
            5. Implications
                - Impact potentiel sur l'environnement
                - Effets sur la qualité de l'air, l'eau, les sols, la végétation
                - Risques pour la santé publique
                - Détailler les effets potentiels sur la santé des populations exposées
                - Conséquences pour les activités portuaires
                - Analyser l'impact sur les opérations du port, la sécurité, la réglementation
            
            6. Recommandations
                - Mesures de mitigation à court terme
                - Proposer des actions immédiates pour réduire les émissions
                - Stratégies de prévention à long terme
                - Suggérer des investissements et des changements de pratiques à long terme
                - Amélioration du système de surveillance
                - Recommandations pour optimiser la collecte et l'analyse des données
            
            7. Conclusion
                - Récapitulatif des points clés
                - Perspectives futures et importance continue de la surveillance
            
            Assurez-vous d'inclure des observations spécifiques, des interprétations basées sur les données fournies, et des recommandations concrètes et applicables. Le rapport doit être rédigé dans un langage professionnel et technique, approprié pour une présentation à la direction du port et aux autorités environnementales. 
            
            Utilisez des balises HTML appropriées pour la structure et le style, mais n'incluez pas de balises <html>, <head> ou <body>. Intégrez des éléments visuels tels que des listes à puces, des tableaux pour les données chiffrées, et des paragraphes bien structurés pour améliorer la lisibilité. Si possible, suggérez des endroits où des graphiques ou des visualisations pourraient être pertinents, même si vous ne pouvez pas les générer directement.` }
            ];

            const response = await getOpenAIResponse(messages);
            
            if (response.choices && response.choices.length > 0) {
                setReport(response.choices[0].message.content);
            } else {
                throw new Error("Pas de réponse générée");
            }
        } catch (error) {
            console.error("Erreur lors de la génération du rapport:", error);
            setReport("<p>Une erreur est survenue lors de la génération du rapport. Veuillez réessayer plus tard.</p>");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rapport d'analyse environnementale</h2>
            <button 
                onClick={handleDownloadPDF}
                className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
                disabled={!report}
            >
                <Download className="mr-2" size={18} />
                Télécharger PDF
            </button>
            <div className="mb-4">
                <button 
                    onClick={fetchReport}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    disabled={isLoading}
                >
                    {isLoading ? 'Génération en cours...' : 'Générer le rapport'}
                </button>
            </div>
            <div 
                ref={reportRef} 
                id="report-content" 
                className="bg-gray-100 p-6 rounded-lg text-black flex flex-col space-y-5"
                dangerouslySetInnerHTML={{ __html: isLoading 
                    ? "<p class='text-gray-500 italic'>Génération du rapport en cours...</p>" 
                    : report 
                    ? report 
                    : "<p class='text-gray-500 italic'>Cliquez sur le bouton pour générer un rapport.</p>" 
                }}
            />
        </div>
    );
};

export default ChatGPTReportContainer;