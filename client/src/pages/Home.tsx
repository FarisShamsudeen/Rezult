import { ArrowUpRight } from 'lucide-react';
import { SwipeButton } from '../components/common/SwipeButton';
import { Link } from 'react-router-dom';
import '../App.css';
import { useEffect } from 'react';

export function Home() {
  useEffect(() => {
    document.title = 'Rezult - The Assessment Management System';
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-4 lg:p-8">

      {/* Outer App Container - Black with rounded corners */}
      <div className="w-full max-w-[1400px] h-[95vh] min-h-[600px] xl:h-[90vh] xl:min-h-[650px] bg-brand-bg rounded-[2rem] md:rounded-[40px] overflow-hidden flex flex-col md:flex-row relative shadow-2xl border border-white/5">

        {/* Left Sidebar Area */}
        <div className="w-full md:w-[300px] pt-8 md:pt-10 lg:pt-12 md:pl-7 md:pr-0 pb-8 md:pb-6 flex flex-col justify-between z-20 shrink-0">

          {/* Logo */}
          <div className="flex flex-col items-start gap-2 px-5 md:px-0">
            <div className="relative w-28 md:w-36 lg:w-40 ml-2">
              <img src="/rezult_logo.png" alt="Rezult Logo" className="w-full h-auto object-contain" />
            </div>
            <span className="text-3xl md:text-4xl font-bold font-orbitron tracking-[0.2em] text-white uppercase mt-1 md:mt-2 ml-4">Rezult</span>
          </div>

          {/* Info Block */}
          <div className="my-auto py-8 md:py-0 px-5">
            <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-3 md:mb-4">Built for Integrity</h3>
            <p className="text-brand-text-secondary text-xs md:text-[13px] leading-relaxed max-w-[280px]">
              Secure, reliable, and fair. We utilize advanced encryption and proctoring tools to ensure that every result is earned through merit and technical stability.
            </p>
          </div>

          {/* Bottom Action Pill */}
          <div className="px-5 md:px-0">
            <SwipeButton />
          </div>
        </div>

        {/* The Cutout Shape for the Pill */}
        <div className="hidden md:block absolute z-10 bg-[#000000] rounded-tr-[35px]"
          style={{ left: '300px', bottom: '24px', width: '85px', height: '60px' }}>

          {/* Top-Left Inner Corner Smoother */}
          <div className="absolute left-0 top-[-30px] w-[30px] h-[30px]"
            style={{ background: 'radial-gradient(circle at 100% 0%, transparent 30px, #000000 30px)' }} />

          {/* Bottom-Right Inner Corner Smoother */}
          <div className="absolute right-[-30px] bottom-0 w-[30px] h-[30px]"
            style={{ background: 'radial-gradient(circle at 100% 0%, transparent 30px, #000000 30px)' }} />
        </div>

        {/* Main Hero Card (Gradient) */}
        <div className="flex-1 bg-hero-gradient rounded-[2rem] md:rounded-[40px] mt-4 mr-4 mb-4 ml-4 md:mt-6 md:mr-6 md:mb-6 md:ml-0 p-8 md:p-10 lg:p-16 flex flex-col justify-center relative overflow-hidden shadow-[-15px_0_40px_rgba(0,0,0,0.6)] z-0">

          <div className="relative z-10 max-w-4xl mt-auto mb-auto md:ml-6 lg:ml-10">
            <h1 className="text-white font-orbitron font-bold text-4xl md:text-5xl lg:text-[4rem] xl:text-[5.5rem] leading-[1.1] tracking-tight mb-6 lg:mb-8">
              Welcome<br />
              to the<br />
              world of <span className="text-white font-black text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[6rem]">Assessments</span>
            </h1>
            <p className="text-white/90 text-base md:text-lg lg:text-[1.15rem] leading-[1.5] md:leading-[1.6] max-w-[700px] font-medium tracking-wide">
              Allowing everybody interested in a borderless evaluation system. Create, manage, and analyze MCQs, One-Word, and Descriptive answer questions from any device, anywhere.
            </p>
          </div>

          {/* CTA Button */}
          <div className="absolute bottom-10 right-10 z-10">
            <Link to="/docs">
              <button className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-6 py-3 flex items-center gap-3 text-white font-medium hover:bg-white/20 transition-all group shadow-lg cursor-pointer">
                <span className="text-sm tracking-wide">Read Documentation</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Subtle overlay gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none rounded-[40px]" />
        </div>

      </div>
    </div>
  )
}
