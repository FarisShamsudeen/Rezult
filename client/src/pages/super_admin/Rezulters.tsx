import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Bell, Plus, Check, X, RefreshCw } from 'lucide-react';
import { rezulterService } from '../../services/rezulter.service';
import type { Rezulter } from '../../services/rezulter.service';

export function SuperAdminRezulters() {
  const [activeTab, setActiveTab] = useState('All Status');
  const [rezulters, setRezulters] = useState<Rezulter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRezulters();
  }, []);

  const fetchRezulters = async () => {
    try {
      setIsLoading(true);
      const response = await rezulterService.getAll();
      // Handle different possible payload structures safely
      let dataArray = [];
      if (Array.isArray(response)) {
        dataArray = response;
      } else if (response && Array.isArray(response.data)) {
        dataArray = response.data;
      }
      setRezulters(dataArray);
    } catch (error) {
      console.error('Failed to fetch rezulters', error);
      setRezulters([]);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = ['All Status', 'Active', 'Suspended'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRezulter = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (formData.password !== formData.confirmPassword) {
      setModalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setModalError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      await rezulterService.create({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      fetchRezulters(); // Refresh table
    } catch (error: any) {
      setModalError(error.response?.data?.error || 'Failed to create rezulter');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      // Optimistic update
      setRezulters(prev => prev.map(r => r._id === id ? { ...r, isActive: !r.isActive } : r));
      await rezulterService.toggleStatus(id);
    } catch (error) {
      console.error('Failed to toggle status', error);
      fetchRezulters(); // Revert on error
    }
  };

  const filteredRezulters = rezulters.filter((inst) => {
    if (activeTab === 'Active') return inst.isActive === true;
    if (activeTab === 'Suspended') return inst.isActive === false;
    return true; // All Status
  });

  const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col w-full h-full p-8 overflow-y-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-[26px] font-bold text-white tracking-wide">
          Rezulter Management
        </h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1C64F2] hover:bg-[#1A56DB] text-white px-5 py-2.5 rounded-lg font-bold text-[14px] flex items-center gap-2 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Rezulter
          </button>
          <button className="text-gray-400 hover:text-white transition-colors relative ml-2">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl flex flex-col flex-1 shadow-2xl relative">
        
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row items-center justify-between p-6 border-b border-white/5 gap-4">
          
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search rezulters, emails or IDs..." 
              className="w-full bg-[#1F2937] border border-white/5 rounded-lg pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-[#1C64F2] transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
            <button 
              onClick={fetchRezulters}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors shrink-0 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="w-px h-6 bg-white/10 mx-1"></div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors shrink-0">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <div className="w-px h-6 bg-white/10 mx-1"></div>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                  activeTab === tab
                    ? 'bg-[#1e3a8a] text-[#60a5fa] border border-[#1e3a8a]'
                    : tab === 'Suspended'
                      ? 'border border-red-500/20 text-red-500 hover:bg-red-500/10'
                      : 'border border-white/5 text-gray-400 hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rezulter Name</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Admin Email</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Join Date</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">Loading rezulters...</td>
                </tr>
              ) : filteredRezulters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No rezulters found for this filter.</td>
                </tr>
              ) : (
                filteredRezulters.map((inst) => (
                  <tr key={inst._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          inst.isActive 
                            ? 'bg-blue-500/10 text-blue-500' 
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {getInitials(inst.name)}
                        </div>
                        <span className="text-[14px] font-semibold text-white/90 group-hover:text-white transition-colors">{inst.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[14px] font-medium text-gray-400">{inst.email}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[14px] font-medium text-gray-400">{inst.createdAt ? formatDate(inst.createdAt) : 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleStatus(inst._id)}
                          className={`relative w-11 h-6 rounded-full transition-colors flex items-center shrink-0 ${
                            inst.isActive ? 'bg-[#1C64F2]' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center ${
                            inst.isActive ? 'translate-x-[22px]' : 'translate-x-[2px]'
                          }`}>
                            {inst.isActive && <Check className="w-3 h-3 text-[#1C64F2]" strokeWidth={3} />}
                          </div>
                        </button>
                        <span className={`text-[14px] font-medium ${
                          inst.isActive ? 'text-gray-200' : 'text-gray-500'
                        }`}>
                          {inst.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-gray-500 hover:text-white transition-colors p-1">
                        <MoreVertical className="w-5 h-5 inline-block" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Rezulter Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121620] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white tracking-wide">Add New Rezulter</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRezulter} className="p-6 flex flex-col gap-5">
              {modalError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
                  {modalError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rezulter Name</label>
                  <input 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="e.g. Oxford University" 
                    className="w-full bg-white text-black rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C64F2] transition-shadow placeholder:text-gray-500 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Rezulter Email Address</label>
                  <input 
                    required
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="oxford@outlook.com" 
                    className="w-full bg-white text-black rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C64F2] transition-shadow placeholder:text-gray-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Enter Password</label>
                  <input 
                    required
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••" 
                    className="w-full bg-white text-black rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C64F2] transition-shadow placeholder:text-gray-500 tracking-widest font-medium"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Re-Type Password</label>
                  <input 
                    required
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••" 
                    className="w-full bg-white text-black rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C64F2] transition-shadow placeholder:text-gray-500 tracking-widest font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 mt-6 pt-6 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white hover:bg-gray-200 text-black px-6 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Rezulter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
