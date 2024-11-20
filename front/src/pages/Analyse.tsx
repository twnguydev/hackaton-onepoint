import { Station } from "@/interfaces/Station";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { Circle, MapContainer, Popup, TileLayer, useMap, } from "react-leaflet";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
 
interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
}
 
const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, id }) => {
  useEffect(() => {
    axios.get('http://localhost:5001')
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des données :', error);
      });
  }, []);
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        id={id}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );
};
 
const stationData: Station[] = [
  {
    id_station: "FR03053",
    nom_station: "Marseille L2 Kaddouz",
    departement_id: "13",
    adresse: "SEM rue Charles Kaddouz",
    latitude: 43.308489,
    longitude: 5.425306,
    variables: {
      "02": "NO",
      "03": "NO2",
      "12": "NOx",
      "24": "PM10",
      "G6": "BC",
      "GA": "BCwb",
      "GB": "BCff",
    },
  },
  {
    id_station: "FR03058",
    nom_station: "Port de Fos-sur-Mer",
    departement_id: "13",
    adresse: "Fos-sur-Mer, Bouches-du-Rhône",
    latitude: 43.4442,
    longitude: 4.8892,
    variables: {
      "02": "NO",
      "03": "NO2",
      "12": "NOx",
      "24": "PM10",
      "G6": "BC",
      "GA": "BCwb",
      "GB": "BCff",
    },
  },
];
 
 
const pollutantColors: { [key: string]: string } = {
  NO: "#3b82f6",
  NO2: "#22c55e",
  NOx: "#f97316",
  PM10: "#ef4444",
  BC: "#a855f7",
  BCwb: "#4b5563",
  BCff: "#fbbf24",
};
 
 
const PollutantVisualization = ({
  stations,
  selectedPollutant,
  isHeatmap,
}: {
  stations: Station[];
  selectedPollutant: string;
  isHeatmap: boolean;
}) => {
  return (
    <>
      {stations.map((station) =>
        Object.entries(station.variables)
          .filter(([_, pollutant]) => selectedPollutant === "ALL" || pollutant === selectedPollutant)
          .map(([key, pollutant]) => {
            const baseRadius = isHeatmap ? 2000 : 1000;
            const layers = isHeatmap ? [1.0, 0.7, 0.5, 0.3] : [0.6];
 
            return layers.map((opacity, index) => (
              <Circle
                key={`${station.id_station}-${key}-${index}`}
                center={[station.latitude, station.longitude]}
                radius={baseRadius * (index + 1)}
                pathOptions={{
                  color: pollutantColors[pollutant],
                  fillColor: pollutantColors[pollutant],
                  fillOpacity: opacity,
                  weight: isHeatmap ? 0 : 1,
                }}
              >
                <Popup>
                  <div>
                    <h3 className="text-lg font-semibold">{station.nom_station}</h3>
                    <p>Polluant: {pollutant}</p>
                    <p>Adresse: {station.adresse}</p>
                  </div>
                </Popup>
              </Circle>
            ));
          })
      )}
    </>
  );
};
 
const CenterMap = ({ stations }: { stations: Station[] }) => {
  const map = useMap();
  const bounds = L.latLngBounds(stations.map((station) => [station.latitude, station.longitude]));
  map.fitBounds(bounds);
  return null;
};
 
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={` shadow-md rounded-lg overflow-hidden ${className}`}>{children}</div>;
 
const CardHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
);
 
const CardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xl font-semibold text-white">{children}</h2>
);
 
const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="p-6">{children}</div>
);
 
const Select: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}> = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-gray-700 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {options.map((option) => (
      <option className="text-white border border-gray-300 bg-p-2 rounded-md shadow-sm" key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
 
export default function Analyse() {
  const [position] = useState<[number, number]>([43.3753, 5.1577]);
  const [selectedPollutant, setSelectedPollutant] = useState<string>("ALL");
  const [isHeatmap, setIsHeatmap] = useState(false);
 
  const uniquePollutants = Array.from(
    new Set(stationData.flatMap((station) => Object.values(station.variables)))
  );
 
 
  const filteredStationData =
    selectedPollutant === "ALL"
      ? stationData
      : stationData.filter((station) =>
        Object.values(station.variables).includes(selectedPollutant)
      );
 
 
  const chartData = filteredStationData.map((station) => {
    const pollutantCount = Object.values(station.variables).reduce(
      (acc: { [key: string]: number }, pollutant) => {
        acc[pollutant] = (acc[pollutant] || 0) + 1;
        return acc;
      },
      {}
    );
    return { station: station.nom_station, ...pollutantCount };
  });
 
 
  const filteredChartData = chartData.map((data: any) => ({
    station: data.station,
    [selectedPollutant]: data[selectedPollutant] || 0,
  }));
 
 return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
        Analyse de la Pollution
      </h1>
     
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-2 bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <CardTitle  className="text-2xl text-white font-bold text-blue-400">Carte de la Pollution</CardTitle>
              <div className="flex items-center space-x-3 bg-gray-700 p-2 rounded-lg">
                <span className="text-sm text-gray-400">Vue normale</span>
                <Switch
                  checked={isHeatmap}
                  onCheckedChange={setIsHeatmap}
                 
                  className="data-[state=checked]:bg-blue-500"
                />
                <span className="text-sm text-gray-400">Vue thermique</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Select
                value={selectedPollutant}
                onChange={setSelectedPollutant}
                options={[
                  { value: "ALL", label: "Tous les polluants" },
                  ...uniquePollutants.map((pollutant) => ({
                    value: pollutant,
                    label: pollutant,
                  })),
                ]}
                className="bg-gray-700 border-gray-600 text-white focus:border-blue-500"
              />
            </div>
            <div className="h-[60vh] w-full rounded-xl overflow-hidden border border-gray-700">
              <MapContainer
                center={position}
                zoom={10}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <PollutantVisualization
                  stations={filteredStationData}
                  selectedPollutant={selectedPollutant}
                  isHeatmap={isHeatmap}
                />
                <CenterMap stations={filteredStationData} />
              </MapContainer>
            </div>
          </CardContent>
        </Card>
 
        <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-400">Graphique des Polluants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[60vh]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={selectedPollutant === "ALL" ? chartData : filteredChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="station" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem',
                      color: '#F9FAFB'
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      color: '#9CA3AF'
                    }}
                  />
                  {selectedPollutant === "ALL"
                    ? Object.keys(chartData[0] || {})
                        .slice(1)
                        .map((pollutant) => (
                          <Bar
                            key={pollutant}
                            dataKey={pollutant}
                            fill={pollutantColors[pollutant] || "#60A5FA"}
                          />
                        ))
                    : (
                      <Bar
                        dataKey={selectedPollutant}
                        fill={pollutantColors[selectedPollutant] || "#60A5FA"}
                      />
                    )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}