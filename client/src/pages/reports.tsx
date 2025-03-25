import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { useCurrency } from "@/hooks/use-currency";
import { Download, BarChart2, PieChart as PieChartIcon } from "lucide-react";

interface ReportsData {
  members: {
    membersByMonth: { month: string; count: number }[];
    totalMembers: number;
    activeMembers: number;
    newMembersThisMonth: number;
    genderRatio: string;
    ageDistribution: { name: string; value: number }[];
  };
  memberships: {
    membershipDistribution: { name: string; value: number }[];
    totalSubscriptions: number;
    activeSubscriptions: number;
    renewalRate: string;
    avgSubscriptionLength: string;
    expiringToday: number;
    expiringThisWeek: number;
    expiringThisMonth: number;
    expired: number;
  };
  revenue: {
    revenueByMonth: { month: string; revenue: number }[];
    thisYearRevenue: number;
    lastYearRevenue: number;
    revenueGrowth: string;
    currentMonthRevenue: number;
    previousMonthRevenue: number;
  };
  attendance: {
    attendanceByDay: { day: string; count: number }[];
    topHours: string;
    totalAttendance: number;
    averageDaily: number;
  };
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState("members");
  const { formatCurrency } = useCurrency();

  // Fetch the reports data
  const { data: reportsData, isLoading } = useQuery<ReportsData>({
    queryKey: ["/api/reports"],
  });

  const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f43f5e'];

  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
            <p className="mt-1 text-sm text-gray-500">
              Analyze your gym performance and metrics.
            </p>
          </div>
          <Button className="mt-4 sm:mt-0" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>

        {/* Reports tabs */}
        <Tabs defaultValue="members" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="memberships">Memberships</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-[200px]" />
                <Skeleton className="h-[200px]" />
              </div>
            </div>
          ) : (
            <>
              {/* Members Tab */}
              <TabsContent value="members" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-primary" />
                      Member Growth
                    </CardTitle>
                    <CardDescription>
                      Total member count over the past year
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={reportsData?.members.membersByMonth || []}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="count"
                            name="Members"
                            stroke="#3b82f6"
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Member Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Total Members</span>
                          <span className="font-medium">{reportsData?.members.totalMembers || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Active Members</span>
                          <span className="font-medium">
                            {reportsData?.members.activeMembers || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">New Members (This Month)</span>
                          <span className="font-medium">{reportsData?.members.newMembersThisMonth || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Gender Ratio (M/F/O)</span>
                          <span className="font-medium">{reportsData?.members.genderRatio || "N/A"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5 text-primary" />
                        Age Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={reportsData?.members.ageDistribution || []}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label
                            >
                              {(reportsData?.members.ageDistribution || []).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Memberships Tab */}
              <TabsContent value="memberships" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Membership Plan Distribution</CardTitle>
                    <CardDescription>
                      Distribution of members across different membership plans
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={reportsData?.memberships.membershipDistribution || []}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {(reportsData?.memberships.membershipDistribution || []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} members`, "Count"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Total Subscriptions</span>
                          <span className="font-medium">{reportsData?.memberships.totalSubscriptions || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Active Subscriptions</span>
                          <span className="font-medium">
                            {reportsData?.memberships.activeSubscriptions || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Renewal Rate</span>
                          <span className="font-medium">{reportsData?.memberships.renewalRate || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Avg. Subscription Length</span>
                          <span className="font-medium">{reportsData?.memberships.avgSubscriptionLength || "N/A"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Expiring Soon</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Expiring Today</span>
                          <span className="font-medium text-red-600">{reportsData?.memberships.expiringToday || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Expiring This Week</span>
                          <span className="font-medium text-yellow-600">{reportsData?.memberships.expiringThisWeek || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Expiring This Month</span>
                          <span className="font-medium">{reportsData?.memberships.expiringThisMonth || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Expired (Not Renewed)</span>
                          <span className="font-medium text-gray-800">{reportsData?.memberships.expired || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Revenue Tab */}
              <TabsContent value="revenue" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Revenue</CardTitle>
                    <CardDescription>
                      Revenue generated over the past year
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={reportsData?.revenue.revenueByMonth || []}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis 
                            tickFormatter={(value) => formatCurrency(value / 1000) + 'k'}
                          />
                          <Tooltip 
                            formatter={(value) => [formatCurrency(value as number), "Revenue"]}
                          />
                          <Legend />
                          <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Total Revenue (YTD)</span>
                          <span className="font-medium">{formatCurrency(reportsData?.revenue.thisYearRevenue || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">This Month</span>
                          <span className="font-medium">{formatCurrency(reportsData?.revenue.currentMonthRevenue || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Previous Month</span>
                          <span className="font-medium">{formatCurrency(reportsData?.revenue.previousMonthRevenue || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Growth Rate (YoY)</span>
                          <span className={`font-medium ${parseFloat(reportsData?.revenue.revenueGrowth || "0") > 0 ? "text-green-600" : "text-red-600"}`}>
                            {reportsData?.revenue.revenueGrowth !== "N/A" ? `${reportsData?.revenue.revenueGrowth}%` : "N/A"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue by Source</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(reportsData?.memberships.membershipDistribution || []).slice(0, 4).map((plan, index) => (
                          <div key={index} className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm text-gray-500">{plan.name}</span>
                            <span className="font-medium">
                              {formatCurrency((reportsData?.revenue.currentMonthRevenue || 0) * (plan.value / (reportsData?.memberships.activeSubscriptions || 1)))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Attendance Tab */}
              <TabsContent value="attendance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Attendance</CardTitle>
                    <CardDescription>
                      Member attendance by day of the week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={reportsData?.attendance.attendanceByDay || []}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" name="Check-ins" fill="#6366f1" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Attendance Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Total Check-ins</span>
                          <span className="font-medium">{reportsData?.attendance.totalAttendance || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Average Daily Attendance</span>
                          <span className="font-medium">{reportsData?.attendance.averageDaily || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Most Popular Day</span>
                          <span className="font-medium">
                            {reportsData?.attendance.attendanceByDay?.sort((a, b) => b.count - a.count)[0]?.day || "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Peak Hours</span>
                          <span className="font-medium">{reportsData?.attendance.topHours || "N/A"}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Attendance Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Weekday vs Weekend</span>
                          <span className="font-medium">
                            {(() => {
                              if (!reportsData?.attendance.attendanceByDay) return "N/A";
                              const weekday = reportsData.attendance.attendanceByDay.slice(1, 6).reduce((sum, day) => sum + day.count, 0);
                              const weekend = reportsData.attendance.attendanceByDay[0].count + reportsData.attendance.attendanceByDay[6].count;
                              const total = weekday + weekend;
                              if (total === 0) return "N/A";
                              return `${Math.round(weekday / total * 100)}% / ${Math.round(weekend / total * 100)}%`;
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Utilization Rate</span>
                          <span className="font-medium">
                            {Math.round((reportsData?.attendance.averageDaily || 0) / (reportsData?.members.activeMembers || 1) * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Busiest Time of Day</span>
                          <span className="font-medium">{reportsData?.attendance.topHours?.split(',')[0] || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Monthly Check-ins per Member</span>
                          <span className="font-medium">
                            {((reportsData?.attendance.totalAttendance || 0) / (reportsData?.members.activeMembers || 1) / 3).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
}