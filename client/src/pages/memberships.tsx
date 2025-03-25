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
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MembershipPlan, InsertMembershipPlan } from "@shared/schema";
import AddMembershipForm from "@/components/modals/add-membership-form";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/use-currency";
import { Search, Plus, Dumbbell, Calendar, DollarSign } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function Memberships() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddMembershipModal, setShowAddMembershipModal] = useState(false);
  const { toast } = useToast();

  const { data: plans, isLoading } = useQuery<MembershipPlan[]>({
    queryKey: ["/api/membership-plans"],
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      return apiRequest("PATCH", `/api/membership-plans/${id}`, { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/membership-plans"] });
      toast({
        title: "Plan status updated",
        description: "The membership plan's active status has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update plan status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const filteredPlans = plans?.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPlan = async (planData: InsertMembershipPlan) => {
    try {
      await apiRequest("POST", "/api/membership-plans", planData);
      queryClient.invalidateQueries({ queryKey: ["/api/membership-plans"] });
      setShowAddMembershipModal(false);
      toast({
        title: "Membership plan added successfully",
        description: `${planData.name} has been added to the system.`,
      });
    } catch (error) {
      toast({
        title: "Failed to add plan",
        description: "There was an error adding the membership plan. Please try again.",
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
            <h1 className="text-2xl font-semibold text-gray-900">Membership Plans</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your gym membership plans and pricing.
            </p>
          </div>
          <Button className="mt-4 sm:mt-0" onClick={() => setShowAddMembershipModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search plans by name or description..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Membership plans grid/list */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        ) : (
          <>
            {/* Card view for smaller screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:hidden">
              {filteredPlans && filteredPlans.length > 0 ? (
                filteredPlans.map(plan => (
                  <Card key={plan.id} className={`overflow-hidden border-l-4 ${plan.active ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                        <Badge variant={plan.active ? "success" : "secondary"}>
                          {plan.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                      
                      <div className="flex items-center mt-4 text-gray-700">
                        <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                        <span className="text-xl font-bold">{Number(plan.price).toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center mt-2 text-gray-700">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        <span>{plan.duration} Days</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={plan.active}
                            onCheckedChange={(checked) => 
                              toggleActiveMutation.mutate({ id: plan.id, active: checked })
                            }
                          />
                          <span className="text-sm">{plan.active ? 'Active' : 'Inactive'}</span>
                        </div>
                        
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full p-8 bg-white rounded-lg shadow text-center">
                  <Dumbbell className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No plans found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 
                      "No plans match your search criteria." : 
                      "Get started by adding a new membership plan."}
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setShowAddMembershipModal(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Plan
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Table view for larger screens */}
            <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden">
              {filteredPlans && filteredPlans.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map(plan => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Dumbbell className="h-4 w-4 text-blue-600" />
                            </div>
                            {plan.name}
                          </div>
                        </TableCell>
                        <TableCell>{plan.description}</TableCell>
                        <TableCell>{plan.duration} days</TableCell>
                        <TableCell>${Number(plan.price).toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={plan.active}
                              onCheckedChange={(checked) => 
                                toggleActiveMutation.mutate({ id: plan.id, active: checked })
                              }
                            />
                            <Badge variant={plan.active ? "success" : "secondary"}>
                              {plan.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center">
                  <Dumbbell className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No plans found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 
                      "No plans match your search criteria." : 
                      "Get started by adding a new membership plan."}
                  </p>
                  <div className="mt-6">
                    <Button onClick={() => setShowAddMembershipModal(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Plan
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <AddMembershipForm 
        isOpen={showAddMembershipModal} 
        onClose={() => setShowAddMembershipModal(false)} 
        onSubmit={handleAddPlan}
      />
    </MainLayout>
  );
}
