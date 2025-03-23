import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Member, InsertMember } from "@shared/schema";
import AddMemberForm from "@/components/modals/add-member-form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Search, Plus, UserRound } from "lucide-react";

export default function Members() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const { toast } = useToast();

  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      return apiRequest("PATCH", `/api/members/${id}`, { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      toast({
        title: "Member status updated",
        description: "The member's active status has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update member status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const filteredMembers = members?.filter(member => 
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  const handleAddMember = async (memberData: InsertMember) => {
    try {
      await apiRequest("POST", "/api/members", memberData);
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      setShowAddMemberModal(false);
      toast({
        title: "Member added successfully",
        description: `${memberData.fullName} has been added to the system.`,
      });
    } catch (error) {
      toast({
        title: "Failed to add member",
        description: "There was an error adding the member. Please try again.",
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
            <h1 className="text-2xl font-semibold text-gray-900">Members</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your gym members and their information.
            </p>
          </div>
          <Button className="mt-4 sm:mt-0" onClick={() => setShowAddMemberModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members by name, email or phone..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Members table */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {filteredMembers && filteredMembers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact Information</TableHead>
                      <TableHead className="hidden md:table-cell">Date of Birth</TableHead>
                      <TableHead className="hidden lg:table-cell">Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <UserRound className="h-4 w-4 text-primary-600" />
                            </div>
                            {member.fullName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{member.email}</div>
                            <div className="text-gray-500">{member.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {member.address || "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={member.active}
                              onCheckedChange={(checked) => 
                                toggleActiveMutation.mutate({ id: member.id, active: checked })
                              }
                            />
                            <Badge variant={member.active ? "success" : "secondary"}>
                              {member.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <UserRound className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 
                    "No members match your search criteria." : 
                    "Get started by adding a new member."}
                </p>
                <div className="mt-6">
                  <Button onClick={() => setShowAddMemberModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AddMemberForm 
        isOpen={showAddMemberModal} 
        onClose={() => setShowAddMemberModal(false)} 
        onSubmit={handleAddMember}
      />
    </MainLayout>
  );
}
