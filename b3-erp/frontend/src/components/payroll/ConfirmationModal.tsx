'use client';

import { useState } from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes?: string) => Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success' | 'info';
  requireNotes?: boolean;
  notesLabel?: string;
  notesPlaceholder?: string;
  details?: Array<{ label: string; value: string | number }>;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
  requireNotes = false,
  notesLabel = 'Notes',
  notesPlaceholder = 'Enter notes here...',
  details = []
}: ConfirmationModalProps) {
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (requireNotes && !notes.trim()) {
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirm(requireNotes ? notes : undefined);
      handleClose();
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setNotes('');
      onClose();
    }
  };

  const variantStyles = {
    danger: {
      icon: AlertCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      buttonColor: 'bg-red-600 hover:bg-red-700',
      headerColor: 'text-red-900'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
      headerColor: 'text-yellow-900'
    },
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      headerColor: 'text-green-900'
    },
    info: {
      icon: AlertCircle,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      headerColor: 'text-blue-900'
    }
  };

  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className={`text-xl font-bold ${style.headerColor}`}>{title}</h2>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Icon and Message */}
          <div className={`flex items-start p-4 rounded-lg ${style.bgColor} border ${style.borderColor} mb-4`}>
            <Icon className={`h-6 w-6 ${style.iconColor} mt-0.5 mr-3 flex-shrink-0`} />
            <p className="text-gray-900">{message}</p>
          </div>

          {/* Details Table */}
          {details.length > 0 && (
            <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {details.map((detail, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700 w-1/3">
                        {detail.label}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {typeof detail.value === 'number'
                          ? detail.value.toLocaleString('en-IN')
                          : detail.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Notes Input */}
          {requireNotes && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {notesLabel} <span className="text-red-600">*</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={notesPlaceholder}
                rows={4}
                disabled={isProcessing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
              />
              {requireNotes && !notes.trim() && (
                <p className="mt-1 text-sm text-red-600">Notes are required</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing || (requireNotes && !notes.trim())}
            className={`px-4 py-2 text-white rounded-lg ${style.buttonColor} disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
