import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Bell, Plus, Check, X, RefreshCw } from 'lucide-react';
import { candidateService } from '../../services/candidate.service';
import type { Candidate } from '../../services/candidate.service';

export function SuperAdminCandidates() {
  const [activeTab, setActiveTab] = useState('All Status');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState('createdAt_desc');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortOptions = [
    { value: 'createdAt_desc', label: 'Join Date (Newest)' },
    { value: 'createdAt_asc', label: 'Join Date (Oldest)' },
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' }
  ];
  const activeSortLabel = sortOptions.find(o => o.value === sortOption)?.label || 'Sort';

  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0, currentPage: 1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchCandidates();
  }, [page, limit, debouncedSearch, activeTab, sortOption]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await candidateService.getStats();
      if (response && response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch candidate stats', error);
    }
  };

  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      let isActiveParam = undefined;
      if (activeTab === 'Active') isActiveParam = true;
      if (activeTab === 'Suspended') isActiveParam = false;
      
      const [sortField, sortOrder] = sortOption.split('_');

      const response = await candidateService.getAll({
        page,
        limit,
        search: debouncedSearch,
        isActive: isActiveParam,
        sortField,
        sortOrder
      });
      
      if (response && response.data) {
        setCandidates(response.data.data || []);
        setPagination(response.data.pagination || { totalPages: 1, totalItems: 0, currentPage: 1 });
      } else {
        setCandidates([]);
      }
    } catch (error) {
      console.error('Failed to fetch candidates', error);
      setCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = ['All Status', 'Active', 'Suspended'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
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
      await candidateService.create(formData);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      fetchCandidates();
      fetchStats();
    } catch (error: any) {
      setModalError(error.response?.data?.error || 'Failed to create candidate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await candidateService.toggleStatus(id);
      fetchCandidates();
      fetchStats();
    } catch (error) {
      console.error('Failed to toggle status', error);
      fetchCandidates();
    }
  };

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
          Candidate Management
        </h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1C64F2] hover:bg-[#1A56DB] text-white px-5 py-2.5 rounded-lg font-bold text-[14px] flex items-center gap-2 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Candidate
          </button>
          <button className="text-gray-400 hover:text-white transition-colors relative ml-2">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#161D27] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-lg">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
          <h3 className="text-gray-400 text-[13px] font-semibold tracking-wider uppercase mb-3">Total Candidates</h3>
          <p className="text-4xl font-bold text-white mb-3">{stats.total}</p>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#00EBD5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            <span className="text-[#00EBD5] text-sm font-medium">Updated live</span>
          </div>
        </div>

        <div className="bg-[#161D27] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-lg">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
          <h3 className="text-gray-400 text-[13px] font-semibold tracking-wider uppercase mb-3">Active Candidates</h3>
          <p className="text-4xl font-bold text-white mb-3">{stats.active}</p>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-white/50" />
            <span className="text-white/60 text-sm font-medium">Currently active</span>
          </div>
        </div>

        <div className="bg-[#161D27] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-lg">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
          <h3 className="text-gray-400 text-[13px] font-semibold tracking-wider uppercase mb-3">Suspended</h3>
          <p className="text-4xl font-bold text-white mb-3">{stats.suspended}</p>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span className="text-orange-400 text-sm font-medium">Inactive accounts</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-[#111827] border border-white/5 rounded-2xl flex flex-col flex-1 shadow-2xl relative">
        
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row items-center justify-between p-6 border-b border-white/5 gap-4">
          
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidates, emails or IDs..." 
              className="w-full bg-[#1F2937] border border-white/5 rounded-lg pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-[#1C64F2] transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto pb-2 lg:pb-0">
            <button 
              onClick={fetchCandidates}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors shrink-0 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <div className="w-px h-6 bg-white/10 mx-1"></div>
            {/* Custom Sort Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
                className="flex items-center justify-between gap-2 bg-[#1F2937] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-gray-300 font-medium hover:bg-white/5 focus:outline-none focus:border-[#1C64F2] transition-colors min-w-[190px]"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  {activeSortLabel}
                </div>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isSortOpen && (
                <div className="absolute top-full right-0 mt-2 w-full bg-[#1F2937] border border-white/10 rounded-lg shadow-2xl py-1 z-50 backdrop-blur-md">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSortOption(option.value);
                        setPage(1);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortOption === option.value 
                          ? 'bg-[#1C64F2]/10 text-[#60a5fa] font-medium' 
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="w-px h-6 bg-white/10 mx-1"></div>
            
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
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
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Candidate Name</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Candidate Email</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Join Date</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">Loading candidates...</td>
                </tr>
              ) : candidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No candidates found for this filter.</td>
                </tr>
              ) : (
                candidates.map((cand) => (
                  <tr key={cand._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          cand.isActive 
                            ? 'bg-blue-500/10 text-blue-500' 
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {getInitials(cand.name)}
                        </div>
                        <span className="text-[14px] font-semibold text-white/90 group-hover:text-white transition-colors">{cand.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[14px] font-medium text-gray-400">{cand.email}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[14px] font-medium text-gray-400">{cand.createdAt ? formatDate(cand.createdAt) : 'N/A'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleToggleStatus(cand._id)}
                          className={`relative w-11 h-6 rounded-full transition-colors flex items-center shrink-0 ${
                            cand.isActive ? 'bg-[#1C64F2]' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center ${
                            cand.isActive ? 'translate-x-[22px]' : 'translate-x-[2px]'
                          }`}>
                            {cand.isActive && <Check className="w-3 h-3 text-[#1C64F2]" strokeWidth={3} />}
                          </div>
                        </button>
                        <span className={`text-[14px] font-medium ${
                          cand.isActive ? 'text-gray-200' : 'text-gray-500'
                        }`}>
                          {cand.isActive ? 'Active' : 'Inactive'}
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

        {/* Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-white/5">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{candidates.length > 0 ? (page - 1) * limit + 1 : 0}</span> to <span className="font-medium text-white">{Math.min(page * limit, pagination.totalItems)}</span> of <span className="font-medium text-white">{pagination.totalItems}</span> candidates
          </div>
          <div className="flex items-center gap-4">
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="bg-[#1F2937] border border-white/5 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#1C64F2]"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <div className="flex items-center gap-1 bg-[#1F2937] border border-white/5 rounded-lg p-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm rounded-md hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="px-3 py-1 text-sm font-medium bg-[#1C64F2]/20 text-[#60a5fa] rounded-md">
                {page} / {pagination.totalPages || 1}
              </span>
              <button 
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="px-3 py-1 text-sm rounded-md hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Candidate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#121620] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white tracking-wide">Add New Candidate</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCandidate} className="p-6 flex flex-col gap-5">
              {modalError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
                  {modalError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Candidate Name</label>
                  <input 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="e.g. John Doe" 
                    className="w-full bg-white text-black rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C64F2] transition-shadow placeholder:text-gray-500 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Candidate Email</label>
                  <input 
                    required
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com" 
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
                  {isSubmitting ? 'Creating...' : 'Create Candidate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
