import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentService, type AssessmentResultBreakdown } from '../../services/assessment.service';
import { XCircle, ArrowLeft, Check, X, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function AssessmentResult() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AssessmentResultBreakdown | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await assessmentService.getResult(id);
        setResult(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to load assessment result');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-white">
        <div className="w-12 h-12 border-4 border-[#00EBD5] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white/60 font-medium">Calculating score and loading breakdown...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-white p-6">
        <XCircle className="w-14 h-14 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Result Unavailable</h2>
        <p className="text-white/60 mb-6 text-center max-w-md">{error || 'Could not fetch your result'}</p>
        <button
          onClick={() => navigate('/assessments')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Exams
        </button>
      </div>
    );
  }

  if (result.isImmediateResult === false) {
    return (
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-white p-6 text-center">
        <div className="bg-[#0A0D14] border border-white/5 rounded-[36px] p-10 md:p-12 shadow-2xl w-full flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-amber-400" />
          </div>
          <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-4 bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Results Pending Release
          </span>
          <h1 className="text-3xl font-extrabold text-white mb-2">{result.assessmentTitle}</h1>
          <p className="text-white/60 text-sm max-w-md mb-4">
            Your submission was recorded on {new Date(result.submittedAt).toLocaleDateString()} at{' '}
            {new Date(result.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
            Immediate results are disabled for this assessment — your score and review will be available once released by the Rezulter.
          </p>
          <button
            onClick={() => navigate('/assessments')}
            className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Exams
          </button>
        </div>
      </div>
    );
  }

  const isPassed = result.status === 'PASSED';

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-full overflow-y-auto pr-4 pb-12 custom-scrollbar">
      {/* Top Navigation */}
      <button
        onClick={() => navigate('/assessments')}
        className="flex items-center gap-2 text-white/60 hover:text-white font-medium text-sm mb-6 w-fit transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Exams
      </button>

      {/* Main Score Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0A0D14] border border-white/5 rounded-[36px] p-8 md:p-12 mb-10 shadow-2xl relative overflow-hidden"
      >
        <div className={`absolute top-0 inset-x-0 h-3 ${
          isPassed ? 'bg-gradient-to-r from-[#00EBD5] to-[#0072FF]' : 'bg-red-500'
        }`} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-3 ${
              isPassed 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'bg-red-500/10 text-red-400 border border-red-500/30'
            }`}>
              {result.status}
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              {result.assessmentTitle}
            </h1>
            <p className="text-white/50 text-sm font-medium">
              Completed on {new Date(result.submittedAt).toLocaleDateString()} at {new Date(result.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Circular Score Badge */}
          <div className="flex flex-col items-center">
            <div className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl relative ${
              isPassed 
                ? 'border-[#00EBD5] bg-[#00EBD5]/10 shadow-[0_0_30px_rgba(0,235,213,0.3)]' 
                : 'border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
            }`}>
              <span className="text-4xl font-black text-white">{result.percentage}%</span>
              <span className="text-xs font-bold text-white/60 mt-1">
                {result.score} / {result.totalPossibleMarks} Marks
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/5">
          <div className="bg-[#13111C] p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-white/50 font-medium block mb-1">Total Score</span>
            <span className="text-xl font-bold text-white">{result.score}</span>
          </div>
          <div className="bg-[#13111C] p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-white/50 font-medium block mb-1">Max Marks</span>
            <span className="text-xl font-bold text-white">{result.totalPossibleMarks}</span>
          </div>
          <div className="bg-[#13111C] p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-white/50 font-medium block mb-1">Accuracy</span>
            <span className={`text-xl font-bold ${isPassed ? 'text-[#00EBD5]' : 'text-red-400'}`}>
              {result.percentage}%
            </span>
          </div>
          <div className="bg-[#13111C] p-4 rounded-2xl border border-white/5">
            <span className="text-xs text-white/50 font-medium block mb-1">Status</span>
            <span className={`text-xl font-bold ${isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
              {result.status}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Question by Question Review Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Detailed Question Review</h2>
          <p className="text-white/50 text-sm">Review your selected answers and the correct solutions.</p>
        </div>
      </div>

      {/* Review List */}
      <div className="flex flex-col gap-6">
        {result.review.map((item, idx) => {
          const isCorrect = item.earnedMarks > 0;

          return (
            <div
              key={item.questionId || idx}
              className="bg-[#0A0D14] border border-white/5 rounded-[28px] p-6 md:p-8 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <span className="text-xs uppercase font-bold tracking-wider text-white/40">
                  Question {idx + 1}
                </span>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    isCorrect 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    {item.earnedMarks} / {item.maxMarks} Marks
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-medium text-white mb-6 leading-relaxed">
                {item.questionText}
              </h3>

              {/* MCQ Review */}
              {item.questionType === 'mcq' && item.options && (
                <div className="flex flex-col gap-3">
                  {item.options.map((opt, i) => {
                    const isUserSelected = (item.userMCQAnswer || []).includes(opt.optText);
                    const isCorrectOpt = opt.isCorrect;

                    let cardStyle = 'bg-[#13111C] border-white/5 text-white/70';
                    if (isCorrectOpt) {
                      cardStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200';
                    } else if (isUserSelected && !isCorrectOpt) {
                      cardStyle = 'bg-red-500/10 border-red-500/40 text-red-200';
                    }

                    return (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border flex items-center justify-between text-sm font-medium ${cardStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold opacity-60">{String.fromCharCode(65 + i)}.</span>
                          <span>{opt.optText}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isUserSelected && (
                            <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-white">
                              Your Choice
                            </span>
                          )}
                          {isCorrectOpt && (
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full font-bold">
                              Correct Solution
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* One Word Review */}
              {item.questionType === 'one_word' && (
                <div className="space-y-3 bg-[#13111C] p-5 rounded-2xl border border-white/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs text-white/50 font-medium">Your Submitted Answer:</span>
                    <span className={`text-sm font-bold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.userOneWordAnswer || '(No answer provided)'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5">
                    <span className="text-xs text-white/50 font-medium">Accepted Answer:</span>
                    <span className="text-sm font-bold text-[#00EBD5]">
                      {item.correctOneWordAnswer || 'N/A'}
                    </span>
                  </div>
                </div>
              )}

              {/* Descriptive Review */}
              {item.questionType === 'descriptive' && (
                <div className="space-y-3 bg-[#13111C] p-5 rounded-2xl border border-white/5">
                  <div>
                    <span className="text-xs text-white/50 font-medium block mb-1">Your Submitted Response:</span>
                    <p className="text-sm text-white/90 whitespace-pre-wrap">
                      {item.userDescriptiveAnswer || '(No response submitted)'}
                    </p>
                  </div>
                  {item.referenceAnswer && (
                    <div className="pt-3 border-t border-white/5">
                      <span className="text-xs text-[#00EBD5] font-medium block mb-1">Reference Answer:</span>
                      <p className="text-sm text-white/70 whitespace-pre-wrap">{item.referenceAnswer}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
