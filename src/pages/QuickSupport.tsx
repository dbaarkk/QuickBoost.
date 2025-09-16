import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { 
  TrendingUp,
  ArrowLeft,
  Bot,
  User,
  X,
  Loader2,
  Send
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '../lib/queryClient';
import { type Conversation } from '@shared/schema';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const QuickSupport: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: "Hi! I'm QuickSupport AI. I'm here to help you with any questions about QuickBoost services. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock user ID - in real app this would come from auth context
  const userId = 'demo_user';

  // Load conversation history
  const { data: conversationHistory, isLoading: isLoadingHistory } = useQuery<Conversation[]>({
    queryKey: ['/api/conversations', userId],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation history when component mounts
  useEffect(() => {
    if (conversationHistory && conversationHistory.length > 0) {
      // Convert database conversations to message format
      const historyMessages: Message[] = [];
      
      conversationHistory.forEach((conv) => {
        historyMessages.push({
          id: `${conv.id}_user`,
          content: conv.userMessage,
          sender: 'user',
          timestamp: new Date(conv.timestamp)
        });
        historyMessages.push({
          id: `${conv.id}_ai`,
          content: conv.aiResponse,
          sender: 'ai',
          timestamp: new Date(conv.timestamp)
        });
      });

      // If we have history, replace welcome message with history + welcome
      if (historyMessages.length > 0) {
        setMessages([
          ...historyMessages,
          {
            id: 'welcome_back',
            content: "Welcome back! I can see our previous conversation above. How can I help you today?",
            sender: 'ai',
            timestamp: new Date()
          }
        ]);
      }
    } else if (conversationHistory && conversationHistory.length === 0) {
      // No history, show welcome message
      setMessages([{
        id: 'welcome',
        content: "Hi! I'm QuickSupport AI. I'm here to help you with any questions about QuickBoost services. How can I assist you today?",
        sender: 'ai',
        timestamp: new Date()
      }]);
    }
  }, [conversationHistory]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat', { message, userId });
      return response.json();
    },
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Date.now().toString() + '_ai',
        content: data.response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Invalidate conversations cache to refresh history
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', userId] });
    },
    onError: (error) => {
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        content: "I apologize, but I'm having trouble responding right now. Please try again or contact our support team directly.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const handleSendMessage = () => {
    const message = inputMessage.trim();
    if (!message) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString() + '_user',
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Send to AI
    chatMutation.mutate(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const sendQuickReply = (message: string) => {
    setInputMessage(message);
    setTimeout(() => handleSendMessage(), 100);
  };

  const quickReplies = [
    "How do I place an order?",
    "What payment methods do you accept?",
    "How fast is delivery?",
    "How do I add funds?",
    "Can I cancel an order?",
    "Is my data secure?"
  ];

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="bg-[#1E1E1E] shadow-lg border-b border-[#2A2A2A] sticky top-0 z-50">
        <div className="bg-[#121212] border-b border-[#2A2A2A] py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <Link to="/dashboard" className="flex items-center space-x-4 py-2">
                <TrendingUp className="h-8 w-8 text-[#00CFFF]" />
                <span className="text-xl font-black text-[#E0E0E0] tracking-tight">QuickBoost</span>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link 
              to="/dashboard"
              className="flex items-center text-[#A0A0A0] hover:text-[#E0E0E0] transition-colors"
              data-testid="button-back-to-dashboard"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-xl font-semibold text-[#E0E0E0]">QuickSupport AI</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-[#2A2A2A] rounded-2xl shadow-lg border border-[#2A2A2A] overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#00CFFF] to-[#7B61FF] p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">QuickSupport AI</h3>
                <div className="flex items-center text-white/80 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Online
                </div>
              </div>
            </div>
            <Link 
              to="/dashboard" 
              className="text-white/80 hover:text-white transition-colors"
              data-testid="button-close-chat"
            >
              <X className="h-6 w-6" />
            </Link>
          </div>

          {/* Messages Area */}
          <div className="h-96 flex flex-col">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto" data-testid="chat-messages">
              {isLoadingHistory && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-[#00CFFF]" />
                  <span className="ml-2 text-[#A0A0A0]">Loading conversation history...</span>
                </div>
              )}
              
              {messages.map((message) => (
                <div key={message.id} className="animate-fade-in">
                  {message.sender === 'user' ? (
                    <div className="flex items-start space-x-3 justify-end">
                      <div className="bg-gradient-to-r from-[#00CFFF] to-[#7B61FF] rounded-lg rounded-tr-none p-3 max-w-xs lg:max-w-md">
                        <p className="text-white">{message.content}</p>
                      </div>
                      <div className="w-8 h-8 bg-[#1E1E1E] rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-[#E0E0E0]" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#00CFFF] to-[#7B61FF] rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-[#1E1E1E] rounded-lg rounded-tl-none p-3 max-w-xs lg:max-w-md">
                        <p className="text-[#E0E0E0]">{message.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {chatMutation.isPending && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#00CFFF] to-[#7B61FF] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-[#1E1E1E] rounded-lg rounded-tl-none p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#A0A0A0] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#A0A0A0] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[#A0A0A0] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => sendQuickReply(reply)}
                    className="bg-[#00CFFF]/20 text-[#00CFFF] px-3 py-1 rounded-full text-sm hover:bg-[#00CFFF]/30 transition-colors"
                    data-testid={`button-quick-reply-${index}`}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-[#2A2A2A]">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-[#E0E0E0] placeholder:text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#00CFFF]"
                    disabled={chatMutation.isPending}
                    data-testid="input-chat-message"
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || chatMutation.isPending}
                  className="bg-gradient-to-r from-[#00CFFF] to-[#7B61FF] text-white p-2 rounded-lg hover:from-[#00CFFF]/90 hover:to-[#7B61FF]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-send-message"
                >
                  {chatMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSupport;
