
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  FileText, 
  Calendar, 
  Download, 
  BarChart, 
  PieChart,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminDashboard from "./AdminDashboard";
import { transactions } from "@/data/transactions";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

// Helper function to calculate total sales
const calculateTotalSales = () => {
  return transactions.reduce((total, tx) => {
    if (tx.type === 'sale' && tx.status === 'completed') {
      return total + tx.total;
    }
    return total;
  }, 0);
};

// Helper function to calculate total rentals
const calculateTotalRentals = () => {
  return transactions.reduce((total, tx) => {
    if (tx.type === 'rent' && tx.status === 'completed') {
      return total + tx.total;
    }
    return total;
  }, 0);
};

// Helper function to group transactions by month
const getMonthlyData = () => {
  const monthlyData: { [key: string]: { sales: number, rentals: number, month: string } } = {};
  
  transactions.forEach(tx => {
    if (tx.status !== 'completed') return;
    
    const date = new Date(tx.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    const monthName = date.toLocaleString('en-US', { month: 'short' });
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { sales: 0, rentals: 0, month: monthName };
    }
    
    if (tx.type === 'sale') {
      monthlyData[monthYear].sales += tx.total;
    } else {
      monthlyData[monthYear].rentals += tx.total;
    }
  });
  
  // Convert to array and sort by date
  return Object.entries(monthlyData)
    .map(([key, value]) => ({
      ...value,
      key
    }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.key.split('/').map(Number);
      const [bMonth, bYear] = b.key.split('/').map(Number);
      
      if (aYear !== bYear) return aYear - bYear;
      return aMonth - bMonth;
    })
    .slice(-6); // Get last 6 months
};

// Helper function to get transaction type breakdown
const getTransactionTypeData = () => {
  const saleCount = transactions.filter(tx => tx.type === 'sale' && tx.status === 'completed').length;
  const rentCount = transactions.filter(tx => tx.type === 'rent' && tx.status === 'completed').length;
  
  return [
    { name: 'Sales', value: saleCount },
    { name: 'Rentals', value: rentCount }
  ];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReportsPage = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [reportPeriod, setReportPeriod] = useState("last6months");

  // If user is not admin, redirect to login
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }
  
  const totalSales = calculateTotalSales();
  const totalRentals = calculateTotalRentals();
  const totalRevenue = totalSales + totalRentals;
  const monthlyData = getMonthlyData();
  const transactionTypeData = getTransactionTypeData();

  const handleExportReport = () => {
    // In a real app, this would generate a report
    alert("Report exported (simulation)");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminDashboard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold flex items-center">
            <FileText className="mr-2" /> Reports & Analytics
          </h1>
          <Button onClick={handleExportReport}>
            <Download size={18} className="mr-2" /> Export Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <div className="text-xs text-gray-500 mt-1">From all transactions</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Sales Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
              <div className="text-xs text-gray-500 mt-1">From product sales</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Rental Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRentals)}</div>
              <div className="text-xs text-gray-500 mt-1">From product rentals</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue from sales and rentals</CardDescription>
                <div className="mt-2">
                  <select 
                    className="p-2 border rounded-md text-sm"
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value)}
                  >
                    <option value="last6months">Last 6 Months</option>
                    <option value="last12months">Last 12 Months</option>
                    <option value="thisYear">This Year</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={monthlyData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="sales" name="Sales" fill="#8884d8" />
                      <Bar dataKey="rentals" name="Rentals" fill="#82ca9d" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Breakdown</CardTitle>
                <CardDescription>Distribution of transaction types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={transactionTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {transactionTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboard>
  );
};

export default ReportsPage;
