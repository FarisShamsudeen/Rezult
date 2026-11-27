import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Users, Award, CheckCircle, 
  Trash2, Copy, Check, FileText
} from 'lucide-react';
import { assessmentService } from '../../services/assessment.service';

export function RezulterAssessmentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadDetails();
  }, [id]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const res = await assessmentService.getAssessmentDetailsForRezulter(id!);
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load assessment details');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (!data?.assessment?.inviteToken) return;
    navigator.clipboard.writeText(data.assessment.inviteToken);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to permanently delete this assessment and its candidate responses?');
    if (!confirm || !id) return;

    try {
      setIsDeleting(true);
      await assessmentService.deleteAssessment(id);
      navigate('/assessments');
    } catch (err: any) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to delete assessment');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
        <div className="w-10 h-10 border-4 border-[#00EBD5] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white/60 font-medium">Loading assessment details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Error Loading Assessment</h2>
        <p className="text-white/60 mb-6">{error || 'Assessment not found'}</p>
        <button
          onClick={() => navigate('/assessments')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assessments
        </button>
      </div>
    );
  }

  const { assessment, questions, stats, results } = data;

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto h-full overflow-y-auto pr-4 custom-scrollbar pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/assessments')}
          className="flex items-center gap-2 text-white/60 hover:text-white font-medium text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assessments
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all border border-white/5"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-[#00EBD5]" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCode ? 'Code Copied!' : `Code: ${assessment.inviteToken}`}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all border border-red-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? 'Deleting...' : 'Delete Exam'}
          </button>
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="bg-[#12181C] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 mb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                assessment.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {assessment.status}
              </span>
              <span className="text-white/40 text-xs font-semibold">
                Created on {new Date(assessment.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-white">{assessment.title}</h1>
            <p className="text-white/60 text-sm mt-1">{assessment.description || 'No description provided'}</p>
          </div>

          <div className="flex items-center gap-6 bg-[#1A2328] p-4 rounded-2xl border border-white/5 shrink-0">
            <div className="flex flex-col items-center">
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Duration</span>
              <span className="text-white text-xl font-bold flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#00EBD5]" /> {assessment.durationInMinutes}m
              </span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Pass Mark</span>
              <span className="text-[#00EBD5] text-xl font-bold">40%</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1A2328] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/40 text-xs font-bold uppercase">Submissions</span>
              <Users className="w-4 h-4 text-white/40" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.totalSubmissions}</span>
          </div>

          <div className="bg-[#1A2328] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/40 text-xs font-bold uppercase">Pass Rate</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold text-emerald-400">{stats.passRate}%</span>
          </div>

          <div className="bg-[#1A2328] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/40 text-xs font-bold uppercase">Avg. Score</span>
              <CheckCircle className="w-4 h-4 text-[#00EBD5]" />
            </div>
            <span className="text-2xl font-bold text-[#00EBD5]">{stats.avgScore} pts</span>
          </div>

          <div className="bg-[#1A2328] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/40 text-xs font-bold uppercase">Questions</span>
              <FileText className="w-4 h-4 text-white/40" />
            </div>
            <span className="text-2xl font-bold text-white">{questions.length}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Candidates Submissions + Questions Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        {/* Candidates Submissions Table */}
        <div className="bg-[#12181C] border border-white/5 rounded-3xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4">Candidate Submissions ({results.length})</h3>

          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/40 text-center">
              <Users className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm font-medium">No candidate has submitted this assessment yet.</p>
              <p className="text-xs text-white/30 mt-1">Share the invite code <strong className="text-white">{assessment.inviteToken}</strong> with your students.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 uppercase text-[11px] font-bold">
                    <th className="pb-3 px-3">Candidate</th>
                    <th className="pb-3 px-3">Score</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {results.map((r: any) => (
                    <tr key={r._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{r.candidateName}</span>
                          <span className="text-xs text-white/40">{r.candidateEmail}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        {r.score}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          r.status === 'PASSED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-xs text-white/50">
                        {new Date(r.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Questions Inspection Column */}
        <div className="bg-[#12181C] border border-white/5 rounded-3xl p-6 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white mb-2">Question Bank ({questions.length})</h3>

          <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {questions.map((q: any, i: number) => (
              <div key={q._id || i} className="bg-[#1A2328] border border-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-extrabold text-[#00EBD5]">
                    Q{i + 1} • {q.questionType.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-white/50">{q.maxMarks} PTS</span>
                </div>
                <p className="text-white text-sm font-medium leading-relaxed">{q.questionText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
