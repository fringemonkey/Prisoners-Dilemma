import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface DataExporterProps {
  runs: any[];
  permutations: any[];
}

export const DataExporter: React.FC<DataExporterProps> = ({ runs, permutations }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Export & Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            Data export, import, and advanced analytics coming soon...
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Available runs: {runs.length}</p>
            <p>Available permutations: {permutations.length}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
