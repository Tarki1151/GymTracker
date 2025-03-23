import { ActivityLog } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  UserPlus,
  Check,
  DollarSign,
  Clock,
  AlertTriangle,
  Wrench,
  Activity
} from "lucide-react";

interface RecentActivityProps {
  activities: ActivityLog[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'member_added':
        return (
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <UserPlus className="w-4 h-4 text-primary" />
          </div>
        );
      case 'subscription_added':
      case 'subscription_updated':
        return (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600" />
          </div>
        );
      case 'payment_received':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
        );
      case 'check_in':
      case 'check_out':
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
        );
      case 'equipment_updated':
        return (
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <Wrench className="w-4 h-4 text-red-600" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <Activity className="w-4 h-4 text-gray-600" />
          </div>
        );
    }
  };

  const getTimeDifference = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return format(new Date(date), 'MMM d');
  };

  return (
    <div className="flow-root mt-3">
      <ul className="-my-5 divide-y divide-gray-200">
        {activities.map((activity) => (
          <li key={activity.id} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.action.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {activity.description}
                </p>
              </div>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {getTimeDifference(activity.timestamp)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Button
          variant="outline"
          className="w-full"
        >
          View all activity
        </Button>
      </div>
    </div>
  );
}
