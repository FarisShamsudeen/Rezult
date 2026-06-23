import { useState } from 'react';
import { 
  Bell, Plus, Search, ChevronDown, Filter, 
  MoreVertical, ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react';

export function RezulterCandidates() {
  const [searchQuery, setSearchQuery] = useState('');

  const candidates = [
    {
      id: '#C-1024',
      name: 'Eleanor Pena',
      email: 'eleanor.pena@example.com',
      joinDate: 'Oct 24, 2023',
      joinTime: '09:12 AM',
      assessments: 12,
      status: 'Active',
    },
    {
      id: '#C-1025',
      name: 'Cameron Williamson',
      email: 'cameron.w@example.com',
      joinDate: 'Oct 22, 2023',
      joinTime: '02:45 PM',
      assessments: 4,
      status: 'Pending',
    },
    {
      id: '#C-1026',
      name: 'Brooklyn Simmons',
      email: 'brooklyn.s@example.com',
      joinDate: 'Oct 18, 2023',
      joinTime: '11:00 AM',
      assessments: 8,
      status: 'Active',
    },
    {
      id: '#C-1027',
      name: 'Leslie Alexander',
      email: 'leslie.alex@example.com',
      joinDate: 'Oct 15, 2023',
      joinTime: '10:30 AM',
      assessments: 0,
      status: 'Inactive',
    },
    {
      id: '#C-1028',
      name: 'Guy Hawkins',
      email: 'guy.hawkins@example.com',
      joinDate: 'Oct 10, 2023',
      joinTime: '04:15 PM',
      assessments: 15,
      status: 'Active',
    },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-[#E8F5E9] text-[#2E7D32]';
      case 'Pending':
        return 'bg-[#FFF8E1] text-[#F57F17]';
      case 'Inactive':
        return 'bg-[#F1F3F4] text-[#5F6368]';
      default:
        return 'bg-white/10 text-white';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-[#2E7D32]';
      case 'Pending':
        return 'bg-[#F57F17]';
      case 'Inactive':
        return 'bg-[#5F6368]';
      default:
        return 'bg-white/50';
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto h-full overflow-y-auto pr-2 custom-scrollbar pb-8">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div>
          <h1 className="text-[26px] font-bold text-white mb-1 tracking-wide">
            Candidates
          </h1>
          <p className="text-white/50 text-[14px] font-medium tracking-wide">
            Manage and organize your institution's examinations.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-white/60 hover:text-white transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FF3B30] rounded-full border-2 border-[#0A0D14]"></span>
          </button>
          
          <button className="bg-[#00EBD5] text-black px-6 py-2.5 rounded-[40px] font-bold text-[14px] flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,235,213,0.3)]">
            <Plus className="w-4 h-4" />
            Copy Invitation Link
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="bg-[#12181C] border border-white/5 rounded-3xl p-6 flex flex-col min-h-[600px]">
        
        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
          
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-white/40" />
            </div>
            <input
              type="text"
              placeholder="Search Candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A2328] border border-white/5 text-white text-sm rounded-[14px] pl-10 pr-4 py-3 focus:outline-none focus:border-white/10 transition-colors placeholder:text-white/30 font-medium"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-3">
            <button className="bg-[#1A2328] hover:bg-[#1A2328]/80 border border-white/5 text-white/70 text-sm rounded-[14px] px-5 py-3 flex items-center gap-2 font-medium transition-colors">
              All Statuses
              <ChevronDown className="w-4 h-4 text-white/40" />
            </button>
            <button className="bg-[#1A2328] hover:bg-[#1A2328]/80 border border-white/5 text-white/70 text-sm rounded-[14px] px-5 py-3 flex items-center gap-2 font-medium transition-colors">
              Sort By Date
            </button>
            <button className="bg-[#1A2328] hover:bg-[#1A2328]/80 border border-white/5 text-white/70 rounded-[14px] p-3 flex items-center justify-center transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
<div className="w-full">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase">Candidate Name</th>
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase">Email Address</th>
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase">Join Date</th>
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase text-center">Assessments</th>
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase">Status</th>
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-white/[0.02] transition-colors group">
                  {/* Name Column */}
                  <td className="py-5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-bold text-white group-hover:text-[#00EBD5] transition-colors">
                        {candidate.name}
                      </span>
                      <span className="text-[12px] text-white/40 font-medium">
                        ID: {candidate.id}
                      </span>
                    </div>
                  </td>

                  {/* Email Column */}
                  <td className="py-5 px-4">
                    <span className="text-[14px] font-medium text-[#73A5C6] group-hover:text-[#8BBDE0] transition-colors">
                      {candidate.email}
                    </span>
                  </td>

                  {/* Date Column */}
                  <td className="py-5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-medium text-[#73A5C6] group-hover:text-[#8BBDE0] transition-colors">
                        {candidate.joinDate.split(', ')[0]},<br />
                        {candidate.joinDate.split(', ')[1]}
                      </span>
                      <span className="text-[12px] text-white/40 font-medium">
                        {candidate.joinTime}
                      </span>
                    </div>
                  </td>

                  {/* Assessments Column */}
                  <td className="py-5 px-4 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#E8F0FE] text-[#1A73E8] font-bold text-[13px]">
                      {candidate.assessments}
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="py-5 px-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-bold ${getStatusStyles(candidate.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(candidate.status)}`}></span>
                      {candidate.status}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="py-5 px-4 text-right">
                    <button className="text-white/30 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
          <span className="text-[13px] text-white/40 font-medium">
            Showing 1 to 5 of 124 results
          </span>
          
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-white/40 hover:text-white hover:bg-white/5 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#00EBD5] text-[#00EBD5] font-bold text-[13px]">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium text-[13px]">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium text-[13px]">
              3
            </button>
            <div className="w-8 h-8 flex items-center justify-center text-white/40">
              <MoreHorizontal className="w-4 h-4" />
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-white/60 hover:text-white hover:bg-white/5 transition-colors font-medium text-[13px]">
              8
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-white/40 hover:text-white hover:bg-white/5 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
