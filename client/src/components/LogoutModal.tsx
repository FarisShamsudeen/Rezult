import { motion, AnimatePresence } from 'framer-motion';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="pointer-events-auto w-full max-w-sm mx-4 bg-[#0A0A0A] border border-[#00F2FE]/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,242,254,0.15)] relative overflow-hidden"
            >
              {/* Subtle top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-[#00F2FE] to-transparent opacity-50" />
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#1A1A1A] rounded-full border border-red-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">Ready to Leave?</h3>
                <p className="text-white/60 mb-8 text-sm leading-relaxed">
                  You are about to log out of your session. Make sure all your work is saved.
                </p>

                <div className="flex w-full gap-4">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="flex-1 py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-sm font-semibold shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
