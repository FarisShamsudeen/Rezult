import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { authService } from '../services/auth.service';

interface ForgotPasswordProps {
  role: 'candidate' | 'rezulter';
}

export function ForgotPassword({ role }: ForgotPasswordProps) {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Rezult - Email Verification';
  }, []);

  const handleSendOTP = async () => {
    if (!email) {
      return setError('Please enter your email');
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.forgotPassword({ email, role });
      navigate(`/${role}/verify-otp`, { state: { email, purpose: 'forgot_password' } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 lg:p-8">
      
      {/* Outer App Container with Glowing Gradient Border */}
      <div className="w-full max-w-[1400px] h-[90vh] min-h-[650px] rounded-[42px] p-[2px] bg-gradient-to-r from-[#00FF87] via-[#00F2FE] to-[#0072FF] shadow-[0_0_40px_rgba(0,242,254,0.15)] relative">
        
        {/* Inner Black Container */}
        <div className="w-full h-full bg-[#050505] rounded-[40px] flex flex-col md:flex-row relative overflow-hidden">
          
          {/* Left Side - Isolated Gradient Hero Card */}
          <div className="hidden md:flex flex-1 p-5 lg:p-8">
            <div className="w-full h-full bg-hero-gradient rounded-[30px] p-10 lg:p-14 flex flex-col justify-end relative z-0 overflow-hidden shadow-2xl">
              <div className="relative z-10 max-w-xl mb-6">
                <h1 className="text-white font-orbitron font-bold text-5xl lg:text-7xl leading-[1.05] tracking-tight mb-6 uppercase">
                  WE <br />
                  ASSESS FROM<br />
                  ANYWHERE.
                </h1>
                <p className="text-white/90 text-lg lg:text-[1.15rem] leading-[1.6] max-w-[700px] font-medium tracking-wide">
                  Allowing everybody interested in a borderless evaluation system. Create, manage, and analyze MCQs, One-Word, and Descriptive answer questions from any device, anywhere.
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right Side - Verification Form */}
          <div className="w-full md:w-[500px] lg:w-[550px] p-8 lg:p-12 flex flex-col items-center justify-center relative shrink-0">
            
            <div className="w-full max-w-[420px] flex flex-col items-center"> 
              
              {/* Logo Centered */}
              <div className="flex items-center mb-12">
                <img src="/rezult_logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                <span className="text-white font-orbitron font-bold tracking-[0.2em] text-sm uppercase">ezult</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-orbitron lg:text-4xl font-bold text-center mb-4 tracking-[0.15em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#00FF87] to-[#00F2FE]">
                VERIFICATION
              </h2>
              
              {/* Subtitle */}
              <p className="text-white/80 text-center text-sm lg:text-base max-w-[300px] mb-8 leading-relaxed">
                Enter your email to send One Time Password (OTP) for verification.
              </p>

              {/* Form Box */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-[#0A0A0A] p-8 rounded-[24px] shadow-lg border border-white/5"
              >
                {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
                {/* Email Field */}
                <div className="mb-6">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-black border border-[#00F2FE]/40 rounded-full px-5 py-3.5 text-white outline-none focus:border-[#00FF87] transition-colors placeholder:text-white/40 text-sm"
                  />
                </div>

                {/* Send OTP Button */}
                <button 
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="relative w-full py-3.5 rounded-full border border-[#00F2FE]/40 hover:border-transparent overflow-hidden group transition-all shadow-[0_0_15px_rgba(0,242,254,0.1)] hover:shadow-[0_0_25px_rgba(0,242,254,0.3)] mb-6"
                >
                  <div className="absolute inset-0 bg-black transition-opacity duration-300 group-hover:opacity-0" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00FF87] via-[#00F2FE] to-[#0072FF] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative z-10 text-white font-medium group-hover:font-semibold text-lg transition-all">{isLoading ? 'Sending...' : 'Send the OTP'}</span>
                </button>

                {/* Remember Password Link */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Remembered your password?</span>
                  <Link to="/login" className="text-white font-bold hover:text-[#00FF87] transition-colors">
                    Sign In
                  </Link>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
