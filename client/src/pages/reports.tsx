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
import { Download, BarChart2, PieChart as PieChartIcon } from "lucide-react";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("members");

  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["/api/members"],
  });

  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ["/api/subscriptions"],
  });

  const { data: payments, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["/api/payments"],
  });

  const { data: attendance, isLoading: isLoadingAttendance } = useQuery({
    queryKey: ["/api/attendance"],
  });

  const isLoading = 
    isLoadingMembers || 
    isLoadingSubscriptions || 
    isLoadingPayments || 
    isLoadingAttendance;

  // Sample data - in a real app this would be calculated from the API data
  const membersByMonth = [
    { month: "Jan", count: 310 },
    { month: "Feb", count: 325 },
    { month: "Mar", count: 342 },
    { month: "Apr", count: 367 },
    { month: "May", count: 388 },
    { month: "Jun", count: 402 },
    { month: "Jul", count: 418 },
    { month: "Aug", count: 425 },
    { month: "Sep", count: 435 },
    { month: "Oct", count: 440 },
    { month: "Nov", count: 452 },
    { month: "Dec", count: 458 },
  ];

  const membershipDistribution = [
    { name: "Premium Monthly", value: 187 },
    { name: "Standard Monthly", value: 145 },
    { name: "Standard Annual", value: 75 },
    { name: "Elite Quarterly", value: 51 },
  ];

  const revenueByMonth = [
    { month: "Jan", revenue: 28000 },
    { month: "Feb", revenue: 29500 },
    { month: "Mar", revenue: 30800 },
    { month: "Apr", revenue: 32500 },
    { month: "May", revenue: 34000 },
    { month: "Jun", revenue: 35200 },
    { month: "Jul", revenue: 36000 },
    { month: "Aug", revenue: 36500 },
    { month: "Sep", revenue: 37000 },
    { month: "Oct", revenue: 37800 },
    { month: "Nov", revenue: 38200 },
    { month: "Dec", revenue: 39000 },
  ];

  const attendanceByDay = [
    { day: "Mon", count: 132 },
    { day: "Tue", count: 120 },
    { day: "Wed", count: 158 },
    { day: "Thu", count: 142 },
    { day: "Fri", count: 135 },
    { day: "Sat", count: 85 },
    { day: "Sun", count: 68 },
  ];

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
                          data={membersByMonth}
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
                          <span className="font-medium">{members?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Active Members</span>
                          <span className="font-medium">
                            {members?.filter(m => m.active).length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">New Members (This Month)</span>
                          <span className="font-medium">42</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Gender Ratio (M/F/O)</span>
                          <span className="font-medium">60% / 38% / 2%</span>
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
                              data={[
                                { name: "18-25", value: 85 },
                                { name: "26-35", value: 165 },
                                { name: "36-45", value: 120 },
                                { name: "46+", value: 88 },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              nameKey="name"
                              label
                            >
                              {membershipDistribution.map((entry, index) => (
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
                            data={membershipDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {membershipDistribution.map((entry, index) => (
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
                          <span className="font-medium">{subscriptions?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Active Subscriptions</span>
                          <span className="font-medium">
                            {subscriptions?.filter(s => s.status === 'active').length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Renewal Rate</span>
                          <span className="font-medium">76%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Avg. Subscription Length</span>
                          <span className="font-medium">7.2 months</span>
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
                          <span className="font-medium text-red-600">3</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Expiring This Week</span>
                          <span className="font-medium text-yellow-600">12</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Expiring This Month</span>
                          <span className="font-medium">43</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Expired (Not Renewed)</span>
                          <span className="font-medium text-gray-800">8</span>
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
                          data={revenueByMonth}
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
                            tickFormatter={(value) => `$${value / 1000}k`}
                          />
                          <Tooltip 
                            formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
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
                          <span className="font-medium">$375,300</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">This Month</span>
                          <span className="font-medium">$39,000</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Previous Month</span>
                          <span className="font-medium">$38,200</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Growth Rate (MoM)</span>
                          <span className="font-medium text-green-600">+2.1%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue by Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Premium Monthly</span>
                          <span className="font-medium">$16,829</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Standard Monthly</span>
                          <span className="font-medium">$7,249</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Standard Annual</span>
                          <span className="font-medium">$6,250</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Elite Quarterly</span>
                          <span className="font-medium">$12,750</span>
                        </div>
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
                          data={attendanceByDay}
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
                          <span className="text-sm text-gray-500">Total Check-ins (This Month)</span>
                          <span className="font-medium">3,421</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Avg. Daily Check-ins</span>
                          <span className="font-medium">127</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Peak Hour</span>
                          <span className="font-medium">6:00 PM - 7:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Busiest Day</span>
                          <span className="font-medium">Wednesday</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Member Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Visit Frequency per Member</span>
                          <span className="font-medium">3.2 per week</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Avg. Visit Duration</span>
                          <span className="font-medium">75 minutes</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                          <span className="text-sm text-gray-500">Non-active Members (0 visits)</span>
                          <span className="font-medium text-red-600">27 (7%)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Most Active Member</span>
                          <span className="font-medium">Michael Brown (22 visits)</span>
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
