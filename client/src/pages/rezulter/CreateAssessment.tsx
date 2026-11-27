import { useState } from 'react';
import { 
  SlidersHorizontal, Database, MonitorPlay, 
  Settings, Shield, Plus, Edit2, Trash2, 
  CheckCircle2, Rocket, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SelectQuestionTypeModal } from '../../components/modals/SelectQuestionTypeModal';
import { QuestionModal } from '../../components/modals/QuestionModal';
import { assessmentService, type CreateQuestionDTO, type CreateAssessmentDTO } from '../../services/assessment.service';

export function RezulterCreateAssessment() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'parameters' | 'question_bank' | 'preview'>('parameters');
  const [isQuestionTypeModalOpen, setIsQuestionTypeModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState<'mcq' | 'one_word' | 'descriptive'>('mcq');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateAssessmentDTO>({
    title: 'Full Stack Engineering Evaluation',
    description: 'Comprehensive exam covering React, Node.js, and relational database design.',
    durationInMinutes: 45,
    passingThreshold: 70,
    scheduledStartTime: new Date(),
    scheduledEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isQuestionsInOrder: false,
    isImmediateResult: true,
    isRestrictedOthers: true,
    timezone: 'UTC',
    questions: [
      {
        questionType: 'mcq',
        questionText: 'In a microservices architecture, which component is primarily responsible for routing requests and load balancing?',
        maxMarks: 10,
        displayOptions: [
          { optText: 'Message Broker', isAnswer: false, optMark: 0 },
          { optText: 'API Gateway', isAnswer: true, optMark: 10 },
          { optText: 'Service Registry', isAnswer: false, optMark: 0 },
          { optText: 'Reverse Proxy', isAnswer: false, optMark: 0 }
        ]
      },
      {
        questionType: 'one_word',
        questionText: 'In a relational database, what is the term for a unique identifier for each record in a table?',
        maxMarks: 10,
        correctOneWordAnswer: 'PRIMARY KEY'
      },
      {
        questionType: 'descriptive',
        questionText: 'Discuss strategies for ensuring scalability in a distributed architecture, including horizontal scaling and caching.',
        maxMarks: 20,
        referenceAnswer: 'Should cover horizontal scaling, Redis caching, database read replicas, and stateless service design.'
      }
    ]
  });

  const handleSelectQuestionType = (type: string) => {
    let normalizedType: 'mcq' | 'one_word' | 'descriptive' = 'mcq';
    if (type === 'one_word' || type === 'oneWord') normalizedType = 'one_word';
    else if (type === 'descriptive') normalizedType = 'descriptive';
    
    setSelectedQuestionType(normalizedType);
    setCurrentEditingIndex(null);
    setIsQuestionModalOpen(true);
  };

  const handleEditQuestion = (index: number) => {
    const q = formData.questions[index];
    setSelectedQuestionType(q.questionType);
    setCurrentEditingIndex(index);
    setIsQuestionModalOpen(true);
  };

  const handleDeleteQuestion = (index: number) => {
    if (formData.questions.length <= 1) {
      alert('An assessment must have at least one question.');
      return;
    }
    const confirmDelete = window.confirm('Are you sure you want to delete this question?');
    if (confirmDelete) {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSaveQuestion = (question: CreateQuestionDTO) => {
    if (currentEditingIndex !== null) {
      // Edit existing
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.map((q, i) => i === currentEditingIndex ? question : q)
      }));
    } else {
      // Add new
      setFormData(prev => ({
        ...prev,
        questions: [...prev.questions, question]
      }));
    }
  };

  const totalPoints = formData.questions.reduce((sum, q) => sum + (q.maxMarks || 0), 0);

  const submitAssessment = async () => {
    if (!formData.title.trim()) {
      alert('Please enter an assessment title');
      setActiveTab('parameters');
      return;
    }

    if (formData.questions.length === 0) {
      alert('Please add at least one question');
      setActiveTab('question_bank');
      return;
    }

    try {
      setIsSubmitting(true);
      await assessmentService.createAssessment(formData);
      navigate('/assessments');
    } catch (error: any) {
      console.error('Failed to create assessment', error);
      alert(error.response?.data?.error || error.response?.data?.message || 'Failed to create assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto h-full overflow-y-auto pr-4 custom-scrollbar pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
        <div>
          <h1 className="text-[26px] font-bold text-white mb-1 tracking-wide">
            Create Assessment
          </h1>
          <p className="text-white/50 text-[14px] font-medium tracking-wide">
            Design your examination, configure rules, and curate questions.
          </p>
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
          Question Bank ({formData.questions.length})
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 text-[14px] font-bold pb-4 -mb-[17px] border-b-2 transition-all ${
            activeTab === 'preview' ? 'text-[#00EBD5] border-[#00EBD5]' : 'text-white/40 border-transparent hover:text-white/70'
          }`}
        >
          <MonitorPlay className="w-4 h-4" />
          Preview & Publish
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex flex-col gap-6 w-full max-w-[950px] mt-4">
        
        {/* Parameters Tab */}
        {activeTab === 'parameters' && (
          <div className="flex flex-col gap-6">
            {/* Core Configuration */}
            <div className="bg-[#12181C] border border-white/5 rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-white/70" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-[16px]">Core Configuration</h3>
                  <p className="text-white/40 text-[13px] font-medium">Fundamental identity, timing, and passing thresholds.</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-white/60 text-[11px] font-bold uppercase tracking-widest mb-2">
                    Assessment Title
                  </label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Distributed Systems & Microservices Quiz"
                    className="w-full bg-[#1A2328] border border-white/5 text-white text-[14px] font-medium rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#00EBD5]/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-[11px] font-bold uppercase tracking-widest mb-2">
                    Description & Instructions
                  </label>
                  <textarea 
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide overview, guidelines, or instructions for the candidates..."
                    className="w-full bg-[#1A2328] border border-white/5 text-white text-[14px] font-medium rounded-xl p-4 focus:outline-none focus:border-[#00EBD5]/50 transition-colors"
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <label className="block text-white/60 text-[11px] font-bold uppercase tracking-widest mb-2">
                      Duration (Minutes)
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        min={5}
                        max={300}
                        value={formData.durationInMinutes}
                        onChange={(e) => setFormData(prev => ({ ...prev, durationInMinutes: Number(e.target.value) }))}
                        className="w-full bg-[#1A2328] border border-white/5 text-white text-[14px] font-medium rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#00EBD5]/50 transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-xs font-bold">MINS</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-white/60 text-[11px] font-bold uppercase tracking-widest mb-2">
                      Passing Threshold (%)
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        min={0}
                        max={100}
                        value={formData.passingThreshold}
                        onChange={(e) => setFormData(prev => ({ ...prev, passingThreshold: Number(e.target.value) }))}
                        className="w-full bg-[#1A2328] border border-white/5 text-white text-[14px] font-medium rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#00EBD5]/50 transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Integrity & Rules */}
            <div className="bg-[#12181C] border border-white/5 rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00EBD5]/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#00EBD5]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-[16px]">Integrity & Proctoring Options</h3>
                  <p className="text-white/40 text-[13px] font-medium">Control exam flow, result publication, and anti-cheating mechanisms.</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div 
                  onClick={() => setFormData(prev => ({ ...prev, isImmediateResult: !prev.isImmediateResult }))}
                  className="flex items-center justify-between p-4 bg-[#1A2328]/50 hover:bg-[#1A2328] rounded-2xl transition-colors cursor-pointer border border-white/5"
                >
                  <div>
                    <h4 className="text-white font-bold text-[14px]">Immediate Results & Solution Review</h4>
                    <p className="text-white/40 text-[12px] font-medium">Show score breakdown and correct answers right after candidate submits.</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative shrink-0 transition-colors ${formData.isImmediateResult ? 'bg-[#00EBD5]' : 'bg-white/10'}`}>
                    <div className={`w-4 h-4 rounded-full absolute top-0.5 shadow-sm transition-all ${formData.isImmediateResult ? 'bg-white right-0.5' : 'bg-white/50 left-0.5'}`} />
                  </div>
                </div>

                <div 
                  onClick={() => setFormData(prev => ({ ...prev, isQuestionsInOrder: !prev.isQuestionsInOrder }))}
                  className="flex items-center justify-between p-4 bg-[#1A2328]/50 hover:bg-[#1A2328] rounded-2xl transition-colors cursor-pointer border border-white/5"
                >
                  <div>
                    <h4 className="text-white font-bold text-[14px]">Randomize Question Order</h4>
                    <p className="text-white/40 text-[12px] font-medium">Present questions in scrambled sequence for each candidate.</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative shrink-0 transition-colors ${formData.isQuestionsInOrder ? 'bg-[#00EBD5]' : 'bg-white/10'}`}>
                    <div className={`w-4 h-4 rounded-full absolute top-0.5 shadow-sm transition-all ${formData.isQuestionsInOrder ? 'bg-white right-0.5' : 'bg-white/50 left-0.5'}`} />
                  </div>
                </div>

                <div 
                  onClick={() => setFormData(prev => ({ ...prev, isRestrictedOthers: !prev.isRestrictedOthers }))}
                  className="flex items-center justify-between p-4 bg-[#1A2328]/50 hover:bg-[#1A2328] rounded-2xl transition-colors cursor-pointer border border-white/5"
                >
                  <div>
                    <h4 className="text-white font-bold text-[14px]">Anti-Cheat Browser Tracking</h4>
                    <p className="text-white/40 text-[12px] font-medium">Detect tab switching, blur events, and record warnings during the session.</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full relative shrink-0 transition-colors ${formData.isRestrictedOthers ? 'bg-[#00EBD5]' : 'bg-white/10'}`}>
                    <div className={`w-4 h-4 rounded-full absolute top-0.5 shadow-sm transition-all ${formData.isRestrictedOthers ? 'bg-white right-0.5' : 'bg-white/50 left-0.5'}`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end mt-4">
              <button 
                onClick={() => setActiveTab('question_bank')}
                className="bg-[#00EBD5] hover:brightness-110 text-black text-[14px] font-bold px-8 py-3.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,235,213,0.3)]"
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
            <div className="flex items-center justify-between bg-[#12181C] border border-white/5 rounded-2xl px-6 py-4">
              <div className="flex items-center gap-6">
                <span className="text-white/70 text-[14px] font-medium">
                  Total Questions: <strong className="text-white ml-1">{formData.questions.length}</strong>
                </span>
                <div className="w-px h-6 bg-white/10" />
                <span className="text-white/70 text-[14px] font-medium">
                  Total Points: <strong className="text-[#00EBD5] ml-1">{totalPoints}</strong>
                </span>
              </div>
              <button 
                onClick={() => setIsQuestionTypeModalOpen(true)}
                className="bg-[#00EBD5] hover:brightness-110 text-black text-[13px] font-bold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,235,213,0.3)]"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            {/* Questions List */}
            <div className="flex flex-col gap-6">
              {formData.questions.map((question, idx) => (
                <div 
                  key={idx}
                  className="bg-[#12181C] border border-white/5 hover:border-white/10 rounded-3xl p-6 relative transition-all"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center font-bold text-[14px]">
                        {idx + 1}
                      </div>
                      <span className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-white/5 text-[#00EBD5]">
                        {question.questionType.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[#00EBD5] font-bold text-[14px]">
                        {question.maxMarks} PTS
                      </span>
                      <button 
                        onClick={() => handleEditQuestion(idx)}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        title="Edit question"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteQuestion(idx)}
                        className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-white text-[15px] font-medium mb-4 leading-relaxed">
                    {question.questionText}
                  </h3>

                  {/* MCQ Options Display */}
                  {question.questionType === 'mcq' && question.displayOptions && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {question.displayOptions.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-3.5 rounded-xl border flex items-center justify-between text-sm ${
                            opt.isAnswer 
                              ? 'bg-[#00EBD5]/10 border-[#00EBD5] text-white font-semibold' 
                              : 'bg-[#1A2328] border-white/5 text-white/70'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-xs font-bold text-white/50">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>{opt.optText}</span>
                          </div>
                          {opt.isAnswer && (
                            <CheckCircle2 className="w-4 h-4 text-[#00EBD5] shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* One Word Answer Display */}
                  {question.questionType === 'one_word' && (
                    <div className="bg-[#1A2328] border border-white/5 rounded-xl p-3.5 flex items-center gap-3">
                      <span className="text-xs text-white/40 uppercase font-bold tracking-wider">Correct Key:</span>
                      <span className="text-sm font-bold text-[#00EBD5]">{question.correctOneWordAnswer}</span>
                    </div>
                  )}

                  {/* Descriptive Reference Answer Display */}
                  {question.questionType === 'descriptive' && (
                    <div className="bg-[#1A2328] border border-white/5 rounded-xl p-3.5 flex flex-col gap-1">
                      <span className="text-xs text-white/40 uppercase font-bold tracking-wider">Evaluation Rubric / Reference:</span>
                      <span className="text-sm text-white/80">{question.referenceAnswer || 'Manual grading'}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-4">
              <button 
                onClick={() => setActiveTab('parameters')}
                className="bg-[#12181C] hover:bg-[#12181C]/80 border border-white/10 text-white/70 text-[14px] font-bold px-8 py-3.5 rounded-full flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Parameters
              </button>
              <button 
                onClick={() => setActiveTab('preview')}
                className="bg-[#00EBD5] hover:brightness-110 text-black text-[14px] font-bold px-8 py-3.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,235,213,0.3)]"
              >
                Next: Preview & Publish
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="flex flex-col gap-6">
            
            {/* Assessment Summary Card */}
            <div className="bg-[#12181C] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-[#00EBD5]/10 border border-[#00EBD5]/20 rounded-full px-3 py-1 mb-3">
                    <span className="text-[#00EBD5] text-[10px] font-bold uppercase tracking-widest">Ready for Publication</span>
                  </div>
                  <h2 className="text-white text-2xl md:text-3xl font-extrabold">{formData.title}</h2>
                  <p className="text-white/60 text-sm mt-1">{formData.description || 'No description provided'}</p>
                </div>

                <div className="flex items-center gap-6 bg-[#1A2328] p-4 rounded-2xl border border-white/5 shrink-0">
                  <div className="flex flex-col items-center">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Points</span>
                    <span className="text-[#00EBD5] text-2xl font-bold">{totalPoints}</span>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="flex flex-col items-center">
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Questions</span>
                    <span className="text-white text-2xl font-bold">{formData.questions.length}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1A2328] p-4 rounded-xl border border-white/5">
                  <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest block mb-1">Duration</span>
                  <span className="text-white font-bold text-sm">{formData.durationInMinutes} Minutes</span>
                </div>
                <div className="bg-[#1A2328] p-4 rounded-xl border border-white/5">
                  <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest block mb-1">Pass Mark</span>
                  <span className="text-[#00EBD5] font-bold text-sm">{formData.passingThreshold}%</span>
                </div>
                <div className="bg-[#1A2328] p-4 rounded-xl border border-white/5">
                  <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest block mb-1">Instant Results</span>
                  <span className="text-white font-bold text-sm">{formData.isImmediateResult ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="bg-[#1A2328] p-4 rounded-xl border border-white/5">
                  <span className="text-white/40 text-[11px] font-bold uppercase tracking-widest block mb-1">Anti-Cheat</span>
                  <span className="text-emerald-400 font-bold text-sm">Active</span>
                </div>
              </div>
            </div>

            {/* Questions Inspection */}
            <div className="flex flex-col gap-4">
              <h3 className="text-white font-bold text-lg">Question List Review</h3>
              {formData.questions.map((q, idx) => (
                <div key={idx} className="bg-[#12181C] border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-extrabold text-[#00EBD5]">Question {idx + 1} ({q.questionType.replace('_', ' ')})</span>
                    <span className="text-xs font-bold text-white/60">{q.maxMarks} PTS</span>
                  </div>
                  <p className="text-white text-sm font-medium">{q.questionText}</p>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-center gap-6 mt-6 pb-8">
              <button 
                onClick={() => setActiveTab('question_bank')}
                className="bg-[#12181C] hover:bg-[#12181C]/80 border border-white/10 text-white/70 text-[14px] font-bold px-8 py-4 rounded-full flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Questions
              </button>
              <button 
                onClick={submitAssessment}
                disabled={isSubmitting}
                className="bg-[#00EBD5] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-black text-[15px] font-bold px-10 py-4 rounded-full flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,235,213,0.3)]"
              >
                {isSubmitting ? 'Creating Assessment...' : 'Publish Assessment'}
                {!isSubmitting && <Rocket className="w-5 h-5" />}
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Select Type Modal */}
      <SelectQuestionTypeModal 
        isOpen={isQuestionTypeModalOpen}
        onClose={() => setIsQuestionTypeModalOpen(false)}
        onSelect={handleSelectQuestionType}
      />

      {/* Question Add / Edit Modal */}
      <QuestionModal
        isOpen={isQuestionModalOpen}
        questionType={selectedQuestionType}
        initialData={currentEditingIndex !== null ? formData.questions[currentEditingIndex] : null}
        onClose={() => setIsQuestionModalOpen(false)}
        onSave={handleSaveQuestion}
      />
    </div>
  );
}
