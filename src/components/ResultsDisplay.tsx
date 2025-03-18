
import React from 'react';
import { useSales } from '../context/SalesContext';
import { Check, X, ShoppingBag, ArrowRight } from 'lucide-react';

const ResultsDisplay: React.FC = () => {
  const { salesAttempts, setStage, setCurrentCustomer } = useSales();
  
  // Get the most recent attempt
  const lastAttempt = salesAttempts.length > 0 
    ? salesAttempts[salesAttempts.length - 1] 
    : null;
  
  const handleNextCustomer = () => {
    setCurrentCustomer(null); // Reset customer to get a new random one
    setStage('customer-interaction');
  };
  
  if (!lastAttempt) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p>No sales attempts recorded yet.</p>
      </div>
    );
  }
  
  const { successful, product, customerPersonality } = lastAttempt;
  
  return (
    <div className="flex flex-col h-full pt-16 pb-4">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="glass-card p-8 rounded-2xl mb-8 text-center animate-blur-in">
          <div className="mb-6">
            {successful ? (
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="text-green-500" size={32} />
              </div>
            ) : (
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <X className="text-red-500" size={32} />
              </div>
            )}
            
            <h2 className="text-2xl font-bold mb-2">
              {successful ? 'Sale Successful!' : 'Sale Unsuccessful'}
            </h2>
            
            <p className="text-gray-600">
              {successful 
                ? 'Congratulations! Your sales AI successfully convinced the customer to make a purchase.' 
                : 'Your sales AI was unable to convince the customer to make a purchase this time.'}
            </p>
          </div>
          
          <div className="py-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-12 w-12 rounded overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-left">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-primary text-sm">
                  {product.price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0
                  })}
                </p>
              </div>
            </div>
            
            <p className="text-sm">
              <span className="font-medium">Customer type:</span> {customerPersonality.name}
            </p>
            
            {successful && (
              <div className="mt-4 py-4 px-4 bg-green-50 rounded-lg">
                <p className="text-green-700 text-sm font-medium">
                  Commission earned: {(product.price * 0.1).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleNextCustomer}
            className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all"
          >
            Try with Next Customer
            <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="mt-12">
          <h3 className="font-semibold text-lg mb-4 text-center">Sales History</h3>
          <div className="glass-card overflow-hidden rounded-xl">
            {salesAttempts.slice().reverse().map((attempt, index) => (
              <div 
                key={attempt.id} 
                className={`flex items-center p-4 ${
                  index !== 0 ? 'border-t border-gray-100' : ''
                }`}
              >
                <div className={`mr-4 p-2 rounded-full ${
                  attempt.successful ? 'bg-green-100' : 'bg-red-100'  
                }`}>
                  {attempt.successful ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <X size={16} className="text-red-500" />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium">{attempt.product.name}</p>
                  <p className="text-sm text-gray-600">
                    Customer: {attempt.customerPersonality.name}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="font-medium text-primary">
                    {attempt.successful ? (
                      (attempt.product.price * 0.1).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0
                      })
                    ) : (
                      '$0'
                    )}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(attempt.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
