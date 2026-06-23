import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Calendar() {
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  // Generating 28 days for the 4-week view shown in the mockup
  const days = Array.from({ length: 28 }, (_, i) => i + 1);

  const events = [
    { day: 1, title: 'Database Mgmt', color: 'border-[#00EBD5]/30 text-[#00EBD5] bg-[#00EBD5]/10', dot: 'bg-[#00EBD5]' },
    { day: 3, title: 'System Design', color: 'border-[#0072FF]/30 text-[#0072FF] bg-[#0072FF]/10', dot: 'bg-transparent' },
    { day: 10, title: 'Algorithm Analysis', color: 'border-[#8B5CF6]/30 text-[#8B5CF6] bg-[#8B5CF6]/10', dot: 'bg-transparent' },
    { day: 13, title: '★ Final Exam', color: 'border-[#F59E0B]/30 text-[#F59E0B] bg-[#F59E0B]/10', dot: 'bg-transparent' },
    { day: 18, title: 'Viva Voce', color: 'border-[#EC4899]/30 text-[#EC4899] bg-[#EC4899]/10', dot: 'bg-transparent' },
  ];

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto h-full overflow-hidden pb-8 pr-7">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1 tracking-wide">
            My Calender
          </h1>
          <p className="text-white/50 text-sm font-medium">Checkout the History and Time Schedules</p>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-white hover:text-[#00F2FE] transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            March 2026
          </h2>
          <button className="text-white hover:text-[#00F2FE] transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col bg-transparent rounded-[32px] overflow-hidden gap-1">
        
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {daysOfWeek.map((day) => (
            <div key={day} className="bg-[#052844] py-4 rounded-t-[20px] text-center text-[#00EBD5]/80 text-[11px] font-bold tracking-widest uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-7 gap-1 flex-1">
          {days.map((day) => {
            const isActive = day === 2;
            const event = events.find(e => e.day === day);
            
            return (
              <div 
                key={day} 
                className={`relative p-4 flex flex-col gap-2 rounded-[20px] min-h-[100px] transition-all duration-300
                  ${isActive 
                    ? 'bg-[#00F2FE] shadow-[0_0_40px_rgba(0,242,254,0.4)] z-10 scale-[1.02]' 
                    : 'bg-[#052844] hover:bg-[#07365C]'
                  }
                  ${day > 21 ? 'rounded-b-[20px]' : ''}
                `}
              >
                <span className={`text-[17px] font-bold ${
                  isActive ? 'text-[#050505]' : 'text-[#00EBD5]'
                }`}>
                  {day}
                </span>

                {event && (
                  <div className={`mt-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold leading-tight ${event.color} flex items-start gap-1.5`}>
                    {event.dot !== 'bg-transparent' && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${event.dot}`} />
                    )}
                    <span className="opacity-90">{event.title}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
