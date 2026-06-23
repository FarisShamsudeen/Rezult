import { Search, Calendar, RefreshCw, ChevronDown, PenTool, Microscope, ArrowRight } from 'lucide-react';

export function Rezulters() {
  const rezulters = [
    {
      id: 1,
      name: 'Brototype rezulter',
      description: 'Self development through rigorous learning',
      status: 'ACTIVE',
      upcomingExams: 1,
      lastResult: '100%',
      icon: PenTool,
    },
    {
      id: 2,
      name: 'BioSync Labs',
      description: 'Genomic Synthesis & Bio-Computing',
      status: 'ACTIVE',
      upcomingExams: 0,
      lastResult: '92%',
      icon: Microscope,
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto h-full overflow-y-auto pr-2 custom-scrollbar pb-8">

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-wide">
            My rezulters
          </h1>
          <p className="text-white/50 text-sm font-medium">Manage and monitor your affiliated educational partnerships.</p>
        </div>

        <div className="flex items-center gap-2 bg-[#0A0D14] border border-white/5 rounded-[40px] pl-6 pr-2 py-1.5">
          <input
            type="text"
            placeholder="Enter rezulter code or Link"
            className="bg-transparent text-sm text-white outline-none w-52 placeholder:text-white/30 font-medium"
          />
          <button className="text-white text-sm font-medium hover:text-[#00F2FE] transition-colors px-4 py-2 rounded-full hover:bg-white/5">
            Join
          </button>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="bg-[#0A0D14] border border-white/5 rounded-[32px] p-4 flex flex-col md:flex-row items-center gap-4 mb-8">

        <div className="flex-1 w-full relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search your rezulters by name"
            className="w-full bg-[#13111C] border border-white/5 text-white placeholder:text-white/40 text-[15px] font-medium rounded-full py-4 pl-14 pr-6 outline-none focus:border-[#00F2FE]/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex items-center gap-2 bg-[#13111C] border border-white/5 hover:bg-white/5 transition-colors text-white text-sm font-medium rounded-full px-6 py-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            All Statuses
            <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </button>

          <button className="flex items-center gap-2 bg-[#13111C] border border-white/5 hover:bg-white/5 transition-colors text-white text-sm font-medium rounded-full px-6 py-4">
            <Calendar className="w-4 h-4" />
            Join Date
            <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </button>

          <button className="bg-[#13111C] border border-white/5 hover:bg-white/5 transition-colors text-white rounded-full p-4 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* rezulters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rezulters.map((inst) => (
          <div
            key={inst.id}
            className="bg-[#0A0D14] border border-white/5 rounded-[32px] p-6 flex flex-col justify-between hover:border-white/10 transition-colors"
          >
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#13111C] border border-white/5 flex items-center justify-center">
                  <inst.icon className="w-6 h-6 text-[#00EBD5]" />
                </div>
                <div className="px-4 py-1.5 rounded-full border border-[#00EBD5]/30 text-[#00EBD5] text-[10px] font-bold tracking-widest uppercase bg-[#00EBD5]/10">
                  {inst.status}
                </div>
              </div>

              <h2 className="text-[22px] font-bold text-white mb-2 tracking-wide">
                {inst.name}
              </h2>
              <p className="text-white/40 text-sm font-medium mb-8 leading-relaxed pr-4">
                {inst.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#13111C] border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-white/30 text-[11px] font-bold uppercase tracking-wider">
                    Upcoming<br />Exams
                  </span>
                  <span className="text-[#00EBD5] text-[22px] font-bold">
                    {inst.upcomingExams} Exams
                  </span>
                </div>
                <div className="bg-[#13111C] border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                  <span className="text-white/30 text-[11px] font-bold uppercase tracking-wider">
                    Last Result
                  </span>
                  <span className="text-white text-[22px] font-bold mt-auto">
                    {inst.lastResult}
                  </span>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-bold transition-colors group w-fit">
              Chat with rezulter
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
