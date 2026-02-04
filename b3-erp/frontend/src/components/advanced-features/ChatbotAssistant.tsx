'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  ReactNode,
} from 'react';

// ============================================================================
// Chatbot Types
// ============================================================================

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'error';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  status?: MessageStatus;
  metadata?: {
    intent?: string;
    confidence?: number;
    suggestions?: string[];
    actions?: ChatAction[];
    sources?: string[];
  };
}

export interface ChatAction {
  id: string;
  label: string;
  type: 'link' | 'action' | 'form';
  payload: string | Record<string, unknown>;
}

export interface QuickReply {
  id: string;
  label: string;
  value: string;
}

export interface ChatbotConfig {
  name: string;
  avatar?: string;
  greeting: string;
  placeholder?: string;
  quickReplies?: QuickReply[];
  systemPrompt?: string;
}

export type ChatbotState = 'idle' | 'thinking' | 'typing' | 'error';

// ============================================================================
// Intent Recognition Types
// ============================================================================

export interface Intent {
  name: string;
  patterns: RegExp[];
  response: string | ((match: RegExpMatchArray, context: ChatContext) => string | Promise<string>);
  actions?: ChatAction[];
  followUp?: QuickReply[];
}

export interface ChatContext {
  messages: ChatMessage[];
  user?: Record<string, unknown>;
  session?: Record<string, unknown>;
}

// ============================================================================
// Default Intents
// ============================================================================

export const DEFAULT_INTENTS: Intent[] = [
  {
    name: 'greeting',
    patterns: [/^(hi|hello|hey|good morning|good afternoon|good evening)/i],
    response: "Hello! I'm here to help you with the ManufacturingOS system. What can I assist you with today?",
    followUp: [
      { id: '1', label: 'Check inventory', value: 'How do I check inventory levels?' },
      { id: '2', label: 'Create order', value: 'How do I create a new order?' },
      { id: '3', label: 'View reports', value: 'Show me available reports' },
    ],
  },
  {
    name: 'help',
    patterns: [/^(help|what can you do|how can you help)/i],
    response: `I can help you with:
• **Inventory** - Check stock levels, find items, manage warehouses
• **Orders** - Create, track, and manage orders
• **Production** - View schedules, update work orders
• **Reports** - Generate and view analytics
• **Navigation** - Find features and pages

Just ask me anything!`,
  },
  {
    name: 'inventory_check',
    patterns: [/(?:check|show|view|what'?s?)\s*(?:the\s+)?(?:inventory|stock)(?:\s+(?:level|status))?(?:\s+(?:for|of)\s+(.+))?/i],
    response: (match) => {
      const item = match[1];
      if (item) {
        return `Checking inventory for "${item}"... I found 3 locations with this item. Would you like me to show details?`;
      }
      return 'I can help you check inventory. What item or category would you like to look up?';
    },
    actions: [
      { id: '1', label: 'View Inventory Dashboard', type: 'link', payload: '/inventory' },
    ],
  },
  {
    name: 'create_order',
    patterns: [/(?:create|new|add|make)\s*(?:a\s+)?(?:new\s+)?order/i],
    response: "I'll help you create a new order. Let me open the order form for you.",
    actions: [
      { id: '1', label: 'Open Order Form', type: 'link', payload: '/orders/new' },
    ],
  },
  {
    name: 'navigation',
    patterns: [/(?:go to|open|show|navigate to|take me to)\s+(.+)/i],
    response: (match) => {
      const destination = match[1]?.toLowerCase();
      const routes: Record<string, string> = {
        'dashboard': '/dashboard',
        'inventory': '/inventory',
        'orders': '/orders',
        'customers': '/customers',
        'reports': '/reports',
        'settings': '/settings',
        'production': '/production',
      };

      for (const [name, path] of Object.entries(routes)) {
        if (destination?.includes(name)) {
          return `Taking you to ${name}...`;
        }
      }
      return `I'm not sure where "${destination}" is. Can you be more specific?`;
    },
  },
  {
    name: 'report',
    patterns: [/(?:show|view|generate|create)\s*(?:a\s+)?(?:report|analytics|statistics)/i],
    response: 'What type of report would you like to see?',
    followUp: [
      { id: '1', label: 'Sales Report', value: 'Show sales report' },
      { id: '2', label: 'Inventory Report', value: 'Show inventory report' },
      { id: '3', label: 'Production Report', value: 'Show production report' },
    ],
  },
  {
    name: 'thanks',
    patterns: [/^(thanks|thank you|thx|ty)/i],
    response: "You're welcome! Is there anything else I can help you with?",
  },
  {
    name: 'goodbye',
    patterns: [/^(bye|goodbye|see you|exit|close)/i],
    response: 'Goodbye! Feel free to come back if you need any help.',
  },
];

// ============================================================================
// Chatbot Context
// ============================================================================

interface ChatbotContextValue {
  config: ChatbotConfig;
  messages: ChatMessage[];
  state: ChatbotState;
  isOpen: boolean;
  unreadCount: number;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
}

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

// ============================================================================
// Chatbot Provider
// ============================================================================

export interface ChatbotProviderProps {
  children: ReactNode;
  config: ChatbotConfig;
  intents?: Intent[];
  onMessage?: (message: ChatMessage) => void;
  onAction?: (action: ChatAction) => void;
  apiEndpoint?: string;
  useAI?: boolean;
}

export function ChatbotProvider({
  children,
  config,
  intents = DEFAULT_INTENTS,
  onMessage,
  onAction,
  apiEndpoint,
  useAI = false,
}: ChatbotProviderProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [state, setState] = useState<ChatbotState>('idle');
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Add greeting message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetingMessage: ChatMessage = {
        id: 'greeting',
        role: 'assistant',
        content: config.greeting,
        timestamp: new Date(),
        metadata: {
          suggestions: config.quickReplies?.map((q) => q.value),
        },
      };
      setMessages([greetingMessage]);
    }
  }, [isOpen, messages.length, config.greeting, config.quickReplies]);

  // Reset unread count when opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Process message with intents
  const processWithIntents = useCallback(
    async (content: string): Promise<ChatMessage> => {
      const context: ChatContext = { messages };

      for (const intent of intents) {
        for (const pattern of intent.patterns) {
          const match = content.match(pattern);
          if (match) {
            let response: string;
            if (typeof intent.response === 'function') {
              response = await intent.response(match, context);
            } else {
              response = intent.response;
            }

            return {
              id: `assistant-${Date.now()}`,
              role: 'assistant',
              content: response,
              timestamp: new Date(),
              metadata: {
                intent: intent.name,
                actions: intent.actions,
                suggestions: intent.followUp?.map((q) => q.value),
              },
            };
          }
        }
      }

      // Default response
      return {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: "I'm not sure I understand. Could you rephrase that or try one of these options?",
        timestamp: new Date(),
        metadata: {
          suggestions: [
            'Help me with inventory',
            'Create a new order',
            'Show reports',
            'What can you do?',
          ],
        },
      };
    },
    [intents, messages]
  );

  // Process message with AI API
  const processWithAI = useCallback(
    async (content: string): Promise<ChatMessage> => {
      if (!apiEndpoint) {
        throw new Error('API endpoint not configured');
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...(config.systemPrompt
              ? [{ role: 'system', content: config.systemPrompt }]
              : []),
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      return {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content || data.message,
        timestamp: new Date(),
        metadata: data.metadata,
      };
    },
    [apiEndpoint, config.systemPrompt, messages]
  );

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
        status: 'sending',
      };

      setMessages((prev) => [...prev, userMessage]);
      setState('thinking');

      try {
        // Process message
        let assistantMessage: ChatMessage;

        if (useAI && apiEndpoint) {
          assistantMessage = await processWithAI(content);
        } else {
          // Simulate thinking delay
          await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));
          assistantMessage = await processWithIntents(content);
        }

        // Update user message status
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMessage.id ? { ...m, status: 'sent' as MessageStatus } : m
          )
        );

        // Add assistant message with typing effect
        setState('typing');
        await new Promise((resolve) => setTimeout(resolve, 300));

        setMessages((prev) => [...prev, assistantMessage]);
        onMessage?.(assistantMessage);

        if (!isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      } catch (error) {
        // Handle error
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMessage.id ? { ...m, status: 'error' as MessageStatus } : m
          )
        );

        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: "I'm sorry, something went wrong. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setState('idle');
      }
    },
    [useAI, apiEndpoint, processWithAI, processWithIntents, onMessage, isOpen]
  );

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // Toggle open
  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      config,
      messages,
      state,
      isOpen,
      unreadCount,
      sendMessage,
      clearMessages,
      toggleOpen,
      setOpen: setIsOpen,
    }),
    [config, messages, state, isOpen, unreadCount, sendMessage, clearMessages, toggleOpen]
  );

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
}

