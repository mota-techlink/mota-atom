"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Package, CreditCard, Clock, TrendingUp, ChevronRight, ChevronLeft, Loader2,User } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const scrollbarStyles = `
  .orders-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .orders-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .orders-scroll::-webkit-scrollbar-thumb {
    background: #475569;
    border-radius: 3px;
  }
  .orders-scroll::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }
`

export default function DashboardContent({ user, stats, recentOrders }: any) {
  type ChartDataItem = {
    name: string
    total: number
  }

  const [period, setPeriod] = useState<string>("month")
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchChartData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/chart-data?period=${period}&year=${year}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setChartData(data)
      }
    } catch (err) {
      console.error("Failed to fetch chart data", err)
    } finally {
      setLoading(false)
    }
  }, [period, year])

  useEffect(() => {
    fetchChartData()
  }, [fetchChartData])

  return (
    <div className="p-6 space-y-8 bg-slate-950 text-slate-50 min-h-screen">
      <style>{scrollbarStyles}</style>
      {/* 1. Header & User Info */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hi, {user.user_metadata?.full_name || 'Member'}</h1>
          <p className="text-slate-400">Welcome back! Manage your {stats.totalOrders} projects here.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 p-2 pr-4 rounded-full border border-slate-800">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
            {user.email?.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-sm">
            <p className="font-medium">{user.email}</p>
            <p className="text-xs text-slate-500">Last login: {new Date(user.last_sign_in_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {/* <MetricCard title="Total Payment" value={`$${stats.totalPayment.toLocaleString()}`} icon={<Wallet className="h-4 w-4 text-blue-500"/>} subText="+20.1% from last month" isTrend /> */}
        <MetricCard title="Total Payment" value={`$${stats.totalPayment.toLocaleString()}`} icon={<Wallet className="h-4 w-4 text-blue-500"/>}  />
        <MetricCard title="Active Orders" value={stats.activeOrders} icon={<Package className="h-4 w-4 text-blue-500"/>} subText="Awaiting delivery" />
        <MetricCard title="Total Orders" value={stats.totalOrders} icon={<CreditCard className="h-4 w-4 text-blue-500"/>} subText="Lifetime orders" />
        <MetricCard title="Support" value={stats.supportTickets} icon={<Clock className="h-4 w-4 text-blue-500"/>} subText="Open tickets" />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 bg-slate-900 border-slate-800 text-slate-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="space-y-1">
              <CardTitle>Spending Overview</CardTitle>
              {/* 🟢 年份切换 UI */}
              <div className="flex items-center gap-2 text-slate-400">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 hover:bg-slate-800"
                  onClick={() => setYear(prev => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-mono font-bold text-blue-400">{year}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 hover:bg-slate-800"
                  onClick={() => setYear(prev => prev + 1)}
                  disabled={year >= new Date().getFullYear()} // 不允许选未来年份
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="month" onValueChange={setPeriod}>
              <TabsList className="bg-slate-950 border border-slate-800">                
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="quater">Quater</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="pt-4 relative" style={{ height: '300px' }}>
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : null}
            
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}} 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 3. Recent Orders Card */}
        <Card className="md:col-span-3 bg-slate-900 border-slate-800 text-slate-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-blue-400">
              <Link href="/dashboard/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-6 pt-0">
            <div className="orders-scroll space-y-6 overflow-y-auto pr-2" style={{ maxHeight: '300px' }}>
              {recentOrders.map((order: any) => (
                // 3. 这里的跳转带上 order_number 参数
                <Link 
                  key={order.id} 
                  href={`/dashboard/orders?open=${order.order_number}`}
                  className="flex items-center gap-4 group hover:bg-slate-800/50 p-2 -mx-2 rounded-lg transition-colors"
                >
                <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">{order.product_name}</p>
                  <p className="text-xs text-slate-500 mt-1 font-mono uppercase">{order.order_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-400">${order.amount_total}</p>
                  <Badge variant="outline" className="h-5 text-[10px] uppercase border-blue-900 text-blue-400">
                    {order.status}
                  </Badge>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-blue-500 transition-colors" />
              </Link>
            ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-slate-900 border-slate-800 text-slate-50 flex flex-row items-center p-6 gap-6">
          <div className="bg-blue-500/10 p-4 rounded-full">
            <User className="h-8 w-8 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">Personal Information</h3>
            <p className="text-sm text-slate-400">Update your profile, phone number, and address.</p>
          </div>
          <Button variant="outline" className="border-slate-700 hover:bg-slate-800" asChild>
            <Link href="/dashboard/profile">Edit</Link>
        </Button>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-50 flex flex-row items-center p-6 gap-6">
          <div className="bg-blue-500/10 p-4 rounded-full">
            <CreditCard className="h-8 w-8 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">Payment Methods</h3>
            <p className="text-sm text-slate-400">Manage your Stripe and Crypto payment details.</p>
          </div>
          <Button variant="outline" className="border-slate-700  hover:bg-slate-800" asChild>
            <Link href="/dashboard/settings">Manage</Link>            
          </Button>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon, subText, isTrend }: any) {
  return (
    <Card className="bg-slate-900 border-slate-800 text-slate-50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs mt-1 ${isTrend ? 'text-green-500 flex items-center' : 'text-slate-500'}`}>
          {isTrend && <TrendingUp className="h-3 w-3 mr-1" />} {subText}
        </p>
      </CardContent>
    </Card>
  )
}