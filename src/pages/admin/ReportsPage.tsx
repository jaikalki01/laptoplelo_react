import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminDashboard from "./AdminDashboard";
import { BASE_URL } from "@/routes";
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

interface ReportData {
  total_revenue: number;
  sales_revenue: number;
  rental_revenue: number;
  transaction_type_distribution: {
    name: string;
    value: number;
  }[];
}

interface MonthlyData {
  month: string;
  sales: number;
  rentals: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReportsPage = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [reportPeriod, setReportPeriod] = useState<"last6months" | "last12months" | "thisYear">("last6months");
  const [report, setReport] = useState<ReportData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [reportResponse, monthlyResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/v1/analytics/overview`),
          fetch(`${BASE_URL}/api/v1/analytics/monthly-revenue?period=${reportPeriod}`)
        ]);

        if (!reportResponse.ok || !monthlyResponse.ok) {
          throw new Error('Failed to fetch report data');
        }

        const [reportData, monthlyData] = await Promise.all([
          reportResponse.json(),
          monthlyResponse.json()
        ]);

        setReport({
          total_revenue: reportData.total_revenue ?? 0,
          sales_revenue: reportData.sales_revenue ?? 0,
          rental_revenue: reportData.rental_revenue ?? 0,
          transaction_type_distribution: reportData.transaction_type_distribution ?? []
        });
        setMonthlyData(monthlyData);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reportPeriod]);

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

  if (!user || user.role !== 'admin') {
    return null; // Redirect will happen in useEffect
  }

  if (loading) {
    return (
      <AdminDashboard>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </AdminDashboard>
    );
  }

  if (error) {
    return (
      <AdminDashboard>
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </AdminDashboard>
    );
  }

  return (
    <AdminDashboard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold flex items-center">
            <FileText className="mr-2" /> Reports & Analytics
          </h1>
          <Button onClick={handleExportReport} disabled={!report}>
            <Download size={18} className="mr-2" /> Export Report
          </Button>
        </div>

        {report && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(report.total_revenue)}</div>
                  <div className="text-xs text-gray-500 mt-1">From all transactions</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Sales Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(report.sales_revenue)}</div>
                  <div className="text-xs text-gray-500 mt-1">From product sales</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Rental Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(report.rental_revenue)}</div>
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
                        onChange={(e) => setReportPeriod(e.target.value as typeof reportPeriod)}
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
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
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
                      {report.transaction_type_distribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={report.transaction_type_distribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {report.transaction_type_distribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-gray-500">No transaction data available</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AdminDashboard>
  );
};

export default ReportsPage;
