import { useState } from 'react';
import { 
  MapPin, SlidersHorizontal, Database, MonitorPlay, 
  Settings, Clock, Shield, Upload, Plus, Edit2, Trash2, 
  CheckCircle2, Rocket, ArrowLeft, ArrowRight, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SelectQuestionTypeModal } from '../../components/modals/SelectQuestionTypeModal';
import { PremiumFeatureModal } from '../../components/modals/PremiumFeatureModal';

export function RezulterCreateAssessment() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'parameters' | 'question_bank' | 'preview'>('parameters');
  const [isQuestionTypeModalOpen, setIsQuestionTypeModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const handleAddQuestion = (type: string) => {
    console.log('Selected question type:', type);
    // Logic to add a new question goes here
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto h-full overflow-y-auto pr-2 custom-scrollbar pb-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div>
          <h1 className="text-[26px] font-bold text-white mb-1 tracking-wide">
            Setting the Assessment
          </h1>
          <p className="text-white/50 text-[14px] font-medium tracking-wide">
            Create a New Assessment
          </p>
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A2328] border border-white/5 cursor-pointer">
          <MapPin className="w-5 h-5 text-[#FF3B30]" />
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-white/5 pb-4 mt-2">
        <button
          onClick={() => setActiveTab('parameters')}
          className={`flex items-center gap-2 text-[14px] font-bold pb-4 -mb-[17px] border-b-2 transition-all ${
            activeTab === 'parameters' ? 'text-[#00EBD5] border-[#00EBD5]' : 'text-white/40 border-transparent hover:text-white/70'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Parameters
        </button>
        <button
          onClick={() => setActiveTab('question_bank')}
          className={`flex items-center gap-2 text-[14px] font-bold pb-4 -mb-[17px] border-b-2 transition-all ${
            activeTab === 'question_bank' ? 'text-[#00EBD5] border-[#00EBD5]' : 'text-white/40 border-transparent hover:text-white/70'
          }`}
        >
          <Database className="w-4 h-4" />
          Question Bank
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 text-[14px] font-bold pb-4 -mb-[17px] border-b-2 transition-all ${
            activeTab === 'preview' ? 'text-[#00EBD5] border-[#00EBD5]' : 'text-white/40 border-transparent hover:text-white/70'
          }`}
        >
          <MonitorPlay className="w-4 h-4" />
          Preview
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex flex-col gap-6 w-full max-w-[900px] mt-4">
        
        {/* Parameters Tab */}
        {activeTab === 'parameters' && (
          <div className="flex flex-col gap-6">
            {/* Core Configuration */}
            <div className="bg-[#1A2328]/50 border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-8 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-[16px]">Core Configuration</h3>
                    <p className="text-white/40 text-[13px] font-medium">Fundamental identity and scoring logic.</p>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-white/40" />
              </div>

              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="flex-1">
                  <label className="block text-white/60 text-[11px] font-bold uppercase tracking-widest mb-2">
                    Assessment Title
                  </label>
                  <input 
                    type="text" 
                    defaultValue="Logic & Reasoning"
                    className="w-full bg-[#12181C] border border-white/5 text-white text-[14px] font-medium rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#00EBD5]/50 transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-white/60 text-[11px] font-bold uppercase tracking-widest mb-2">
                    Passing Threshold (%)
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      defaultValue="75"
                      className="w-full bg-[#12181C] border border-white/5 text-white text-[14px] font-medium rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#00EBD5]/50 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-[11px] font-bold uppercase tracking-widest mb-2">
                  Duration (In Minutes)
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    defaultValue="60"
                    className="w-full bg-[#12181C] border border-white/5 text-white text-[14px] font-medium rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#00EBD5]/50 transition-colors"
                  />
                  <div className="absolute right-1 top-1 bottom-1 bg-white/5 rounded-lg px-4 flex items-center justify-center">
                    <span className="text-white/40 text-[12px] font-bold">MINS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timing & Availability */}
            <div className="bg-[#1A2328]/50 border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-8 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F57C00]/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#F57C00]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-[16px]">Timing & Availability</h3>
                    <p className="text-white/40 text-[13px] font-medium">Define when the window for entry is active.</p>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-white/40" />
              </div>

              <div className="bg-[#12181C] border border-white/5 rounded-2xl p-5 mb-4 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">Start Date & Time</span>
                  <div className="w-10 h-5 bg-[#00EBD5] rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <input type="date" defaultValue="2024-10-24" className="flex-1 bg-[#1A2328] border border-white/5 text-white text-[14px] font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-[#00EBD5]/50 [color-scheme:dark]" />
                  <input type="time" defaultValue="09:00" className="flex-1 bg-[#1A2328] border border-white/5 text-white text-[14px] font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-[#00EBD5]/50 [color-scheme:dark]" />
                </div>
              </div>

              <div className="bg-[#12181C] border border-white/5 rounded-2xl p-5 mb-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">End Date & Time</span>
                  <div className="w-10 h-5 bg-[#00EBD5] rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <input type="date" defaultValue="2024-10-27" className="flex-1 bg-[#1A2328] border border-white/5 text-white text-[14px] font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-[#00EBD5]/50 [color-scheme:dark]" />
                  <input type="time" defaultValue="18:00" className="flex-1 bg-[#1A2328] border border-white/5 text-white text-[14px] font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-[#00EBD5]/50 [color-scheme:dark]" />
                </div>
              </div>
              
              <div className="bg-[#00EBD5]/10 border border-[#00EBD5]/20 rounded-xl px-4 py-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00EBD5]" />
                <span className="text-[#00EBD5] text-[11px] font-bold uppercase tracking-widest">Timezone: (GMT-05:00) Eastern Time</span>
              </div>
            </div>

            {/* Integrity & Advanced Rules */}
            <div className="bg-[#1A2328]/50 border border-white/5 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-8 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#00EBD5]/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#00EBD5]" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-[16px]">Integrity & Advanced Rules</h3>
                    <p className="text-white/40 text-[13px] font-medium">Security protocols and question randomization.</p>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-white/40" />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors">
                  <div>
                    <h4 className="text-white font-bold text-[14px]">Randomize Question Order</h4>
                    <p className="text-white/40 text-[12px] font-medium">Prevent candidates from sharing sequence answers.</p>
                  </div>
                  <div className="w-10 h-5 bg-[#00EBD5] rounded-full relative cursor-pointer shrink-0">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors">
                  <div>
                    <h4 className="text-white font-bold text-[14px]">Lockdown Browser</h4>
                    <p className="text-white/40 text-[12px] font-medium">Restrict access to other tabs or applications.</p>
                  </div>
                  <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer shrink-0">
                    <div className="w-4 h-4 bg-white/50 rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors">
                  <div>
                    <h4 className="text-white font-bold text-[14px]">Immediate Results</h4>
                    <p className="text-white/40 text-[12px] font-medium">Show final score to candidate immediately after submission.</p>
                  </div>
                  <div className="w-10 h-5 bg-[#00EBD5] rounded-full relative cursor-pointer shrink-0">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Button for Parameters */}
            <div className="flex items-center justify-end mt-4">
              <button 
                onClick={() => setActiveTab('question_bank')}
                className="bg-[#00EBD5] hover:brightness-110 text-black text-[14px] font-bold px-8 py-3.5 rounded-[14px] flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,235,213,0.3)]"
              >
                Next: Question Bank
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Question Bank Tab */}
        {activeTab === 'question_bank' && (
          <div className="flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-[#1A2328]/50 border border-white/5 rounded-2xl px-6 py-4">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="w-5 h-5 rounded border border-white/20 bg-[#12181C] flex items-center justify-center"></div>
                  <span className="text-white/70 text-[14px] font-medium">Select All</span>
                </label>
                <div className="w-px h-6 bg-white/10"></div>
                <span className="text-white/70 text-[14px] font-medium">Total Marks: <strong className="text-white ml-1">45</strong></span>
              </div>
              <div className="flex items-center gap-4">
                <button className="bg-[#12181C] hover:bg-[#12181C]/80 border border-white/5 text-white/70 text-[13px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload JSON
                </button>
                <button 
                  onClick={() => setIsQuestionTypeModalOpen(true)}
                  className="bg-[#00EBD5] hover:brightness-110 text-black text-[13px] font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,235,213,0.3)]"
                >
                  <Plus className="w-4 h-4" />
                  Add New Question
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="flex flex-col gap-6">
              
              {/* Multiple Choice Question */}
              <div className="bg-[#1A2328]/30 border-2 border-[#1A73E8] rounded-3xl p-6 relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1A73E8] text-white flex items-center justify-center font-bold text-[14px]">1</div>
                    <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">Multiple Choice</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#1A73E8] font-bold text-[14px]">10 Points</span>
                    <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-white text-[16px] font-bold mb-6 leading-relaxed">
                  In a microservices architecture, which component is primarily responsible for routing requests to the appropriate service instances and providing load balancing?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#12181C] border border-white/5 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-white/20 transition-colors">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/40 text-[12px] font-bold">A</div>
                    <span className="text-white/70 text-[14px] font-medium flex-1">Message Broker</span>
                    <span className="text-white/20 text-[11px] font-bold bg-white/5 px-2 py-1 rounded">0 PTS</span>
                  </div>
                  <div className="bg-[#00EBD5]/10 border border-[#00EBD5] rounded-2xl p-4 flex items-center gap-4 cursor-pointer">
                    <div className="w-6 h-6 rounded bg-[#00EBD5] flex items-center justify-center text-black text-[12px] font-bold">B</div>
                    <span className="text-white font-bold text-[14px] flex-1">API Gateway</span>
                    <span className="text-[#00EBD5] text-[11px] font-bold bg-[#00EBD5]/20 px-2 py-1 rounded">10 PTS</span>
                    <CheckCircle2 className="w-4 h-4 text-[#00EBD5]" />
                  </div>
                  <div className="bg-[#12181C] border border-white/5 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-white/20 transition-colors">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/40 text-[12px] font-bold">C</div>
                    <span className="text-white/70 text-[14px] font-medium flex-1">Service Registry</span>
                    <span className="text-white/20 text-[11px] font-bold bg-white/5 px-2 py-1 rounded">0 PTS</span>
                  </div>
                  <div className="bg-[#12181C] border border-white/5 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-white/20 transition-colors">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/40 text-[12px] font-bold">D</div>
                    <span className="text-white/70 text-[14px] font-medium flex-1">Reverse Proxy</span>
                    <span className="text-[#1A73E8] text-[11px] font-bold bg-[#1A73E8]/20 px-2 py-1 rounded">5 PTS</span>
                  </div>
                </div>
              </div>

              {/* One Word Question */}
              <div className="bg-[#1A2328]/30 border-2 border-[#00EBD5] rounded-3xl p-6 relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00EBD5] text-black flex items-center justify-center font-bold text-[14px]">2</div>
                    <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">One Word</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#00EBD5] font-bold text-[14px]">10 Points</span>
                  </div>
                </div>
                <h3 className="text-white text-[16px] font-bold mb-6 leading-relaxed">
                  In a relational database, what is the term for a unique identifier for each record in a table?
                </h3>
                <div className="bg-[#12181C] border border-white/5 rounded-xl px-5 py-4 mb-4">
                  <span className="text-white/70 text-[14px] font-medium">Primary Key</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-[#2E7D32]/20 border border-[#2E7D32]/50 rounded-lg px-3 py-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                  <span className="text-[#4CAF50] text-[11px] font-bold uppercase tracking-widest">Correct Answer: PRIMARY KEY</span>
                </div>
              </div>

              {/* Descriptive Question */}
              <div className="bg-[#1A2328]/30 border-2 border-[#F57C00] rounded-3xl p-6 relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F57C00] text-white flex items-center justify-center font-bold text-[14px]">3</div>
                    <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">Descriptive</span>
                    <div className="bg-[#1A73E8] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1 shadow-[0_0_10px_rgba(26,115,232,0.5)]">
                      <Rocket className="w-3 h-3" />
                      Premium AI Grading
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#F57C00] font-bold text-[14px]">25 Points</span>
                  </div>
                </div>
                <h3 className="text-white text-[16px] font-bold mb-6 leading-relaxed">
                  Discuss the strategies for ensuring scalability in a microservices architecture. How do load balancing and horizontal scaling play a role in maintaining performance under high traffic?
                </h3>
                <div className="bg-[#12181C] border border-white/5 rounded-xl h-32 w-full"></div>
              </div>

            </div>

            {/* Action Buttons for Question Bank */}
            <div className="flex items-center justify-between mt-4">
              <button 
                onClick={() => setActiveTab('parameters')}
                className="bg-[#1A2328] hover:bg-[#1A2328]/80 border border-white/10 text-white/70 text-[14px] font-bold px-8 py-3.5 rounded-[14px] flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous: Parameters
              </button>
              <button 
                onClick={() => setActiveTab('preview')}
                className="bg-[#00EBD5] hover:brightness-110 text-black text-[14px] font-bold px-8 py-3.5 rounded-[14px] flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,235,213,0.3)]"
              >
                Next: Preview
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="flex flex-col gap-6">
            
            {/* Preview Header Card */}
            <div className="bg-[#1A2328]/50 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">Points</span>
                    <span className="text-[#00EBD5] text-[24px] font-bold">45</span>
                  </div>
                  <div className="w-px h-10 bg-white/10"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">Total Questions</span>
                    <span className="text-white text-[24px] font-bold">03</span>
                  </div>
                </div>
              </div>
              
              <div className="inline-flex items-center gap-2 bg-[#00EBD5]/10 border border-[#00EBD5]/20 rounded-full px-3 py-1 mb-4">
                <span className="text-[#00EBD5] text-[10px] font-bold uppercase tracking-widest">Preview Mode</span>
              </div>
              
              <h2 className="text-white text-[32px] font-bold mb-4">Logic and Reasoning</h2>
              
              <ul className="flex flex-col gap-2 mb-8">
                <li className="flex items-center gap-2 text-white/70 text-[14px] font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                  Questions will be Randomised
                </li>
                <li className="flex items-center gap-2 text-white/70 text-[14px] font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                  Immediate Results will shown
                </li>
                <li className="flex items-center gap-2 text-white/70 text-[14px] font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                  Candidate Must attain 75% to pass
                </li>
              </ul>

              <div className="flex flex-col sm:flex-row items-center gap-6 border-t border-white/10 pt-6">
                <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                  <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">Assessment Starts At</span>
                  <span className="text-[#00EBD5] text-[16px] font-bold">09:00 AM, 10/24/2024</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                <div className="flex-1 flex flex-col items-center text-center">
                  <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">Maximum Duration</span>
                  <span className="text-[#1A73E8] text-[16px] font-bold">60 Minutes</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                <div className="flex-1 flex flex-col items-center sm:items-end text-center sm:text-right">
                  <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">Assessment Ends At</span>
                  <span className="text-[#00EBD5] text-[16px] font-bold">06:00 PM, 10/27/2024</span>
                </div>
              </div>
            </div>

            {/* Read-Only Questions List for Preview */}
            <div className="flex flex-col gap-6">
              
              {/* Preview Q1 */}
              <div className="bg-[#1A2328]/30 border border-[#1A73E8]/30 rounded-3xl p-6 relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1A73E8] text-white flex items-center justify-center font-bold text-[14px]">1</div>
                    <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">Multiple Choice</span>
                  </div>
                  <span className="text-[#1A73E8] font-bold text-[14px]">10 Points</span>
                </div>
                <h3 className="text-white text-[16px] font-bold mb-6 leading-relaxed">
                  In a microservices architecture, which component is primarily responsible for routing requests to the appropriate service instances and providing load balancing?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#12181C] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/40 text-[12px] font-bold">A</div>
                    <span className="text-white/70 text-[14px] font-medium flex-1">Message Broker</span>
                  </div>
                  <div className="bg-[#2E7D32]/10 border border-[#4CAF50] rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-6 h-6 rounded bg-[#4CAF50] flex items-center justify-center text-white text-[12px] font-bold">B</div>
                    <span className="text-white font-bold text-[14px] flex-1">API Gateway</span>
                    <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                  </div>
                  <div className="bg-[#12181C] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/40 text-[12px] font-bold">C</div>
                    <span className="text-white/70 text-[14px] font-medium flex-1">Service Registry</span>
                  </div>
                  <div className="bg-[#12181C] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/40 text-[12px] font-bold">D</div>
                    <span className="text-white/70 text-[14px] font-medium flex-1">Reverse Proxy</span>
                  </div>
                </div>
              </div>

              {/* Preview Q2 */}
              <div className="bg-[#1A2328]/30 border border-[#1A73E8]/30 rounded-3xl p-6 relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1A73E8] text-white flex items-center justify-center font-bold text-[14px]">2</div>
                    <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">Multiple Choice</span>
                  </div>
                  <span className="text-[#1A73E8] font-bold text-[14px]">10 Points</span>
                </div>
                <h3 className="text-white text-[16px] font-bold mb-6 leading-relaxed">
                  Which of the following database consistency models ensures that all reads receive the most recent write or an error?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#2E7D32]/10 border border-[#4CAF50] rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-6 h-6 rounded bg-[#4CAF50] flex items-center justify-center text-white text-[12px] font-bold">A</div>
                    <span className="text-white font-bold text-[14px] flex-1">Strong Consistency</span>
                    <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                  </div>
                  <div className="bg-[#12181C] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/40 text-[12px] font-bold">B</div>
                    <span className="text-white/70 text-[14px] font-medium flex-1">Eventual Consistency</span>
                  </div>
                  <div className="bg-[#12181C] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/40 text-[12px] font-bold">C</div>
                    <span className="text-white/70 text-[14px] font-medium flex-1">Monotonic Read Consistency</span>
                  </div>
                  <div className="bg-[#12181C] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/40 text-[12px] font-bold">D</div>
                    <span className="text-white/70 text-[14px] font-medium flex-1">Causal Consistency</span>
                  </div>
                </div>
              </div>

              {/* Preview Q3 */}
              <div className="bg-[#1A2328]/30 border border-[#1A73E8]/30 rounded-3xl p-6 relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1A73E8] text-white flex items-center justify-center font-bold text-[14px]">3</div>
                    <span className="text-white/60 text-[11px] font-bold uppercase tracking-widest">Multiple Choice</span>
                  </div>
                  <span className="text-[#1A73E8] font-bold text-[14px]">10 Points</span>
                </div>
                <h3 className="text-white text-[16px] font-bold mb-6 leading-relaxed">
                  What is the primary benefit of implementing 'Circuit Breaker' pattern in distributed systems?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#12181C] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/40 text-[12px] font-bold">A</div>
                    <span className="text-white/70 text-[14px] font-medium flex-1">Reducing network latency</span>
                  </div>
                  <div className="bg-[#12181C] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/40 text-[12px] font-bold">B</div>
                    <span className="text-white/70 text-[14px] font-medium flex-1">Increasing data throughput</span>
                  </div>
                  <div className="bg-[#2E7D32]/10 border border-[#4CAF50] rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-6 h-6 rounded bg-[#4CAF50] flex items-center justify-center text-white text-[12px] font-bold">C</div>
                    <span className="text-white font-bold text-[14px] flex-1">Preventing cascading failures</span>
                    <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                  </div>
                  <div className="bg-[#12181C] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-white/40 text-[12px] font-bold">D</div>
                    <span className="text-white/70 text-[14px] font-medium flex-1">Automating deployment pipelines</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center gap-6 mt-8 pb-8">
              <button 
                onClick={() => setActiveTab('question_bank')}
                className="bg-[#1A2328] hover:bg-[#1A2328]/80 border border-white/10 text-white/70 text-[14px] font-bold px-8 py-4 rounded-full flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Editor
              </button>
              <button 
                onClick={() => setIsPremiumModalOpen(true)}
                className="bg-[#00EBD5] hover:brightness-110 text-black text-[15px] font-bold px-10 py-4 rounded-full flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,235,213,0.3)]"
              >
                Publish Assessment
                <Rocket className="w-5 h-5" />
              </button>
            </div>

          </div>
        )}
      </div>

      <SelectQuestionTypeModal 
        isOpen={isQuestionTypeModalOpen}
        onClose={() => setIsQuestionTypeModalOpen(false)}
        onSelect={handleAddQuestion}
      />

      <PremiumFeatureModal 
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onContinue={(plan) => {
          console.log('Selected premium plan:', plan);
          // Navigate to a checkout page or next step
          // navigate('/assessments');
        }}
      />
    </div>
  );
}
