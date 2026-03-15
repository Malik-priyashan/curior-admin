import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import Link from "next/link";

const summary = [
  { label: "Today Orders", value: "42", note: "+12% vs yesterday" },
  { label: "Delivered", value: "35", note: "83% completion" },
  { label: "Pending Pickup", value: "7", note: "2 urgent orders" },
  { label: "Today Revenue", value: "LKR 124,500", note: "Net after discounts" },
];

const recentOrders = [
  {
    id: "ORD-10291",
    customer: "Nimal Perera",
    area: "Colombo 05",
    amount: "LKR 3,200",
    status: "Delivered",
  },
  {
    id: "ORD-10292",
    customer: "Kasuni Fernando",
    area: "Nugegoda",
    amount: "LKR 7,850",
    status: "In Transit",
  },
  {
    id: "ORD-10293",
    customer: "Ravindu Silva",
    area: "Maharagama",
    amount: "LKR 2,450",
    status: "Pending",
  },
  {
    id: "ORD-10294",
    customer: "Ishara Jayawardena",
    area: "Dehiwala",
    amount: "LKR 4,900",
    status: "Delivered",
  },
];

function statusVariant(status: string): "success" | "pending" | "warn" {
  if (status === "Delivered") return "success";
  if (status === "In Transit") return "pending";
  return "warn";
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">Welcome back. Here is a quick overview today.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/curior-services">
              <Button>Get Courier Services List</Button>
            </Link>
   
            <LogoutButton />
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map((item) => (
            <Card key={item.label} className="border-slate-200 bg-white">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-wide">
                  {item.label}
                </CardDescription>
                <CardTitle className="text-2xl font-black">{item.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500">{item.note}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Recent Orders</CardTitle>
              <CardDescription>Latest activity from your merchant account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-semibold text-slate-900">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.area}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
