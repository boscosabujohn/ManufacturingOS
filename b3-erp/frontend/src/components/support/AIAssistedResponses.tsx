'use client'

import { useState } from 'react'
import { Sparkles, Copy, ThumbsUp, ThumbsDown, RefreshCw, MessageSquare, Zap, TrendingUp } from 'lucide-react'

export type ResponseTone = 'professional' | 'friendly' | 'empathetic' | 'technical' | 'concise';
export type ResponseQuality = 'excellent' | 'good' | 'needs-improvement';

export interface AIResponse {
  id: string;
  ticketSubject: string;
  generatedResponse: string;
  tone: ResponseTone;
  confidence: number;
  quality: ResponseQuality;
  usageCount: number;
  feedbackScore: number;
}

export default function AIAssistedResponses() {
  const [selectedTone, setSelectedTone] = useState<ResponseTone>('professional');
  const [generating, setGenerating] = useState(false);

  const [aiResponses] = useState<AIResponse[]>([
    {
      id: 'AI-RESP-001',
      ticketSubject: 'Unable to log in to account',
      generatedResponse: 'Thank you for reaching out. I understand you\'re experiencing login issues. Let me help you resolve this. First, please try clearing your browser cache and cookies, then attempt to log in again. If the issue persists, click on "Forgot Password" to reset your credentials. I\'m here to assist if you need further help.',
      tone: 'empathetic',
      confidence: 95,
      quality: 'excellent',
      usageCount: 234,
      feedbackScore: 4.8
    },
    {
      id: 'AI-RESP-002',
      ticketSubject: 'API rate limit exceeded',
      generatedResponse: 'Your account has reached the API rate limit of 1000 requests per hour. The limit will reset at the top of the next hour. To avoid this in the future, implement exponential backoff in your API client or consider upgrading to a higher tier plan for increased limits.',
      tone: 'technical',
      confidence: 98,
      quality: 'excellent',
      usageCount: 156,
      feedbackScore: 4.9
    },
    {
      id: 'AI-RESP-003',
      ticketSubject: 'Billing question about recent charge',
      generatedResponse: 'Hi there! I\'d be happy to help clarify your billing. The recent charge of $99.00 is for your Premium Plan renewal on January 15th. This includes unlimited users, priority support, and advanced analytics. Would you like me to send you a detailed invoice or help with anything else?',
      tone: 'friendly',
      confidence: 92,
      quality: 'good',
      usageCount: 189,
      feedbackScore: 4.6
    }
  ]);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2000);
  };

  const getToneColor = (tone: ResponseTone) => {
    const colors = {
      professional: 'bg-blue-100 text-blue-700',
      friendly: 'bg-green-100 text-green-700',
      empathetic: 'bg-purple-100 text-purple-700',
      technical: 'bg-indigo-100 text-indigo-700',
      concise: 'bg-gray-100 text-gray-700'
    };
    return colors[tone];
  };

  const getQualityColor = (quality: ResponseQuality) => {
    const colors = {
      'excellent': 'text-green-600',
      'good': 'text-blue-600',
      'needs-improvement': 'text-yellow-600'
    };
    return colors[quality];
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-purple-600" />
              AI-Assisted Responses
            </h2>
            <p className="text-gray-600 mt-1">Generate contextual responses with AI-powered suggestions</p>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-gray-600">GPT-4 Powered</span>
          </div>
        </div>
      </div>

      {/* Response Generator */}
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Response</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Subject</label>
              <input
                type="text"
                placeholder="Enter ticket subject or description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                defaultValue="Customer requesting refund for duplicate charge"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Response Tone</label>
              <div className="flex flex-wrap gap-2">
                {(['professional', 'friendly', 'empathetic', 'technical', 'concise'] as ResponseTone[]).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                      selectedTone === tone
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Generate AI Response
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-6 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">Generated Response</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">
                95% Confidence
              </span>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded flex items-center gap-1">
                <Copy className="h-4 w-4" />
                Copy
              </button>
              <button className="px-3 py-1 text-green-700 hover:bg-green-100 rounded flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
              </button>
              <button className="px-3 py-1 text-red-700 hover:bg-red-100 rounded flex items-center gap-1">
                <ThumbsDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-900 leading-relaxed">
              Hi there! I completely understand your concern about the duplicate charge. I sincerely apologize for any inconvenience this has caused. I've reviewed your account and confirmed that you were charged twice on January 15th for $99.00 each.
              <br /><br />
              I've immediately processed a full refund of $99.00 for the duplicate charge. You should see this reflected in your account within 3-5 business days. I've also added a credit of $10 to your account as a gesture of goodwill for the inconvenience.
              <br /><br />
              Is there anything else I can help you with today? I'm here to ensure you have the best experience possible.
              <br /><br />
              Best regards,<br />
              Support Team
            </p>
          </div>
        </div>
      </div>

      {/* AI Response Library */}
      <div className="bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Response Library</h3>
              <p className="text-sm text-gray-600 mt-1">Previously generated high-quality responses</p>
            </div>
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {aiResponses.map((response) => (
            <div key={response.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">{response.ticketSubject}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getToneColor(response.tone)}`}>
                      {response.tone.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {response.confidence}% Confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{response.generatedResponse}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Quality:</span>
                    <span className={`font-medium ${getQualityColor(response.quality)}`}>
                      {response.quality.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Used:</span>
                    <span className="font-medium text-gray-900">{response.usageCount} times</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-medium text-yellow-600">{response.feedbackScore} ★</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-3 py-1 text-blue-700 hover:bg-blue-100 rounded flex items-center gap-1">
                    <Copy className="h-4 w-4" />
                    Use Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
          <Sparkles className="h-8 w-8 text-purple-600 mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Context-Aware</h4>
          <p className="text-sm text-gray-700">
            AI analyzes ticket history, customer profile, and previous interactions to generate personalized responses
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <Zap className="h-8 w-8 text-blue-600 mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Multi-Language</h4>
          <p className="text-sm text-gray-700">
            Automatically detects customer language and generates responses in their preferred language
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
          <h4 className="font-semibold text-gray-900 mb-2">Learning System</h4>
          <p className="text-sm text-gray-700">
            AI continuously learns from agent feedback and successful resolutions to improve response quality
          </p>
        </div>
      </div>
    </div>
  );
}
