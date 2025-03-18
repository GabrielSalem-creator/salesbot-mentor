
import React, { useState, useRef, useEffect } from 'react';
import { useSales, Message } from '../context/SalesContext';
import { Send, ArrowRight } from 'lucide-react';

const TrainingInterface: React.FC = () => {
  const { 
    trainingMessages, 
    sendMessage, 
    isAiThinking,
    setStage
  } = useSales();
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [trainingMessages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isAiThinking) {
      sendMessage(inputValue.trim(), 'training');
      setInputValue('');
    }
  };
  
  const handleContinue = () => {
    setStage('product-selection');
  };
  
  const renderMessage = (message: Message, index: number) => {
    return (
      <div 
        key={message.id} 
        className={`chat-message-container animate-slide-up`}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className={`chat-message ${message.role === 'user' ? 'user' : 'ai'}`}>
          {message.content}
        </div>
      </div>
    );
  };
  
  const renderTypingIndicator = () => {
    return (
      <div className="chat-message-container">
        <div className="chat-message ai" style={{ padding: '12px 16px' }}>
          <div className="dot-pulse"></div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full pt-16 pb-4">
      <div className="glass-card p-6 rounded-2xl mb-6 mx-auto max-w-2xl w-full animate-fade-in">
        <h2 className="text-xl font-semibold mb-2">Train Your Sales AI</h2>
        <p className="text-gray-600 mb-4">
          Teach your AI how to be an effective salesperson. Share sales techniques, 
          strategies, and approaches. The better you train it, the more successful it will be.
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-2 mb-4">
        {trainingMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <p className="mb-4">Start training your AI by sending a message about sales techniques.</p>
            <p className="text-sm">Example: "When selling a product, always focus on benefits rather than features."</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {trainingMessages.map((message, index) => renderMessage(message, index))}
            {isAiThinking && renderTypingIndicator()}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="px-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your sales training instructions..."
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
          
          {trainingMessages.length >= 4 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleContinue}
                className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all"
              >
                Continue to Product Selection
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingInterface;
