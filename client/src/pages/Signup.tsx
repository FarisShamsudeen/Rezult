import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export function Signup() {
  const [activeTab, setActiveTab] = useState<'candidate' | 'rezulter'>('candidate');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    document.title = 'Rezult - Register Now';
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);
    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: activeTab
      });
      navigate(`/${activeTab}/verify-otp`, { state: { email: formData.email, purpose: 'registration' } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const response = await authService.googleAuth({
          role: activeTab,
          credential: tokenResponse.access_token
        });
        login(response.data.user, response.data.token);
        navigate('/'); // enter session
      } catch (err: any) {
        setError(err.response?.data?.error || 'Google Sign Up failed');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
  });

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

          {/* Right Side - Signup Form */}
          <div className="w-full md:w-[500px] lg:w-[550px] p-8 lg:p-12 flex flex-col items-center relative shrink-0 overflow-y-auto custom-scrollbar">
            
            <div className="w-full max-w-[420px] flex flex-col items-center my-auto py-4"> 

              {/* Title */}
              <h2 className="text-3xl font-orbitron lg:text-4xl font-bold text-center mb-10 tracking-[0.15em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#00FF87] to-[#00F2FE]">
                REGISTER
              </h2>

              {/* Form Section */}
              <div className="relative w-full">
                
                {/* Tabs */}
                <div className="flex items-end gap-3 mb-[-2px] relative z-20 px-8">
                  {(['candidate', 'rezulter'] as const).map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                      <div key={tab} className="relative z-20">
                        {isActive ? (
                          <div className="relative px-6 py-3 cursor-default">
                            <span className="relative z-20 font-medium text-sm text-white capitalize">{tab}</span>
                            
                            <motion.div 
                              layoutId="signupActiveTabBg" 
                              className="absolute inset-0 bg-gradient-to-r from-[#00FF87] via-[#00F2FE] to-[#0072FF] rounded-t-[16px] z-10 p-[2px] pb-0"
                            >
                              <div className="w-full h-full bg-[#050505] rounded-t-[14px] relative">
                                {/* Smooth Left Corner */}
                                <div className="absolute left-[-20px] bottom-0 w-[20px] h-[20px] bg-transparent overflow-hidden">
                                   <div className="absolute top-[-20px] right-[0px] w-[40px] h-[40px] rounded-full border-[2px] border-[#00FF87] shadow-[10px_10px_0_10px_#050505]" />
                                </div>
                                
                                {/* Smooth Right Corner */}
                                <div className="absolute right-[-20px] bottom-0 w-[20px] h-[20px] bg-transparent overflow-hidden">
                                   <div className="absolute top-[-20px] left-[0px] w-[40px] h-[40px] rounded-full border-[2px] border-[#00F2FE] shadow-[-10px_10px_0_10px_#050505]" />
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setActiveTab(tab)}
                            className="bg-[#102428] text-gray-400 hover:text-white px-5 py-1.5 rounded-full text-sm font-medium mb-2 transition-colors z-30 capitalize relative"
                          >
                            {tab}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Form Box */}
                <motion.div 
                  layout
                  className="bg-gradient-to-r from-[#00FF87] via-[#00F2FE] to-[#0072FF] p-[2px] relative z-10 shadow-[0_0_40px_rgba(0,242,254,0.15)] rounded-[24px]"
                >
                  <div className="bg-[#050505] p-6 lg:p-8 rounded-[22px] w-full h-full relative z-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <form onSubmit={handleSubmit}>
                          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
                          
                          {/* Full Name Field */}
                        <div className="mb-5">
                          <label className="block text-white text-sm mb-2 font-medium">
                            Full Name
                          </label>
                          <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-black border border-[#00F2FE]/40 rounded-full px-5 py-3 text-white outline-none focus:border-[#00FF87] transition-colors text-sm"
                          />
                        </div>

                        {/* Email Field */}
                        <div className="mb-5">
                          <label className="block text-white text-sm mb-2 font-medium">
                            Email
                          </label>
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-black border border-[#00F2FE]/40 rounded-full px-5 py-3 text-white outline-none focus:border-[#00FF87] transition-colors text-sm"
                          />
                        </div>

                        {/* Password Field */}
                        <div className="mb-5">
                          <label className="block text-white text-sm mb-2 font-medium">
                            Enter Password
                          </label>
                          <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full bg-black border border-[#00F2FE]/40 rounded-full px-5 py-3 text-white outline-none focus:border-[#00FF87] transition-colors text-sm"
                          />
                        </div>

                        {/* Confirm Password Field */}
                        <div className="mb-6">
                          <label className="block text-white text-sm mb-2 font-medium">
                            Confirm Password
                          </label>
                          <input 
                            type="password" 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full bg-black border border-[#00F2FE]/40 rounded-full px-5 py-3 text-white outline-none focus:border-[#00FF87] transition-colors text-sm"
                          />
                        </div>

                        {/* Sign Up Button */}
                        <button type="submit" disabled={isLoading} className="relative w-full py-3 rounded-full border border-[#00F2FE]/40 hover:border-transparent overflow-hidden group transition-all shadow-[0_0_15px_rgba(0,242,254,0.1)] hover:shadow-[0_0_25px_rgba(0,242,254,0.3)]">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#003B30] to-[#001829] transition-opacity duration-300 group-hover:opacity-0" />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#00FF87] via-[#00F2FE] to-[#0072FF] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <span className="relative z-10 text-white font-medium group-hover:font-semibold text-base transition-all">{isLoading ? 'Loading...' : 'Sign up'}</span>
                        </button>
                        </form>

                        {/* Google Sign Up */}
                        <div className="mt-5 flex justify-center">
                          <button onClick={() => handleGoogleLogin()} type="button" className="flex items-center gap-3 text-[#00F2FE] hover:text-[#00FF87] text-sm font-medium transition-colors">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Sign Up with Google
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Sign In Link */}
              <div className="mt-8 text-center">
                <span className="text-white/60 text-sm">Already have an account ? </span>
                <Link to="/login" className="text-[#00FF87] hover:text-[#00F2FE] text-sm font-bold transition-colors">Sign In</Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
