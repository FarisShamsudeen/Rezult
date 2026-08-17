import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { authService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';

interface VerifyOTPProps {
  role: 'candidate' | 'rezulter';
}

export function VerifyOTP({ role }: VerifyOTPProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'user@email.com';
  const purpose = location.state?.purpose || 'registration';
  const { login } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [resendKey, setResendKey] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (!canResend) {
      timer = setTimeout(() => {
        setCanResend(true);
      }, 60000);
    }
    return () => clearTimeout(timer);
  }, [canResend, resendKey]);

  useEffect(() => {
    document.title = 'Rezult - Verify OTP';
  }, []);

  const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6 - index);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[index + i] = pastedData[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    const sanitizedValue = value.replace(/\D/g, '');
    if (!sanitizedValue && value !== '') return;

    if (sanitizedValue.length > 1) {
      const pastedData = sanitizedValue.slice(0, 6 - index);
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[index + i] = pastedData[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = sanitizedValue;
    setOtp(newOtp);

    if (sanitizedValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const borderColors = [
    'border-[#00FF87]/60 focus:border-[#00FF87]', 
    'border-[#00EBD5]/60 focus:border-[#00EBD5]', 
    'border-[#00F2FE]/60 focus:border-[#00F2FE]', 
    'border-[#00B2FF]/60 focus:border-[#00B2FF]', 
    'border-[#0072FF]/60 focus:border-[#0072FF]', 
    'border-[#004FFF]/60 focus:border-[#004FFF]'
  ];

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      return setError('Please enter a valid 6-digit OTP');
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authService.verifyOTP({ email, otp: otpCode, role, purpose });
      if (purpose === 'registration') {
        login(response.data.user, response.data.token);
        navigate('/'); // redirect to dashboard
      } else if (purpose === 'forgot_password') {
        navigate(`/${role}/reset-password`, { state: { email, otp: otpCode } });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      if (purpose === 'forgot_password') {
        await authService.forgotPassword({ email, role });
      } else {
        await authService.resendOTP({ email, role, purpose });
      }
      setCanResend(false);
      setResendKey(prev => prev + 1);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
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

          <style>{`
            @keyframes fillText {
              0% { background-position: 100% 0; }
              100% { background-position: 0% 0; }
            }
            .resend-animating {
              background: linear-gradient(to right, #ffffff 50%, #4b5563 50%);
              background-size: 200% 100%;
              background-position: 100% 0;
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              color: transparent;
              animation: fillText 60s linear forwards;
            }
          `}</style>

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
              <p className="text-white/80 text-center text-sm lg:text-base max-w-[320px] mb-8 leading-relaxed">
                We sent a 6-digit code to {email}. Just pop that code in below to confirm your email.
              </p>

              {/* Form Box */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-[#0A0A0A] p-8 rounded-[24px] shadow-lg border border-white/5"
              >
                {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
                {/* OTP Inputs */}
                <div className="flex justify-between gap-2 mb-8">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={(e) => handlePaste(index, e)}
                      className={`w-11 h-12 lg:w-12 lg:h-14 bg-black border ${borderColors[index]} rounded-xl text-center text-xl text-white outline-none focus:scale-[1.05] transition-all`}
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <button onClick={handleVerify} disabled={isLoading} className="relative w-full py-3.5 rounded-full border border-[#00F2FE]/40 hover:border-transparent overflow-hidden group transition-all shadow-[0_0_15px_rgba(0,242,254,0.1)] hover:shadow-[0_0_25px_rgba(0,242,254,0.3)] mb-6">
                  <div className="absolute inset-0 bg-black transition-opacity duration-300 group-hover:opacity-0" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00FF87] via-[#00F2FE] to-[#0072FF] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative z-10 text-white font-medium group-hover:font-semibold text-lg transition-all">{isLoading ? 'Verifying...' : 'Verify'}</span>
                </button>

                {/* Resend Code Link */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Don't get any code?</span>
                  <button 
                    key={resendKey}
                    onClick={handleResend}
                    disabled={!canResend}
                    className={`font-bold transition-colors ${
                      canResend 
                        ? 'text-white hover:text-[#00FF87]' 
                        : 'resend-animating cursor-progress'
                    }`}
                  >
                    Resend Code
                  </button>
                </div>
              </motion.div>

              {/* Go Back Link */}
              <div className="mt-8 text-center text-sm">
                <span className="text-white/80">Want to Change the Email ? </span>
                <button onClick={() => navigate(-1)} className="text-[#00F2FE] hover:text-[#00FF87] font-bold transition-colors">Go back</button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
