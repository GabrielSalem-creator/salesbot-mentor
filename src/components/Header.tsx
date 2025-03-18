
import React from 'react';
import { useSales } from '../context/SalesContext';
import { ChevronLeft, Coins } from 'lucide-react';

const Header: React.FC = () => {
  const { stage, setStage, balance } = useSales();
  
  const handleBack = () => {
    // Logic to go back to previous stage
    if (stage === 'training') {
      setStage('welcome');
    } else if (stage === 'product-selection') {
      setStage('training');
    } else if (stage === 'customer-interaction') {
      setStage('product-selection');
    } else if (stage === 'results') {
      setStage('customer-interaction');
    }
  };
  
  const formattedBalance = balance.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  const getTitle = () => {
    switch (stage) {
      case 'welcome':
        return 'SalesMentor';
      case 'training':
        return 'Training Your Sales AI';
      case 'product-selection':
        return 'Select a Product';
      case 'customer-interaction':
        return 'Customer Interaction';
      case 'results':
        return 'Results';
      default:
        return 'SalesMentor';
    }
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          {stage !== 'welcome' && (
            <button 
              onClick={handleBack}
              className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <h1 className="text-xl font-medium">{getTitle()}</h1>
        </div>
        
        <div className="flex items-center bg-secondary rounded-full py-1 px-3 shadow-sm">
          <Coins size={16} className="text-amber-500 mr-1" />
          <span className="font-medium">{formattedBalance}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
