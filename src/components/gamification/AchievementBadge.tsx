import React from 'react';
import { Achievement } from '@/types';
import { cn } from '@/lib/utils';
import { Trophy, Star, Clock, Calendar, Award, Target } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy,
  star: Star,
  clock: Clock,
  calendar: Calendar,
  award: Award,
  target: Target,
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, size = 'md' }) => {
  const Icon = iconMap[achievement.icon] || Trophy;

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
  };

  return (
    <div className="flex flex-col items-center gap-2 animate-fade-in">
      <div
        className={cn(
          'rounded-full flex items-center justify-center transition-all duration-300',
          sizeClasses[size],
          achievement.unlocked
            ? 'bg-primary text-primary-foreground shadow-card'
            : 'bg-muted text-muted-foreground'
        )}
      >
        <Icon className={iconSizes[size]} />
      </div>
      <div className="text-center">
        <p
          className={cn(
            'font-medium text-sm',
            achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {achievement.title}
        </p>
        <p className="text-xs text-muted-foreground">{achievement.description}</p>
      </div>
    </div>
  );
};

export default AchievementBadge;
