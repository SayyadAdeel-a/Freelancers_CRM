import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-mono uppercase tracking-wider text-gray-600 dark:text-gray-400">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm outline-none',
          'focus:border-gray-900 dark:focus:border-gray-100 transition-colors duration-150',
          error && 'border-red-500 focus:border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500 font-mono">{error}</p>}
    </div>
  );
}