

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  emoji?: string;
}

export function EmptyState({ title, description, action, emoji = '📋' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-6">{emoji}</div>
      <h1 className="text-4xl font-light text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h1>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 font-mono text-sm mb-8 max-w-sm text-center">
          {description}
        </p>
      )}
      {action && <div className="flex gap-3">{action}</div>}
    </div>
  );
}