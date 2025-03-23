import { useState } from "react";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type HeaderProps = {
  onOpenSidebar: () => void;
};

export default function Header({ onOpenSidebar }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/auth");
      },
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center">
        <button
          onClick={onOpenSidebar}
          className="text-gray-500 focus:outline-none lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative mx-4 lg:mx-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-5 h-5 text-gray-500" />
          </span>
          <input
            className="w-32 pl-10 pr-4 rounded-md form-input sm:w-64 focus:border-primary"
            type="text"
            placeholder="Search"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="flex items-center p-2 text-sm font-medium text-gray-700 bg-white rounded-md hover:text-primary focus:outline-none">
          <Bell className="w-5 h-5 mx-1" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center text-sm font-medium text-gray-700 rounded-md focus:outline-none">
              <div className="w-8 h-8 mr-2 overflow-hidden bg-gray-200 rounded-full">
                <Avatar>
                  <AvatarFallback>{user?.fullName ? getInitials(user.fullName) : "U"}</AvatarFallback>
                </Avatar>
              </div>
              <span>{user?.fullName || "User"}</span>
              <ChevronDown className="w-5 h-5 ml-2" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
