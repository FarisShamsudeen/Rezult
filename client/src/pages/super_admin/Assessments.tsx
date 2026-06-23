import React, { useState } from 'react';
import { Search, Bell, Plus, Download, Copy, Trash2, Code2, Cpu, Filter } from 'lucide-react';

export function SuperAdminAssessments() {
  const [activeTab, setActiveTab] = useState('ALL EXAMS');

  const assessments = [
    {
      id: 'A1',
      title: 'Backend Engineering Senior Level',
      techStack: 'Node.js • PostgreSQL • Redis',
      status: 'ACTIVE',
      candidates: '124',
      createdDate: 'Oct 12, 2023',
      createdBy: 'BY ADMIN_01',
      icon: <Code2 className="w-5 h-5 text-blue-400" />,
      iconBg: 'bg-blue-500/10'
    },
    {
      id: 'A2',
      title: 'Machine Learning Fundamentals',
      techStack: 'Python • PyTorch • Data Viz',
      status: 'COMPLETED',
      candidates: '452',
      createdDate: 'Aug 21, 2023',
      createdBy: '',
      icon: <Cpu className="w-5 h-5 text-orange-400" />,
      iconBg: 'bg-orange-500/10'
    }
  ];

  const tabs = ['ALL EXAMS', 'ACTIVE', 'COMPLETED'];

  return (
    <div className="flex flex-col w-full h-full p-8 overflow-y-auto">
      {/* Top Header */}
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-[22px] font-bold text-white tracking-wide">
          Assessments
        </h1>
        <div className="flex items-center gap-4">
          <button className="bg-[#1C64F2] hover:bg-[#1A56DB] text-white px-5 py-2 rounded-lg font-medium text-[14px] flex items-center gap-2 transition-colors shadow-lg">
            <Plus className="w-4 h-4" />
            Add Assessment
          </button>
          <button className="text-gray-400 hover:text-white transition-colors relative ml-2">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Title Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Assessment Management</h2>
          <p className="text-gray-400 text-[15px] max-w-2xl leading-relaxed">
            Configure, monitor, and analyze technical evaluations for engineering
            candidates with real-time tracking.
          </p>
        </div>
        <button className="bg-[#00F2FE]/10 hover:bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/30 px-5 py-2.5 rounded-lg font-medium text-[14px] flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,242,254,0.15)] whitespace-nowrap mt-2 md:mt-0">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 bg-[#161D27] p-1.5 rounded-xl border border-white/5 w-full lg:w-auto overflow-x-auto hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-[13px] font-bold tracking-wider transition-colors shrink-0 ${
                activeTab === tab
                  ? 'bg-[#1C64F2] text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Date Range */}
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search Assessments, IDs..." 
              className="w-full bg-[#161D27] border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#1C64F2] transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/5 bg-[#161D27] text-gray-400 text-sm font-medium hover:text-white hover:border-white/10 transition-colors shrink-0">
            <Filter className="w-4 h-4" />
            Date Range
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#161D27] border border-white/5 rounded-2xl flex flex-col shadow-2xl overflow-hidden flex-1">
        
        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-[#1C2331]/30">
                <th className="py-5 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Title & Tech Stack</th>
                <th className="py-5 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-5 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Candidates</th>
                <th className="py-5 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Created</th>
                <th className="py-5 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right pr-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assessments.map((assessment) => (
                <tr key={assessment.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-5 px-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-1 ${assessment.iconBg}`}>
                        {assessment.icon}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[15px] font-semibold text-gray-200 group-hover:text-white transition-colors leading-tight">
                          {assessment.title}
                        </span>
                        <span className="text-[13px] font-medium text-gray-500">
                          {assessment.techStack}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest ${
                      assessment.status === 'ACTIVE' 
                        ? 'text-[#00FF87] bg-[#00FF87]/10' 
                        : 'text-gray-400 bg-gray-500/10'
                    }`}>
                      {assessment.status}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-gray-200">{assessment.candidates}</span>
                      <span className="text-[10px] font-bold text-gray-500 tracking-wider">PARTICIPANTS</span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[14px] font-medium text-gray-300">{assessment.createdDate}</span>
                      {assessment.createdBy && (
                        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">
                          {assessment.createdBy}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-5 px-6 text-right pr-10">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-gray-500 hover:text-gray-300 transition-colors p-1.5 rounded-lg hover:bg-white/5">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="text-[#FF3B30]/70 hover:text-[#FF3B30] transition-colors p-1.5 rounded-lg hover:bg-[#FF3B30]/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 px-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1C2331]/30">
          <span className="text-gray-500 text-xs font-semibold tracking-wide">
            Showing 1 - 3 of 24 assessments
          </span>
          <div className="flex items-center gap-2">
            <button className="w-6 h-6 flex items-center justify-center rounded bg-transparent text-gray-500 hover:text-white transition-colors">
              <span className="sr-only">Previous</span>
              &lt;
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded bg-[#00F2FE] text-[#0A0D10] font-bold text-xs">
              &gt;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
