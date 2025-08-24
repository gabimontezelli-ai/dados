import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning';
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  type = 'danger'
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const colorClasses = {
    danger: {
      bg: 'from-red-600 to-pink-600',
      ring: 'ring-red-500/25',
      button: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700',
      icon: 'text-red-400'
    },
    warning: {
      bg: 'from-yellow-600 to-orange-600',
      ring: 'ring-yellow-500/25',
      button: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700',
      icon: 'text-yellow-400'
    }
  };

  const colors = colorClasses[type];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-md">
        <div className={`absolute -inset-1 bg-gradient-to-r ${colors.bg} rounded-2xl blur opacity-75`}></div>
        <div className={`relative bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-2xl ring-1 ${colors.ring}`}>
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center ${colors.ring} ring-1`}>
              <AlertTriangle className={`w-6 h-6 ${colors.icon}`} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{message}</p>
            </div>

            <button
              onClick={onCancel}
              className="flex-shrink-0 p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-all font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className={`flex-1 px-4 py-2 ${colors.button} text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg`}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}