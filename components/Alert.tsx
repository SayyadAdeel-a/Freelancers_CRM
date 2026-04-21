import { cn } from '@/lib/utils';

interface AlertProps {
  variant?: 'default' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

export function Alert({ variant = 'default', children }: AlertProps) {
  const variants = {
    default: 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
    success: 'border-green-500 text-green-700 dark:text-green-400 dark:border-green-700',
    warning: 'border-amber-500 text-amber-700 dark:text-amber-400 dark:border-amber-700',
    error: 'border-red-500 text-red-700 dark:text-red-400 dark:border-red-800',
  };

  return (
    <div className={cn(
      'border-l-4 p-4 font-mono text-sm',
      variants[variant]
    )}>
      {children}
    </div>
  );
}