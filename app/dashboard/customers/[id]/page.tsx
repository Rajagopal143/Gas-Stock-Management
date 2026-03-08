"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Phone, 
  MapPin, 
  Store, 
  Calendar, 
  IndianRupee, 
  Truck, 
  History, 
  ReceiptIndianRupee,
  AlertCircle,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const qc = useQueryClient();
  const id = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => fetch(`/api/customers/${id}`).then((res) => {
      if (!res.ok) throw new Error("Customer not found");
      return res.json();
    }),
  });

  const deleteCustomer = async () => {
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Customer deleted successfully");
      qc.invalidateQueries({ queryKey: ["customers"] });
      router.push("/dashboard/customers");
    } catch {
      toast.error("Failed to delete customer");
    }
  };

  if (isLoading) return <div className="flex h-96 items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div>;
  if (error) return <div className="text-center py-20"><p className="text-destructive font-bold text-xl">Customer not found</p><Button variant="link" onClick={() => router.back()}>Go Back</Button></div>;

  const { customer, deliveries, collections, totalSales, totalPaid, balance } = data;

  return (
    <div className="space-y-6 pb-12 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/customers")} className="shrink-0">
            <ArrowLeft className="size-4" />
          </Button>
          <div className="min-w-0">
            <h2 className="text-3xl font-black tracking-tight truncate">{customer.name}</h2>
            <p className="text-muted-foreground flex items-center gap-2 text-sm">
              <Store className="size-3" /> {customer.shopName || "Personal Account"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/customers/${id}/edit`)} className="gap-2">
            <Edit className="size-4" /> Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2 shadow-lg shadow-destructive/20">
                <Trash2 className="size-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl border-none">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the customer profile.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteCustomer} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
                  Delete Customer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Contact Info */}
        <Card className="md:col-span-1 border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Phone className="size-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Phone Number</p>
                <p className="font-bold text-sm">{customer.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <MapPin className="size-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted-foreground">Area / Address</p>
                <p className="font-bold text-sm">{customer.area || "N/A"}</p>
                <p className="text-xs text-muted-foreground">{customer.address}</p>
              </div>
            </div>
            {customer.notes && (
              <div className="rounded-xl bg-muted/50 p-3 text-xs italic text-muted-foreground border border-dashed">
                &ldquo;{customer.notes}&rdquo;
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-none shadow-xl shadow-primary/5 bg-blue-50/50 border border-blue-100">
            <CardContent className="p-6">
              <Truck className="size-4 text-blue-500 mb-2" />
              <p className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">Total Buy (Sales)</p>
              <p className="text-2xl font-black text-blue-700 tracking-tight">₹{totalSales.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-xl shadow-primary/5 bg-emerald-50/50 border border-emerald-100">
            <CardContent className="p-6">
              <ReceiptIndianRupee className="size-4 text-emerald-500 mb-2" />
              <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Total Paid</p>
              <p className="text-2xl font-black text-emerald-700 tracking-tight">₹{totalPaid.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className={cn(
            "border-none shadow-xl shadow-primary/5 overflow-hidden",
            balance > 0 ? "bg-rose-50 border border-rose-100" : "bg-emerald-600 text-white"
          )}>
            <CardContent className="p-6 relative">
              <IndianRupee className={cn("size-4 mb-2", balance > 0 ? "text-rose-500" : "text-emerald-100")} />
              <p className={cn("text-[10px] font-bold uppercase tracking-wider", balance > 0 ? "text-rose-600" : "text-emerald-100")}>Current Balance</p>
              <p className="text-2xl font-black tracking-tight">₹{balance.toLocaleString()}</p>
              {balance > 0 && (
                <div className="absolute top-4 right-4 animate-pulse">
                  <AlertCircle className="size-4 text-rose-500" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* History Tabs */}
      <Tabs defaultValue="deliveries" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="deliveries" className="gap-2">
            <History className="size-3.5" /> Buy History
          </TabsTrigger>
          <TabsTrigger value="collections" className="gap-2">
            <ReceiptIndianRupee className="size-3.5" /> Payment History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deliveries">
          <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="divide-y">
                {deliveries.length === 0 ? (
                  <div className="p-20 text-center text-muted-foreground">No purchase history found.</div>
                ) : (
                                      deliveries.map((d: { _id: string; cylinderType: string; deliveryDate: string; quantity: number; pricePerCylinder: number }) => (
                    <div key={d._id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Package className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{d.cylinderType}</p>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center"><Calendar className="size-3 mr-1" /> {format(new Date(d.deliveryDate), "dd MMM yyyy")}</span>
                            <span>Qty: {d.quantity}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black tracking-tight">₹{(d.quantity * d.pricePerCylinder).toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">₹{d.pricePerCylinder} / cylinder</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections">
          <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="divide-y">
                {collections.length === 0 ? (
                  <div className="p-20 text-center text-muted-foreground">No payment history found.</div>
                ) : (
                                      collections.map((c: { _id: string; paymentMode: string; paymentDate: string; amount: number; notes?: string }) => (
                    <div key={c._id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <ReceiptIndianRupee className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{c.paymentMode}</p>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center"><Calendar className="size-3 mr-1" /> {format(new Date(c.paymentDate), "dd MMM yyyy")}</span>
                            {c.notes && <span className="italic">{c.notes}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-emerald-600 tracking-tight">₹{c.amount.toLocaleString()}</p>
                        <Badge variant="outline" className="text-[9px] font-bold text-emerald-500 bg-emerald-50 border-emerald-100">Received</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Utility to merge classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
