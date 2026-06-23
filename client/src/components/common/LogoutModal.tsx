import React from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
      <div className="bg-[#050505] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00EBD5]/10 to-[#0072FF]/10 pointer-events-none"></div>
        <h2 className="text-2xl font-bold text-white mb-2 relative z-10">Sign Out</h2>
        <p className="text-white/60 mb-8 relative z-10">Are you sure you want to log out of your account?</p>
        <div className="flex gap-4 relative z-10">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-black bg-gradient-to-r from-[#00EBD5] to-[#0072FF] hover:opacity-90 transition-opacity"
          >
            Yes, Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
