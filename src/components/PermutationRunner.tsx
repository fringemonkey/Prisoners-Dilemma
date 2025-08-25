import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export const PermutationRunner: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Permutation Runner</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            Advanced parameter testing and batch simulation runner coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
