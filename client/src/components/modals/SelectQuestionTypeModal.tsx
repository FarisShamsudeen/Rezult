import { useState } from 'react';
import { X, List, CircleDot, Circle, CaseSensitive, AlignLeft, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectQuestionTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
}

export function SelectQuestionTypeModal({ isOpen, onClose, onSelect }: SelectQuestionTypeModalProps) {
  const [selectedType, setSelectedType] = useState<string>('multiple_choice');

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
              className="bg-[#12181C] border border-white/10 rounded-[24px] w-full max-w-[750px] overflow-visible shadow-2xl pointer-events-auto flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-8 pb-6 border-b border-white/5 relative">
                <div>
                  <h2 className="text-[22px] font-bold text-white mb-2 tracking-wide">Select Question Type</h2>
                  <p className="text-[14px] text-white/50 font-medium tracking-wide">Choose the format that best fits your evaluation criteria.</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Option 1: Multiple Choice */}
                <div 
                  onClick={() => setSelectedType('multiple_choice')}
                  className={`bg-[#1A2328]/50 border-2 rounded-[20px] p-6 cursor-pointer transition-all relative ${
                    selectedType === 'multiple_choice' 
                      ? 'border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] bg-gradient-to-b from-[#1A2328] to-white/5' 
                      : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-[12px] bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                      <List className="w-5 h-5" />
                    </div>
                    {selectedType === 'multiple_choice' ? (
                      <CircleDot className="w-5 h-5 text-white/80" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/20" />
                    )}
                  </div>
                  <h3 className="text-white font-bold text-[16px] mb-2 tracking-wide">Multiple Choice</h3>
                  <p className="text-[12px] text-white/50 font-medium leading-relaxed">
                    Standard format with one or more correct answers from a predefined list.
                  </p>
                </div>

                {/* Option 2: One Word */}
                <div 
                  onClick={() => setSelectedType('one_word')}
                  className={`bg-[#1A2328]/50 border-2 rounded-[20px] p-6 cursor-pointer transition-all relative ${
                    selectedType === 'one_word' 
                      ? 'border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] bg-gradient-to-b from-[#1A2328] to-white/5' 
                      : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-[12px] bg-[#00EBD5]/10 border border-[#00EBD5]/20 flex items-center justify-center text-[#00EBD5]">
                      <CaseSensitive className="w-5 h-5" />
                    </div>
                    {selectedType === 'one_word' ? (
                      <CircleDot className="w-5 h-5 text-white/80" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/20" />
                    )}
                  </div>
                  <h3 className="text-white font-bold text-[16px] mb-2 tracking-wide">One Word</h3>
                  <p className="text-[12px] text-white/50 font-medium leading-relaxed">
                    Concise answers. System will evaluate based on exact or partial string matching.
                  </p>
                </div>

                {/* Option 3: Descriptive */}
                <div 
                  onClick={() => setSelectedType('descriptive')}
                  className={`bg-[#1A2328]/50 border-2 rounded-[20px] p-6 cursor-pointer transition-all relative ${
                    selectedType === 'descriptive' 
                      ? 'border-[#F57C00] shadow-[0_0_15px_rgba(245,124,0,0.15)] bg-gradient-to-b from-[#1A2328] to-[#F57C00]/5' 
                      : 'border-[#F57C00]/30 hover:border-[#F57C00]/50'
                  }`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F57C00] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg z-10 whitespace-nowrap">
                    <Star className="w-3 h-3 fill-current" /> Premium
                  </div>
                  <div className="flex items-center justify-between mb-6 mt-1">
                    <div className="w-10 h-10 rounded-[12px] bg-[#F57C00]/10 border border-[#F57C00]/20 flex items-center justify-center text-[#F57C00]">
                      <AlignLeft className="w-5 h-5" />
                    </div>
                    {selectedType === 'descriptive' ? (
                      <CircleDot className="w-5 h-5 text-white/80" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/20" />
                    )}
                  </div>
                  <h3 className="text-white font-bold text-[16px] mb-2 tracking-wide">Descriptive</h3>
                  <p className="text-[12px] text-white/50 font-medium leading-relaxed">
                    Long-form essay answers requiring manual grading or advanced AI evaluation.
                  </p>
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
                    onSelect(selectedType);
                    onClose();
                  }}
                  className="px-8 py-2.5 rounded-xl bg-[#8BB4F6] hover:bg-[#A3C4F8] text-[#12181C] font-bold text-[14px] transition-colors shadow-[0_0_15px_rgba(139,180,246,0.2)]"
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
