
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { chatWithCohere } from '../lib/cohereAI';

// Types
export type AppStage = 'welcome' | 'training' | 'product-selection' | 'customer-interaction' | 'results';

export type CustomerPersonality = {
  id: string;
  name: string;
  traits: string[];
  description: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

export type Message = {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
};

export type SalesAttempt = {
  id: string;
  customerPersonality: CustomerPersonality;
  product: Product;
  conversation: Message[];
  successful: boolean | null;
  timestamp: number;
};

interface SalesContextType {
  stage: AppStage;
  setStage: (stage: AppStage) => void;
  trainingMessages: Message[];
  addTrainingMessage: (content: string, role: 'user' | 'ai' | 'system') => void;
  clearTrainingMessages: () => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  availableProducts: Product[];
  currentCustomer: CustomerPersonality | null;
  setCurrentCustomer: (customer: CustomerPersonality | null) => void;
  availableCustomers: CustomerPersonality[];
  customerMessages: Message[];
  addCustomerMessage: (content: string, role: 'user' | 'ai' | 'system') => void;
  clearCustomerMessages: () => void;
  salesAttempts: SalesAttempt[];
  currentSalesAttempt: SalesAttempt | null;
  completeSalesAttempt: (successful: boolean) => void;
  balance: number;
  sendMessage: (content: string, context: 'training' | 'customer') => Promise<void>;
  isAiThinking: boolean;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

// Sample products
const products: Product[] = [
  {
    id: '1',
    name: 'Smart Phone X12',
    description: 'The latest smartphone with cutting-edge features and a stunning display.',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Premium Headphones',
    description: 'Noise-cancelling headphones with exceptional sound quality.',
    price: 299,
    imageUrl: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Fitness Watch Pro',
    description: 'Track your health metrics and stay connected with this advanced fitness watch.',
    price: 199,
    imageUrl: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Designer Bag',
    description: 'Luxury designer bag made with premium materials and craftsmanship.',
    price: 1299,
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop'
  }
];

// Sample customer personalities
const customerPersonalities: CustomerPersonality[] = [
  {
    id: '1',
    name: 'The Skeptic',
    traits: ['Doubtful', 'Questioning', 'Analytical'],
    description: 'This customer questions everything and needs solid evidence before making a decision.'
  },
  {
    id: '2',
    name: 'The Bargain Hunter',
    traits: ['Price-conscious', 'Value-oriented', 'Negotiator'],
    description: 'This customer is primarily concerned with getting the best deal possible.'
  },
  {
    id: '3',
    name: 'The Impulse Buyer',
    traits: ['Spontaneous', 'Emotional', 'Quick-decider'],
    description: 'This customer makes decisions quickly based on emotional reactions.'
  },
  {
    id: '4',
    name: 'The Feature Enthusiast',
    traits: ['Technical', 'Detail-oriented', 'Feature-focused'],
    description: 'This customer cares deeply about specifications and technical features.'
  }
];

export const SalesProvider = ({ children }: { children: ReactNode }) => {
  const [stage, setStage] = useState<AppStage>('welcome');
  const [trainingMessages, setTrainingMessages] = useState<Message[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<CustomerPersonality | null>(null);
  const [customerMessages, setCustomerMessages] = useState<Message[]>([]);
  const [salesAttempts, setSalesAttempts] = useState<SalesAttempt[]>([]);
  const [currentSalesAttempt, setCurrentSalesAttempt] = useState<SalesAttempt | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Initialize the first customer when starting a customer interaction
  useEffect(() => {
    if (stage === 'customer-interaction' && !currentCustomer && availableCustomers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCustomers.length);
      const randomCustomer = availableCustomers[randomIndex];
      setCurrentCustomer(randomCustomer);
      
      // Initialize a new sales attempt
      if (selectedProduct) {
        const newAttempt: SalesAttempt = {
          id: Date.now().toString(),
          customerPersonality: randomCustomer,
          product: selectedProduct,
          conversation: [],
          successful: null,
          timestamp: Date.now()
        };
        setCurrentSalesAttempt(newAttempt);
        
        // Add initial system message to guide the conversation
        const initialMessage: Message = {
          id: Date.now().toString(),
          role: 'system',
          content: `Hello! I'm ${randomCustomer.name}. ${randomCustomer.description}`,
          timestamp: Date.now()
        };
        setCustomerMessages([initialMessage]);
      }
    }
  }, [stage, currentCustomer, selectedProduct]);

  const addTrainingMessage = (content: string, role: 'user' | 'ai' | 'system') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: Date.now()
    };
    setTrainingMessages(prev => [...prev, newMessage]);
  };

  const clearTrainingMessages = () => {
    setTrainingMessages([]);
  };

  const addCustomerMessage = (content: string, role: 'user' | 'ai' | 'system') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: Date.now()
    };
    setCustomerMessages(prev => [...prev, newMessage]);
    
    // Also add to current sales attempt
    if (currentSalesAttempt) {
      setCurrentSalesAttempt(prev => {
        if (!prev) return null;
        return {
          ...prev,
          conversation: [...prev.conversation, newMessage]
        };
      });
    }
  };

  const clearCustomerMessages = () => {
    setCustomerMessages([]);
  };

  const completeSalesAttempt = (successful: boolean) => {
    if (currentSalesAttempt) {
      // Update the current attempt
      const completedAttempt: SalesAttempt = {
        ...currentSalesAttempt,
        successful
      };
      
      // Add to history
      setSalesAttempts(prev => [...prev, completedAttempt]);
      
      // Update balance if successful
      if (successful && selectedProduct) {
        setBalance(prev => prev + selectedProduct.price * 0.1); // 10% commission
      }
      
      // Clear current attempt
      setCurrentSalesAttempt(null);
      setCurrentCustomer(null);
      clearCustomerMessages();
      
      // Move to results
      setStage('results');
    }
  };

  const sendMessage = async (content: string, context: 'training' | 'customer') => {
    try {
      setIsAiThinking(true);
      
      if (context === 'training') {
        addTrainingMessage(content, 'user');
        
        // Basic AI response for training
        const response = await chatWithCohere(content, 'You are a helpful AI assistant helping someone learn sales techniques.');
        addTrainingMessage(response, 'ai');
      } else if (context === 'customer') {
        // Add user message (salesperson)
        addCustomerMessage(content, 'user');
        
        if (currentCustomer && selectedProduct) {
          // Generate prompt based on customer personality and product
          const customerPrompt = `You are playing the role of a customer with the following traits: ${currentCustomer.traits.join(', ')}. 
          ${currentCustomer.description}
          
          You are considering buying a ${selectedProduct.name} which costs $${selectedProduct.price}.
          ${selectedProduct.description}
          
          Respond as this customer would to a salesperson. Be realistic in your responses and only agree to purchase if the salesperson makes a compelling case.
          
          The salesperson just said: "${content}"`;
          
          const response = await chatWithCohere(customerPrompt);
          
          // Check if the customer has decided to buy or not
          const lowercaseResponse = response.toLowerCase();
          if (
            (lowercaseResponse.includes("i'll take it") || 
             lowercaseResponse.includes("i will buy") || 
             lowercaseResponse.includes("sold") || 
             lowercaseResponse.includes("i'll buy") || 
             lowercaseResponse.includes("sign me up"))
          ) {
            // Customer is buying
            addCustomerMessage(response, 'ai');
            setTimeout(() => completeSalesAttempt(true), 1500);
          } else if (
            (lowercaseResponse.includes("not interested") || 
             lowercaseResponse.includes("no thanks") || 
             lowercaseResponse.includes("i'm not buying") || 
             lowercaseResponse.includes("too expensive") ||
             lowercaseResponse.includes("i'll pass"))
          ) {
            // Customer is rejecting
            addCustomerMessage(response, 'ai');
            setTimeout(() => completeSalesAttempt(false), 1500);
          } else {
            // Conversation continues
            addCustomerMessage(response, 'ai');
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = context === 'training' ? 
        'Sorry, I had trouble processing that. Please try again.' : 
        'The customer seems distracted and doesn\'t respond.';
      
      if (context === 'training') {
        addTrainingMessage(errorMessage, 'system');
      } else {
        addCustomerMessage(errorMessage, 'system');
      }
    } finally {
      setIsAiThinking(false);
    }
  };

  const value = {
    stage,
    setStage,
    trainingMessages,
    addTrainingMessage,
    clearTrainingMessages,
    selectedProduct,
    setSelectedProduct,
    availableProducts: products,
    currentCustomer,
    setCurrentCustomer,
    availableCustomers: customerPersonalities,
    customerMessages,
    addCustomerMessage,
    clearCustomerMessages,
    salesAttempts,
    currentSalesAttempt,
    completeSalesAttempt,
    balance,
    sendMessage,
    isAiThinking
  };

  return <SalesContext.Provider value={value}>{children}</SalesContext.Provider>;
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
