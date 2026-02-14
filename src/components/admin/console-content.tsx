"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export function ConsoleContent({ orders, stats }: any) {
  type ChartDataItem = {
    name: string;
    revenue: number;
    orders: number;
    users: number;
  };

  const [period, setPeriod] = useState<string>("month");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchChartData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/chart-data?period=${period}&year=${year}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setChartData(data);
      }
    } catch (err) {
      console.error("Failed to fetch chart data", err);
    } finally {
      setLoading(false);
    }
  }, [period, year]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "2-digit",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="md:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle>Revenue & Orders Trend</CardTitle>
              <CardDescription>Historical data for the selected period</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setYear((prev) => prev - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-12 text-center">{year}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setYear((prev) => prev + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Period Tabs */}
            <Tabs value={period} onValueChange={setPeriod} className="mb-4">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="month">Monthly</TabsTrigger>
                <TabsTrigger value="week">Weekly</TabsTrigger>
                <TabsTrigger value="quarter">Quarterly</TabsTrigger>
              </TabsList>
            </Tabs>

            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => {
                      if (typeof value === "number" && value > 1000) {
                        return formatCurrency(value);
                      }
                      return value;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                  <Bar dataKey="orders" fill="#3b82f6" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders Summary */}
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Recent Orders</CardTitle>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-85 overflow-y-auto pr-1">
              {orders.length > 0 ? (
                orders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">{order.product_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(order.amount_total)}</p>
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No orders yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <QuickLinkCard
          title="Manage Orders"
          description="View, edit, and manage all orders"
          href="/admin/orders"
        />
        <QuickLinkCard
          title="Manage Users"
          description="View, edit user permissions and details"
          href="/admin/users"
        />
        <QuickLinkCard
          title="System Settings"
          description="Configure platform settings"
          href="/admin/settings"
        />
      </div>
    </div>
  );
}

function QuickLinkCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer hover:border-primary/50 hover:shadow-md transition">
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
          <Button variant="ghost" size="sm" className="mt-3">
            Open <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
