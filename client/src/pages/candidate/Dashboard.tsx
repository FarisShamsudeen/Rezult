import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Calculator, Check, AlertCircle, LayoutDashboard, FileText, Building2, Calendar, MessageSquareWarning, User, LogOut, ArrowRight, Play } from 'lucide-react';
import { LogoutModal } from '../../components/modals/LogoutModal';
import { assessmentService, type CandidateAssessmentItem } from '../../services/assessment.service';

export function CandidateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<CandidateAssessmentItem[]>([]);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await assessmentService.getCandidateAssessments();
        setAssessments(res.data || []);
      } catch (err) {
        console.error('Failed to load candidate dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    try {
      setJoinError(null);
      const res = await assessmentService.joinByToken(joinCode.trim());
      if (res.data?._id) {
        navigate(`/assessments/${res.data._id}/take`);
      }
    } catch (err: any) {
      setJoinError(err.response?.data?.error || err.response?.data?.message || 'Invalid assessment code');
    }
  };

  const upcomingAssessments = assessments.filter(a => !a.hasAttempted);
  const attemptedAssessments = assessments.filter(a => a.hasAttempted);

  return (
    <div className="flex flex-col gap-10 w-full max-w-[1400px] mx-auto h-full overflow-y-auto pb-8 pr-8 custom-scrollbar">

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-white mb-1">
            Welcome back, <span className="text-[#00EBD5]">{user?.name || 'User'}</span>
          </h1>
          <p className="text-white/40 text-[13px] font-medium">Ready to attend your assessments today?</p>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-white hover:text-[#00EBD5] transition-colors relative mt-1">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border-2 border-[#050505]"></span>
          </button>

          <form onSubmit={handleJoin} className="flex flex-col items-end">
            <div className="flex items-center gap-3 bg-[#0A0D14] border border-white/5 rounded-full px-5 py-1.5 focus-within:border-[#00EBD5]/40 transition-all">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter exam code"
                className="bg-transparent text-[13px] text-white outline-none w-44 placeholder:text-white/30 font-medium uppercase"
              />
              <button
                type="submit"
                disabled={!joinCode.trim()}
                className="text-white text-[13px] font-medium hover:text-[#00EBD5] transition-colors disabled:opacity-30"
              >
                Join
              </button>
            </div>
            {joinError && <span className="text-[11px] text-red-400 mt-1">{joinError}</span>}
          </form>
        </div>
      </header>

      {/* Upcoming Assessments */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-5 bg-white/80 rounded-full"></div>
            <h2 className="text-[22px] font-bold text-white tracking-wide">Available Assessments</h2>
          </div>
          <button 
            onClick={() => navigate('/assessments')} 
            className="text-[#00EBD5] text-[13px] font-bold hover:underline underline-offset-4 tracking-wide flex items-center gap-1"
          >
            View All Exams &rarr;
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center text-white/40">
            <div className="w-8 h-8 border-3 border-[#00EBD5] border-t-transparent rounded-full animate-spin mr-3" />
            Loading assessments...
          </div>
        ) : upcomingAssessments.length === 0 ? (
          <div className="bg-[#080B12] border border-white/5 rounded-[30.5px] p-8 text-center text-white/50">
            <p className="font-medium">No pending assessments right now. You're completely up to date!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {upcomingAssessments.slice(0, 3).map((assessment) => (
              <div
                key={assessment._id}
                className="rounded-[32px] p-[1.5px] bg-gradient-to-r from-[#00EBD5] to-[#0072FF] shadow-[0_0_25px_rgba(0,235,213,0.15)]"
              >
                <div className="bg-[#080B12] rounded-[30.5px] px-8 py-6 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                  {/* Left: Icon & Title */}
                  <div className="flex items-center gap-6">
                    <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#00EBD5] to-[#0072FF] flex items-center justify-center shrink-0">
                      <Calculator className="w-6 h-6 text-[#050505]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-[22px] font-bold text-white tracking-wide">{assessment.title}</h3>
                      <div className="flex items-center gap-2 text-white/50 text-[15px] font-medium">
                        <span>Rezulter: {assessment.rezulter}</span>
                        <span className="text-white/20">•</span>
                        <span className="text-[#00EBD5] font-mono text-xs">Code: {assessment.inviteToken}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status, Time, Button */}
                  <div className="flex flex-col md:flex-row md:items-center gap-8 xl:gap-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-[180px] py-1.5 rounded-full border border-[#00EBD5]/40 flex items-center justify-center text-[#00EBD5] text-[12px] font-bold tracking-widest uppercase">
                        ACTIVE
                      </div>
                      <div className="flex items-center gap-6 text-white/40 text-[13px] font-medium">
                        <span>{assessment.durationInMinutes} Minutes Duration</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/assessments/${assessment._id}/take`)}
                      className="px-8 py-3 rounded-[40px] bg-gradient-to-r from-[#00EBD5] to-[#0072FF] text-[#050505] font-bold text-[15px] hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,235,213,0.3)] shrink-0 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" /> Start Exam
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Grids */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-8 mt-2">
        {/* Exam History */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-[3px] h-5 bg-white/80 rounded-full"></div>
              <h2 className="text-[22px] font-bold text-white tracking-wide">Exam History</h2>
            </div>
            <button
              onClick={() => navigate('/assessments')}
              className="text-[#00EBD5] text-[13px] font-bold hover:underline underline-offset-4 tracking-wide"
            >
              View History &rarr;
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {attemptedAssessments.length === 0 ? (
              <div className="bg-[#080B12] border border-white/5 rounded-2xl p-6 text-center text-white/40 text-sm">
                No exams completed yet. Take your first test!
              </div>
            ) : (
              attemptedAssessments.slice(0, 4).map((history) => (
                <div
                  key={history._id}
                  onClick={() => navigate(`/assessments/${history._id}/result`)}
                  className="bg-[#080B12] border border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-white/20 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-[46px] h-[46px] rounded-xl flex items-center justify-center border ${
                      history.resultStatus === 'PASSED'
                        ? 'bg-[#00FF87]/5 border-[#00FF87]/20 text-[#00FF87]'
                        : 'bg-[#FF9500]/5 border-[#FF9500]/20 text-[#FF9500]'
                    }`}>
                      {history.resultStatus === 'PASSED' ? <Check className="w-[22px] h-[22px]" /> : <AlertCircle className="w-[22px] h-[22px]" />}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-white font-bold text-[15px]">{history.title}</h4>
                      <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase">
                        {history.submittedAt ? new Date(history.submittedAt).toLocaleDateString() : 'COMPLETED'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[17px] font-bold ${
                      history.resultStatus === 'PASSED' ? 'text-[#00FF87]' : 'text-[#FF9500]'
                    }`}>
                      {history.score} Marks
                    </span>
                    <ArrowRight className="w-4 h-4 text-white/30" />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Overall Accuracy / Stats */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-[3px] h-5 bg-white/80 rounded-full"></div>
              <h2 className="text-[22px] font-bold text-white tracking-wide">Performance Overview</h2>
            </div>
          </div>

          <div className="bg-[#080B12] border border-white/5 rounded-[32px] p-8 h-[280px] flex flex-col justify-around relative">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#13111C] p-4 rounded-2xl border border-white/5 text-center">
                <span className="text-xs text-white/50 block mb-1">Total Exams</span>
                <span className="text-2xl font-bold text-white">{assessments.length}</span>
              </div>
              <div className="bg-[#13111C] p-4 rounded-2xl border border-white/5 text-center">
                <span className="text-xs text-white/50 block mb-1">Completed</span>
                <span className="text-2xl font-bold text-[#00EBD5]">{attemptedAssessments.length}</span>
              </div>
              <div className="bg-[#13111C] p-4 rounded-2xl border border-white/5 text-center">
                <span className="text-xs text-white/50 block mb-1">Passed</span>
                <span className="text-2xl font-bold text-[#00FF87]">
                  {attemptedAssessments.filter(a => a.resultStatus === 'PASSED').length}
                </span>
              </div>
            </div>

            <p className="text-xs text-white/40 text-center mt-4">
              Continuous assessment tracking enables detailed proficiency indexing across modules.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export function CandidateLayout() {
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    await logout();
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/assessments', label: 'My Exams', icon: FileText },
    { to: '/rezulters', label: 'Rezulters', icon: Building2 },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/concerns', label: 'Concerns', icon: MessageSquareWarning },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col justify-between p-6 shrink-0 z-20 bg-[#050505]">
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00EBD5] to-[#0072FF] flex items-center justify-center font-bold text-black font-orbitron">
              R
            </div>
            <span className="text-xl font-bold font-orbitron tracking-wider">REZULT</span>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00EBD5]/10 to-[#0072FF]/10 text-[#00EBD5] border border-[#00EBD5]/30 shadow-[0_0_15px_rgba(0,235,213,0.1)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-hidden relative">
        <Outlet />
      </main>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleLogout} 
      />
    </div>
  );
}
