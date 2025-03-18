
import React from 'react';
import { SalesProvider, useSales } from '../context/SalesContext';
import Header from '../components/Header';
import TrainingInterface from '../components/TrainingInterface';
import ProductSelection from '../components/ProductSelection';
import CustomerInteraction from '../components/CustomerInteraction';
import ResultsDisplay from '../components/ResultsDisplay';
import { ArrowRight } from 'lucide-react';

const WelcomeScreen = () => {
  const { setStage } = useSales();
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <div className="glass-card p-8 rounded-2xl max-w-xl w-full mb-8 animate-scale-in">
        <h1 className="text-4xl font-bold mb-4">SalesMentor</h1>
        <p className="text-xl text-gray-600 mb-6">
          Train your AI to become a master salesperson
        </p>
        <p className="text-gray-600 mb-6">
          Teach your AI sales strategies, select products to sell, and test its 
          skills against virtual customers with different personalities.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-4 rounded-xl">
            <div className="text-lg font-medium mb-1">Step 1</div>
            <p className="text-sm">Train your AI with sales techniques</p>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <div className="text-lg font-medium mb-1">Step 2</div>
            <p className="text-sm">Select products for your AI to sell</p>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <div className="text-lg font-medium mb-1">Step 3</div>
            <p className="text-sm">Test your AI's skills with customers</p>
          </div>
        </div>
        
        <button
          onClick={() => setStage('training')}
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all"
        >
          Get Started
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { stage } = useSales();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {stage === 'welcome' && <WelcomeScreen />}
        {stage === 'training' && <TrainingInterface />}
        {stage === 'product-selection' && <ProductSelection />}
        {stage === 'customer-interaction' && <CustomerInteraction />}
        {stage === 'results' && <ResultsDisplay />}
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <SalesProvider>
      <AppContent />
    </SalesProvider>
  );
};

export default Index;
