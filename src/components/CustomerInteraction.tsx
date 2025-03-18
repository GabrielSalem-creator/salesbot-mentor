
import React, { useState, useRef, useEffect } from 'react';
import { useSales } from '../context/SalesContext';
import { Send, User } from 'lucide-react';

const CustomerInteraction: React.FC = () => {
  const { 
    customerMessages, 
    currentCustomer,
    selectedProduct,
    sendMessage,
    isAiThinking
  } = useSales();
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [customerMessages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isAiThinking) {
      sendMessage(inputValue.trim(), 'customer');
      setInputValue('');
    }
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
        <p className="text-gray-600 text-sm">{currentCustomer.description}</p>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
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
          {customerMessages.map((message, index) => (
            <div 
              key={message.id} 
              className={`chat-message-container animate-slide-up`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {message.role === 'system' ? (
                <div className="text-center text-sm text-gray-500 my-2">
                  {message.content}
                </div>
              ) : (
                <div className={`chat-message ${message.role === 'user' ? 'user' : 'ai'}`}>
                  {message.content}
                </div>
              )}
            </div>
          ))}
          
          {isAiThinking && (
            <div className="chat-message-container">
              <div className="chat-message ai" style={{ padding: '12px 16px' }}>
                <div className="dot-pulse"></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="px-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your sales pitch..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isAiThinking}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isAiThinking}
              className="bg-primary text-white rounded-full p-2 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerInteraction;
