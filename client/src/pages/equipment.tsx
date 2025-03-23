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
import { Equipment, InsertEquipment } from "@shared/schema";
import AddEquipmentForm from "@/components/modals/add-equipment-form";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Search, 
  Plus, 
  Dumbbell, 
  Wrench, 
  Clock, 
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Edit,
  Eye
} from "lucide-react";
import { differenceInMonths } from "date-fns";

export default function EquipmentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showViewEquipmentModal, setShowViewEquipmentModal] = useState(false);
  const { toast } = useToast();

  const { data: equipment, isLoading } = useQuery<Equipment[]>({
    queryKey: ["/api/equipment"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/equipment/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      toast({
        title: "Equipment status updated",
        description: "The equipment status has been updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update equipment status. Please try again.",
        variant: "destructive",
      });
    }
  });

  const filteredEquipment = equipment?.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEquipment = async (equipmentData: InsertEquipment) => {
    try {
      await apiRequest("POST", "/api/equipment", equipmentData);
      queryClient.invalidateQueries({ queryKey: ["/api/equipment"] });
      setShowAddEquipmentModal(false);
      toast({
        title: "Equipment added successfully",
        description: `${equipmentData.name} has been added to the inventory.`,
      });
    } catch (error) {
      toast({
        title: "Failed to add equipment",
        description: "There was an error adding the equipment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge variant="success">Operational</Badge>;
      case 'under maintenance':
        return <Badge variant="warning">Under Maintenance</Badge>;
      case 'out of order':
        return <Badge variant="destructive">Out of Order</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getMaintenanceStatus = (lastDate: string | null) => {
    if (!lastDate) return 'none';
    
    const lastMaintenance = new Date(lastDate);
    const now = new Date();
    const monthsSinceLastMaintenance = differenceInMonths(now, lastMaintenance);
    
    if (monthsSinceLastMaintenance >= 6) {
      return 'overdue';
    } else if (monthsSinceLastMaintenance >= 4) {
      return 'upcoming';
    } else {
      return 'ok';
    }
  };

  const getMaintenanceStatusBadge = (lastDate: string | null) => {
    const status = getMaintenanceStatus(lastDate);
    
    switch (status) {
      case 'overdue':
        return <Badge variant="destructive">Maintenance Overdue</Badge>;
      case 'upcoming':
        return <Badge variant="warning">Maintenance Due Soon</Badge>;
      case 'ok':
        return <Badge variant="success">Maintenance Up-to-Date</Badge>;
      default:
        return <Badge variant="secondary">No Maintenance Records</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Equipment Inventory</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your gym equipment inventory and maintenance records.
            </p>
          </div>
          <Button className="mt-4 sm:mt-0" onClick={() => setShowAddEquipmentModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Equipment
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search equipment by name, category or status..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Equipment table */}
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
            {filteredEquipment && filteredEquipment.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="hidden md:table-cell">Purchase Info</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Maintenance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEquipment.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Dumbbell className="h-4 w-4 text-blue-600" />
                            </div>
                            {item.name}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{item.category}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm">
                            {item.purchaseDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>
                                  {new Date(item.purchaseDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {item.purchasePrice && (
                              <div className="flex items-center gap-1 mt-1">
                                <DollarSign className="h-4 w-4 text-gray-400" />
                                <span>${Number(item.purchasePrice).toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.status)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="text-sm">
                            {item.maintenanceDate && (
                              <div className="flex items-center gap-1">
                                <Wrench className="h-4 w-4 text-gray-400" />
                                <span>
                                  Last: {new Date(item.maintenanceDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            <div className="mt-1">
                              {getMaintenanceStatusBadge(item.maintenanceDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedEquipment(item);
                                setShowViewEquipmentModal(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                toast({
                                  title: "Edit functionality",
                                  description: "Edit functionality will be implemented in the next update.",
                                });
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateStatusMutation.mutate({ 
                                id: item.id, 
                                status: item.status === 'operational' ? 'under maintenance' : 'operational' 
                              })}
                            >
                              {item.status === 'operational' ? (
                                <>
                                  <Wrench className="mr-1 h-4 w-4" />
                                  Maintenance
                                </>
                              ) : item.status === 'under maintenance' ? (
                                <>
                                  <CheckCircle2 className="mr-1 h-4 w-4" />
                                  Operational
                                </>
                              ) : (
                                <>
                                  <Wrench className="mr-1 h-4 w-4" />
                                  Repair
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Dumbbell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No equipment found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 
                    "No equipment items match your search criteria." : 
                    "Get started by adding equipment to your inventory."}
                </p>
                <div className="mt-6">
                  <Button onClick={() => setShowAddEquipmentModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Equipment
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AddEquipmentForm 
        isOpen={showAddEquipmentModal} 
        onClose={() => setShowAddEquipmentModal(false)} 
        onSubmit={handleAddEquipment}
      />
    </MainLayout>
  );
}
