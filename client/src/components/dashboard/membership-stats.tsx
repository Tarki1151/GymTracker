import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function MembershipStats() {
  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["/api/members"],
  });

  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ["/api/subscriptions"],
  });

  const { data: attendance, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ["/api/attendance"],
  });

  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["/api/membership-plans"],
  });

  const isLoading = isLoadingMembers || isLoadingSubscriptions || isLoadingAttendance || isLoadingPlans;

  if (isLoading) {
    return (
      <dl className="grid grid-cols-1 gap-5 mt-5 sm:grid-cols-2">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </dl>
    );
  }

  const newMembersThisMonth = members ? members.filter(member => {
    const createdAt = new Date(member.createdAt);
    const now = new Date();
    return createdAt.getMonth() === now.getMonth() && 
           createdAt.getFullYear() === now.getFullYear();
  }).length : 0;

  const activeSubscriptions = subscriptions ? subscriptions.filter(sub => {
    const endDate = new Date(sub.endDate);
    const today = new Date();
    return sub.status === 'active' && endDate >= today;
  }).length : 0;
  
  const retentionRate = members && subscriptions ? 
    Math.round((activeSubscriptions / members.length) * 100) : 0;

  const planPopularity = plans && subscriptions ? plans.map(plan => {
    const count = subscriptions.filter(sub => sub.planId === plan.id).length;
    return { name: plan.name, count };
  }).sort((a, b) => b.count - a.count) : [];
  
  const mostPopularPlan = planPopularity.length > 0 ? planPopularity[0].name : "None";

  // Calculate average daily check-ins for the last 30 days
  const dailyCheckIns = attendance ? (() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentAttendance = attendance.filter(record => 
      new Date(record.checkInTime) >= thirtyDaysAgo
    );
    
    // Group by day
    const dayMap = new Map();
    recentAttendance.forEach(record => {
      const date = new Date(record.checkInTime).toDateString();
      dayMap.set(date, (dayMap.get(date) || 0) + 1);
    });
    
    // Calculate average
    const days = dayMap.size || 1; // avoid division by zero
    const totalCheckins = recentAttendance.length;
    return Math.round(totalCheckins / days);
  })() : 0;

  return (
    <dl className="grid grid-cols-1 gap-5 mt-5 sm:grid-cols-2">
      <div className="px-4 py-5 overflow-hidden bg-gray-50 rounded-lg sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">
          New Members This Month
        </dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">
          {newMembersThisMonth}
        </dd>
      </div>

      <div className="px-4 py-5 overflow-hidden bg-gray-50 rounded-lg sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">
          Avg. Retention Rate
        </dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">
          {retentionRate}%
        </dd>
      </div>

      <div className="px-4 py-5 overflow-hidden bg-gray-50 rounded-lg sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">
          Most Popular Plan
        </dt>
        <dd className="mt-1 text-xl font-semibold text-gray-900">
          {mostPopularPlan}
        </dd>
      </div>

      <div className="px-4 py-5 overflow-hidden bg-gray-50 rounded-lg sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">
          Avg. Daily Check-ins
        </dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">
          {dailyCheckIns}
        </dd>
      </div>
    </dl>
  );
}
