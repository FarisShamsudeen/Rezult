import { useState, useEffect } from 'react';
import { Search, Bell } from 'lucide-react';
import { superAdminService, type DashboardStats } from '../../services/superAdmin.service';

export function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await superAdminService.getDashboardStats();
      if (response && response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-white/5">
        <h1 className="text-2xl font-orbitron font-medium text-white tracking-wide">Dashboard Overview</h1>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search rezulters..." 
              className="bg-[#1C2331] text-sm text-white placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-[#00F2FE]/50"
            />
          </div>
          <button className="text-gray-400 hover:text-white transition-colors relative">
            <Bell size={20} />
            {/* Notification Dot */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#0A0D10]" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-8 space-y-8 flex-1">
        
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Institutions */}
          <div className="bg-[#1A202A] rounded-2xl p-6 border border-white/5 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Rezulters</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white tracking-tight">{isLoading ? '...' : stats?.totalRezulters ?? 0}</span>
                <span className="text-[#00F2FE] text-sm font-medium">~12%</span>
              </div>
            </div>
            {/* Watermark/Pattern */}
            <div className="absolute right-4 top-4 text-white/5 pointer-events-none">
               <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/></svg>
            </div>
          </div>

          {/* Total Candidates */}
          <div className="bg-[#1A202A] rounded-2xl p-6 border border-white/5 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Candidates</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white tracking-tight">{isLoading ? '...' : stats?.totalCandidates ?? 0}</span>
                <span className="text-[#00F2FE] text-sm font-medium">~8%</span>
              </div>
            </div>
            {/* Watermark/Pattern */}
            <div className="absolute right-4 -top-2 text-white/5 pointer-events-none text-8xl font-black italic">
               8
            </div>
          </div>

          {/* Total Assessments */}
          <div className="bg-[#1A202A] rounded-2xl p-6 border border-white/5 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Assessments</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-white tracking-tight">{isLoading ? '...' : stats?.totalAssessments ?? 0}</span>
                <span className="text-gray-500 text-sm font-medium">This month</span>
              </div>
            </div>
            {/* Watermark/Pattern */}
            <div className="absolute right-0 top-0 text-white/5 pointer-events-none">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
          </div>
        </div>

        {/* Live Assessments Section */}
        <div className="bg-[#1A202A] rounded-2xl border border-white/5 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-[#1C2331]/30">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]"></span>
              <h2 className="text-lg font-bold text-white">Live Assessments Now</h2>
            </div>
            <button className="text-gray-400 text-sm font-medium hover:text-white transition-colors flex items-center gap-1">
              View All <span>→</span>
            </button>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-[#151A22]/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assessments Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rezulters</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Users</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Loading live assessments...
                    </td>
                  </tr>
                ) : (!stats?.liveAssessments || stats.liveAssessments.length === 0) ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No live assessments at the moment.
                    </td>
                  </tr>
                ) : (
                  stats.liveAssessments.map((assessment) => (
                    <tr key={assessment.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5">
                        <span className="text-gray-300 font-medium text-[15px]">{assessment.name}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-gray-400 text-[15px]">{assessment.rezulterName}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-gray-300 text-[15px]">{assessment.activeUsers}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded bg-[#00F2FE]/10 text-[#00F2FE] text-xs font-bold border border-[#00F2FE]/20 tracking-wide uppercase">
                          {assessment.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
