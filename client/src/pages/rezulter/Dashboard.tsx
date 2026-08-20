import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell, LayoutDashboard, FileText,
  ClipboardList, Users, TrendingUp, MoreVertical, Zap, PlusCircle,
  ChevronRight, Link as LinkIcon, Copy, Plus, HelpCircle, LogOutIcon
} from 'lucide-react';
import { LogoutModal } from '../../components/modals/LogoutModal';

export function RezulterDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeExaminations = [
    {
      id: 1,
      name: 'Calculus 201 - Midterm',
      status: 'Active',
      timeRemaining: '45m 20s'
    },
    {
      id: 2,
      name: 'Physics 101 - Lab Final',
      status: 'Paused',
      timeRemaining: '--:--'
    }
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto h-full overflow-y-auto pr-6 custom-scrollbar pb-8">

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div>
          <h1 className="text-[26px] font-bold text-white mb-1 tracking-wide">
            Dashboard
          </h1>
          <p className="text-white/50 text-[14px] font-medium tracking-wide">Welcome back, here's what's happening today.</p>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-white/60 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00EBD5] rounded-full border-2 border-[#0A0D14]"></span>
          </button>

          <button onClick={() => navigate('/assessments/create')} className="bg-[#00EBD5] text-black px-6 py-2.5 rounded-[40px] font-bold text-[14px] flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,235,213,0.3)]">
            <Plus className="w-4 h-4" />
            Create New Assessment
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">

        {/* Left Column */}
        <div className="flex flex-col gap-6">

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-[#12181C] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-6 right-6 text-white/5 pointer-events-none">
                <ClipboardList className="w-16 h-16" strokeWidth={1} />
              </div>
              <h3 className="text-white/50 text-sm font-medium mb-4">Total Assessments</h3>
              <div className="flex items-end gap-4">
                <span className="text-[42px] text-white font-bold leading-none">124</span>
                <div className="flex items-center gap-1 bg-[#00FF87]/10 text-[#00FF87] px-2 py-1 rounded-full text-[11px] font-bold mb-1 border border-[#00FF87]/20">
                  <TrendingUp className="w-3 h-3" />
                  12%
                </div>
              </div>
              {/* progress bar underline */}
              <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00EBD5] to-[#0072FF] w-[70%] rounded-full shadow-[0_0_10px_rgba(0,235,213,0.5)]" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#12181C] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-6 right-6 text-white/5 pointer-events-none">
                <Users className="w-16 h-16" strokeWidth={1} />
              </div>
              <h3 className="text-white/50 text-sm font-medium mb-4">Active Candidates</h3>
              <div className="flex items-end gap-4">
                <span className="text-[42px] text-white font-bold leading-none">1,850</span>
                <div className="flex items-center gap-1 bg-[#00FF87]/10 text-[#00FF87] px-2 py-1 rounded-full text-[11px] font-bold mb-1 border border-[#00FF87]/20">
                  <TrendingUp className="w-3 h-3" />
                  5%
                </div>
              </div>
              {/* progress bar underline */}
              <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0072FF] to-[#00EBD5] w-[45%] rounded-full shadow-[0_0_10px_rgba(0,114,255,0.5)]" />
              </div>
            </div>
          </div>

          {/* Recent Performance Chart */}
          <div className="bg-[#12181C] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[17px] font-bold text-white mb-1 tracking-wide">Recent Performance</h2>
                <p className="text-white/40 text-[13px] font-medium tracking-wide">Candidate scoring trends over the last 30 days</p>
              </div>
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-[14px] text-white/70 text-[12px] font-bold transition-colors tracking-wide">
                Last 30 Days
              </button>
            </div>

            <div className="h-[240px] w-full border border-white/5 rounded-[20px] relative flex items-end justify-between px-6 pt-4 overflow-hidden group">
              {/* Grid background dotted */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '32px 32px', backgroundPosition: 'center bottom' }}></div>

              {/* Central label */}
              <div className="absolute inset-0 flex items-center justify-center text-[#00EBD5]/30 text-sm font-medium pointer-events-none z-20">
                Interactive Chart Visualization Area
              </div>

              {/* Simulated CSS bars */}
              {[30, 45, 80, 50, 40, 60, 90].map((h, i) => (
                <div key={i} className="w-[12%] rounded-t-sm bg-gradient-to-t from-[#0072FF]/20 via-[#00EBD5]/40 to-[#00EBD5]/80 relative z-10 hover:brightness-125 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,235,213,0.1)]" style={{ height: `${h}%` }}>
                </div>
              ))}
            </div>
          </div>

          {/* Active Examinations Table */}
          <div className="bg-[#12181C] border border-white/5 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[17px] font-bold text-white tracking-wide">Active Examinations</h2>
              <button className="text-[#00EBD5] text-[13px] font-bold hover:underline underline-offset-4 tracking-wide">View All</button>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-4 text-[11px] font-bold text-white/40 tracking-widest uppercase">Assessment Name</th>
                    <th className="pb-4 text-[11px] font-bold text-white/40 tracking-widest uppercase">Status</th>
                    <th className="pb-4 text-[11px] font-bold text-white/40 tracking-widest uppercase">Time Remaining</th>
                    <th className="pb-4 text-[11px] font-bold text-white/40 tracking-widest uppercase text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activeExaminations.map((exam) => (
                    <tr key={exam.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-5">
                        <div className="text-[14px] font-bold text-white/90 group-hover:text-white transition-colors">{exam.name}</div>
                      </td>
                      <td className="py-5">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold border tracking-wide uppercase ${exam.status === 'Active'
                          ? 'bg-[#00FF87]/10 text-[#00FF87] border-[#00FF87]/20'
                          : 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/20'
                          }`}>
                          {exam.status}
                        </span>
                      </td>
                      <td className="py-5">
                        <div className="text-[14px] font-medium text-white/60 group-hover:text-white/80 transition-colors">{exam.timeRemaining}</div>
                      </td>
                      <td className="py-5 text-center">
                        <button className="text-white/30 hover:text-white transition-colors">
                          <MoreVertical className="w-5 h-5 inline-block" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">

          {/* Quick Actions */}
          <div className="bg-[#12181C] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            {/* subtle glow */}
            <div className="absolute -top-10 -right-10 w-[200px] h-[200px] bg-[#00EBD5]/10 blur-[60px] rounded-full pointer-events-none z-0"></div>

            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#00EBD5]/10 flex items-center justify-center shrink-0 border border-[#00EBD5]/20">
                  <Zap className="w-5 h-5 text-[#00EBD5]" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-white mb-0.5 tracking-wide">Quick Actions</h2>
                  <p className="text-[12px] text-white/50 font-medium tracking-wide">Manage exams efficiently</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button onClick={() => navigate('/assessments/create')} className="w-full bg-[#00EBD5] hover:bg-[#00EBD5]/90 transition-colors text-black rounded-2xl py-3.5 px-5 flex items-center justify-between font-bold text-[14px]">
                  <div className="flex items-center gap-3">
                    <PlusCircle className="w-5 h-5" />
                    Create Assessment
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button className="w-full bg-transparent hover:bg-white/5 border border-white/10 transition-colors text-white rounded-2xl py-3.5 px-5 flex items-center justify-between font-bold text-[14px] group">
                  <div className="flex items-center gap-3 text-white/70 group-hover:text-white transition-colors">
                    <LinkIcon className="w-5 h-5" />
                    Copy Invitation Link
                  </div>
                  <Copy className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-[#12181C] border border-white/5 rounded-3xl p-6 flex-1">
            <h2 className="text-[17px] font-bold text-white mb-6 tracking-wide">Upcoming</h2>

            <div className="flex flex-col gap-5">
              {/* Item 1 */}
              <div className="flex gap-4 items-center group cursor-pointer">
                <div className="w-[56px] h-[56px] rounded-[16px] bg-[#00EBD5] flex flex-col items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,235,213,0.2)] group-hover:scale-105 transition-transform">
                  <span className="text-[10px] font-bold text-black leading-none mb-1 tracking-wider">OCT</span>
                  <span className="text-[20px] font-extrabold text-black leading-none">24</span>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-[15px] font-bold text-white group-hover:text-[#00EBD5] transition-colors tracking-wide">Literature Final</h4>
                  <p className="text-[13px] text-white/40 font-medium tracking-wide mt-0.5">09:00 AM - Hall A</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex gap-4 items-center group cursor-pointer">
                <div className="w-[56px] h-[56px] rounded-[16px] bg-white/5 flex flex-col items-center justify-center shrink-0 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <span className="text-[10px] font-bold text-white/40 leading-none mb-1 tracking-wider">OCT</span>
                  <span className="text-[20px] font-extrabold text-white/80 leading-none">25</span>
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-[15px] font-bold text-white group-hover:text-white/80 transition-colors tracking-wide">Biology Entrance</h4>
                  <p className="text-[13px] text-white/40 font-medium tracking-wide mt-0.5">11:30 AM - Online</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export function RezulterLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const activePath = location.pathname;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Assessments', path: '/assessments', icon: FileText },
    { name: 'Candidates', path: '/candidates', icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="h-screen w-full bg-[#0A0D14] overflow-hidden flex">
        {/* Sidebar - Dark theme for Rezulter */}
        <aside className="w-[280px] h-full flex flex-col relative z-20 bg-[#1C242A] border-r border-white/5 shrink-0">

          {/* Logo Area */}
          <div className="h-[100px] flex items-center px-8 w-full mt-4">
            <div className="flex items-center gap-2">
              <img src="/rezult_logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="text-white font-orbitron text-[26px] font-bold tracking-[0.2em] uppercase">ezult</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 mt-4 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={() => {
                  const active = item.path === activePath;
                  return `flex items-center gap-4 py-3.5 px-8 transition-all duration-300 font-bold text-[15px] ${active
                    ? 'bg-[#00EBD5]/10 border-l-[3px] border-[#00EBD5] text-[#00EBD5]'
                    : 'text-white/50 hover:text-white border-l-[3px] border-transparent hover:bg-white/[0.02]'
                    }`;
                }}
              >
                {() => {
                  const active = item.path === activePath;
                  return (
                    <>
                      <item.icon className={`w-[22px] h-[22px] ${active ? 'text-[#00EBD5]' : 'text-white/40'}`} />
                      <span className="tracking-wide">{item.name}</span>
                    </>
                  );
                }}
              </NavLink>
            ))}
          </nav>

          {/* Bottom Area */}
          <div className="flex flex-col mt-auto pb-8 px-6 gap-6">
            <NavLink
              to="/support"
              className={() => {
                const active = activePath === '/support';
                return `flex items-center gap-3 transition-colors font-bold text-[14px] px-4 py-3 rounded-2xl ${active ? 'bg-[#00EBD5]/10 text-[#00EBD5]' : 'text-white/50 hover:text-white hover:bg-white/[0.02]'
                  }`;
              }}
            >
              {() => {
                const active = activePath === '/support';
                return (
                  <>
                    <HelpCircle className={`w-5 h-5 ${active ? 'text-[#00EBD5]' : 'text-white/40'}`} />
                    Help & Support
                  </>
                );
              }}
            </NavLink>

            {/* Profile Card / Logout */}
            <div className="bg-[#12181C] border border-white/5 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:border-white/10 transition-all" onClick={() => setIsLogoutModalOpen(true)}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00EBD5] to-[#0072FF] flex items-center justify-center text-black font-bold text-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'R'}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-[14px] leading-tight">{user?.name || 'Brototype'}</span>
                  <span className="text-white/40 text-[12px] font-medium">Admin</span>
                </div>
              </div>
              <LogOutIcon className="w-5 h-5 text-white/30 group-hover:text-[#00EBD5] transition-colors" />
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-hidden bg-[#0A0D14] relative z-30 p-8">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
