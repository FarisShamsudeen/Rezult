import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentService, type AssessmentForTakingResponse } from '../../services/assessment.service';
import { Clock, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Send, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export function TakeAssessment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<AssessmentForTakingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Active question index
  const [currentIdx, setCurrentIdx] = useState(0);

  // Candidate answers: map of questionId -> answers
  const [answers, setAnswers] = useState<Record<string, {
    mcq: string[];
    oneWord: string;
    descriptive: string;
  }>>({});

  // Timer in seconds
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!id) return;

    const loadAssessment = async () => {
      try {
        setLoading(true);
        const res = await assessmentService.getForTaking(id);
        if (res.data.alreadySubmitted) {
          navigate(`/assessments/${id}/result`, { replace: true });
          return;
        }

        setData(res.data);
        const totalSeconds = (res.data.assessment.durationInMinutes || 30) * 60;
        setTimeLeft(totalSeconds);

        // Pre-initialize answer state
        const initialAnswers: Record<string, { mcq: string[]; oneWord: string; descriptive: string }> = {};
        res.data.questions.forEach((q) => {
          initialAnswers[q._id] = { mcq: [], oneWord: '', descriptive: '' };
        });
        setAnswers(initialAnswers);
      } catch (err: any) {
        setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to load assessment');
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [id, navigate]);

  // Anti-cheat: Tab-switching detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => {
          const updated = prev + 1;
          setShowWarning(true);
          return updated;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Timer Countdown
  useEffect(() => {
    if (loading || !data || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, data]);

  const handleAutoSubmit = () => {
    handleSubmit(true);
  };

  const handleSelectMCQ = (qId: string, optText: string) => {
    setAnswers((prev) => {
      const currentMCQ = prev[qId]?.mcq || [];
      const isSelected = currentMCQ.includes(optText);
      const updatedMCQ = isSelected
        ? currentMCQ.filter((t) => t !== optText)
        : [...currentMCQ, optText];

      return {
        ...prev,
        [qId]: {
          ...prev[qId],
          mcq: updatedMCQ,
        },
      };
    });
  };

  const handleOneWordChange = (qId: string, val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        oneWord: val,
      },
    }));
  };

  const handleDescriptiveChange = (qId: string, val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        descriptive: val,
      },
    }));
  };

  const handleSubmit = async (isAuto = false) => {
    if (!id || !data || submitting) return;

    if (!isAuto) {
      const confirm = window.confirm('Are you sure you want to finish and submit your assessment?');
      if (!confirm) return;
    }

    try {
      setSubmitting(true);
      const payloadAnswers = data.questions.map((q) => {
        const ans = answers[q._id];
        return {
          questionId: q._id,
          questionType: q.questionType,
          userMCQAnswer: ans?.mcq || [],
          userOneWordAnswer: ans?.oneWord || undefined,
          userDescriptiveAnswer: ans?.descriptive || undefined,
        };
      });

      await assessmentService.submitAssessment(id, {
        answers: payloadAnswers,
        timeSpentSeconds: (data.assessment.durationInMinutes * 60) - timeLeft,
      });

      navigate(`/assessments/${id}/result`, { replace: true });
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to submit assessment. Please try again.');
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-white">
        <div className="w-12 h-12 border-4 border-[#00EBD5] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white/60 font-medium">Preparing test environment...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-white p-6">
        <AlertTriangle className="w-14 h-14 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Assessment</h2>
        <p className="text-white/60 mb-6 text-center max-w-md">{error || 'Unknown error occurred'}</p>
        <button
          onClick={() => navigate('/assessments')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Exams
        </button>
      </div>
    );
  }

  const currentQ = data.questions[currentIdx];
  const isLastQuestion = currentIdx === data.questions.length - 1;
  const currentAnswer = answers[currentQ._id] || { mcq: [], oneWord: '', descriptive: '' };

  const isAnswered = (qId: string) => {
    const ans = answers[qId];
    if (!ans) return false;
    return ans.mcq.length > 0 || ans.oneWord.trim().length > 0 || ans.descriptive.trim().length > 0;
  };

  const answeredCount = Object.keys(answers).filter(isAnswered).length;

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col h-full overflow-y-auto pr-4 pb-12 custom-scrollbar">
      {/* Anti-cheat Alert Banner */}
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/20 border border-amber-500/50 rounded-2xl p-4 mb-6 flex items-center justify-between text-amber-200"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-sm font-medium">
              Warning: Tab switch detected ({tabSwitches} times). Navigating away from the exam tab is logged for academic integrity.
            </span>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            className="text-xs font-bold underline ml-4 hover:text-white"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Top Header Bar */}
      <header className="bg-[#0A0D14] border border-white/5 rounded-[24px] p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#00EBD5]">Active Assessment</span>
          <h1 className="text-2xl font-bold text-white">{data.assessment.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Answered progress */}
          <div className="bg-[#13111C] border border-white/5 rounded-full px-4 py-2 text-xs font-semibold text-white/70">
            Answered: <span className="text-[#00EBD5]">{answeredCount}</span> / {data.questions.length}
          </div>

          {/* Countdown Clock */}
          <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono font-bold text-lg border transition-all ${
            timeLeft < 300 
              ? 'bg-red-500/10 text-red-400 border-red-500/40 animate-pulse'
              : 'bg-[#13111C] text-[#00EBD5] border-[#00EBD5]/30 shadow-[0_0_15px_rgba(0,235,213,0.15)]'
          }`}>
            <Clock className="w-5 h-5" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Active Question */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="bg-[#0A0D14] border border-white/5 rounded-[32px] p-8 min-h-[460px] flex flex-col justify-between shadow-2xl relative">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <span className="text-sm font-semibold text-white/50">
                  Question <span className="text-white text-lg font-bold">{currentIdx + 1}</span> of {data.questions.length}
                </span>
                <span className="bg-[#13111C] border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-white/80">
                  {currentQ.maxMarks} {currentQ.maxMarks === 1 ? 'Mark' : 'Marks'}
                </span>
              </div>

              <h2 className="text-xl font-medium text-white mb-8 leading-relaxed">
                {currentQ.questionText}
              </h2>

              {/* MCQ Options */}
              {currentQ.questionType === 'mcq' && currentQ.displayOptions && (
                <div className="flex flex-col gap-3 mb-6">
                  {currentQ.displayOptions.map((opt, i) => {
                    const isSelected = currentAnswer.mcq.includes(opt.optText);
                    const letter = String.fromCharCode(65 + i);

                    return (
                      <button
                        key={opt._id || i}
                        type="button"
                        onClick={() => handleSelectMCQ(currentQ._id, opt.optText)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#00EBD5]/10 border-[#00EBD5] shadow-[0_0_20px_rgba(0,235,213,0.2)]'
                            : 'bg-[#13111C] border-white/5 hover:border-white/20 text-white/90'
                        }`}
                      >
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${
                          isSelected
                            ? 'bg-[#00EBD5] text-black border-[#00EBD5]'
                            : 'bg-white/5 text-white/60 border-white/10'
                        }`}>
                          {letter}
                        </span>
                        <span className="font-medium text-[15px]">{opt.optText}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* One Word Answer */}
              {currentQ.questionType === 'one_word' && (
                <div className="mb-6">
                  <label className="text-xs text-white/50 mb-2 block font-medium">Your Answer (Case-insensitive)</label>
                  <input
                    type="text"
                    value={currentAnswer.oneWord}
                    onChange={(e) => handleOneWordChange(currentQ._id, e.target.value)}
                    placeholder="Type your single-word or short answer here..."
                    className="w-full bg-[#13111C] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#00EBD5] transition-colors font-medium"
                  />
                </div>
              )}

              {/* Descriptive Answer */}
              {currentQ.questionType === 'descriptive' && (
                <div className="mb-6">
                  <label className="text-xs text-white/50 mb-2 block font-medium">Your Detailed Explanation</label>
                  <textarea
                    rows={5}
                    value={currentAnswer.descriptive}
                    onChange={(e) => handleDescriptiveChange(currentQ._id, e.target.value)}
                    placeholder="Type your explanation or descriptive answer..."
                    className="w-full bg-[#13111C] border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#00EBD5] transition-colors font-medium"
                  />
                </div>
              )}
            </div>

            {/* Navigation Bottom Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-6">
              <button
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => i - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-white font-medium hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {isLastQuestion ? (
                <button
                  disabled={submitting}
                  onClick={() => handleSubmit(false)}
                  className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-[#00EBD5] to-[#0072FF] text-black font-bold hover:shadow-[0_0_25px_rgba(0,235,213,0.4)] transition-all"
                >
                  <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Exam'}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIdx((i) => i + 1)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold hover:bg-[#00EBD5] transition-all"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette & Submission */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-[#0A0D14] border border-white/5 rounded-[32px] p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Question Palette</h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2 mb-6">
              {data.questions.map((q, idx) => {
                const answered = isAnswered(q._id);
                const isCurrent = idx === currentIdx;

                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-xl font-bold text-sm transition-all flex items-center justify-center border ${
                      isCurrent
                        ? 'border-[#00EBD5] text-[#00EBD5] bg-[#00EBD5]/10 shadow-[0_0_10px_rgba(0,235,213,0.3)]'
                        : answered
                        ? 'bg-gradient-to-br from-[#00EBD5] to-[#0072FF] text-black border-transparent'
                        : 'bg-[#13111C] border-white/5 text-white/50 hover:border-white/20'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 text-xs text-white/50 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-br from-[#00EBD5] to-[#0072FF]" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#00EBD5]/20 border border-[#00EBD5]" />
                <span>Current Question</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#13111C] border border-white/10" />
                <span>Unanswered</span>
              </div>
            </div>

            <button
              disabled={submitting}
              onClick={() => handleSubmit(false)}
              className="w-full mt-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-[#00EBD5]" /> Finish & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
