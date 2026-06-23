import { Search, Calendar, Clock, RefreshCw, ChevronDown } from 'lucide-react';

export function Assessments() {
  const exams = [
    {
      id: 1,
      title: 'Database Management',
      rezulter: 'Brototype rezulter',
      date: 'Today, 10:00 AM',
      duration: '90 Minutes Duration',
    },
    {
      id: 2,
      title: 'MERN Core Concepts',
      rezulter: 'Brototype rezulter',
      date: 'Today, 04:00 PM',
      duration: '90 Minutes Duration',
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto h-full overflow-y-auto pr-8 custom-scrollbar pb-8">

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-wide">
            My Exams
          </h1>
          <p className="text-white/50 text-sm font-medium">Manage your schedule and access your assessments</p>
        </div>

        <div className="flex items-center gap-2 bg-[#0A0D14] border border-white/5 rounded-[40px] pl-6 pr-2 py-1.5">
          <input
            type="text"
            placeholder="Enter exam code or Link"
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
            placeholder="Search Exams by topic or rezulter"
            className="w-full bg-[#13111C] border border-white/5 text-white placeholder:text-white/40 text-[15px] font-medium rounded-full py-4 pl-14 pr-6 outline-none focus:border-[#00F2FE]/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button className="flex items-center gap-2 bg-[#13111C] border border-white/5 hover:bg-white/5 transition-colors text-white text-sm font-medium rounded-full px-6 py-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Upcoming Exams
            <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </button>

          <button className="flex items-center gap-2 bg-[#13111C] border border-white/5 hover:bg-white/5 transition-colors text-white text-sm font-medium rounded-full px-6 py-4">
            <Calendar className="w-4 h-4" />
            Latest to oldest
            <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </button>

          <button className="bg-[#13111C] border border-white/5 hover:bg-white/5 transition-colors text-white rounded-full p-4 flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-gradient-to-r from-[#00EBD5] to-[#0072FF] rounded-[24px] p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_0_30px_rgba(0,242,254,0.3)]"
          >
            {/* Inner top highlight */}
            <div className="absolute top-0 inset-x-0 h-4 bg-white/20 rounded-t-[24px]" />

            <div className="flex justify-between items-start z-10">
              <div className="flex flex-col gap-1">
                <h2 className="text-[28px] font-bold text-white tracking-wide leading-tight">
                  {exam.title}
                </h2>
                <p className="text-white/90 text-[15px] font-medium">
                  {exam.rezulter}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-12 z-10">
              <div className="flex items-center gap-6 text-white text-[13px] font-bold">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {exam.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {exam.duration}
                </span>
              </div>

              <button className="px-8 py-2.5 rounded-[40px] border-2 border-white text-white font-bold text-sm hover:bg-white hover:text-[#0072FF] transition-colors shrink-0">
                Join Now
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
