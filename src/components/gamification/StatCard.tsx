import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'success' | 'default';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}) => {
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-success text-success-foreground',
    default: 'bg-card text-card-foreground border-2 border-border',
  };

  const iconBgClasses = {
    primary: 'bg-primary-foreground/20',
    secondary: 'bg-secondary-foreground/20',
    success: 'bg-success-foreground/20',
    default: 'bg-muted',
  };

  return (
    <div
      className={cn(
        'stat-card rounded-xl p-6 animate-slide-up',
        variantClasses[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn(
            'text-sm font-medium',
            variant === 'default' ? 'text-muted-foreground' : 'opacity-90'
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && (
            <p className={cn(
              'text-sm mt-1',
              variant === 'default' ? 'text-muted-foreground' : 'opacity-80'
            )}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', iconBgClasses[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
