import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').regex(/^\S+$/, 'Password cannot contain spaces')
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function Login() {
  const [activeTab, setActiveTab] = useState<'candidate' | 'rezulter'>('candidate');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = watch('email', '');

  useEffect(() => {
    document.title = 'Rezult - Login Now';
  }, []);

  const onSubmit = async (data: LoginFormInputs) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
        role: activeTab
      });
      login(response.data.user, response.data.token);
      navigate('/'); // redirect to dashboard
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
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
        setError(err.response?.data?.error || 'Google Sign In failed');
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
                <p className="text-white/90 text-lg lg:text-xl leading-relaxed max-w-sm font-medium tracking-wide">
                  Create, manage, and analyze asessments from any device from anywhere.
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-[500px] lg:w-[550px] p-8 lg:p-12 flex flex-col items-center relative shrink-0 overflow-y-auto custom-scrollbar">

            <div className="w-full max-w-[420px] flex flex-col items-center my-auto py-4"> 
              
              {/* Logo Centered */}
              <Link to="/" className="flex items-center mb-8 hover:opacity-80 transition-opacity">
                <img src="/rezult_logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                <span className="text-white font-orbitron font-bold tracking-[0.2em] text-sm uppercase">ezult</span>
              </Link>

              {/* Title */}
              <h2 className="text-3xl font-orbitron lg:text-4xl font-bold text-center mb-12 tracking-[0.15em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#00FF87] to-[#00F2FE]">
                WELCOME BACK
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
                              layoutId="activeTabBg" 
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
                            type="button"
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
                  <div className="bg-[#050505] p-8 rounded-[22px] w-full h-full relative z-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <AnimatePresence>
                            {error && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="text-red-500 text-sm text-center bg-red-500/10 py-2 px-4 rounded-lg border border-red-500/20"
                              >
                                {error}
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                        {/* Email Field */}
                        <div className="mb-6">
                          <label className="block text-white text-sm mb-2.5 font-medium">
                            {activeTab === 'candidate' ? "Candidate's Email" : "Rezulter Email"}
                          </label>
                          <input 
                            type="email" 
                            {...register('email')}
                            className={`w-full bg-black border ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#00F2FE]/40 focus:border-[#00FF87]'} rounded-full px-5 py-3.5 text-white outline-none transition-colors`}
                          />
                          <AnimatePresence>
                            {errors.email && (
                              <motion.p
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="text-red-500 text-xs ml-4"
                              >
                                {errors.email.message}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Password Field */}
                        <div className="mb-6">
                          <label className="block text-white text-sm mb-2.5 font-medium">
                            Password
                          </label>
                          <input 
                            type="password" 
                            {...register('password')}
                            className={`w-full bg-black border ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-[#00F2FE]/40 focus:border-[#00FF87]'} rounded-full px-5 py-3.5 text-white outline-none transition-colors`}
                          />
                          <AnimatePresence>
                            {errors.password && (
                              <motion.p
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="text-red-500 text-xs ml-4"
                              >
                                {errors.password.message}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between mb-8">
                          <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative w-11 h-6 bg-black border border-white/70 rounded-full transition-colors group-hover:border-[#00FF87]">
                              <div className="absolute left-[3px] top-[3px] w-4 h-4 bg-white/90 rounded-full transition-transform" />
                            </div>
                            <span className="text-white/90 text-sm font-medium">Remember Me</span>
                          </label>
                          <Link to={`/${activeTab}/forgot-password`} state={{ email: emailValue }} className="text-white/80 text-sm hover:text-[#00FF87] underline decoration-white/30 underline-offset-4 transition-colors">
                            Forgot Password
                          </Link>
                        </div>

                        {/* Sign In Button */}
                        <button type="submit" disabled={isLoading} className="relative w-full py-3.5 rounded-full border border-[#00F2FE]/40 hover:border-transparent overflow-hidden group transition-all shadow-[0_0_15px_rgba(0,242,254,0.1)] hover:shadow-[0_0_25px_rgba(0,242,254,0.3)] disabled:opacity-70 disabled:cursor-not-allowed">
                          <div className="absolute inset-0 bg-gradient-to-r from-[#003B30] to-[#001829] transition-opacity duration-300 group-hover:opacity-0" />
                          <div className="absolute inset-0 bg-gradient-to-r from-[#00FF87] via-[#00F2FE] to-[#0072FF] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          <span className="relative z-10 text-white font-medium group-hover:font-semibold text-lg transition-all">{isLoading ? 'Signing in...' : 'Sign in'}</span>
                        </button>
                        </form>

                        {/* Google Sign In */}
                        <div className="mt-6 flex justify-center">
                          <button onClick={() => handleGoogleLogin()} type="button" className="flex items-center gap-3 text-[#00F2FE] hover:text-[#00FF87] text-sm font-medium transition-colors">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Sign In with Google
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>

              {/* Sign Up Link */}
              <div className="mt-10 text-center">
                <span className="text-white/60 text-sm">Don't have an account ? </span>
                <Link to="/signup" className="text-[#00FF87] hover:text-[#00F2FE] text-sm font-bold transition-colors">Sign Up</Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
