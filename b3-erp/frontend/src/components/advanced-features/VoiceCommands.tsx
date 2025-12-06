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
// Voice Command Types
// ============================================================================

export interface VoiceCommand {
  /** Command phrases that trigger this action */
  phrases: string[];
  /** Action to execute */
  action: (transcript: string, params?: Record<string, string>) => void;
  /** Description for help menu */
  description: string;
  /** Category for grouping */
  category?: string;
  /** Whether command requires confirmation */
  requiresConfirmation?: boolean;
}

export interface VoiceCommandMatch {
  command: VoiceCommand;
  phrase: string;
  params?: Record<string, string>;
  confidence: number;
}

export type VoiceState = 'inactive' | 'listening' | 'processing' | 'error';

// ============================================================================
// Speech Recognition Types (Web Speech API)
// ============================================================================

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: Event & { error: string }) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

// ============================================================================
// Voice Command Context
// ============================================================================

interface VoiceCommandContextValue {
  isSupported: boolean;
  state: VoiceState;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  commands: VoiceCommand[];
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  registerCommand: (command: VoiceCommand) => void;
  unregisterCommand: (phrases: string[]) => void;
  speak: (text: string, options?: SpeechOptions) => Promise<void>;
  cancelSpeech: () => void;
}

const VoiceCommandContext = createContext<VoiceCommandContextValue | null>(null);

// ============================================================================
// Speech Synthesis Options
// ============================================================================

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: string;
  lang?: string;
}

// ============================================================================
// Voice Command Provider
// ============================================================================

export interface VoiceCommandProviderProps {
  children: ReactNode;
  /** Language for speech recognition */
  language?: string;
  /** Enable continuous listening */
  continuous?: boolean;
  /** Show interim results */
  interimResults?: boolean;
  /** Wake word to activate (e.g., "Hey Assistant") */
  wakeWord?: string;
  /** Auto-stop after silence (ms) */
  autoStopTimeout?: number;
  /** Callback when command is recognized */
  onCommandRecognized?: (match: VoiceCommandMatch) => void;
  /** Callback on any transcript */
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  /** Default commands */
  defaultCommands?: VoiceCommand[];
}

