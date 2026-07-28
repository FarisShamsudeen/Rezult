import { useState } from 'react';
import { Bell, KeyRound, Lock, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { LogoutModal } from '../../components/modals/LogoutModal';

export function SuperAdminProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-8 overflow-y-auto">
      {/* Top Header */}
      <header className="flex items-center justify-between mb-16 shrink-0 border-b border-white/5 pb-6">
        <h1 className="text-[26px] font-bold text-white tracking-wide">
          Profile
        </h1>
        <button className="text-gray-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
        </button>
      </header>

      {/* Centered Content */}
      <div className="flex-1 flex flex-col items-center max-w-2xl mx-auto w-full">

        {/* Title Section */}
        <div className="text-center mb-10">
          <p className="text-[#60A5FA] text-[13px] font-bold tracking-[0.2em] uppercase mb-3">
            Account Verification
          </p>
          <h2 className="text-4xl font-bold text-white mb-4">Security Profile</h2>
          <p className="text-gray-400 text-[15px] max-w-md mx-auto leading-relaxed">
            Manage your credential architecture and system access protocols through this secure interface.
          </p>
        </div>

        {/* Security Card */}
        <div className="bg-[#12161D] border border-white/5 rounded-xl w-full p-8 relative overflow-hidden shadow-2xl mb-12 border-l-4 border-l-[#60A5FA]">

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
              <KeyRound className="w-6 h-6 text-gray-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Change Password</h3>
              <p className="text-gray-400 text-sm">Update your encryption access keys.</p>
            </div>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-[13px] font-medium text-gray-400 mb-2 uppercase tracking-wide">
                Current Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  defaultValue="password123"
                  className="w-full bg-[#1A1F29] border border-transparent rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white/10 transition-colors tracking-widest"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-medium text-gray-400 mb-2 uppercase tracking-wide">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    defaultValue="password123"
                    className="w-full bg-[#1A1F29] border border-transparent rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white/10 transition-colors tracking-widest"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-gray-400 mb-2 uppercase tracking-wide">
                  Confirm New
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    defaultValue="password123"
                    className="w-full bg-[#1A1F29] border border-transparent rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white/10 transition-colors tracking-widest"
                  />
                </div>
              </div>
            </div>

            <button type="button" className="w-full mt-4 bg-[#93C5FD] hover:bg-[#BFDBFE] text-[#1E3A8A] font-bold text-[14px] py-4 rounded-lg uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(147,197,253,0.3)]">
              Update Security Protocols
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE]"></span>
              Last Changed: 14 Days Ago
            </div>
            <div className="flex items-center gap-1.5 text-[#00FF87] text-[11px] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Level 4 Secure
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="text-center mb-12">
          <p className="text-gray-400 text-sm mb-6">
            Finished your session? Ensure you terminate active connections.
          </p>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center gap-3 mx-auto px-6 py-3 rounded-lg border border-[#FF3B30]/30 text-[#FF3B30] hover:bg-[#FF3B30]/10 font-bold text-[14px] tracking-wider transition-colors uppercase"
          >
            <LogOut className="w-4 h-4" />
            Logout System
          </button>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-center gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-auto mb-4">
          <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Security Audit</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Terms of Ops</a>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
