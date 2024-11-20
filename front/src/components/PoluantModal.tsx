import { pollutantInfo } from '@/const/PollutantInfo';
import { Poluant } from '@/interfaces/Poluant';
import { HelpCircle, X } from 'lucide-react';
import React, { useState } from 'react';

interface PoluantModalProps {
    poluants: Poluant[];
    selectedPoluants: string[];
    onPoluantToggle: (poluantId: string) => void;
    onClose: () => void;
}

const PoluantModal: React.FC<PoluantModalProps> = ({ poluants, selectedPoluants, onPoluantToggle, onClose }) => {
    const [selectedInfoPoluant, setSelectedInfoPoluant] = useState<string | null>(null);
    // const [backData, setBackData] = useState<any>(null);

    const handleInfoClick = (poluant: Poluant) => {
        setSelectedInfoPoluant(poluant.label);
    };

  

    const handleSelectAll = () => {
        if (selectedPoluants.length === poluants.length) {
            // Désélectionner tout
            onPoluantToggle('none');
        } else {
            // Sélectionner tout
            onPoluantToggle('all');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto relative">
                <h2 className="text-2xl font-bold mb-4 text-center">Sélectionner les polluants</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {poluants.map((poluant) => (
                        <div key={poluant.id} className="border-2 border-blue-500 rounded-lg p-4 flex items-center relative">
                            <input
                                type="checkbox"
                                id={`poluant-${poluant.id}`}
                                checked={selectedPoluants.includes(poluant.id)}
                                onChange={() => onPoluantToggle(poluant.id)}
                                className="mr-3 h-5 w-5 rounded border-blue-500 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor={`poluant-${poluant.id}`} className="text-black flex-grow">
                                <span className="font-semibold">{poluant.label}</span>
                            </label>
                            <div 
                                className="ml-2 relative"
                            >
                                <HelpCircle 
                                    size={16} 
                                    className="text-blue-500 cursor-pointer" 
                                    onClick={() => handleInfoClick(poluant)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        onClick={handleSelectAll}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        {selectedPoluants.length === poluants.length ? 'Désélectionner tout' : 'Sélectionner tout'}
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition-colors"
                    >
                        Fermer
                    </button>
                </div>

                {selectedInfoPoluant && pollutantInfo[selectedInfoPoluant] && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-semibold text-gray-800">{selectedInfoPoluant}</h2>
                                    <button onClick={() => setSelectedInfoPoluant(null)} className="text-gray-500 hover:text-gray-700">
                                        <X size={24} />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mt-2">Origine :</h3>
                                        <p className="text-gray-600">{pollutantInfo[selectedInfoPoluant].origin}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mt-2">Effets sur la santé :</h3>
                                        <p className="text-gray-600">{pollutantInfo[selectedInfoPoluant].healthEffects}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mt-2">Effets environnementaux :</h3>
                                        <p className="text-gray-600">{pollutantInfo[selectedInfoPoluant].environmentalEffects}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-100 px-6 py-4 rounded-b-lg">
                                <button
                                    onClick={() => setSelectedInfoPoluant(null)}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PoluantModal;