export function VoiceCommandProvider({
  children,
  language = 'en-US',
  continuous = false,
  interimResults = true,
  wakeWord,
  autoStopTimeout = 5000,
  onCommandRecognized,
  onTranscript,
  defaultCommands = [],
}: VoiceCommandProviderProps) {
  const [state, setState] = useState<VoiceState>('inactive');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [commands, setCommands] = useState<VoiceCommand[]>(defaultCommands);
  const [isWakeWordActive, setIsWakeWordActive] = useState(!wakeWord);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const autoStopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Check browser support
  const isSupported = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = language;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setState('listening');
      setError(null);
    };

    recognition.onend = () => {
      setState('inactive');
      setInterimTranscript('');
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setState('error');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (interim) {
        setInterimTranscript(interim);
        onTranscript?.(interim, false);
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        setInterimTranscript('');
        onTranscript?.(finalTranscript, true);

        // Check for wake word
        if (wakeWord && !isWakeWordActive) {
          if (finalTranscript.toLowerCase().includes(wakeWord.toLowerCase())) {
            setIsWakeWordActive(true);
            speak('How can I help you?');
            return;
          }
        }

        // Process commands
        if (isWakeWordActive || !wakeWord) {
          processCommand(finalTranscript, event.results[event.resultIndex][0].confidence);
        }

        // Reset auto-stop timer
        resetAutoStopTimer();
      }
    };

    recognitionRef.current = recognition;
    synthRef.current = window.speechSynthesis;

    return () => {
      recognition.abort();
      if (autoStopTimerRef.current) {
        clearTimeout(autoStopTimerRef.current);
      }
    };
  }, [isSupported, language, continuous, interimResults, wakeWord, isWakeWordActive]);

  // Auto-stop timer reset
  const resetAutoStopTimer = useCallback(() => {
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
    }

    if (autoStopTimeout > 0 && state === 'listening') {
      autoStopTimerRef.current = setTimeout(() => {
        stopListening();
        if (wakeWord) {
          setIsWakeWordActive(false);
        }
      }, autoStopTimeout);
    }
  }, [autoStopTimeout, state, wakeWord]);

  // Process command from transcript
  const processCommand = useCallback(
    (text: string, confidence: number) => {
      setState('processing');

      const normalizedText = text.toLowerCase().trim();

      for (const command of commands) {
        for (const phrase of command.phrases) {
          const normalizedPhrase = phrase.toLowerCase();

          // Check for exact match or contains
          if (
            normalizedText === normalizedPhrase ||
            normalizedText.includes(normalizedPhrase)
          ) {
            const match: VoiceCommandMatch = {
              command,
              phrase,
              confidence,
            };

            // Extract parameters (simple pattern matching)
            const params = extractParams(normalizedText, normalizedPhrase);
            if (params) {
              match.params = params;
            }

            onCommandRecognized?.(match);

            if (!command.requiresConfirmation) {
              command.action(text, params);
            }

            setState('inactive');
            return;
          }
        }
      }

      // No command matched
      setState('inactive');
    },
    [commands, onCommandRecognized]
  );

  // Extract parameters from command
  const extractParams = (
    text: string,
    phrase: string
  ): Record<string, string> | undefined => {
    // Simple extraction: get text after the phrase
    const index = text.indexOf(phrase);
    if (index !== -1) {
      const remainder = text.slice(index + phrase.length).trim();
      if (remainder) {
        return { query: remainder };
      }
    }
    return undefined;
  };

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || state === 'listening') return;

    try {
      recognitionRef.current.start();
      resetAutoStopTimer();
    } catch (err) {
      setError('Failed to start speech recognition');
      setState('error');
    }
  }, [state, resetAutoStopTimer]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
    } catch {
      // Ignore errors when stopping
    }

    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
    }
  }, []);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (state === 'listening') {
      stopListening();
    } else {
      startListening();
    }
  }, [state, startListening, stopListening]);

  // Register command
  const registerCommand = useCallback((command: VoiceCommand) => {
    setCommands((prev) => [...prev.filter((c) => c.phrases[0] !== command.phrases[0]), command]);
  }, []);

  // Unregister command
  const unregisterCommand = useCallback((phrases: string[]) => {
    setCommands((prev) =>
      prev.filter((c) => !c.phrases.some((p) => phrases.includes(p)))
    );
  }, []);

  // Text-to-speech
  const speak = useCallback(
    async (text: string, options: SpeechOptions = {}): Promise<void> => {
      if (!synthRef.current) return;

      return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.rate = options.rate ?? 1;
        utterance.pitch = options.pitch ?? 1;
        utterance.volume = options.volume ?? 1;
        utterance.lang = options.lang ?? language;

        if (options.voice) {
          const voices = synthRef.current!.getVoices();
          const voice = voices.find((v) => v.name === options.voice);
          if (voice) {
            utterance.voice = voice;
          }
        }

        utterance.onend = () => resolve();
        utterance.onerror = (e) => reject(e);

        synthRef.current!.speak(utterance);
      });
    },
    [language]
  );

  // Cancel speech
  const cancelSpeech = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, []);

  const value = useMemo(
    () => ({
      isSupported,
      state,
      transcript,
      interimTranscript,
      error,
      commands,
      startListening,
      stopListening,
      toggleListening,
      registerCommand,
      unregisterCommand,
      speak,
      cancelSpeech,
    }),
    [
      isSupported,
      state,
      transcript,
      interimTranscript,
      error,
      commands,
      startListening,
      stopListening,
      toggleListening,
      registerCommand,
      unregisterCommand,
      speak,
      cancelSpeech,
    ]
  );

  return (
    <VoiceCommandContext.Provider value={value}>
      {children}
    </VoiceCommandContext.Provider>
  );
}

// ============================================================================
// useVoiceCommands Hook
// ============================================================================

export function useVoiceCommands() {
  const context = useContext(VoiceCommandContext);
  if (!context) {
    throw new Error('useVoiceCommands must be used within a VoiceCommandProvider');
  }
  return context;
}

// ============================================================================
// Voice Button Component
// ============================================================================

export interface VoiceButtonProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'floating' | 'minimal';
  showTranscript?: boolean;
  className?: string;
}

