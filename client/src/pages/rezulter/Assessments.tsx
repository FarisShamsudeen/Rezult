import { useState } from 'react';
import { 
  Bell, Plus, Search, ChevronDown, Filter, 
  Eye, Trash2, Link as LinkIcon, Sigma,
  ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function RezulterAssessments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const assessments = [
    {
      id: 1,
      name: 'Calculus 201 - Midterm',
      department: 'Mathematics',
      status: 'Draft',
      date: 'Oct 24, 2023',
      time: '09:00 AM - 12:00 PM',
      attendees: 200,
    },
    {
      id: 2,
      name: 'Calculus 201 - Midterm',
      department: 'Mathematics',
      status: 'Active',
      date: 'Oct 24, 2023',
      time: '09:00 AM - 12:00 PM',
      attendees: 200,
    },
    {
      id: 3,
      name: 'Calculus 201 - Midterm',
      department: 'Mathematics',
      status: 'Active',
      date: 'Oct 24, 2023',
      time: '09:00 AM - 12:00 PM',
      attendees: 200,
    },
    {
      id: 4,
      name: 'Calculus 201 - Midterm',
      department: 'Mathematics',
      status: 'Active',
      date: 'Oct 24, 2023',
      time: '09:00 AM - 12:00 PM',
      attendees: 200,
    },
    {
      id: 5,
      name: 'Calculus 201 - Midterm',
      department: 'Mathematics',
      status: 'Active',
      date: 'Oct 24, 2023',
      time: '09:00 AM - 12:00 PM',
      attendees: 200,
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto h-full overflow-y-auto pr-2 custom-scrollbar pb-8">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div>
          <h1 className="text-[26px] font-bold text-white mb-1 tracking-wide">
            Assessments
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
          
          <button onClick={() => navigate('/assessments/create')} className="bg-[#00EBD5] text-black px-6 py-2.5 rounded-[40px] font-bold text-[14px] flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,235,213,0.3)]">
            <Plus className="w-4 h-4" />
            Create New Assessment
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
              placeholder="Search assessments..."
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
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase">Assessment Name</th>
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase">Status</th>
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase">Scheduled Date</th>
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase">No. of Attendees</th>
                <th className="pb-4 px-4 text-[11px] font-bold text-white/40 tracking-widest uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assessments.map((assessment) => (
                <tr key={assessment.id} className="hover:bg-white/[0.02] transition-colors group">
                  {/* Name Column */}
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] flex items-center justify-center shrink-0">
                        <Sigma className="w-5 h-5 text-[#1A73E8]" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[14px] font-bold text-white group-hover:text-[#00EBD5] transition-colors">
                          {assessment.name}
                        </span>
                        <span className="text-[12px] text-white/40 font-medium">
                          Department: {assessment.department}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="py-5 px-4">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
                      {assessment.status}
                    </span>
                  </td>

                  {/* Date Column */}
                  <td className="py-5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[14px] font-medium text-white/80">
                        {assessment.date}
                      </span>
                      <span className="text-[12px] text-white/40 font-medium">
                        {assessment.time}
                      </span>
                    </div>
                  </td>

                  {/* Attendees Column */}
                  <td className="py-5 px-4">
                    <span className="text-[14px] font-medium text-white/80">
                      {assessment.attendees}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="py-5 px-4">
                    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-60 lg:group-hover:opacity-100 transition-opacity">
                      <button className="bg-white/5 hover:bg-white/10 text-white text-[13px] font-bold px-4 py-2 rounded-xl transition-colors">
                        View
                      </button>
                      
                      {assessment.status === 'Draft' ? (
                        <button className="bg-white/5 hover:bg-white/10 text-white text-[13px] font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
                          Delete
                        </button>
                      ) : (
                        <button className="bg-white/5 hover:bg-white/10 text-white text-[13px] font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
                          Copy Link
                        </button>
                      )}
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
