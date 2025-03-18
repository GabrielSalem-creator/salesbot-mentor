
import React, { useRef, useEffect } from 'react';
import { useSales } from '../context/SalesContext';
import { User, Brain, ArrowRight, Bot } from 'lucide-react';

const CustomerInteraction: React.FC = () => {
  const { 
    customerMessages, 
    currentCustomer,
    selectedProduct,
    isAiThinking,
    completeSalesAttempt
  } = useSales();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [customerMessages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSkipCustomer = () => {
    completeSalesAttempt(false);
  };
  
  if (!currentCustomer || !selectedProduct) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p>Loading customer interaction...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full pt-16 pb-4">
      <div className="glass-card p-6 rounded-2xl mb-6 mx-auto max-w-2xl w-full animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-secondary rounded-full p-2">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{currentCustomer.name}</h2>
            <div className="flex flex-wrap gap-1 mt-1">
              {currentCustomer.traits.map((trait, index) => (
                <span 
                  key={index} 
                  className="bg-secondary/50 text-xs px-2 py-0.5 rounded-full"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3">{currentCustomer.description}</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-700 text-sm mb-3">
          <p className="font-medium">Automated Sales Conversation</p>
          <p>Watch as your trained AI salesperson interacts with this customer in real-time!</p>
        </div>
        
        <div className="pt-3 border-t border-gray-100">
          <p className="text-sm font-medium">Selling:</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="h-12 w-12 rounded overflow-hidden">
              <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{selectedProduct.name}</h3>
              <p className="text-primary text-sm">
                {selectedProduct.price.toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-2 mb-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Brain size={16} className="text-primary" />
              <span>Your AI Salesperson</span>
              <span className="text-gray-400 mx-1">→</span>
              <User size={16} className="text-secondary" />
              <span>Customer</span>
            </div>
            <button
              onClick={handleSkipCustomer}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              Skip this customer
              <ArrowRight size={12} />
            </button>
          </div>
        
          {customerMessages.length === 0 && (
            <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
              <Bot className="inline-block mr-2" size={16} />
              <span>Starting conversation with customer...</span>
            </div>
          )}
          
          {customerMessages.map((message, index) => (
            <div 
              key={message.id} 
              className={`chat-message-container animate-slide-up`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {message.role === 'system' ? (
                <div className="text-center my-3 py-2 px-4 bg-gray-100 rounded-lg text-sm text-gray-700 mx-auto max-w-xs">
                  {message.content}
                </div>
              ) : (
                <div className={`chat-message ${message.role === 'user' ? 'user' : 'ai'}`}>
                  <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
                    {message.role === 'user' ? (
                      <>
                        <Brain size={12} />
                        <span>Your AI Salesperson</span>
                      </>
                    ) : (
                      <>
                        <User size={12} />
                        <span>{currentCustomer.name}</span>
                      </>
                    )}
                  </div>
                  {message.content}
                </div>
              )}
            </div>
          ))}
          
          {isAiThinking && (
            <div className="chat-message-container">
              <div className="chat-message ai" style={{ padding: '12px 16px' }}>
                <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
                  {customerMessages.length > 0 && customerMessages[customerMessages.length - 1].role === 'user' ? (
                    <>
                      <User size={12} />
                      <span>{currentCustomer.name}</span>
                    </>
                  ) : (
                    <>
                      <Brain size={12} />
                      <span>Your AI Salesperson</span>
                    </>
                  )}
                </div>
                <div className="dot-pulse"></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default CustomerInteraction;
