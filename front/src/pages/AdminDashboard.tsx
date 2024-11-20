import React, { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PoluantModal from '@/components/PoluantModal';
import ChatGPTReportContainer from './ChatGPTReportContainer';
import { Poluant } from '../interfaces/Poluant';
import { ApiFetch } from '@/api/ApiFetch';
import d from '../dataset/donnees_polluants_jours.json';
// import { MeteoComponent } from '../components/MeteoComponent';
import tempMar from '../dataset/results_average_temp_2020_2022_marseille.json';
// import tempFos from '../dataset/results_average_temp_2020_2022_fos.json';
import humMar from '../dataset/results_humidity_2020_2022_marseille.json';
// import humFos from '../dataset/results_humidity_2020_2022_fos.json';
import ventMar from '../dataset/results_vent_2020_2022_marseille_kmh.json';
// import ventFos from '../dataset/results_vent_2020_2022_fos_kmh.json';
import rainMar from '../dataset/results_rain_2020_2022_marseille.json';
// import rainFos from '../dataset/results_rain_2020_2022_fos.json';
 
interface Stat {
    title: string;
    value: string;
    unit: string;
    trend: 'up' | 'down' | 'neutral';
    status: 'danger' | 'warning' | 'success';
}
 
 
 
 
 
const pollutants: string[] = ["NOx", "SO2", "NO2", "NO", "PM10", "PM2.5", "PM1"];
 
 
 
const statusColors: { [key: string]: string } = {
    danger: "text-red-600",
    warning: "text-yellow-600",
    success: "text-green-600",
};
 
const trendIcons: { [key: string]: JSX.Element } = {
    up: <ArrowUpIcon className="w-4 h-4" />,
    down: <ArrowDownIcon className="w-4 h-4" />,
    neutral: <MinusIcon className="w-4 h-4" />,
};
 
export default function AdminDashboard() {
    const [selectedPollutant, setSelectedPollutant] = useState<string>(pollutants[0]);
    const [startDate, setStartDate] = useState<string>('2021-06-14');
    const [endDate, setEndDate] = useState<string>('2021-06-17');
    const [poluants, setPoluants] = useState<Poluant[]>([]);
    const [selectedPoluants, setSelectedPoluants] = useState<string[]>([]);
    const [stationPolluants, setStationPolluants] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [stat, setStat] = useState<Stat[]>([]);
    const dataPolluants: any = d;
    const [pollutantData, setpollutantData] = useState<any>([]);
    const [meteo, setMeteo] = useState<any>([0, 0, 0, 0])
 
 
    useEffect(() => {
        const fetchPoluants = async () => {
            try {
                const response = await axios.get('https://api.atmosud.org/observations/stations/polluants');
                const fetchedPoluants: Poluant[] = response.data.polluants.map((p: any) => ({
                    ...p,
                    date: new Date().toISOString()
                }));
 
                setPoluants(fetchedPoluants);
            } catch (error) {
                console.error('Error fetching poluants:', error);
            }
        };
 
        fetchPoluants();
    }, []);
 
    useEffect(() => {
        if (dataPolluants && selectedPollutant) {
            let totalPollutantValue: number = 0;
            let resultsArray: any = [];
 
            const start = new Date(startDate);
            const end = new Date(endDate);
 
            let temperatureMar = tempMar.donnees.filter((val) => val.date == startDate)
            let pluitMar = rainMar.donnees.filter((val) => val.date == startDate)
            let windMar = ventMar.donnees.filter((val) => val.date == startDate)
            let humiditeMar = humMar.donnees.filter((val) => val.date == startDate)
 
            setMeteo([temperatureMar[0].valeur, pluitMar[0].valeur, windMar[0].valeur, humiditeMar[0].valeur])
 
            Object.keys(dataPolluants).forEach(dateKey => {
                const currentDate = new Date(dateKey);
 
 
                if (currentDate >= start && currentDate <= end) {
                    const dataForDate = dataPolluants[dateKey];
                    const pollutantValue = dataForDate[selectedPollutant];
 
 
                    if (pollutantValue !== undefined) {
                        totalPollutantValue += Number(pollutantValue);
 
                        resultsArray.push({
                            date: dateKey,
                            [selectedPollutant]: pollutantValue.toFixed(2),
 
                        });
                    }
                }
            });
 
            let converted: any = totalPollutantValue.toFixed(2)
            setStat(getStats(selectedPollutant, converted, 0));
            setpollutantData(resultsArray)
 
        }
    }, [startDate, endDate, dataPolluants, selectedPollutant]);
 
 
 
    const europeanStandards: { [key: string]: { limit: number, frequency?: string } } = {
        SO2: { limit: 125, frequency: "max 3 fois/an" },
        NO2: { limit: 200, frequency: "max 18 fois/an" },
        PM10: { limit: 50, frequency: "max 35 fois/an" },
        'PM2.5': { limit: 25, frequency: "valeur cible annuelle" },
        O3: { limit: 180, frequency: "max 25 jours/an" },
        NO: { limit: 0 },
        NOx: { limit: 0 },
        PM1: { limit: 0 },
        CO: { limit: 10, frequency: "valeur limite sur 8h" },
    };
 
    const waterQualityStandards = {
        pH: { limit: [6.5, 8.5], status: "normal" },
        NO3: { limit: 50, status: "normal" },
        PO4: { limit: 0.1, status: "normal" },
        'E.coli': { limit: 0, status: "danger" },
    };
 
 
    const pollutionConsequences: { [key: string]: { impact: string, trend: any, status: any, airQuality: number, wasteProduced: number, marineBiodiversity: number, waterQuality: number } } = {
        PM10: {
            impact: "Augmentation des maladies respiratoires",
            trend: "up",
            status: "danger",
            airQuality: 65,
            wasteProduced: 450,
            marineBiodiversity: 230,
            waterQuality: 7.5
        },
        'PM2.5': {
            impact: "Peut nuire à la santé cardiaque et respiratoire",
            trend: "up",
            status: "danger",
            airQuality: 70,
            wasteProduced: 500,
            marineBiodiversity: 220,
            waterQuality: 6.8
        },
        PM1: {
            impact: "Peut pénétrer profondément dans les poumons",
            trend: "up",
            status: "danger",
            airQuality: 75,
            wasteProduced: 480,
            marineBiodiversity: 215,
            waterQuality: 6.5
        },
        NOx: {
            impact: "Contribue au smog et à l'acidification des eaux",
            trend: "up",
            status: "warning",
            airQuality: 80,
            wasteProduced: 460,
            marineBiodiversity: 225,
            waterQuality: 7.2
        },
        NO2: {
            impact: "Aggrave les maladies respiratoires",
            trend: "up",
            status: "danger",
            airQuality: 78,
            wasteProduced: 470,
            marineBiodiversity: 220,
            waterQuality: 6.9
        },
        NO: {
            impact: "Contribue à la formation d'ozone troposphérique",
            trend: "up",
            status: "warning",
            airQuality: 82,
            wasteProduced: 490,
            marineBiodiversity: 210,
            waterQuality: 7.0
        },
        SO2: {
            impact: "Peut causer des pluies acides",
            trend: "up",
            status: "danger",
            airQuality: 85,
            wasteProduced: 500,
            marineBiodiversity: 200,
            waterQuality: 6.6
        },
        O3: {
            impact: "Peut provoquer des problèmes respiratoires",
            trend: "up",
            status: "danger",
            airQuality: 90,
            wasteProduced: 510,
            marineBiodiversity: 195,
            waterQuality: 7.1
        },
        CO: {
            impact: "Peut provoquer des maux de tête et de la fatigue",
            trend: "up",
            status: "warning",
            airQuality: 40,
            wasteProduced: 480,
            marineBiodiversity: 205,
            waterQuality: 7.4
        }
    };
 
 
 
    const getStats = (pollutant: string, total: number, concentration: any): Stat[] => {
        const pollutionInfo = pollutionConsequences[pollutant] || {
            impact: "Impact inconnu",
            trend: "neutral",
            status: "neutral",
            airQuality: 0,
            wasteProduced: 0,
            marineBiodiversity: 0,
            waterQuality: 0
        };
 
        const standard = europeanStandards[pollutant];
 
        const normStatus = standard && standard.limit !== null
            ? (concentration > standard.limit ? "danger" : "success")
            : "no limit";
 
        const waterQualityStatus =
            (pollutionInfo.waterQuality < waterQualityStandards.pH.limit[0] || pollutionInfo.waterQuality > waterQualityStandards.pH.limit[1])
                ? "danger" : "success";
 
        // console.log(standard, normStatus, concentration);
 
        return [
            { title: `Émissions de ${pollutant}`, value: `${total}`, unit: "tonnes", trend: pollutionInfo.trend, status: pollutionInfo.status },
            { title: "Déchets produits", value: `${pollutionInfo.wasteProduced}`, unit: "tonnes", trend: "up", status: "warning" },
            { title: "Qualité de l'air", value: `${pollutionInfo.airQuality}`, unit: "AQI", trend: pollutionInfo.trend, status: pollutionInfo.status },
            { title: "Bruit", value: "72", unit: "dB", trend: "up", status: "danger" },
            { title: "Qualité de l'eau", value: `${pollutionInfo.waterQuality}`, unit: "pH", trend: waterQualityStatus, status: waterQualityStatus },
            { title: "Biodiversité marine", value: `${pollutionInfo.marineBiodiversity}`, unit: "espèces", trend: "down", status: "danger" },
            { title: "Conséquence de la pollution", value: pollutionInfo.impact, unit: "", trend: "neutral", status: "neutral" },
            { title: `Standard europeen ${pollutant}`, value: `${europeanStandards[pollutant].limit}`, unit: "µg/m³", trend: normStatus, status: normStatus },
        ];
    };
 
 
 
 
 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ApiFetch({
                    endpoint: 'stations',
                    params: {
                        format: 'json',
                        download: 'false',
                        typologie: 'false'
                    }
                });
 
                const stat = data.filter(
                    (station: any) => station.id_station === "FR00008" || station.id_station === "FR00019"
                );
 
                const polluantsList: any = stat.map((station: any) => station.variables);
                const arr: any = []
 
                polluantsList.forEach((value: any, index: any) => {
 
                    if (typeof value === 'object' && value !== null) {
 
                        Object.entries(value).forEach(([key, pol]) => {
 
                            if (!arr.includes(pol)) {
                                arr.push(pol);
                            }
                            setStationPolluants(arr)
                        });
                    } else {
                        console.warn(`value à l'index ${index} n'est pas un objet :`, value);
                    }
 
                });
 
            } catch (error) {
                console.error("Erreur lors de la récupération des stations", error);
            } finally {
 
            }
        };
        fetchData();
    }, []);
 
 
    const handlePoluantToggle = (poluantId: string) => {
        setSelectedPoluants(prev =>
            prev.includes(poluantId)
                ? prev.filter(id => id !== poluantId)
                : [...prev, poluantId]
        );
    };
 
    const handleChange = (e: any) => {
 
        setSelectedPollutant(e.target.value);
 
    };
 
    const handleStartDateChange = (e: any) => {
        setStartDate(e.target.value);
 
    };
 
    const handleEndDateChange = (e: any) => {
        setEndDate(e.target.value);
    };
 
 
    // return (
    //     <div className="min-h-screen bg-white">
    //         <header className="bg-white text-blue-800 p-4 shadow-sm">
    //             <div className="container mx-auto flex items-center">
    //                 <svg className="w-10 h-10 mr-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                     <path d="M3 19V5H21V19H3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    //                     <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    //                     <path d="M9 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    //                 </svg>
    //                 <h1 className="text-2xl font-bold">Port Maritime Fos-Marseille - Tableau de Bord Administrateur</h1>
    //             </div>
    //         </header>
 
 
 
    //         <main className="container mx-auto p-4">
    //             <div className="flex flex-wrap items-center mb-4 bg-gray-100 rounded-lg shadow-sm p-4">
    //                 <div className="w-full sm:w-auto mb-2 sm:mb-0 mr-4">
    //                     <label htmlFor="pollutant" className="block text-sm font-medium text-gray-700 mb-1">Polluant</label>
    //                     <div className="flex items-center bg-white gap-2">
    //                         <select
    //                             id="pollutant"
    //                             value={selectedPollutant}
    //                             onChange={handleChange}
    //                             className="mt-1 block w-full bg-white text-gray-800 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
    //                         >
    //                             {stationPolluants.map((pollutant, index) => (
    //                                 <option key={`${pollutant}-${index}`} value={pollutant}>{pollutant}</option>
    //                             ))}
    //                         </select>
    //                     </div>
    //                 </div>
    //                 <div className="w-full sm:w-auto mb-2 sm:mb-0 mr-4">
    //                     <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
    //                     <input
    //                         type="date"
    //                         id="startDate"
    //                         value={startDate}
    //                         onChange={handleStartDateChange}
    //                         className="mt-1 block w-full bg-white text-gray-800 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
    //                     />
    //                 </div>
    //                 <div className="w-full sm:w-auto mb-2 sm:mb-0 mr-4">
    //                     <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
    //                     <input
    //                         type="date"
    //                         id="endDate"
    //                         value={endDate}
    //                         onChange={handleEndDateChange}
    //                         className="mt-1 block w-full bg-white text-gray-800 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
    //                     />
    //                 </div>
    //                 <button
    //                     onClick={() => setIsModalOpen(true)}
    //                     className="mt-2 sm:mt-0 ml-0 sm:ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
    //                 >
    //                     Sélectionner les polluants
    //                 </button>
    //             </div>
    //             <div className="flex flex-wrap -mx-2">
    //                 {stat.map((stat, index) => (
    //                     <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-2">
    //                         <div className="bg-gray-100 rounded-lg shadow-sm p-4 h-full">
    //                             <h2 className="text-lg font-semibold text-gray-700 mb-2">{stat.title}</h2>
    //                             <div className="flex items-baseline">
    //                                 <span className="text-3xl font-bold text-blue-800">{stat.value}</span>
    //                                 <span className="ml-1 text-gray-500">{stat.unit}</span>
    //                             </div>
    //                             <div className={`flex items-center mt-2 ${statusColors[stat.status]}`}>
    //                                 {trendIcons[stat.trend]}
    //                                 {/* {stat.status}{stat.trend} */}
    //                                 <span className="ml-1 text-sm">
    //                                     {stat.trend === 'up' ? 'Augmentation' : stat.trend === 'down' ? 'Diminution' : 'Stable'}
    //                                 </span>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </div>
    //             <div className="mt-8 bg-gray-100 rounded-lg shadow-sm p-4">
    //                 <h2 className="text-xl font-bold text-gray-700 mb-4">Évolution des polluants</h2>
    //                 <div className="h-80">
    //                     {/* {europeanStandards[selectedPollutant].limit} */}
    //                     <ResponsiveContainer width="100%" height={300}>
    //                         <LineChart
    //                             data={pollutantData}
    //                             margin={{
    //                                 top: 5,
    //                                 right: 30,
    //                                 left: 20,
    //                                 bottom: 5,
    //                             }}
    //                         >
    //                             <CartesianGrid strokeDasharray="3 3" />
    //                             <XAxis dataKey="date" />
    //                             <YAxis domain={['dataMin', 'dataMax']} />
    //                             <Tooltip />
 
 
    //                             <Line
    //                                 type="monotone"
    //                                 dataKey={selectedPollutant}
    //                                 stroke="#ff7300"
    //                                 dot={false}
    //                                 strokeDasharray="5 5"
    //                                 isAnimationActive={false}
    //                                 name={`Norme ${selectedPollutant} (${europeanStandards[selectedPollutant].limit} µg/m³)`}
    //                             />
 
 
    //                             <Line
    //                                 type="monotone"
    //                                 dataKey={selectedPollutant}
    //                                 stroke="#8884d8"
    //                                 activeDot={{ r: 8 }}
    //                             />
    //                         </LineChart>
    //                     </ResponsiveContainer>
    //                 </div>
 
    //             </div>
 
 
    //             {isModalOpen && (
    //                 <PoluantModal
    //                     poluants={poluants}
    //                     selectedPoluants={selectedPoluants}
    //                     onPoluantToggle={handlePoluantToggle}
    //                     onClose={() => setIsModalOpen(false)}
    //                 />
    //             )}
    //         </main>
    //     </div>
    // );
 
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 p-6 border-b border-gray-700">
                <div className="container mx-auto flex items-center">
                    <svg className="w-12 h-12 mr-4 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 19V5H21V19H3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                        Port Maritime Fos-Marseille
                    </h1>
                </div>
            </header>
 
            <main className="container mx-auto p-6">
                <div className="flex flex-wrap items-end mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="w-full sm:w-auto mb-4 sm:mb-0 mr-6">
                        <label htmlFor="pollutant" className="block text-sm font-medium text-gray-400 mb-2">Polluant</label>
                        <select
                            id="pollutant"
                            value={selectedPollutant}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400 transition-all"
                        >
                            {stationPolluants.map((pollutant, index) => (
                                <option key={`${pollutant}-${index}`} value={pollutant}>{pollutant}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full sm:w-auto mb-4 sm:mb-0 mr-6">
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-400 mb-2">Date de début</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={handleStartDateChange}
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400 transition-all"
                        />
                    </div>
                    <div className="w-full sm:w-auto mb-4 sm:mb-0 mr-6">
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-400 mb-2">Date de fin</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={handleEndDateChange}
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400 transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105"
                    >
                        Sélectionner les polluants
                    </button>
                </div>
 
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {stat.map((stat, index) => (
                        <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-400 transition-all duration-200">
                            <h2 className="text-lg font-medium text-gray-400 mb-2">{stat.title}</h2>
                            <div className="flex items-baseline">
                                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                                    {stat.value}
                                </span>
                                <span className="ml-2 text-gray-400">{stat.unit}</span>
                            </div>
                            <div className={`flex items-center mt-4 ${statusColors[stat.status]}`}>
                                {trendIcons[stat.trend]}
                                <span className="ml-2 font-medium">
                                    {stat.trend === 'up' ? 'Augmentation' : stat.trend === 'down' ? 'Diminution' : 'Stable'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
 
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                        Évolution des polluants
                    </h2>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={pollutantData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1F2937',
                                        border: '1px solid #374151',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey={selectedPollutant}
                                    stroke="#60A5FA"
                                    strokeWidth={2}
                                    dot={{ r: 4, fill: '#60A5FA' }}
                                    activeDot={{ r: 8 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey={selectedPollutant}
                                    stroke="#FF6B6B"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {isModalOpen && (
                    <PoluantModal
                        poluants={poluants}
                        selectedPoluants={selectedPoluants}
                        onPoluantToggle={handlePoluantToggle}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
                <ChatGPTReportContainer
                    pollutantData={pollutantData}
                    selectedPollutant={selectedPollutant}
                    startDate={startDate}
                    endDate={endDate}
                />
            </main>
        </div>
    );
}