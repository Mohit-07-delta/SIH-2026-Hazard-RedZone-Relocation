import React, { useState } from 'react';
import Dashboard from './components/Sidebar/Dashboard';
import GISMap from './components/Map/GISMap';
import { fetchRelocationPlan } from './services/api';

function App() {
  const [showHazards, setShowHazards] = useState(true);
  const [showHabitations, setShowHabitations] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [relocationData, setRelocationData] = useState<any>(null);

  const handleGeneratePlan = async () => {
    try {
      const data = await fetchRelocationPlan();
      setRelocationData(data);
      // We could also re-fetch safe zones to show updated capacity, 
      // but for this prototype, seeing the lines and route info is sufficient.
    } catch (error) {
      console.error("Failed to generate plan", error);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Dashboard 
        onGeneratePlan={handleGeneratePlan}
        relocationData={relocationData}
        showHazards={showHazards}
        setShowHazards={setShowHazards}
        showHabitations={showHabitations}
        setShowHabitations={setShowHabitations}
        showSafeZones={showSafeZones}
        setShowSafeZones={setShowSafeZones}
      />
      <div className="flex-1 relative">
        <GISMap 
          showHazards={showHazards}
          showHabitations={showHabitations}
          showSafeZones={showSafeZones}
          relocationData={relocationData}
        />
      </div>
    </div>
  );
}

export default App;
