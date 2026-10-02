import { useState, useEffect } from 'react';
import { Search, MoreVertical, Bell, Plus, Check, RefreshCw } from 'lucide-react';
import { rezulterService } from '../../services/rezulter.service';
import type { Rezulter } from '../../services/rezulter.service';
import { ToggleStatusModal } from '../../components/modals/ToggleStatusModal';
import { AddRezulterModal } from '../../components/modals/AddRezulterModal';

export function SuperAdminRezulters() {
  const [activeTab, setActiveTab] = useState('All Status');
  const [rezulters, setRezulters] = useState<Rezulter[]>([]);
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
  const [rezulterToToggle, setRezulterToToggle] = useState<Rezulter | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchRezulters();
  }, [page, limit, debouncedSearch, activeTab, sortOption]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await rezulterService.getStats();
      if (response && response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch rezulter stats', error);
    }
  };

  const fetchRezulters = async () => {
    try {
      setIsLoading(true);
      let isActiveParam = undefined;
      if (activeTab === 'Active') isActiveParam = true;
      if (activeTab === 'Suspended') isActiveParam = false;

      const [sortField, sortOrder] = sortOption.split('_');

      const response = await rezulterService.getAllPaginated({
        page,
        limit,
        search: debouncedSearch,
        isActive: isActiveParam,
        sortField,
        sortOrder
      });

      if (response && response.data) {
        setRezulters(response.data.data || []);
        setPagination(response.data.pagination || { totalPages: 1, totalItems: 0, currentPage: 1 });
      } else {
        setRezulters([]);
      }
    } catch (error) {
      console.error('Failed to fetch rezulters', error);
      setRezulters([]);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = ['All Status', 'Active', 'Suspended'];

  const handleToggleStatus = async (id: string) => {
    try {
      await rezulterService.toggleStatus(id);
      fetchRezulters();
      fetchStats();
    } catch (error) {
      console.error('Failed to toggle status', error);
      fetchRezulters();
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#161D27] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-lg">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
          <h3 className="text-gray-400 text-[13px] font-semibold tracking-wider uppercase mb-3">Total Rezulters</h3>
          <p className="text-4xl font-bold text-white mb-3">{stats.total}</p>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#00EBD5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
            <span className="text-[#00EBD5] text-sm font-medium">Updated live</span>
          </div>
        </div>

        <div className="bg-[#161D27] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-lg">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
          <h3 className="text-gray-400 text-[13px] font-semibold tracking-wider uppercase mb-3">Active Rezulters</h3>
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

        {/* Modern Premium Toolbar */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-6 border-b border-white/5 gap-6 bg-gradient
        -to-r from-transparent via-white/[0.02] to-transparent">
          
          {/* Left: Search & Refresh */}
          <div className="flex items-center gap-3 w-full xl:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-[320px] group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1C64F2]/20 to-[#00EBD5]/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-md" />
              <div className="relative flex items-center bg-[#161D27] border border-white/5 rounded-xl px-4 py-2.5 transition-all">
                <Search className="w-4 h-4 text-gray-500 group-focus-within:text-[#1C64F2] transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search rezulters, emails..." 
                  className="w-full bg-transparent border-none pl-3 text-sm text-white placeholder:text-gray-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Refresh */}
            <button 
              onClick={fetchRezulters}
              disabled={isLoading}
              className={`p-3 rounded-xl border border-white/5 bg-[#161D27] text-gray-400 hover:text-white hover:border-white/10 hover:bg-white/5 transition-all shadow-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Refresh data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Right: Filters & Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">
            
            {/* Modern Segmented Tabs */}
            <div className="flex items-center p-1 bg-[#161D27] border border-white/5 rounded-xl w-full sm:w-auto overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setPage(1); }}
                  className={`px-5 py-2 rounded-lg text-[13px] font-bold tracking-wide transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-[#1C64F2] to-[#0055D4] text-white shadow-[0_0_15px_rgba(28,100,242,0.4)]'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="hidden sm:block w-px h-8 bg-white/5"></div>

            {/* Premium Sort Dropdown */}
            <div className="relative w-full sm:w-[200px] shrink-0">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
                className="flex items-center justify-between w-full gap-2 bg-[#161D27] border border-white/5 hover:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-300 font-medium transition-all shadow-sm focus:border-white/10"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="truncate">{activeSortLabel}</span>
                </div>
                <svg className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isSortOpen && (
                <div className="absolute top-full right-0 mt-2 w-full bg-[#1A2332]/95 border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-2 z-50 backdrop-blur-xl">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSortOption(option.value);
                        setPage(1);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center px-4 py-2.5 text-[13px] transition-colors ${
                        sortOption === option.value 
                          ? 'text-[#60a5fa] font-bold bg-[#1C64F2]/10' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white font-medium'
                      }`}
                    >
                      {option.label}
                      {sortOption === option.value && <Check className="w-4 h-4 ml-auto" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
              ) : rezulters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No rezulters found for this filter.</td>
                </tr>
              ) : (
                rezulters.map((inst) => (
                  <tr key={inst.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${inst.isActive
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
                          onClick={() => setRezulterToToggle(inst)}
                          className={`relative w-11 h-6 rounded-full transition-colors flex items-center shrink-0 ${inst.isActive ? 'bg-[#1C64F2]' : 'bg-gray-600'
                            }`}
                        >
                          <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center ${inst.isActive ? 'translate-x-[22px]' : 'translate-x-[2px]'
                            }`}>
                            {inst.isActive && <Check className="w-3 h-3 text-[#1C64F2]" strokeWidth={3} />}
                          </div>
                        </button>
                        <span className={`text-[14px] font-medium ${inst.isActive ? 'text-gray-200' : 'text-gray-500'
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

        {/* Pagination */}
        <div className="flex items-center justify-between p-6 border-t border-white/5">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{rezulters.length > 0 ? (page - 1) * limit + 1 : 0}</span> to <span className="font-medium text-white">{Math.min(page * limit, pagination.totalItems)}</span> of <span className="font-medium text-white">{pagination.totalItems}</span> rezulters
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

      {/* Toggle Status Confirmation Modal */}
      <ToggleStatusModal
        isOpen={!!rezulterToToggle}
        onClose={() => setRezulterToToggle(null)}
        onConfirm={() => {
          if (rezulterToToggle) {
            handleToggleStatus(rezulterToToggle.id);
            setRezulterToToggle(null);
          }
        }}
        entityName={rezulterToToggle?.name || ''}
        entityType="rezulter"
        isActive={rezulterToToggle?.isActive || false}
      />

      {/* Add Rezulter Modal */}
      <AddRezulterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchRezulters();
          fetchStats();
        }}
      />

    </div>
  );
}
