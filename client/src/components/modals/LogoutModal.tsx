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
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="pointer-events-auto w-full max-w-sm relative group"
            >
              {/* Outer Glow Effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-b from-[#00F2FE]/40 via-transparent to-transparent rounded-3xl opacity-50 blur-[2px] transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="relative bg-[#050505]/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col items-center text-center">
                
                {/* Futuristic Accent Line */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#00F2FE] to-transparent opacity-80" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-[#00F2FE] blur-[4px] opacity-60" />
                
                {/* Icon Container */}
                <div className="relative mb-8 mt-2">
                  <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl animate-pulse" />
                  <div className="w-16 h-16 bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-center relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transform rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-out">
                    <div className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 ease-out">
                      <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">Ready to Leave?</h3>
                <p className="text-zinc-400 mb-8 text-sm leading-relaxed max-w-[260px]">
                  You are about to log out of your session. Make sure all your work is saved.
                </p>

                <div className="flex w-full gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white transition-all duration-300 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="flex-1 py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:border-red-500 transition-all duration-300 text-sm font-medium relative overflow-hidden group/btn"
                  >
                    <span className="relative z-10">Logout</span>
                    {/* Hover reveal gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 z-0" />
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