export function VoiceButton({
  size = 'md',
  variant = 'default',
  showTranscript = false,
  className = '',
}: VoiceButtonProps) {
  const { isSupported, state, interimTranscript, toggleListening } = useVoiceCommands();

  if (!isSupported) return null;

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const isListening = state === 'listening';

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <button
        onClick={toggleListening}
        aria-label={isListening ? 'Stop listening' : 'Start voice command'}
        className={`
          ${sizeClasses[size]}
          rounded-full flex items-center justify-center
          transition-all duration-200
          ${variant === 'floating' ? 'shadow-lg hover:shadow-xl' : ''}
          ${isListening
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }
          ${variant === 'minimal' ? 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400' : ''}
        `}
      >
        {isListening ? (
          <svg className={iconSizes[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        ) : (
          <svg className={iconSizes[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>

      {showTranscript && interimTranscript && (
        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs text-center animate-pulse">
          {interimTranscript}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Voice Search Component
// ============================================================================

export interface VoiceSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function VoiceSearch({
  onSearch,
  placeholder = 'Search or speak...',
  className = '',
}: VoiceSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const { isSupported, state, transcript, startListening, stopListening } = useVoiceCommands();

  useEffect(() => {
    if (transcript && state === 'inactive') {
      setInputValue(transcript);
      onSearch(transcript);
    }
  }, [transcript, state, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const isListening = state === 'listening';

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg
          bg-white dark:bg-gray-800
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${isListening ? 'border-red-500 ring-2 ring-red-200' : ''}
        `}
      />

      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {isSupported && (
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`
              p-2 rounded-full transition-colors
              ${isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500'
              }
            `}
            aria-label={isListening ? 'Stop listening' : 'Voice search'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        )}

        <button
          type="submit"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500"
          aria-label="Search"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {isListening && (
        <div className="absolute left-0 right-0 top-full mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-600 dark:text-red-400 text-center">
          Listening... Speak now
        </div>
      )}
    </form>
  );
}

// ============================================================================
// Voice Command Help Dialog
// ============================================================================

export interface VoiceCommandHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceCommandHelp({ isOpen, onClose }: VoiceCommandHelpProps) {
  const { commands } = useVoiceCommands();

  if (!isOpen) return null;

  // Group commands by category
  const groupedCommands = commands.reduce((acc, cmd) => {
    const category = cmd.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(cmd);
    return acc;
  }, {} as Record<string, VoiceCommand[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Voice Commands</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-96">
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {category}
              </h3>
              <div className="space-y-2">
                {cmds.map((cmd, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex flex-wrap gap-2 mb-1">
                      {cmd.phrases.map((phrase, i) => (
                        <code
                          key={i}
                          className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-sm"
                        >
                          "{phrase}"
                        </code>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {cmd.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Tip: Click the microphone button or press <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Ctrl+Shift+V</kbd> to start
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Default Navigation Commands
// ============================================================================

export const createNavigationCommands = (
  navigate: (path: string) => void
): VoiceCommand[] => [
  {
    phrases: ['go to dashboard', 'open dashboard', 'show dashboard'],
    action: () => navigate('/dashboard'),
    description: 'Navigate to the dashboard',
    category: 'Navigation',
  },
  {
    phrases: ['go to inventory', 'open inventory', 'show inventory'],
    action: () => navigate('/inventory'),
    description: 'Navigate to inventory',
    category: 'Navigation',
  },
  {
    phrases: ['go to orders', 'open orders', 'show orders'],
    action: () => navigate('/orders'),
    description: 'Navigate to orders',
    category: 'Navigation',
  },
  {
    phrases: ['go to settings', 'open settings'],
    action: () => navigate('/settings'),
    description: 'Navigate to settings',
    category: 'Navigation',
  },
  {
    phrases: ['go back', 'back'],
    action: () => window.history.back(),
    description: 'Go back to previous page',
    category: 'Navigation',
  },
  {
    phrases: ['go forward', 'forward'],
    action: () => window.history.forward(),
    description: 'Go forward in history',
    category: 'Navigation',
  },
  {
    phrases: ['refresh', 'reload page'],
    action: () => window.location.reload(),
    description: 'Refresh the current page',
    category: 'Navigation',
  },
  {
    phrases: ['search for', 'find'],
    action: (_transcript, params) => {
      if (params?.query) {
        navigate(`/search?q=${encodeURIComponent(params.query)}`);
      }
    },
    description: 'Search for something',
    category: 'Search',
  },
];

