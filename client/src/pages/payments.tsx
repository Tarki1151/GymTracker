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
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Payment, Member, Subscription, MembershipPlan } from "@shared/schema";
import AddPaymentForm from "@/components/modals/add-payment-form";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Plus, 
  Receipt, 
  ArrowDownUp,
  Calendar,
  CreditCard,
  Wallet,
  BanknoteIcon 
} from "lucide-react";

type PaymentWithDetails = Payment & {
  member?: Member;
  plan?: MembershipPlan;
};

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const { toast } = useToast();

  const { data: payments, isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const { data: members } = useQuery<Member[]>({
    queryKey: ["/api/members"],
  });

  const { data: subscriptions } = useQuery<Subscription[]>({
    queryKey: ["/api/subscriptions"],
  });

  const { data: plans } = useQuery<MembershipPlan[]>({
    queryKey: ["/api/membership-plans"],
  });

  // Combine data for display
  const paymentsWithDetails: PaymentWithDetails[] = payments?.map(payment => {
    const member = members?.find(m => m.id === payment.memberId);
    const subscription = subscriptions?.find(s => s.id === payment.subscriptionId);
    const plan = subscription ? plans?.find(p => p.id === subscription.planId) : undefined;
    
    return {
      ...payment,
      member,
      plan
    };
  }) || [];

  const filteredPayments = paymentsWithDetails.filter(payment => 
    payment.member?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.plan?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPayment = async (paymentData: any) => {
    try {
      await apiRequest("POST", "/api/payments", paymentData);
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      setShowAddPaymentModal(false);
      toast({
        title: "Payment recorded successfully",
        description: `Payment of $${paymentData.amount} has been recorded.`,
      });
    } catch (error) {
      toast({
        title: "Failed to record payment",
        description: "There was an error recording the payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cash':
        return <BanknoteIcon className="h-4 w-4 text-green-600" />;
      case 'card':
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'bank transfer':
        return <Wallet className="h-4 w-4 text-purple-600" />;
      default:
        return <Receipt className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <MainLayout>
      <div className="p-4 sm:p-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Track and manage all payment transactions.
            </p>
          </div>
          <Button className="mt-4 sm:mt-0" onClick={() => setShowAddPaymentModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search payments by member, plan, or payment method..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Payments table */}
        {isLoadingPayments ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {filteredPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt ID</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Membership Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          #{payment.id.toString().padStart(4, '0')}
                        </TableCell>
                        <TableCell>
                          {payment.member?.fullName || "Unknown Member"}
                        </TableCell>
                        <TableCell>
                          {payment.plan?.name || "Unknown Plan"}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${Number(payment.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getPaymentMethodIcon(payment.paymentMethod)}
                            <span className="capitalize">{payment.paymentMethod}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Receipt</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <Receipt className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 
                    "No payments match your search criteria." : 
                    "Get started by recording a new payment."}
                </p>
                <div className="mt-6">
                  <Button onClick={() => setShowAddPaymentModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Record Payment
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AddPaymentForm 
        isOpen={showAddPaymentModal} 
        onClose={() => setShowAddPaymentModal(false)} 
        onSubmit={handleAddPayment}
        members={members || []}
        subscriptions={subscriptions || []}
      />
    </MainLayout>
  );
}
