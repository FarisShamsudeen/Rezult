

interface ToggleStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityName: string;
  entityType: string;
  isActive: boolean;
}

export function ToggleStatusModal({
  isOpen,
  onClose,
  onConfirm,
  entityName,
  entityType,
  isActive
}: ToggleStatusModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#121620] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col transform transition-all">
        <div className="p-6">
          <h3 className="text-xl font-bold text-white tracking-wide mb-2">Confirm Action</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Are you sure you want to <span className={isActive ? 'text-red-400 font-medium' : 'text-blue-400 font-medium'}>{isActive ? 'inactivate' : 'activate'}</span> the {entityType} <span className="text-white font-medium">{entityName}</span>?
            {isActive && ' They will lose access to their account.'}
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white/[0.02] border-t border-white/5">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-400 hover:text-white transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold text-white transition-colors shadow-lg ${isActive ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-[#1C64F2] hover:bg-[#1A56DB] shadow-[#1C64F2]/20'
              }`}
          >
            {isActive ? 'Yes, Inactivate' : 'Yes, Activate'}
          </button>
        </div>
      </div>
    </div>
  );
}
