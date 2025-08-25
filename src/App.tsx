import React from 'react';
import { FishTankDemo } from './components/FishTankDemo';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-4xl font-bold text-center mb-8">
          🧠 Prisoner's Dilemma Simulation
        </h1>
        <p className="text-center text-lg mb-8">
          Testing basic React functionality...
        </p>
        
        <FishTankDemo />
      </div>
    </div>
  );
}

export default App;