// ============================================================================
// useChatbot Hook
// ============================================================================

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}

// ============================================================================
// Chat Widget Component
// ============================================================================

export interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  className?: string;
}

export function ChatWidget({
  position = 'bottom-right',
  className = '',
}: ChatWidgetProps) {
  const { config, messages, state, isOpen, unreadCount, sendMessage, toggleOpen, clearMessages } =
    useChatbot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {config.avatar ? (
                <img
                  src={config.avatar}
                  alt={config.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              )}
              <div>
                <h3 className="font-semibold">{config.name}</h3>
                <p className="text-xs text-blue-100">
                  {state === 'thinking' ? 'Thinking...' : state === 'typing' ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearMessages}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Clear chat"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={toggleOpen}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-3 space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-gray-800 rounded-bl-md'
                  }`}
                >
                  <div
                    className="text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>'),
                    }}
                  />

                  {/* Actions */}
                  {message.metadata?.actions && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.metadata.actions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => {
                            if (action.type === 'link') {
                              window.location.href = action.payload as string;
                            }
                          }}
                          className="text-xs px-2 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Status indicator for user messages */}
                  {message.role === 'user' && message.status && (
                    <div className="text-xs text-blue-200 mt-1 text-right">
                      {message.status === 'sending' && 'Sending...'}
                      {message.status === 'error' && 'Failed'}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {(state === 'thinking' || state === 'typing') && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions */}
            {messages.length > 0 &&
              messages[messages.length - 1].metadata?.suggestions && (
                <div className="flex flex-wrap gap-2">
                  {messages[messages.length - 1].metadata!.suggestions!.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={config.placeholder || 'Type a message...'}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || state !== 'idle'}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleOpen}
        className={`
          w-14 h-14 rounded-full shadow-lg flex items-center justify-center
          transition-all duration-200 hover:scale-110
          ${isOpen ? 'bg-gray-600' : 'bg-blue-600'}
        `}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
}

// ============================================================================
// Inline Chat Component
// ============================================================================

export interface InlineChatProps {
  className?: string;
}

export function InlineChat({ className = '' }: InlineChatProps) {
  const { config, messages, state, sendMessage, clearMessages } = useChatbot();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <span className="font-medium">{config.name}</span>
        </div>
        <button
          onClick={clearMessages}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {state !== 'idle' && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

