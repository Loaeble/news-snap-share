import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'default';
  className?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = 'default',
  className = '' 
}: StatsCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'bg-gradient-primary text-primary-foreground border-primary/20';
      case 'success':
        return 'bg-gradient-success text-success-foreground border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning-foreground border-warning/20';
      default:
        return 'bg-gradient-subtle border-border';
    }
  };

  return (
    <Card className={`animate-fade-in hover:scale-105 hover:shadow-card transition-all duration-300 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              {title}
            </p>
            <p className="text-2xl font-bold animate-scale-in">
              {value}
            </p>
            {trend && (
              <Badge 
                variant={trend.isPositive ? "default" : "destructive"}
                className="text-xs"
              >
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </Badge>
            )}
          </div>
          
          <div className={`p-3 rounded-lg ${getColorClasses()} animate-float`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};