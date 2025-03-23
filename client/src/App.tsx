import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Members from "@/pages/members";
import Memberships from "@/pages/memberships";
import Payments from "@/pages/payments";
import Attendance from "@/pages/attendance";
import Reports from "@/pages/reports";
import Equipment from "@/pages/equipment";
import Settings from "@/pages/settings";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/members" component={Members} />
      <ProtectedRoute path="/memberships" component={Memberships} />
      <ProtectedRoute path="/payments" component={Payments} />
      <ProtectedRoute path="/attendance" component={Attendance} />
      <ProtectedRoute path="/reports" component={Reports} />
      <ProtectedRoute path="/equipment" component={Equipment} />
      <ProtectedRoute path="/settings" component={Settings} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
