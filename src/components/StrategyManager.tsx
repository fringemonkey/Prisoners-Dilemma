import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

export const StrategyManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Strategy Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            Strategy creation, management, and community features coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
