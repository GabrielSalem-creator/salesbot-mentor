
import React from 'react';
import { useSales, Product } from '../context/SalesContext';
import { ArrowRight, CheckCircle } from 'lucide-react';

const ProductSelection: React.FC = () => {
  const { availableProducts, selectedProduct, setSelectedProduct, setStage } = useSales();
  
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };
  
  const handleContinue = () => {
    if (selectedProduct) {
      setStage('customer-interaction');
    }
  };
  
  return (
    <div className="flex flex-col h-full pt-16 pb-4">
      <div className="glass-card p-6 rounded-2xl mb-6 mx-auto max-w-2xl w-full animate-fade-in">
        <h2 className="text-xl font-semibold mb-2">Select a Product to Sell</h2>
        <p className="text-gray-600">
          Choose which product your AI will attempt to sell to virtual customers.
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-2 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {availableProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleSelectProduct(product)}
              className={`glass-card relative p-4 rounded-xl cursor-pointer transition-all hover:shadow-xl animate-scale-in ${
                selectedProduct?.id === product.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:scale-[1.02]'
              }`}
            >
              {selectedProduct?.id === product.id && (
                <div className="absolute top-3 right-3 bg-primary rounded-full text-white p-1">
                  <CheckCircle size={16} />
                </div>
              )}
              
              <div className="aspect-video rounded-lg mb-3 overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              
              <h3 className="font-semibold mb-1">{product.name}</h3>
              <p className="text-primary font-medium mb-2">
                {product.price.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0
                })}
              </p>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="px-4 flex justify-center">
        <button
          onClick={handleContinue}
          disabled={!selectedProduct}
          className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Customer Interaction
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProductSelection;
