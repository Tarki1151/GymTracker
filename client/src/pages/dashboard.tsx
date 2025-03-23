import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import StatsCard from "@/components/dashboard/stats-card";
import MembershipChart from "@/components/dashboard/chart";
import RecentActivity from "@/components/dashboard/recent-activity";
import ExpiringMemberships from "@/components/dashboard/expiring-memberships";
import MembershipStats from "@/components/dashboard/membership-stats";
import WelcomeCard from "@/components/dashboard/welcome-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CheckCheck, DollarSign, Calendar, Plus, UserPlus, CreditCard, PlusCircle, Timer } from "lucide-react";
import { QuickActionButton, QuickActionButtonGroup } from "@/components/ui/quick-action-button";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [_, navigate] = useLocation();
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error loading dashboard data. Please try again later.
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Here's what's happening with your gym today.</p>
        </div>
        
        {/* Welcome Card */}
        <div className="mb-6">
          {isLoading ? (
            <Skeleton className="h-32" />
          ) : (
            <WelcomeCard />
          )}
        </div>
        
        {/* Quick Action Buttons */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <QuickActionButtonGroup>
            <QuickActionButton 
              title="Add Member" 
              onClick={() => navigate('/members')}
              variant="success"
              description="Register new member"
            >
              <UserPlus />
            </QuickActionButton>
            
            <QuickActionButton 
              title="Check-in" 
              onClick={() => navigate('/attendance')}
              variant="info"
              description="Member attendance"
            >
              <Timer />
            </QuickActionButton>
            
            <QuickActionButton 
              title="Take Payment" 
              onClick={() => navigate('/payments')}
              variant="warning"
              description="Record payment"
            >
              <CreditCard />
            </QuickActionButton>
            
            <QuickActionButton 
              title="New Plan" 
              onClick={() => navigate('/memberships')}
              variant="default"
              description="Create membership"
            >
              <PlusCircle />
            </QuickActionButton>
            
            <QuickActionButton 
              title="Add Equipment" 
              onClick={() => navigate('/equipment')}
              variant="danger"
              description="Equipment inventory"
            >
              <Plus />
            </QuickActionButton>
          </QuickActionButtonGroup>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <StatsCard
                title="Total Members"
                value={dashboardData?.totalMembers || 0}
                change={18}
                changeType="increase"
                icon={<Users className="w-6 h-6 text-white" />}
                color="primary"
              />
              <StatsCard
                title="Active Members"
                value={dashboardData?.activeMembers || 0}
                change={12}
                changeType="increase"
                icon={<CheckCheck className="w-6 h-6 text-white" />}
                color="secondary"
              />
              <StatsCard
                title="Monthly Revenue"
                value={`$${dashboardData?.monthlyRevenue?.toFixed(2) || "0.00"}`}
                change={8}
                changeType="increase"
                icon={<DollarSign className="w-6 h-6 text-white" />}
                color="accent"
              />
              <StatsCard
                title="Visits Today"
                value={dashboardData?.todayVisits || 0}
                change={5}
                changeType="decrease"
                icon={<Calendar className="w-6 h-6 text-white" />}
                color="red"
              />
            </>
          )}
        </div>

        {/* Charts and recent activity */}
        <div className="grid grid-cols-1 gap-5 mt-6 lg:grid-cols-3">
          {/* Membership chart */}
          <div className="overflow-hidden bg-white rounded-lg shadow lg:col-span-2">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Membership Growth</h3>
                <div className="flex items-center space-x-3">
                  <select className="block py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option selected>Last 12 months</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                {isLoading ? (
                  <Skeleton className="h-64" />
                ) : (
                  <MembershipChart />
                )}
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
              {isLoading ? (
                <div className="mt-4 space-y-4">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              ) : (
                <RecentActivity activities={dashboardData?.recentActivity || []} />
              )}
            </div>
          </div>
        </div>

        {/* Member stats and expiring memberships */}
        <div className="grid grid-cols-1 gap-5 mt-6 lg:grid-cols-2">
          {/* Member stats */}
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Membership Statistics</h3>
              {isLoading ? (
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </div>
              ) : (
                <MembershipStats />
              )}
            </div>
          </div>

          {/* Expiring memberships */}
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Expiring Memberships</h3>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  View all
                </a>
              </div>
              {isLoading ? (
                <Skeleton className="h-64 mt-4" />
              ) : (
                <ExpiringMemberships memberships={dashboardData?.expiringMemberships || []} />
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
