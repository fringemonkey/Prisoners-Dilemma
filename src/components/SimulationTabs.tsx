import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Slider } from './ui/Slider';
import { useSimulationStore } from '../stores/simulationStore';
import { allStrategies } from '../utils/strategies';

export const SimulationTabs: React.FC = () => {
  const { 
    config, 
    updateConfig, 
    selectedStrategies, 
    setSelectedStrategies,
    runSimulation,
    isRunning,
    currentRun
  } = useSimulationStore();

  const handleStrategyToggle = (strategyId: string) => {
    const current = config.selectedStrategies;
    const updated = current.includes(strategyId)
      ? current.filter(id => id !== strategyId)
      : [...current, strategyId];
    setSelectedStrategies(updated);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Simulation Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Strategy Selection */}
          <div>
            <h3 className="text-lg font-medium mb-3">Strategies</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {allStrategies.map((strategy) => (
                <label
                  key={strategy.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={config.selectedStrategies.includes(strategy.id)}
                    onChange={() => handleStrategyToggle(strategy.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{strategy.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Population Size: {config.populationSize}
              </label>
              <Slider
                value={[config.populationSize]}
                onValueChange={([value]) => updateConfig({ populationSize: value })}
                min={100}
                max={10000}
                step={100}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Generations: {config.generations}
              </label>
              <Slider
                value={[config.generations]}
                onValueChange={([value]) => updateConfig({ generations: value })}
                min={10}
                max={1000}
                step={10}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Noise: {config.noise.toFixed(3)}
              </label>
              <Slider
                value={[config.noise]}
                onValueChange={([value]) => updateConfig({ noise: value })}
                min={0}
                max={0.1}
                step={0.001}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Evolution Rate: {config.evolutionRate.toFixed(3)}
              </label>
              <Slider
                value={[config.evolutionRate]}
                onValueChange={([value]) => updateConfig({ evolutionRate: value })}
                min={0.01}
                max={0.5}
                step={0.01}
                className="w-full"
              />
            </div>
          </div>

          {/* Run Button */}
          <div className="flex justify-end">
            <Button
              onClick={() => runSimulation()}
              disabled={isRunning || selectedStrategies.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {isRunning ? 'Running...' : 'Run Simulation'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {currentRun && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Leaderboard</h4>
                <div className="space-y-2">
                  {currentRun.leaderboard.map((entry, index) => (
                    <div key={entry.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="font-medium">
                        {index + 1}. {entry.name}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {entry.count} individuals
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Simulation Info</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <span className="ml-2">{currentRun.duration}ms</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Timestamp:</span>
                    <span className="ml-2">{currentRun.timestamp.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
