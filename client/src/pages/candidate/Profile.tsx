import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, ShieldCheck, Edit2, Key } from 'lucide-react';

export function CandidateProfile() {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto h-full overflow-y-auto pb-8 pr-8 custom-scrollbar">
      
      {/* Header */}
      <header className="flex flex-col gap-2 mb-4">
        <h1 className="text-[28px] font-bold text-white mb-1 tracking-wide">
          My <span className="text-[#00EBD5]">Profile</span>
        </h1>
        <p className="text-white/40 text-[14px] font-medium">Manage your personal information and security settings.</p>
      </header>

      {/* Main Profile Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] p-[1.5px] bg-gradient-to-br from-[#00EBD5] via-[#0072FF] to-transparent shadow-[0_0_30px_rgba(0,235,213,0.1)] relative group"
          >
            <div className="bg-[#080B12] rounded-[30.5px] p-8 flex flex-col items-center text-center h-full relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#00EBD5]/10 to-transparent pointer-events-none" />
              
              {/* Avatar */}
              <div className="relative mb-6 mt-4">
                <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-[#00EBD5] to-[#0072FF] p-[3px] shadow-[0_0_20px_rgba(0,235,213,0.3)]">
                  <div className="w-full h-full bg-[#050505] rounded-full flex items-center justify-center text-white text-4xl font-orbitron font-bold tracking-widest relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    {user?.name ? getInitials(user.name) : 'U'}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 bg-[#00EBD5] text-[#050505] p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">{user?.name || 'User'}</h2>
              <div className="flex items-center gap-2 text-[#00EBD5] text-sm font-medium mb-6 bg-[#00EBD5]/10 px-4 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4" />
                <span className="capitalize">{user?.role}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0A0D14] border border-white/5 rounded-[32px] p-8 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#00EBD5]/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <User className="w-5 h-5 text-[#00EBD5]" />
                Personal Details
              </h3>
              <button className="text-white/50 hover:text-[#00EBD5] text-sm font-medium flex items-center gap-2 transition-colors">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-white/40 text-sm font-medium">Full Name</label>
                <div className="text-white font-medium text-base bg-black/40 px-5 py-3.5 rounded-2xl border border-white/5">
                  {user?.name || 'Not provided'}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-white/40 text-sm font-medium">Email Address</label>
                <div className="flex items-center justify-between text-white font-medium text-base bg-black/40 px-5 py-3.5 rounded-2xl border border-white/5">
                  <span className="truncate mr-4">{user?.email || 'Not provided'}</span>
                  <Mail className="w-4 h-4 text-[#00EBD5] shrink-0" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/40 text-sm font-medium">Account ID</label>
                <div className="text-white/70 font-medium text-sm bg-black/40 px-5 py-3.5 rounded-2xl border border-white/5 font-mono">
                  {user?.id || 'N/A'}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white/40 text-sm font-medium">Role</label>
                <div className="flex items-center gap-2 text-white font-medium text-base bg-black/40 px-5 py-3.5 rounded-2xl border border-white/5 capitalize">
                  <Shield className="w-4 h-4 text-[#00EBD5]" />
                  {user?.role}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0A0D14] border border-white/5 rounded-[32px] p-8 relative overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Key className="w-5 h-5 text-[#00EBD5]" />
                Security Settings
              </h3>
            </div>

            <div className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5">
              <div>
                <h4 className="text-white font-medium mb-1">Change Password</h4>
                <p className="text-white/40 text-sm">Update your password to keep your account secure.</p>
              </div>
              <button className="px-6 py-2.5 bg-white/5 hover:bg-[#00EBD5]/10 text-white hover:text-[#00EBD5] rounded-full font-medium transition-colors text-sm border border-white/10 hover:border-[#00EBD5]/30">
                Update
              </button>
            </div>
          </motion.div>
        </div>
        
      </div>
    </div>
  );
}
