import { cn } from '@/lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost' | 'minimal';
  className?: string;
  onClick?: () => void;
}

export function Button({ children, variant = 'primary', className, onClick }: ButtonProps) {
  const baseClasses = 'px-6 py-3 font-medium tracking-wider transition-colors duration-150';

  const variantClasses = {
    primary: 'border border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900',
    ghost: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
    minimal: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 underline-offset-2 hover:underline',
  };

  return (
    <button
      onClick={onClick}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </button>
  );
}