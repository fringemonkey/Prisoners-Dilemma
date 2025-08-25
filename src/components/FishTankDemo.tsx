import React from 'react';
import { FishTank } from './FishTank';

// Sample strategy data for demo
const sampleStrategies = [
  {
    id: 'titForTat',
    name: 'Tit for Tat',
    color: '#3B82F6', // Blue
    population: 500,
    cooperation: 0.8
  },
  {
    id: 'alwaysCooperate',
    name: 'Always Cooperate',
    color: '#10B981', // Green
    population: 300,
    cooperation: 1.0
  },
  {
    id: 'alwaysDefect',
    name: 'Always Defect',
    color: '#EF4444', // Red
    population: 200,
    cooperation: 0.0
  },
  {
    id: 'pavlov',
    name: 'Pavlov',
    color: '#8B5CF6', // Purple
    population: 400,
    cooperation: 0.7
  },
  {
    id: 'random',
    name: 'Random',
    color: '#F59E0B', // Yellow
    population: 150,
    cooperation: 0.5
  }
];

export const FishTankDemo: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🐟 Strategy Fish Tank
          </h1>
          <p className="text-lg text-gray-600">
            Watch your Prisoner's Dilemma strategies come to life as swimming fish!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fish Tank */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Live Ecosystem</h2>
              <FishTank 
                strategies={sampleStrategies}
                width={800}
                height={500}
              />
            </div>
          </div>

          {/* Strategy Legend */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Strategy Legend</h2>
            <div className="space-y-4">
              {sampleStrategies.map(strategy => (
                <div key={strategy.id} className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: strategy.color }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {strategy.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Population: {strategy.population}
                    </div>
                    <div className="text-sm text-gray-500">
                      Cooperation: {(strategy.cooperation * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">How to Read:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Fish size = Population size</li>
                <li>• Fish color = Strategy type</li>
                <li>• White lines = Cooperation bonds</li>
                <li>• Movement = Strategy behavior</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Future Features Preview */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">🚀 Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900">Evolution</h3>
              <p className="text-sm text-gray-600">Watch fish adapt and change over generations</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900">Territories</h3>
              <p className="text-sm text-gray-600">Strategies claim and defend areas</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900">Predation</h3>
              <p className="text-sm text-gray-600">High-performing strategies "eat" weaker ones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
