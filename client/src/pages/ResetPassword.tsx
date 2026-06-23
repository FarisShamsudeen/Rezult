import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { authService } from '../services/auth.service';

interface ResetPasswordProps {
  role: 'candidate' | 'rezulter';
}

export function ResetPassword({ role }: ResetPasswordProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Rezult - Reset Password';
    if (!email) {
      navigate(`/${role}/forgot-password`);
    }
  }, [email, navigate, role]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.resetPassword({ email, newPassword: password, role });
      navigate('/login', { state: { message: 'Password reset successful. Please login.' } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password');
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

          {/* Right Side - Reset Password Form */}
          <div className="w-full md:w-[500px] lg:w-[550px] p-8 lg:p-12 flex flex-col items-center justify-center relative shrink-0">
            
            <div className="w-full max-w-[420px] flex flex-col items-center"> 
              
              {/* Logo Centered */}
              <div className="flex items-center mb-12">
                <img src="/rezult_logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                <span className="text-white font-orbitron font-bold tracking-[0.2em] text-sm uppercase">ezult</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl font-orbitron lg:text-4xl font-bold text-center mb-4 tracking-[0.15em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#00FF87] to-[#00F2FE]">
                NEW PASSWORD
              </h2>
              
              {/* Subtitle */}
              <p className="text-white/80 text-center text-sm lg:text-base max-w-[300px] mb-8 leading-relaxed">
                Enter your new password below.
              </p>

              {/* Form Box */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-[#0A0A0A] p-8 rounded-[24px] shadow-lg border border-white/5"
              >
                <form onSubmit={handleResetPassword}>
                  {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
                  
                  {/* Password Field */}
                  <div className="mb-6">
                    <label className="block text-white text-sm mb-2.5 font-medium">New Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter new password"
                      className="w-full bg-black border border-[#00F2FE]/40 rounded-full px-5 py-3.5 text-white outline-none focus:border-[#00FF87] transition-colors placeholder:text-white/40 text-sm"
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-6">
                    <label className="block text-white text-sm mb-2.5 font-medium">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm new password"
                      className="w-full bg-black border border-[#00F2FE]/40 rounded-full px-5 py-3.5 text-white outline-none focus:border-[#00FF87] transition-colors placeholder:text-white/40 text-sm"
                    />
                  </div>

                  {/* Reset Button */}
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full py-3.5 rounded-full border border-[#00F2FE]/40 hover:border-transparent overflow-hidden group transition-all shadow-[0_0_15px_rgba(0,242,254,0.1)] hover:shadow-[0_0_25px_rgba(0,242,254,0.3)] mb-6"
                  >
                    <div className="absolute inset-0 bg-black transition-opacity duration-300 group-hover:opacity-0" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00FF87] via-[#00F2FE] to-[#0072FF] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="relative z-10 text-white font-medium group-hover:font-semibold text-lg transition-all">{isLoading ? 'Resetting...' : 'Reset Password'}</span>
                  </button>
                </form>

                {/* Back Link */}
                <div className="flex items-center justify-center text-sm">
                  <Link to="/login" className="text-white font-bold hover:text-[#00FF87] transition-colors">
                    Back to Sign In
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
