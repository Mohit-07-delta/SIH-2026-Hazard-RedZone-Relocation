import React from 'react';
import { Layers, Users, Map as MapIcon, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface DashboardProps {
  onGeneratePlan: () => void;
  relocationData: any;
  showHazards: boolean;
  setShowHazards: (val: boolean) => void;
  showHabitations: boolean;
  setShowHabitations: (val: boolean) => void;
  showSafeZones: boolean;
  setShowSafeZones: (val: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  onGeneratePlan,
  relocationData,
  showHazards,
  setShowHazards,
  showHabitations,
  setShowHabitations,
  showSafeZones,
  setShowSafeZones
}) => {
  return (
    <div className="w-80 bg-gray-900 text-white h-full flex flex-col p-4 shadow-xl z-10 overflow-y-auto">
      <div className="flex items-center space-x-3 mb-6 border-b border-gray-700 pb-4">
        <Activity className="w-8 h-8 text-blue-400" />
        <div>
          <h1 className="text-lg font-bold">NDRF Control Room</h1>
          <p className="text-xs text-gray-400">SIH 26191 Prototype - Wayanad</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Map Layers</h2>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={showHazards} onChange={(e) => setShowHazards(e.target.checked)} className="form-checkbox h-4 w-4 text-red-500 rounded bg-gray-800 border-gray-600 focus:ring-red-500" />
            <span className="flex items-center text-sm"><AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> Red Zones (Hazards)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={showHabitations} onChange={(e) => setShowHabitations(e.target.checked)} className="form-checkbox h-4 w-4 text-orange-500 rounded bg-gray-800 border-gray-600 focus:ring-orange-500" />
            <span className="flex items-center text-sm"><Users className="w-4 h-4 mr-2 text-orange-400" /> Habitations</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" checked={showSafeZones} onChange={(e) => setShowSafeZones(e.target.checked)} className="form-checkbox h-4 w-4 text-green-500 rounded bg-gray-800 border-gray-600 focus:ring-green-500" />
            <span className="flex items-center text-sm"><ShieldCheck className="w-4 h-4 mr-2 text-green-500" /> Safe Zones (Camps)</span>
          </label>
        </div>
      </div>

      <div className="mb-6 border-t border-gray-700 pt-4">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Actions</h2>
        <button 
          onClick={onGeneratePlan}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded flex items-center justify-center transition-colors"
        >
          <MapIcon className="w-4 h-4 mr-2" />
          Generate Relocation Plan
        </button>
      </div>

      {relocationData && (
        <div className="border-t border-gray-700 pt-4 flex-grow">
          <h2 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Relocation Plan Created</h2>
          <div className="space-y-3">
            {relocationData.routes.features.map((route: any, idx: number) => (
              <div key={idx} className="bg-gray-800 p-3 rounded border border-gray-700 text-xs">
                <div className="font-semibold text-orange-400 mb-1">{route.properties.hab_name}</div>
                <div className="text-gray-300 flex justify-between">
                  <span>To: {route.properties.safe_zone_name}</span>
                  <span className="text-blue-300">{route.properties.distance_km} km</span>
                </div>
                <div className="text-gray-400 mt-1">Pop. Moved: {route.properties.population_moved}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
