import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { differenceInDays } from "date-fns";

interface Membership {
  subscription: {
    id: number;
    memberId: number;
    planId: number;
    startDate: string;
    endDate: string;
    status: string;
  };
  member?: {
    id: number;
    fullName: string;
    email: string;
  };
  plan?: {
    id: number;
    name: string;
  };
}

interface ExpiringMembershipsProps {
  memberships: Membership[];
}

export default function ExpiringMemberships({ memberships }: ExpiringMembershipsProps) {
  const getInitials = (name: string | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatus = (endDate: string) => {
    const daysLeft = differenceInDays(new Date(endDate), new Date());
    
    if (daysLeft <= 0) return { label: 'Expired', variant: 'destructive' as const };
    if (daysLeft <= 3) return { label: 'Critical', variant: 'destructive' as const };
    if (daysLeft <= 7) return { label: 'Warning', variant: 'warning' as const };
    return { label: 'Pending', variant: 'success' as const };
  };

  const getDaysLabel = (endDate: string) => {
    const daysLeft = differenceInDays(new Date(endDate), new Date());
    
    if (daysLeft === 0) return "Today";
    if (daysLeft === 1) return "Tomorrow";
    if (daysLeft < 0) return "Expired";
    return `${daysLeft} days`;
  };

  return (
    <div className="mt-6 overflow-hidden border-t border-gray-200">
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberships.map((item) => {
                    const status = getStatus(item.subscription.endDate);
                    return (
                      <TableRow key={item.subscription.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8">
                              <Avatar>
                                <AvatarFallback>{getInitials(item.member?.fullName)}</AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {item.member?.fullName || "Unknown Member"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {item.member?.email || "No email"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.plan?.name || "Unknown Plan"}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-sm text-gray-900">{getDaysLabel(item.subscription.endDate)}</div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant={status.variant}>
                            {status.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
