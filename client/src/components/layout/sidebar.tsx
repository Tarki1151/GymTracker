import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import {
  Home,
  Users,
  Tags,
  DollarSign,
  Calendar,
  BarChart2,
  Settings,
  Dumbbell
} from "lucide-react";

const getNavigation = (t: any) => [
  { name: t('dashboard.title'), href: '/', icon: Home },
  { name: t('members.title'), href: '/members', icon: Users },
  { name: t('memberships.title'), href: '/memberships', icon: Tags },
  { name: t('payments.title'), href: '/payments', icon: DollarSign },
  { name: t('attendance.title'), href: '/attendance', icon: Calendar },
  { name: t('reports.title'), href: '/reports', icon: BarChart2 },
  { name: t('equipment.title'), href: '/equipment', icon: Dumbbell },
  { name: t('settings.title'), href: '/settings', icon: Settings },
];

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-40 transition-opacity bg-black bg-opacity-50 lg:hidden",
          isOpen ? "block" : "hidden"
        )}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto transition duration-300 transform bg-white border-r lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0 ease-out" : "-translate-x-full ease-in"
        )}
      >
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">Gymify</span>
          </div>
        </div>

        <nav className="mt-8 space-y-1 px-2">
          {getNavigation(t).map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                  isActive
                    ? "text-white bg-primary"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 mr-3",
                    isActive ? "text-white" : "text-gray-500"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {user?.role === 'admin' && (
          <div className="px-4 mt-8">
            <div className="py-2 px-3 bg-blue-50 rounded-md border border-blue-200">
              <div className="text-xs font-semibold text-blue-800">ADMIN MODE</div>
              <div className="text-xs text-blue-600 mt-1">{t('common.adminModeMessage')}</div>
            </div>
          </div>
        )}

        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="text-xs text-gray-500 text-center">
            Gymify v1.0.0
          </div>
        </div>
      </div>
    </>
  );
}
