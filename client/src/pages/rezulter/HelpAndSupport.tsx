import { useState } from 'react';
import { 
  Bell, Plus, Search, Eye, Download, ChevronLeft, ChevronRight
} from 'lucide-react';

export function RezulterHelpAndSupport() {
  const [searchQuery, setSearchQuery] = useState('');

  const issues = [
    {
      id: 'ISS-1042',
      summary: 'Login page crashing on mobile',
      date: 'Oct 24, 2023',
      type: 'Bug',
      status: 'FIXED',
    },
    {
      id: 'ISS-1041',
      summary: 'Add dark mode toggle',
      date: 'Oct 23, 2023',
      type: 'Feature Request',
      status: 'IN PROGRESS',
    },
    {
      id: 'ISS-1040',
      summary: 'Database connection timeout',
      date: 'Oct 22, 2023',
      type: 'Backend',
      status: 'CRITICAL',
    },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'FIXED':
        return 'bg-[#00EBD5]/10 text-[#00EBD5] border border-[#00EBD5]/20';
      case 'IN PROGRESS':
        return 'bg-[#73A5C6]/10 text-[#73A5C6] border border-[#73A5C6]/20';
      case 'CRITICAL':
        return 'bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/20';
      default:
        return 'bg-white/10 text-white border border-white/20';
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto h-full overflow-y-auto pr-2 custom-scrollbar pb-8">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div>
          <h1 className="text-[26px] font-bold text-white mb-1 tracking-wide">
            Help and Support
          </h1>
          <p className="text-white/50 text-[14px] font-medium tracking-wide">
            Seek Help from the Super Admin Regarding anything
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-white/60 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FF3B30] rounded-full border-2 border-[#0A0D14]"></span>
          </button>
          
          <button className="bg-[#38bdf8] hover:bg-[#38bdf8]/90 text-black px-6 py-2.5 rounded-[40px] font-bold text-[14px] flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <Plus className="w-4 h-4" />
            Report New Issue
          </button>
        </div>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Card 1 */}
         <div className="bg-[#12181C] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white/50 text-[12px] font-bold mb-3 tracking-widest uppercase">Total Issues</h3>
            <div className="text-[28px] text-white font-bold leading-none">1,248</div>
         </div>
         {/* Card 2 */}
         <div className="bg-[#12181C] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white/50 text-[12px] font-bold mb-3 tracking-widest uppercase">Open Bugs</h3>
            <div className="text-[28px] text-[#FF453A] font-bold leading-none">42</div>
         </div>
         {/* Card 3 */}
         <div className="bg-[#12181C] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white/50 text-[12px] font-bold mb-3 tracking-widest uppercase">Avg. Resolution Time</h3>
            <div className="text-[28px] text-white font-bold leading-none">2.4d</div>
         </div>
         {/* Card 4 */}
         <div className="bg-[#12181C] border border-white/5 rounded-2xl p-6">
            <h3 className="text-white/50 text-[12px] font-bold mb-3 tracking-widest uppercase">Pending Features</h3>
            <div className="text-[28px] text-[#8BBDE0] font-bold leading-none">18</div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#12181C] border border-white/5 rounded-3xl p-6 flex flex-col min-h-[500px]">
        
        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border border-white/5 p-3 rounded-2xl mb-8">
          
          {/* Search */}
          <div className="flex-1 relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-white/40" />
            </div>
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A2328] border border-white/5 text-white text-[13px] rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-white/10 transition-colors placeholder:text-white/30 font-medium"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-3">
            <button className="bg-transparent hover:bg-white/5 border border-white/10 text-white/60 text-[12px] rounded-full px-4 py-2 transition-colors font-medium">
              Date: Last 30 Days
            </button>
            <button className="bg-[#00EBD5]/10 border border-[#00EBD5]/30 text-[#00EBD5] text-[12px] rounded-full px-4 py-2 transition-colors font-bold">
              Status: All
            </button>
            <button className="bg-transparent hover:bg-white/5 border border-white/10 text-white/60 text-[12px] rounded-full px-4 py-2 transition-colors font-medium">
              Category: System
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase w-[40%]">Issue Summary</th>
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase">Date Generated</th>
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase">Type</th>
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase">Status</th>
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-white/[0.02] transition-colors group">
                  {/* Summary Column */}
                  <td className="py-5 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[15px] font-bold text-white group-hover:text-[#00EBD5] transition-colors">
                        {issue.summary}
                      </span>
                      <span className="text-[12px] text-white/40 font-mono">
                        ID: {issue.id}
                      </span>
                    </div>
                  </td>

                  {/* Date Column */}
                  <td className="py-5 px-4">
                    <span className="text-[13px] font-medium text-white/70">
                      {issue.date}
                    </span>
                  </td>

                  {/* Type Column */}
                  <td className="py-5 px-4">
                    <span className="text-[13px] font-medium text-white/70">
                      {issue.type}
                    </span>
                  </td>

                  {/* Status Column */}
                  <td className="py-5 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${getStatusStyles(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="py-5 px-4">
                    <div className="flex items-center justify-end gap-3 text-white/40">
                      <button className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
                        <Eye className="w-[18px] h-[18px]" />
                      </button>
                      <button className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
                        <Download className="w-[18px] h-[18px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
          <span className="text-[13px] text-white/40 font-medium">
            Showing 1 to 10 of 42 entries
          </span>
          
          <div className="flex items-center gap-2">
            <button className="text-white/40 hover:text-white transition-colors p-1">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 text-white font-medium text-[13px] border border-white/20">
              1
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-transparent text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium text-[13px]">
              2
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-transparent text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium text-[13px]">
              3
            </button>
            <span className="text-white/40 px-1">...</span>
            <button className="text-white/40 hover:text-white transition-colors p-1">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
