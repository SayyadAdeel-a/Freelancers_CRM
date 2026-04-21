

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-white/10 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-light text-gray-900 dark:text-gray-100 font-mono">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <span className="text-2xl font-light text-gray-600 dark:text-gray-400">×</span>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}