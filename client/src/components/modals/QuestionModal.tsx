import { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CreateQuestionDTO } from '../../services/assessment.service';

interface QuestionModalProps {
  isOpen: boolean;
  questionType: 'mcq' | 'one_word' | 'descriptive';
  initialData?: CreateQuestionDTO | null;
  onClose: () => void;
  onSave: (question: CreateQuestionDTO) => void;
}

export function QuestionModal({ isOpen, questionType, initialData, onClose, onSave }: QuestionModalProps) {
  const [questionText, setQuestionText] = useState('');
  const [maxMarks, setMaxMarks] = useState(10);

  // MCQ state
  const [options, setOptions] = useState<{ optText: string; isAnswer: boolean; optMark: number }[]>([
    { optText: '', isAnswer: true, optMark: 10 },
    { optText: '', isAnswer: false, optMark: 0 },
  ]);

  // One Word state
  const [correctOneWordAnswer, setCorrectOneWordAnswer] = useState('');

  // Descriptive state
  const [referenceAnswer, setReferenceAnswer] = useState('');

  useEffect(() => {
    if (initialData) {
      setQuestionText(initialData.questionText || '');
      setMaxMarks(initialData.maxMarks || 10);
      if (initialData.questionType === 'mcq' && initialData.displayOptions) {
        setOptions(initialData.displayOptions.map(opt => ({
          optText: opt.optText,
          isAnswer: opt.isAnswer,
          optMark: opt.optMark ?? (opt.isAnswer ? initialData.maxMarks : 0)
        })));
      }
      if (initialData.correctOneWordAnswer) {
        setCorrectOneWordAnswer(initialData.correctOneWordAnswer);
      }
      if (initialData.referenceAnswer) {
        setReferenceAnswer(initialData.referenceAnswer);
      }
    } else {
      // Defaults for new question
      setQuestionText('');
      setMaxMarks(questionType === 'descriptive' ? 20 : 10);
      setOptions([
        { optText: '', isAnswer: true, optMark: 10 },
        { optText: '', isAnswer: false, optMark: 0 },
      ]);
      setCorrectOneWordAnswer('');
      setReferenceAnswer('');
    }
  }, [initialData, questionType, isOpen]);

  const handleAddOption = () => {
    setOptions(prev => [...prev, { optText: '', isAnswer: false, optMark: 0 }]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleOptionTextChange = (index: number, text: string) => {
    setOptions(prev => prev.map((opt, i) => i === index ? { ...opt, optText: text } : opt));
  };

  const handleToggleAnswer = (index: number) => {
    setOptions(prev => prev.map((opt, i) => {
      if (i === index) {
        const nextAnswer = !opt.isAnswer;
        return { ...opt, isAnswer: nextAnswer, optMark: nextAnswer ? maxMarks : 0 };
      }
      // If we want single-choice default:
      return { ...opt, isAnswer: false, optMark: 0 };
    }));
  };

  const handleSave = () => {
    if (!questionText.trim()) {
      alert('Please enter question text');
      return;
    }

    if (questionType === 'mcq') {
      const validOptions = options.filter(o => o.optText.trim() !== '');
      if (validOptions.length < 2) {
        alert('Please provide at least 2 non-empty options');
        return;
      }
      if (!validOptions.some(o => o.isAnswer)) {
        alert('Please select at least one correct option');
        return;
      }

      onSave({
        questionType: 'mcq',
        questionText: questionText.trim(),
        maxMarks: Number(maxMarks) || 10,
        displayOptions: validOptions.map(o => ({
          optText: o.optText.trim(),
          isAnswer: o.isAnswer,
          optMark: o.isAnswer ? Number(maxMarks) || 10 : 0
        }))
      });
    } else if (questionType === 'one_word') {
      if (!correctOneWordAnswer.trim()) {
        alert('Please enter the accepted one-word answer');
        return;
      }
      onSave({
        questionType: 'one_word',
        questionText: questionText.trim(),
        maxMarks: Number(maxMarks) || 10,
        correctOneWordAnswer: correctOneWordAnswer.trim().toUpperCase()
      });
    } else {
      // descriptive
      onSave({
        questionType: 'descriptive',
        questionText: questionText.trim(),
        maxMarks: Number(maxMarks) || 20,
        referenceAnswer: referenceAnswer.trim() || undefined
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#12181C] border border-white/10 rounded-[28px] w-full max-w-[700px] max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col custom-scrollbar"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 sticky top-0 bg-[#12181C] z-10">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#00EBD5]">
                {questionType.replace('_', ' ')}
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {initialData ? 'Edit Question' : 'Add New Question'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 flex flex-col gap-6">
            {/* Marks & Type Info */}
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-semibold text-white/70">
                Points / Maximum Marks
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={maxMarks}
                  onChange={(e) => setMaxMarks(Number(e.target.value))}
                  className="w-24 bg-[#1A2328] border border-white/10 rounded-xl px-4 py-2 text-white text-center font-bold outline-none focus:border-[#00EBD5]"
                />
                <span className="text-xs text-white/40 font-bold uppercase">PTS</span>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                Question Statement
              </label>
              <textarea
                rows={4}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Type your question prompt here..."
                className="w-full bg-[#1A2328] border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-[#00EBD5] transition-colors leading-relaxed placeholder:text-white/20 font-medium"
              />
            </div>

            {/* MCQ Options */}
            {questionType === 'mcq' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-white/60">
                    Options & Answer Key
                  </label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#00EBD5] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Option
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                        opt.isAnswer
                          ? 'bg-[#00EBD5]/10 border-[#00EBD5]'
                          : 'bg-[#1A2328] border-white/5'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleAnswer(idx)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          opt.isAnswer
                            ? 'bg-[#00EBD5] text-black'
                            : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                        title={opt.isAnswer ? 'Correct answer' : 'Mark as correct'}
                      >
                        {String.fromCharCode(65 + idx)}
                      </button>

                      <input
                        type="text"
                        value={opt.optText}
                        onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                        className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/20 font-medium"
                      />

                      {opt.isAnswer && (
                        <div className="flex items-center gap-1 text-[#00EBD5] text-xs font-bold px-2 py-1 bg-[#00EBD5]/20 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </div>
                      )}

                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="text-white/30 hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* One Word Answer */}
            {questionType === 'one_word' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                  Correct Answer (Case-insensitive)
                </label>
                <input
                  type="text"
                  value={correctOneWordAnswer}
                  onChange={(e) => setCorrectOneWordAnswer(e.target.value)}
                  placeholder="e.g. PRIMARY KEY"
                  className="w-full bg-[#1A2328] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#00EBD5] font-semibold uppercase"
                />
              </div>
            )}

            {/* Descriptive Reference Answer */}
            {questionType === 'descriptive' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
                  Reference Answer / Rubric (Optional)
                </label>
                <textarea
                  rows={4}
                  value={referenceAnswer}
                  onChange={(e) => setReferenceAnswer(e.target.value)}
                  placeholder="Outline key points or reference text used for evaluation..."
                  className="w-full bg-[#1A2328] border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-[#00EBD5] font-medium placeholder:text-white/20"
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-white/5 flex items-center justify-end gap-3 bg-[#12181C] sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full border border-white/10 text-white/70 hover:bg-white/5 font-bold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-8 py-2.5 rounded-full bg-[#00EBD5] hover:brightness-110 text-black font-bold text-sm transition-all shadow-[0_0_15px_rgba(0,235,213,0.3)]"
            >
              Save Question
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
