export function Concerns() {
  const tabs = ['Recent', 'Pending', 'Resolved'];
  
  const concerns = [
    {
      id: 1,
      status: 'In Progress',
      statusColor: 'text-[#5E81AC] border-[#5E81AC]/30 bg-[#5E81AC]/10',
      reportId: '#REP-1088',
      title: 'Incorrect Grade Display',
      description: 'The final grade for Advanced Mathematics does not reflect the...',
      date: 'Nov 05, 2023',
    },
    {
      id: 2,
      status: 'Resolved',
      statusColor: 'text-[#00FF87] border-[#00FF87]/30 bg-[#00FF87]/10',
      reportId: '#REP-1042',
      title: 'Exam Portal Connectivity',
      description: 'Persistent timeout errors encountered while attempting to...',
      date: 'Oct 12, 2023',
    },
    {
      id: 3,
      status: 'Pending',
      statusColor: 'text-[#FF7676] border-[#FF7676]/30 bg-[#FF7676]/10',
      reportId: '#REP-1102',
      title: 'Missing Course Materials',
      description: 'Required reading materials for the Cloud Computing module are not...',
      date: 'Nov 18, 2023',
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto h-full overflow-y-auto pr-2 custom-scrollbar pb-8 pr-8">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        
        {/* Empty left area to match image layout */}
        <div className="w-10 hidden md:block"></div>

        {/* Segmented Control */}
        <div className="flex items-center gap-2">
          {tabs.map((tab, idx) => (
            <button 
              key={tab}
              className={`px-8 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors ${
                idx === 0 
                  ? 'bg-[#1E2538] text-white/90 border border-white/10' 
                  : 'bg-[#131722] text-white/50 hover:text-white/80 border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <button className="bg-[#82C3FE] hover:bg-[#6EB5F6] text-[#050505] font-bold text-sm px-6 py-3 rounded-[14px] transition-colors flex items-center justify-center gap-2 tracking-wide">
          <span>+</span> Send a New Report
        </button>
      </header>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {concerns.map((concern) => (
          <div 
            key={concern.id} 
            className="bg-[#111522] border border-[#1C2333] rounded-[24px] p-8 flex flex-col hover:border-white/10 transition-colors"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-8">
              <div className={`px-4 py-1.5 rounded-full border text-[10px] font-bold tracking-widest uppercase ${concern.statusColor}`}>
                {concern.status}
              </div>
              <span className="text-white/40 text-[11px] font-bold tracking-widest">
                {concern.reportId}
              </span>
            </div>

            {/* Content */}
            <h2 className="text-[#82C3FE] text-lg font-bold mb-3 tracking-wide">
              {concern.title}
            </h2>
            <p className="text-white/50 text-sm font-medium leading-relaxed mb-10">
              {concern.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
              <span className="text-white/40 text-xs font-bold tracking-wider">
                {concern.date}
              </span>
              <button className="text-[#82C3FE] hover:text-white text-xs font-bold transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
