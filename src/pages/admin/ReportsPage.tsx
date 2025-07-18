// Updated to use real data from API for ReportsPage
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { BASE_URL } from "@/routes";
import {
  FileText,
  Calendar,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminDashboard from "./AdminDashboard";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReportsPage = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [reportPeriod, setReportPeriod] = useState("last6months");

  const [report, setReport] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user]);

//   useEffect(() => {
//     fetch(`http://localhost:8001/api/v1/analytics/reports`)
//       .then(res => res.json())
//       .then(data => setReport(data));
//
//     fetch("http://localhost:8001/api/v1/analytics/monthly-revenue")
//       .then(res => res.json())
//       .then(data => setMonthlyData(data));
//   }, []);

useEffect(() => {
  fetch(`${BASE_URL}/reports`)
    .then(res => res.json())
    .then(data => setReport(data));

  fetch(`${BASE_URL}/monthly-revenue`)
    .then(res => res.json())
    .then(data => setMonthlyData(data));
}, []);

  const handleExportReport = () => {
    alert("Report exported (simulation)");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (!report) return null;

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
              <div className="text-2xl font-bold">{formatCurrency(Number(report.total_revenue) || 0)}</div>
              <div className="text-xs text-gray-500 mt-1">From all transactions</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Sales Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(Number(report.sales_revenue) || 0)}</div>
              <div className="text-xs text-gray-500 mt-1">From product sales</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Rental Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(Number(report.total_revenue) || 0)}
</div>
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
                    <RechartsBarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
<Tooltip formatter={(value) => formatCurrency(typeof value === 'number' ? value : 0)} />
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
                       data={report.transaction_type_distribution || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${isNaN(percent) ? '0' : (percent * 100).toFixed(0)}%`}

                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                      {Array.isArray(report.transaction_type_distribution) &&
  report.transaction_type_distribution.map((entry: any, index: number) => (
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