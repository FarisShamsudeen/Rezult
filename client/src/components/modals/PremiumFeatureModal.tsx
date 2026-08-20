import { useState } from 'react';
import { X, CreditCard, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (plan: string) => void;
}

export function PremiumFeatureModal({ isOpen, onClose, onContinue }: PremiumFeatureModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('one_time');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" 
            onClick={onClose} 
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#12181C] border border-white/10 rounded-[24px] w-full max-w-[650px] overflow-visible shadow-2xl pointer-events-auto flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-8 pb-6 border-b border-white/5 relative">
                <div>
                  <h2 className="text-[20px] font-bold text-white mb-2 tracking-wide">You have added a premium feature</h2>
                  <p className="text-[13px] text-white/50 font-medium tracking-wide">Select a plan to proceed with generating your assessment.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
                
                {/* One-time Payment */}
                <div 
                  onClick={() => setSelectedPlan('one_time')}
                  className={`bg-[#1A2328]/50 border-2 rounded-[20px] p-6 cursor-pointer transition-all relative flex flex-col justify-between min-h-[220px] ${
                    selectedPlan === 'one_time' 
                      ? 'border-[#1A73E8] shadow-[0_0_15px_rgba(26,115,232,0.15)] bg-gradient-to-b from-[#1A2328] to-[#1A73E8]/5' 
                      : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-[12px] bg-[#1A73E8]/10 flex items-center justify-center text-[#1A73E8] mb-6">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold text-[16px] mb-2 tracking-wide">One-time Payment</h3>
                    <p className="text-[12px] text-white/50 font-medium leading-relaxed">
                      Pay once for this specific assessment generation.
                    </p>
                  </div>
                  <div className="mt-6 text-white font-bold text-[24px]">
                    $5.00
                  </div>
                </div>

                {/* Monthly Subscription */}
                <div 
                  onClick={() => setSelectedPlan('monthly')}
                  className={`bg-[#1A2328]/50 border-2 rounded-[20px] p-6 cursor-pointer transition-all relative flex flex-col justify-between min-h-[220px] ${
                    selectedPlan === 'monthly' 
                      ? 'border-[#F57C00] shadow-[0_0_15px_rgba(245,124,0,0.15)] bg-gradient-to-b from-[#1A2328] to-[#F57C00]/5' 
                      : 'border-[#F57C00]/30 hover:border-[#F57C00]/50'
                  }`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F57C00] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg z-10 whitespace-nowrap">
                    BEST VALUE
                  </div>
                  <div>
                    <div className="w-10 h-10 rounded-[12px] bg-[#F57C00]/10 flex items-center justify-center text-[#F57C00] mb-6 mt-2">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold text-[16px] mb-2 tracking-wide">Monthly Subscription</h3>
                    <p className="text-[12px] text-white/50 font-medium leading-relaxed">
                      95% off the original price calculated for 28 days.
                    </p>
                  </div>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-[#F57C00] font-bold text-[24px]">$95.00</span>
                    <span className="text-white/30 text-[14px] font-medium line-through mb-1">$100.00</span>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/5 flex items-center justify-end gap-4 bg-[#0A0D14]/50">
                <button 
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl border border-white/10 text-white/70 font-bold text-[14px] hover:bg-white/5 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    onContinue(selectedPlan);
                    onClose();
                  }}
                  className="px-8 py-2.5 rounded-xl bg-[#00EBD5] hover:brightness-110 text-black font-bold text-[14px] transition-all shadow-[0_0_15px_rgba(0,235,213,0.3)]"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
