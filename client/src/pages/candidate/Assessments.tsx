import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Search, Calendar, Clock, RefreshCw, CheckCircle, Play, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { assessmentService, type CandidateAssessmentItem } from '../../services/assessment.service';

export function Assessments() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<CandidateAssessmentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const res = await assessmentService.getCandidateAssessments();
      setAssessments(res.data || []);
    } catch (err: any) {
      console.error('Failed to load candidate assessments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const handleJoinByCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    try {
      setJoining(true);
      setJoinError(null);
      const res = await assessmentService.joinByToken(joinCode.trim());
      if (res.data?._id) {
        navigate(`/assessments/${res.data._id}/take`);
      }
    } catch (err: any) {
      setJoinError(err.response?.data?.error || err.response?.data?.message || 'Invalid assessment code or token');
    } finally {
      setJoining(false);
    }
  };

  const filteredAssessments = assessments.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.rezulter && a.rezulter.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto h-full overflow-y-auto pr-8 custom-scrollbar pb-8">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-wide">
            My Exams
          </h1>
          <p className="text-white/50 text-sm font-medium">Manage your schedule and access your assessments</p>
        </div>

        {/* Join by Code Form */}
        <form onSubmit={handleJoinByCode} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="flex items-center gap-2 bg-[#0A0D14] border border-white/5 rounded-[40px] pl-6 pr-2 py-1.5 focus-within:border-[#00EBD5]/50 transition-all">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter exam code (e.g. A3F8B2)"
              className="bg-transparent text-sm text-white outline-none w-56 placeholder:text-white/30 font-medium uppercase"
            />
            <button
              type="submit"
              disabled={joining || !joinCode.trim()}
              className="text-white text-sm font-medium hover:text-[#00EBD5] transition-colors px-4 py-2 rounded-full hover:bg-white/5 disabled:opacity-40"
            >
              {joining ? 'Joining...' : 'Join'}
            </button>
          </div>
          {joinError && (
            <span className="text-xs text-red-400 mt-1 block">{joinError}</span>
          )}
        </form>
      </header>

      {/* Search Bar */}
      <div className="bg-[#0A0D14] border border-white/5 rounded-[32px] p-4 flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Exams by topic or rezulter..."
            className="w-full bg-[#13111C] border border-white/5 text-white placeholder:text-white/40 text-[15px] font-medium rounded-full py-4 pl-14 pr-6 outline-none focus:border-[#00EBD5]/50 transition-colors"
          />
        </div>

        <button
          onClick={loadAssessments}
          className="bg-[#13111C] border border-white/5 hover:bg-white/5 transition-colors text-white rounded-full p-4 flex items-center justify-center shrink-0"
          title="Refresh exams list"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-white/50">
          <div className="w-10 h-10 border-4 border-[#00EBD5] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Fetching assessments...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAssessments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0A0D14] border border-white/5 rounded-[32px] text-center p-8">
          <AlertCircle className="w-12 h-12 text-white/30 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Assessments Available</h3>
          <p className="text-sm text-white/50 max-w-sm mb-4">
            {searchTerm ? 'No exams match your search criteria.' : 'There are no active exams published right now. Ask your Rezulter for an invitation code.'}
          </p>
        </div>
      )}

      {/* Exam Cards Grid */}
      {!loading && filteredAssessments.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredAssessments.map((exam) => {
            const hasAttempted = exam.hasAttempted;

            return (
              <div
                key={exam._id}
                className={`rounded-[28px] p-8 flex flex-col justify-between relative overflow-hidden transition-all border ${
                  hasAttempted
                    ? 'bg-[#0A0D14] border-white/10 hover:border-white/20'
                    : 'bg-gradient-to-r from-[#00EBD5] to-[#0072FF] border-transparent shadow-[0_0_30px_rgba(0,242,254,0.25)]'
                }`}
              >
                {/* Highlight banner for active exam */}
                {!hasAttempted && (
                  <div className="absolute top-0 inset-x-0 h-3 bg-white/20" />
                )}

                <div className="flex justify-between items-start z-10 mb-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full ${
                        hasAttempted 
                          ? 'bg-white/10 text-white/60' 
                          : 'bg-black/20 text-white'
                      }`}>
                        Code: {exam.inviteToken}
                      </span>
                      {hasAttempted && (
                        <span className={`text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full ${
                          exam.resultStatus === 'PASSED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {exam.resultStatus}: {exam.score} Marks
                        </span>
                      )}
                    </div>

                    <h2 className={`text-2xl font-bold tracking-wide leading-tight mt-2 ${
                      hasAttempted ? 'text-white' : 'text-white'
                    }`}>
                      {exam.title}
                    </h2>
                    <p className={`text-sm font-medium line-clamp-2 ${
                      hasAttempted ? 'text-white/50' : 'text-white/80'
                    }`}>
                      {exam.description || `Created by ${exam.rezulter}`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-white/10 z-10">
                  <div className={`flex items-center gap-6 text-xs font-bold ${
                    hasAttempted ? 'text-white/60' : 'text-white'
                  }`}>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {exam.durationInMinutes} Mins Duration
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(exam.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {hasAttempted ? (
                    <button
                      onClick={() => navigate(`/assessments/${exam._id}/result`)}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all shrink-0"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> View Result
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/assessments/${exam._id}/take`)}
                      className="flex items-center gap-2 px-8 py-2.5 rounded-full border-2 border-white text-white font-bold text-sm hover:bg-white hover:text-[#0072FF] transition-all shrink-0 shadow-lg"
                    >
                      <Play className="w-4 h-4 fill-current" /> Start Exam
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
