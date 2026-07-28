import { useState } from 'react';
import { X } from 'lucide-react';
import { rezulterService } from '../../services/rezulter.service';

interface AddRezulterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddRezulterModal({ isOpen, onClose, onSuccess }: AddRezulterModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      await rezulterService.create(formData);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      onSuccess();
    } catch (error: any) {
      setModalError(error.response?.data?.error || 'Failed to create rezulter');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#121620] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white tracking-wide">Add New Rezulter</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
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
              onClick={onClose}
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
  );
}
