import { motion, AnimatePresence } from 'framer-motion';

interface BlockedModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export function BlockedModal({ isOpen, onConfirm }: BlockedModalProps) {
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
            className="fixed inset-0 bg-black/80 z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="pointer-events-auto w-full max-w-sm relative group"
            >
              {/* Outer Glow Effect */}
              <div className="absolute -inset-[1px] bg-gradient-to-b from-red-600/40 via-transparent to-transparent rounded-3xl opacity-50 blur-[2px] transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="relative bg-[#050505]/95 backdrop-blur-3xl border border-red-500/20 rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col items-center text-center">
                
                {/* Futuristic Accent Line */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-80" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-red-500 blur-[4px] opacity-60" />
                
                {/* Icon Container */}
                <div className="relative mb-8 mt-2">
                  <div className="absolute inset-0 bg-red-600/30 rounded-2xl blur-xl animate-pulse" />
                  <div className="w-16 h-16 bg-gradient-to-b from-red-500/10 to-red-500/[0.02] border border-red-500/20 rounded-2xl flex items-center justify-center relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transform rotate-45 transition-transform duration-500 ease-out">
                    <div className="transform -rotate-45 transition-transform duration-500 ease-out">
                      <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">Access Revoked</h3>
                <p className="text-zinc-400 mb-8 text-sm leading-relaxed max-w-[260px]">
                  Your account has been deactivated by the administrator. Your current session has been terminated. Please contact support to resolve this issue.
                </p>

                <div className="flex w-full gap-3">
                  <button
                    onClick={onConfirm}
                    className="flex-1 py-3 px-4 rounded-xl bg-red-600 border border-red-500 text-white hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 text-sm font-medium relative overflow-hidden group/btn"
                  >
                    <span className="relative z-10">Back to Login</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 z-0" />
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
