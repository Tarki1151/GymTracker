import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type QuickActionButtonProps = {
  children: ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
};

export function QuickActionButton({
  children,
  title,
  description,
  onClick,
  variant = "default",
  size = "md",
}: QuickActionButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 hover:border-emerald-300 text-emerald-600";
      case "warning":
        return "bg-amber-50 hover:bg-amber-100 border-amber-200 hover:border-amber-300 text-amber-600";
      case "danger":
        return "bg-rose-50 hover:bg-rose-100 border-rose-200 hover:border-rose-300 text-rose-600";
      case "info":
        return "bg-sky-50 hover:bg-sky-100 border-sky-200 hover:border-sky-300 text-sky-600";
      default:
        return "bg-primary-50 hover:bg-primary-100 border-primary-200 hover:border-primary-300 text-primary-600";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "p-3";
      case "lg":
        return "p-5";
      default:
        return "p-4";
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center rounded-xl border bg-white shadow-sm transition-all duration-200",
        "hover:shadow-md hover:-translate-y-1 cursor-pointer",
        getVariantClasses(),
        getSizeClasses()
      )}
    >
      <div className="mb-2 text-2xl">{children}</div>
      <div className="font-medium text-sm">{title}</div>
      {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
      
      {/* Hover effect dalgalar */}
      <div className="absolute inset-0 -z-10 rounded-xl bg-white transition-all duration-300 group-hover:scale-110 opacity-0 group-hover:opacity-20"></div>
      <div className="absolute inset-0 -z-10 rounded-xl bg-white transition-all duration-500 group-hover:scale-125 opacity-0 group-hover:opacity-10"></div>
    </button>
  );
}

export function QuickActionButtonGroup({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {children}
    </div>
  );
}