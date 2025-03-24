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
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const [_, navigate] = useLocation();
  const { t } = useTranslation();
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {t('errors.serverError')}
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
          <h1 className="text-2xl font-semibold text-gray-900">{t('dashboard.title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('dashboard.welcome')}</p>
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
          <h2 className="text-lg font-medium text-gray-900 mb-4">{t('dashboard.quickActions')}</h2>
          <QuickActionButtonGroup>
            <QuickActionButton 
              title={t('dashboard.addMember')}
              onClick={() => navigate('/members')}
              variant="success"
              description={t('members.addMember')}
            >
              <UserPlus />
            </QuickActionButton>
            
            <QuickActionButton 
              title={t('dashboard.checkIn')}
              onClick={() => navigate('/attendance')}
              variant="info"
              description={t('attendance.checkIn')}
            >
              <Timer />
            </QuickActionButton>
            
            <QuickActionButton 
              title={t('dashboard.addPayment')}
              onClick={() => navigate('/payments')}
              variant="warning"
              description={t('payments.addPayment')}
            >
              <CreditCard />
            </QuickActionButton>
            
            <QuickActionButton 
              title={t('memberships.addPlan')}
              onClick={() => navigate('/memberships')}
              variant="default"
              description={t('memberships.addPlan')}
            >
              <PlusCircle />
            </QuickActionButton>
            
            <QuickActionButton 
              title={t('equipment.addEquipment')}
              onClick={() => navigate('/equipment')}
              variant="danger"
              description={t('equipment.addEquipment')}
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
                title={t('dashboard.totalMembers')}
                value={dashboardData?.totalMembers || 0}
                change={18}
                changeType="increase"
                icon={<Users className="w-6 h-6 text-white" />}
                color="primary"
              />
              <StatsCard
                title={t('dashboard.activeMembers')}
                value={dashboardData?.activeMembers || 0}
                change={12}
                changeType="increase"
                icon={<CheckCheck className="w-6 h-6 text-white" />}
                color="secondary"
              />
              <StatsCard
                title={t('dashboard.monthlyRevenue')}
                value={`₺${dashboardData?.monthlyRevenue?.toFixed(2) || "0.00"}`}
                change={8}
                changeType="increase"
                icon={<DollarSign className="w-6 h-6 text-white" />}
                color="accent"
              />
              <StatsCard
                title={t('dashboard.todayVisits')}
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
                <h3 className="text-lg font-medium leading-6 text-gray-900">{t('reports.membershipReport')}</h3>
                <div className="flex items-center space-x-3">
                  <select className="block py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                    <option>{t('reports.last7Days')}</option>
                    <option>{t('reports.last30Days')}</option>
                    <option>{t('reports.last3Months')}</option>
                    <option selected>{t('reports.last12Months')}</option>
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
              <h3 className="text-lg font-medium leading-6 text-gray-900">{t('dashboard.recentActivity')}</h3>
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
              <h3 className="text-lg font-medium leading-6 text-gray-900">{t('reports.membershipStatistics')}</h3>
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
                <h3 className="text-lg font-medium leading-6 text-gray-900">{t('dashboard.expiringMemberships')}</h3>
                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                  {t('common.viewAll')}
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
