import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Calculator, Check, AlertCircle, LayoutDashboard, FileText, Building2, Calendar, MessageSquareWarning, User, LogOut } from 'lucide-react';
import { LogoutModal } from '../../components/modals/LogoutModal';

export function CandidateDashboard() {
  const { user } = useAuth();

  const upcomingAssessments = [
    {
      id: 1,
      title: 'Advanced MERN Theory',
      rezulter: 'Brototype Rezulter',
      duration: '90 Minutes',
      date: 'Oct 24, 2023',
      status: 'LIVE NOW',
      gradient: 'from-[#00EBD5] to-[#0072FF]'
    },
    {
      id: 2,
      title: 'Advanced MERN Theory',
      rezulter: 'Brototype Rezulter',
      duration: '90 Minutes',
      date: 'Oct 24, 2023',
      status: 'LIVE NOW',
      gradient: 'from-[#00FF87] to-[#00EBD5]'
    },
  ];

  const assessmentHistory = [
    { id: 1, title: 'Islamic History', time: '2 DAYS AGO', score: 92, status: 'success' },
    { id: 2, title: 'Cloud (AWS)', time: '1 WEEK AGO', score: 85, status: 'success' },
    { id: 3, title: 'Net Security', time: '2 WEEKS AGO', score: 68, status: 'warning' },
  ];

  const attendanceData = [
    { label: 'Rezulter 1', value: 92 },
    { label: 'Rezulter 2', value: 85.5 },
    { label: 'Rezulter 3', value: 78.9 },
    { label: 'Rezulter 4', value: 90.4 },
  ];

  return (
    <div className="flex flex-col gap-10 w-full max-w-[1400px] mx-auto h-full overflow-y-auto pb-8 pr-8">

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

          <div className="flex items-center gap-4">
            <div className="bg-[#0A0D14] border border-white/5 rounded-full px-6 py-2 w-[280px]">
              <input
                type="text"
                placeholder="Enter assessment code or Link"
                className="bg-transparent text-[13px] text-white outline-none w-full placeholder:text-white/30 font-medium"
              />
            </div>
            <button className="text-white text-[13px] font-medium hover:text-[#00EBD5] transition-colors">
              Join
            </button>
          </div>
        </div>
      </header>

      {/* Upcoming Assessments */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-[3px] h-5 bg-white/80 rounded-full"></div>
            <h2 className="text-[22px] font-bold text-white tracking-wide">Upcoming Assessments</h2>
          </div>
          <button className="text-[#00EBD5] text-[13px] font-bold hover:underline underline-offset-4 tracking-wide">
            View Schedule &rarr;
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {upcomingAssessments.map((assessment) => (
            <div
              key={assessment.id}
              className={`rounded-[32px] p-[1.5px] bg-gradient-to-r ${assessment.gradient} shadow-[0_0_25px_rgba(0,235,213,0.15)]`}
            >
              <div className="bg-[#080B12] rounded-[30.5px] px-8 py-6 flex flex-col xl:flex-row xl:items-center justify-between gap-8">

                {/* Left: Icon & Title */}
                <div className="flex items-center gap-6">
                  <div className={`w-[60px] h-[60px] rounded-full bg-gradient-to-br ${assessment.gradient} flex items-center justify-center shrink-0`}>
                    <Calculator className="w-6 h-6 text-[#050505]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-[22px] font-bold text-white tracking-wide">{assessment.title}</h3>
                    <div className="flex items-center gap-2 text-white/50 text-[15px] font-medium">
                      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {assessment.rezulter}
                    </div>
                  </div>
                </div>

                {/* Right: Status, Time, Button */}
                <div className="flex flex-col md:flex-row md:items-center gap-8 xl:gap-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-[200px] py-1.5 rounded-full border border-[#00EBD5]/40 flex items-center justify-center text-[#00EBD5] text-[13px] font-bold tracking-widest uppercase">
                      {assessment.status}
                    </div>
                    <div className="flex items-center gap-6 text-white/40 text-[13px] font-medium">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {assessment.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {assessment.date}
                      </span>
                    </div>
                  </div>

                  <button className="px-8 py-3 rounded-[40px] bg-gradient-to-r from-[#00EBD5] to-[#0072FF] text-[#050505] font-bold text-[15px] hover:brightness-110 transition-all shadow-[0_0_20px_rgba(0,235,213,0.3)] shrink-0">
                    Start Exam
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
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
            <button className="text-[#00EBD5] text-[13px] font-bold hover:underline underline-offset-4 tracking-wide">
              View History &rarr;
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {assessmentHistory.map((history) => (
              <div key={history.id} className="bg-[#080B12] border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className={`w-[46px] h-[46px] rounded-xl flex items-center justify-center border ${history.status === 'success'
                    ? 'bg-[#00FF87]/5 border-[#00FF87]/20 text-[#00FF87]'
                    : 'bg-[#FF9500]/5 border-[#FF9500]/20 text-[#FF9500]'
                    }`}>
                    {history.status === 'success' ? <Check className="w-[22px] h-[22px]" /> : <AlertCircle className="w-[22px] h-[22px]" />}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-white font-bold text-[15px]">{history.title}</h4>
                    <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase">{history.time}</span>
                  </div>
                </div>
                <div className={`text-[17px] font-bold ${history.status === 'success' ? 'text-[#00FF87]' : 'text-[#FF9500]'
                  }`}>
                  {history.score}%
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exam Attendance */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-[3px] h-5 bg-white/80 rounded-full"></div>
              <h2 className="text-[22px] font-bold text-white tracking-wide">Exam Attendance</h2>
            </div>
            <button className="text-[#00EBD5] text-[13px] font-bold hover:underline underline-offset-4 tracking-wide">
              View Insights &rarr;
            </button>
          </div>

          <div className="bg-[#080B12] border border-white/5 rounded-[32px] p-8 h-[280px] flex items-end justify-around relative">
            {/* Chart Grid Lines */}
            <div className="absolute inset-x-8 inset-y-8 flex flex-col justify-between pointer-events-none">
              {[100, 80, 60, 40, 20, 0].map((val) => (
                <div key={val} className="flex items-center gap-4 w-full h-[1px]">
                  <span className="text-white/20 text-[11px] font-medium w-6 text-right">{val}</span>
                  <div className="flex-1 border-t border-dashed border-white/10"></div>
                </div>
              ))}
            </div>

            {/* Chart Bars */}
            <div className="absolute inset-x-8 bottom-8 top-8 flex items-end justify-around pl-14 pr-4">
              {attendanceData.map((data, index) => (
                <div key={index} className="flex flex-col items-center group relative h-full justify-end w-14">
                  {/* Value Tooltip/Label */}
                  <span className="absolute -top-6 text-white text-[11px] font-bold opacity-100 mb-1">
                    {data.value}
                  </span>

                  {/* Bar container */}
                  <div className="relative w-12 flex-1 flex items-end">
                    {/* Glowing backdrop at the top */}
                    <div
                      className="absolute w-[180%] h-[30px] bg-[#00FF87] blur-[16px] opacity-70 -translate-x-1/2 left-1/2 rounded-full"
                      style={{ bottom: `calc(${data.value}% - 15px)` }}
                    />

                    {/* Main bar */}
                    <div
                      className="w-full rounded-t-[14px] bg-gradient-to-t from-[#0072FF] via-[#00EBD5] to-[#00FF87] relative z-10"
                      style={{ height: `${data.value}%` }}
                    >
                      {/* Inner highlight */}
                      <div className="absolute top-0 inset-x-0 h-2 bg-white/40 rounded-t-[14px]" />
                    </div>
                  </div>

                  {/* Label */}
                  <span className="absolute -bottom-7 text-white/30 text-[11px] font-medium whitespace-nowrap">
                    {data.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export function CandidateLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const activePath = location.pathname;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Assessments', path: '/assessments', icon: FileText },
    { name: 'Rezulters', path: '/rezulters', icon: Building2 },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Concerns', path: '/concerns', icon: MessageSquareWarning },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4">
      {/* Outer App Container */}
      <div className="w-full h-[calc(100vh-2rem)] p-[2px] relative">

        {/* Inner Black Container */}
        <div className="w-full h-full bg-transparent flex overflow-hidden">

          {/* Sidebar - this entire panel is transparent to pick up parent color */}
          <aside className="w-[280px] h-full flex flex-col relative z-20 bg-transparent gap-2">

            {/* Logo Area */}
            <div className="relative bg-black rounded-l-[40px] h-[80px] flex items-center px-9 w-full mb-3">
              <div className="flex items-center">
                <img src="/rezult_logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                <span className="text-white font-orbitron text-[30px] font-bold tracking-[0.2em] uppercase mb-1">ezult</span>
              </div>

              {/* Bottom-Right Inner Corner Smoother */}
              <div className="absolute right-0 bottom-[-30px] w-[30px] h-[30px] pointer-events-none"
                style={{ background: 'radial-gradient(circle at 0% 100%, transparent 30px, #050505 30px)' }} />
            </div>

            {/* Navigation */}
            <nav className="flex flex-col relative flex-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={() => {
                    const active = item.path === activePath;
                    return `relative flex items-center gap-4 py-3.5 px-6 mx-5 mb-2 transition-all duration-300 font-bold text-[17px] rounded-[40px] ${active
                      ? 'bg-[#050505] text-white shadow-lg'
                      : 'text-[#050505] hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      }`;
                  }}
                >
                  {() => {
                    const active = item.path === activePath;
                    return (
                      <>
                        <item.icon className={`w-6 h-6 ${active ? 'text-[#00EBD5]' : ''}`} />
                        <span className="tracking-wide">{item.name}</span>
                      </>
                    );
                  }}
                </NavLink>
              ))}

              {/* Profile */}
              <div className="mt-auto pb-1">
                <NavLink
                  to="/profile"
                  className={() => {
                    const active = activePath === '/profile';
                    return `relative flex items-center gap-4 py-3.5 px-6 mx-5 font-bold text-[17px] rounded-[40px] transition-all duration-300 ${active
                      ? 'bg-[#050505] text-white shadow-lg'
                      : 'text-[#050505] hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      }`;
                  }}
                >
                  {() => {
                    const active = activePath === '/profile';
                    return (
                      <>
                        <User className={`w-6 h-6 ${active ? 'text-[#00EBD5]' : ''}`} />
                        <span className="tracking-wide">Profile</span>
                      </>
                    );
                  }}
                </NavLink>
              </div>
            </nav>

            {/* Logout Area */}
            <div className="relative bg-black rounded-l-[40px] h-[80px] flex items-center px-9 w-[full">
              {/* Top-Right Inner Corner Smoother */}
              <div className="absolute right-0 top-[-30px] w-[30px] h-[30px] pointer-events-none"
                style={{ background: 'radial-gradient(circle at 0% 0%, transparent 30px, #050505 30px)' }} />
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-4 font-bold text-[17px] text-white hover:text-[#00EBD5] transition-colors"
              >
                <LogOut className="w-6 h-6" />
                <span className="tracking-wide">Logout</span>
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 h-full overflow-hidden bg-black rounded-r-[40px] relative z-30 p-10 pr-0">
            <Outlet />
          </main>

        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}