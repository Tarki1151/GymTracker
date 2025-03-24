import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Settings as SettingsIcon,
  User,
  Building,
  Bell,
  Lock,
  FileText,
  Save,
  Mail,
  Users,
  Shield,
  Loader2,
} from "lucide-react";

// Ayar değerlerini getirmek için type
type Setting = {
  id: number;
  key: string;
  value: string;
  updatedAt: string;
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Ayar değerleri için state
  const [appName, setAppName] = useState("TarabyaMarte");
  const [businessHours, setBusinessHours] = useState("6:00 AM - 10:00 PM");
  const [contactEmail, setContactEmail] = useState("contact@tarabyamarte.com");
  const [maintenanceMode, setMaintenanceMode] = useState("false");
  
  // Ayarları getirmek için query
  const { data: settings, isLoading: isLoadingSettings } = useQuery<Setting[]>({ 
    queryKey: ['/api/settings']
  });
  
  // Ayarları değişkenlere atama
  useEffect(() => {
    if (settings) {
      settings.forEach(setting => {
        if (setting.key === 'appName') setAppName(setting.value);
        if (setting.key === 'businessHours') setBusinessHours(setting.value);
        if (setting.key === 'contactEmail') setContactEmail(setting.value);
        if (setting.key === 'maintenanceMode') setMaintenanceMode(setting.value);
      });
    }
  }, [settings]);
  
  // Ayar güncellemek için mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const res = await apiRequest('PATCH', `/api/settings/${key}`, { value });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
    },
    onError: (error: Error) => {
      console.error('Error updating setting:', error);
      toast({
        title: 'Error',
        description: 'Failed to update settings: ' + error.message,
        variant: 'destructive'
      });
    }
  });

  // Sistem ayarlarını kaydetme işlemi
  const handleSystemSave = async () => {
    try {
      // Her ayarı asenkron olarak güncelle
      await updateSettingMutation.mutateAsync({ key: 'appName', value: appName });
      await updateSettingMutation.mutateAsync({ key: 'businessHours', value: businessHours });
      await updateSettingMutation.mutateAsync({ key: 'contactEmail', value: contactEmail });
      await updateSettingMutation.mutateAsync({ key: 'maintenanceMode', value: maintenanceMode });
      
      toast({
        title: "Settings saved",
        description: "System settings have been updated successfully",
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Diğer ayarlar için genel kaydetme işlemi
  const handleSave = () => {
    if (activeTab === "system") {
      handleSystemSave();
    } else {
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully",
      });
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Settings tabs */}
        <Tabs defaultValue="profile" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="system">
                <SettingsIcon className="h-4 w-4 mr-2" />
                System
              </TabsTrigger>
            )}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue={user?.fullName || ""} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue={user?.username || ""} />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue={user?.email || ""} />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" placeholder="Write a short bio about yourself" className="h-24" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-primary" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Two-factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch id="twoFactor" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Session Management</h4>
                        <p className="text-sm text-gray-500">Manage your active sessions on different devices</p>
                      </div>
                      <Button variant="outline" size="sm">Manage Sessions</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Update Security
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Choose what notifications you receive and how
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <h4 className="text-sm font-medium">Email Notifications</h4>
                        </div>
                        <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                      </div>
                      <Switch id="emailNotifications" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <h4 className="text-sm font-medium">Member Notifications</h4>
                        </div>
                        <p className="text-sm text-gray-500">Get notified when members perform certain actions</p>
                      </div>
                      <Switch id="memberNotifications" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                          <h4 className="text-sm font-medium">Report Notifications</h4>
                        </div>
                        <p className="text-sm text-gray-500">Receive weekly and monthly report summaries</p>
                      </div>
                      <Switch id="reportNotifications" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Bell className="h-4 w-4 mr-2 text-gray-500" />
                          <h4 className="text-sm font-medium">System Alerts</h4>
                        </div>
                        <p className="text-sm text-gray-500">Receive important system alerts and updates</p>
                      </div>
                      <Switch id="systemAlerts" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Reset Defaults</Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* System Tab (Admin only) */}
          {isAdmin && (
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <SettingsIcon className="h-5 w-5 mr-2 text-primary" />
                    System Settings
                  </CardTitle>
                  <CardDescription>
                    Manage global system settings and configurations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="appName">Gym Name</Label>
                      <Input 
                        id="appName" 
                        value={appName} 
                        onChange={(e) => setAppName(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessHours">Business Hours</Label>
                        <Input 
                          id="businessHours" 
                          value={businessHours} 
                          onChange={(e) => setBusinessHours(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input 
                          id="contactEmail" 
                          type="email" 
                          value={contactEmail} 
                          onChange={(e) => setContactEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-gray-500" />
                            <h4 className="text-sm font-medium">Maintenance Mode</h4>
                          </div>
                          <p className="text-sm text-gray-500">Temporarily disable the system for maintenance</p>
                        </div>
                        <Switch 
                          id="maintenanceMode" 
                          checked={maintenanceMode === "true"} 
                          onCheckedChange={(checked) => setMaintenanceMode(checked ? "true" : "false")}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-gray-500" />
                            <h4 className="text-sm font-medium">User Management</h4>
                          </div>
                          <p className="text-sm text-gray-500">Manage user roles and permissions</p>
                        </div>
                        <Button variant="outline" size="sm">Manage Users</Button>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-gray-500" />
                            <h4 className="text-sm font-medium">System Logs</h4>
                          </div>
                          <p className="text-sm text-gray-500">View and manage system logs</p>
                        </div>
                        <Button variant="outline" size="sm">View Logs</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
}
