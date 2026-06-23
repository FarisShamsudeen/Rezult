import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, ClipboardList, BarChart2, Search, Bell, Shield } from 'lucide-react';

export function SuperAdminLayout() {
  const navItems = [
    { name: 'Dashboard', path: '/super-admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Rezulters', path: '/super-admin/rezulters', icon: <Building2 size={20} /> },
    { name: 'Candidate', path: '/super-admin/candidates', icon: <Users size={20} /> },
    { name: 'Assessments', path: '/super-admin/assessments', icon: <ClipboardList size={20} /> },
    { name: 'Reports', path: '/super-admin/reports', icon: <BarChart2 size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#0A0D10] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#050505] border-r border-white/5 flex flex-col justify-between hidden md:flex shrink-0">
        
        <div>
          {/* Logo */}
          <div className="p-8 pb-10 flex items-center">
            <img src="/rezult_logo.png" alt="Rezult" className="w-8 h-8 object-contain" />
            <span className="font-orbitron font-bold tracking-[0.2em] text-2xl uppercase">EZULT</span>
          </div>

          {/* Navigation */}
          <nav className="px-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-[#1C2331] text-white font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 font-medium'
                  }`
                }
              >
                {item.icon}
                <span className="text-[15px]">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section - User Profile Link */}
        <div className="p-4 mb-4 border-t border-white/5 mt-auto">
          <NavLink 
            to="/super-admin/profile"
            className={({ isActive }) => 
              `flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                isActive ? 'bg-[#1C2331] border border-white/10' : 'hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1C2331] flex items-center justify-center text-gray-300">
                <Shield size={16} className="text-[#60A5FA]" />
              </div>
              <span className="text-gray-300 font-medium text-[15px]">Super Admin</span>
            </div>
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-[#0A0D10]">
         {/* Top Header (Shared across pages, but placed here or in Dashboard) */}
         <Outlet />
      </main>
    </div>
  );
}
