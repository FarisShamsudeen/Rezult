import { ArrowLeft, BookOpen, Shield, Users, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Docs() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-12 overflow-y-auto custom-scrollbar relative">
      {/* Subtle Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00FF87]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#00F2FE]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Navigation */}
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00FF87] transition-colors mb-10 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-widest uppercase">Back to Home</span>
        </Link>

        {/* Header */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <BookOpen className="w-4 h-4 text-[#00F2FE]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-300">Official Documentation</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-orbitron font-bold uppercase tracking-tight leading-[1.1] mb-6">
            Rezult <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00FF87] to-[#00F2FE]">
              Platform Guide
            </span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl font-medium">
            A comprehensive overview of the Rezult assessment ecosystem, roles, and capabilities designed for seamless evaluations from anywhere.
          </p>
        </header>

        {/* Roles Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-orbitron font-bold uppercase tracking-wider mb-8 text-white border-b border-white/10 pb-4">
            System Roles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Super Admin */}
            <div className="bg-[#111620] border border-white/5 p-8 rounded-3xl hover:border-[#00FF87]/30 transition-colors group">
              <Shield className="w-10 h-10 text-[#00FF87] mb-6" />
              <h3 className="text-xl font-bold mb-3 uppercase tracking-wider">Super Admin</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The master controller. Super Admins have unrestricted access to manage Rezulters, oversee global Candidate pools, monitor system health, and manage global settings.
              </p>
            </div>

            {/* Rezulter */}
            <div className="bg-[#111620] border border-white/5 p-8 rounded-3xl hover:border-[#00F2FE]/30 transition-colors group">
              <Target className="w-10 h-10 text-[#00F2FE] mb-6" />
              <h3 className="text-xl font-bold mb-3 uppercase tracking-wider">Rezulter</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The evaluators and organizations. Rezulters create assessments, manage their specific pool of candidates, grade descriptive answers, and analyze reports.
              </p>
            </div>

            {/* Candidate */}
            <div className="bg-[#111620] border border-white/5 p-8 rounded-3xl hover:border-[#0072FF]/30 transition-colors group">
              <Users className="w-10 h-10 text-[#0072FF] mb-6" />
              <h3 className="text-xl font-bold mb-3 uppercase tracking-wider">Candidate</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The test-takers. Candidates log in to view assigned assessments, take tests in real-time, view their results, and track their performance history securely.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-orbitron font-bold uppercase tracking-wider mb-8 text-white border-b border-white/10 pb-4">
            Core Architecture
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-white/5 to-transparent border border-white/5 p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-3 text-[#00FF87]">Authentication & Security</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                Rezult employs robust JWT-based authentication ensuring isolated sessions across different roles. Features include encrypted passwords, role-based middleware guarding backend routes, and secure HTTP-only configurations.
              </p>
            </div>

            <div className="bg-gradient-to-r from-white/5 to-transparent border border-white/5 p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-3 text-[#00F2FE]">Dynamic Assessments</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                A flexible schema allowing MCQs, One-Word, and Descriptive answers. Includes AI-powered automated grading for quick evaluations and manual overrides for nuanced grading.
              </p>
            </div>

            <div className="bg-gradient-to-r from-white/5 to-transparent border border-white/5 p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-3 text-[#0072FF]">Modern Stack</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                Built on a bleeding-edge stack featuring React & Vite for lightning-fast client delivery, Tailwind CSS v4 for dynamic glassmorphic aesthetics, Node.js/Express for stable networking, and MongoDB for scalable document storage.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
