import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'accent' | 'red';
}

const colorMap = {
  primary: 'bg-primary',
  secondary: 'bg-green-500',
  accent: 'bg-indigo-500',
  red: 'bg-red-500'
};

export default function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'increase',
  icon, 
  color 
}: StatsCardProps) {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className={cn(
            "flex-shrink-0 p-3 rounded-md text-white",
            colorMap[color]
          )}>
            {icon}
          </div>

          <div className="flex-1 w-0 ml-5">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {change !== undefined && (
                  <div className={cn(
                    "flex items-baseline ml-2 text-sm font-semibold",
                    changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {changeType === 'increase' ? (
                      <ArrowUp className="self-center flex-shrink-0 w-5 h-5" />
                    ) : (
                      <ArrowDown className="self-center flex-shrink-0 w-5 h-5" />
                    )}
                    <span className="sr-only">{changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                    {change}%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
