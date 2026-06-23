import React, { useState } from 'react';
import { Bell, Paperclip, Send, Download, ChevronDown, FileText } from 'lucide-react';

export function SuperAdminReports() {
  const [activeTab, setActiveTab] = useState('Rezulters');
  const [activeChat, setActiveChat] = useState('1');

  const chatsList = [
    {
      id: '1',
      name: 'Quantum Systems',
      time: '12:45 PM',
      preview: 'Hardware validation reports are ready for',
      pills: [
        { text: 'HIGH PRIORITY', color: 'text-red-400 bg-red-400/10 border border-red-400/20' },
        { text: 'In Progress', color: 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20', dot: true }
      ],
      isActive: true
    },
    {
      id: '2',
      name: 'Nova Research Lab',
      time: 'Yesterday',
      preview: 'Thank you for the prompt update on the...',
      pills: [
        { text: 'SYSTEM', color: 'text-gray-400 bg-gray-400/10 border border-gray-400/20' },
        { text: 'Pending', color: 'text-gray-400 bg-gray-400/10 border border-gray-400/20', dot: true }
      ],
      isActive: false
    },
    {
      id: '3',
      name: 'Ether Core',
      time: 'Oct 24',
      preview: 'Requesting access expansion for the new',
      pills: [
        { text: 'In Progress', color: 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20', dot: true }
      ],
      isActive: false
    },
    {
      id: '4',
      name: 'Apex Informatics',
      time: 'Oct 22',
      preview: 'Compliance documents attached for the...',
      pills: [
        { text: 'Completed', color: 'text-gray-400 bg-gray-400/10 border border-gray-400/20', dot: true }
      ],
      isActive: false
    }
  ];

  return (
    <div className="flex flex-col w-full h-full p-8 overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between mb-8 shrink-0">
        <h1 className="text-[26px] font-bold text-white tracking-wide">
          Reports
        </h1>
        <button className="text-gray-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
        </button>
      </header>

      {/* Main Layout Container */}
      <div className="flex flex-1 gap-6 min-h-0">
        
        {/* Left Pane - List */}
        <div className="w-[380px] flex flex-col shrink-0">
          {/* Tabs */}
          <div className="flex items-center bg-[#161D27] p-1.5 rounded-xl border border-white/5 mb-6">
            <button
              onClick={() => setActiveTab('Rezulters')}
              className={`flex-1 py-2 rounded-lg text-[13px] font-bold tracking-wider transition-colors ${
                activeTab === 'Rezulters'
                  ? 'bg-[#1C3A5A] text-[#60A5FA]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Rezulters
            </button>
            <button
              onClick={() => setActiveTab('Candidates')}
              className={`flex-1 py-2 rounded-lg text-[13px] font-bold tracking-wider transition-colors ${
                activeTab === 'Candidates'
                  ? 'bg-[#1C3A5A] text-[#60A5FA]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Candidates
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto hide-scrollbar space-y-3 pr-2">
            {chatsList.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  chat.isActive
                    ? 'bg-[#121A25] border-l-4 border-l-[#3B82F6] border-y-white/10 border-r-white/10 shadow-lg'
                    : 'bg-[#111827] border-white/5 hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold text-[15px]">{chat.name}</h3>
                  <span className={`text-[11px] font-medium ${chat.isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                    {chat.time}
                  </span>
                </div>
                <p className="text-[13px] text-gray-400 mb-4 truncate">{chat.preview}</p>
                <div className="flex flex-wrap gap-2">
                  {chat.pills.map((pill, idx) => (
                    <span
                      key={idx}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${pill.color}`}
                    >
                      {pill.dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />}
                      {pill.text}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane - Chat Window */}
        <div className="flex-1 bg-[#121822] border border-white/5 rounded-2xl flex flex-col shadow-2xl min-w-0">
          
          {/* Chat Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Quantum Systems</h2>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-400/10 border border-red-400/20">
                  HIGH PRIORITY
                </span>
              </div>
              <p className="text-[13px] font-medium text-gray-400">
                Ticket #é S-2024-889 <span className="mx-2">•</span> Hardware Validation
              </p>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-[13px] font-bold hover:bg-white/10 transition-colors">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              In Progress
              <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
            
            {/* Incoming Message 1 */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[12px] font-bold text-gray-300 uppercase tracking-wider">Quantum Systems</span>
                <span className="text-[11px] font-medium text-gray-600">10:22 AM</span>
              </div>
              <div className="bg-[#1A2332] text-gray-300 text-[14px] leading-relaxed p-5 rounded-2xl rounded-tl-sm max-w-[85%] border border-white/5 shadow-sm">
                System scan complete for the Node-04 cluster. Initial reports indicate a slight latency in the feedback loop. Have you noticed any degradation on the local client side?
              </div>
            </div>

            {/* Outgoing Message */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-medium text-gray-600">11:05 AM</span>
                <span className="text-[12px] font-bold text-[#60A5FA] uppercase tracking-wider">You (Admin)</span>
              </div>
              <div className="bg-[#122F4C] text-gray-200 text-[14px] leading-relaxed p-5 rounded-2xl rounded-tr-sm max-w-[85%] border border-[#1C64F2]/20 shadow-md">
                We've seen consistent performance, but the hardware validation reports are ready for review. I've attached the telemetry data for your verification. Everything seems to be operating within the expected Cyber-Fidelity parameters.
              </div>
            </div>

            {/* System Automated Message (Attachment) */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">System Automated</span>
                <span className="text-[11px] font-medium text-gray-600">11:06 AM</span>
              </div>
              <div className="bg-[#1C2431] border border-white/5 rounded-xl p-4 flex items-center gap-4 max-w-[360px] cursor-pointer hover:bg-white/[0.04] transition-colors">
                <div className="w-10 h-10 rounded-lg bg-[#2A3648] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#60A5FA]" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[14px] font-semibold text-white truncate">Hardware_Report_V4.log</span>
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-0.5">4.2 MB · RAW DATA</span>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors p-1">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Incoming Message 2 */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[12px] font-bold text-gray-300 uppercase tracking-wider">Quantum Systems</span>
                <span className="text-[11px] font-medium text-gray-600">12:45 PM</span>
              </div>
              <div className="bg-[#1A2332] text-gray-300 text-[14px] leading-relaxed p-5 rounded-2xl rounded-tl-sm max-w-[85%] border border-white/5 shadow-sm">
                Confirmed. Reviewing the telemetry now. We will push the patch updates via the terminal if the validation holds.
              </div>
            </div>

          </div>

          {/* Chat Input */}
          <div className="p-6 shrink-0 mt-auto border-t border-white/5 bg-[#121822]">
            <div className="relative flex items-center bg-[#0B0F15] border border-white/10 rounded-xl overflow-hidden focus-within:border-[#1C64F2]/50 transition-colors shadow-inner">
              <button className="pl-5 pr-3 text-gray-500 hover:text-gray-300 transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder="Type your message here..."
                className="flex-1 bg-transparent py-4 px-2 text-sm text-white placeholder:text-gray-600 focus:outline-none"
              />
              <button className="mr-3 ml-2 w-10 h-10 rounded-lg bg-[#00F2FE] hover:bg-[#00D4DF] text-[#0A0D10] flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
            <div className="text-center mt-3">
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                Messages are recorded in the official timeline log.
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
