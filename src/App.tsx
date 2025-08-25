import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { MainLayout } from './components/Layout/MainLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">
            🧠 Prisoner's Dilemma Simulation
          </h1>
          <p className="text-lg mb-8">
            Welcome back! The app is working again.
          </p>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ App successfully loaded!
          </div>
        </div>
      </MainLayout>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#000000',
            border: '1px solid #e5e7eb',
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
