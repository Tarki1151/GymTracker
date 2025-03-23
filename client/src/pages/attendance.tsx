import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Attendance as AttendanceType, Member } from "@shared/schema";
import CheckInForm from "@/components/modals/check-in-form";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  ClipboardCheck, 
  UserCheck,
  Clock,
  Calendar,
  LogIn,
  LogOut,
  ArrowLeftRight
} from "lucide-react";
import { format } from "date-fns";

type AttendanceWithMember = AttendanceType & {
  member?: Member;
};

export default function Attendance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const { toast } = useToast();

  const { data: attendance, isLoading: isLoadingAttendance } = useQuery<AttendanceType[]>({
    queryKey: ["/api/attendance"],
  });

  const { data: members } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });

  // Combine data for display
  const attendanceWithMembers: AttendanceWithMember[] = attendance?.map(record => {
    const member = members?.find(m => m.id === record.memberId);
    return {
      ...record,
      member
    };
  }) || [];

  // Sort by check-in time, most recent first
  const sortedAttendance = [...attendanceWithMembers].sort(
    (a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
  );

  const filteredAttendance = sortedAttendance.filter(record => 
    record.member?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckIn = async (data: { memberId: number }) => {
    try {
      await apiRequest("POST", "/api/attendance", {
        memberId: data.memberId,
        checkInTime: new Date().toISOString(),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      setShowCheckInModal(false);
      toast({
        title: "Check-in recorded successfully",
        description: `Member has been checked in.`,
      });
    } catch (error) {
      console.error("Check-in error:", error);
      toast({
        title: "Failed to record check-in",
        description: "There was an error recording the check-in. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckOut = async (id: number) => {
    try {
      await apiRequest("PATCH", `/api/attendance/${id}`, {
        checkOutTime: new Date().toISOString(),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      toast({
        title: "Check-out recorded successfully",
        description: `Member has been checked out.`,
      });
    } catch (error) {
      console.error("Check-out error:", error);
      toast({
        title: "Failed to record check-out",
        description: "There was an error recording the check-out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Attendance</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track member check-ins and facility usage.
            </p>
          </div>
          <Button className="mt-4 sm:mt-0" onClick={() => setShowCheckInModal(true)}>
            <UserCheck className="mr-2 h-4 w-4" />
            Check In Member
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by member name..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Attendance table */}
        {isLoadingAttendance ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {filteredAttendance.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendance.map((record) => {
                      const duration = record.checkOutTime 
                        ? Math.round((new Date(record.checkOutTime).getTime() - new Date(record.checkInTime).getTime()) / (1000 * 60)) 
                        : null;
                        
                      return (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <UserCheck className="h-4 w-4 text-green-600" />
                              </div>
                              {record.member?.fullName || "Unknown Member"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {format(new Date(record.checkInTime), 'MMM dd, yyyy')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <LogIn className="h-4 w-4 text-blue-600" />
                              {format(new Date(record.checkInTime), 'h:mm a')}
                            </div>
                          </TableCell>
                          <TableCell>
                            {record.checkOutTime ? (
                              <div className="flex items-center gap-2">
                                <LogOut className="h-4 w-4 text-red-600" />
                                {format(new Date(record.checkOutTime), 'h:mm a')}
                              </div>
                            ) : (
                              <span className="text-gray-500">Still in gym</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {duration !== null ? (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-600" />
                                {duration < 60 
                                  ? `${duration} min` 
                                  : `${Math.floor(duration / 60)}h ${duration % 60}m`}
                              </div>
                            ) : (
                              <ArrowLeftRight className="h-4 w-4 text-gray-400" />
                            )}
                          </TableCell>
                          <TableCell>
                            {!record.checkOutTime && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCheckOut(record.id)}
                              >
                                <LogOut className="mr-2 h-4 w-4" />
                                Check Out
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <ClipboardCheck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 
                    "No attendance records match your search criteria." : 
                    "Get started by checking in a member."}
                </p>
                <div className="mt-6">
                  <Button onClick={() => setShowCheckInModal(true)}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Check In Member
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <CheckInForm 
        isOpen={showCheckInModal} 
        onClose={() => setShowCheckInModal(false)} 
        onSubmit={handleCheckIn}
        members={members?.map(m => ({
          id: m.id,
          fullName: m.fullName,
          active: m.active === null ? true : !!m.active
        })) || []}
      />
    </MainLayout>
  );
}
