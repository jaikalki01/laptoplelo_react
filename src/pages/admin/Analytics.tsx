
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  Calendar,
  ArrowUp,
  ArrowDown,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminDashboard from "./AdminDashboard";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { transactions } from "@/data/transactions";
import { products } from "@/data/products";
import { users } from "@/data/users";

// Mock data for analytics
const customerGrowth = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 132 },
  { month: 'Mar', users: 145 },
  { month: 'Apr', users: 163 },
  { month: 'May', users: 182 },
  { month: 'Jun', users: 195 },
  { month: 'Jul', users: 210 },
  { month: 'Aug', users: 242 },
  { month: 'Sep', users: 273 },
  { month: 'Oct', users: 305 },
  { month: 'Nov', users: 333 },
  { month: 'Dec', users: 350 },
];

const revenueData = [
  { month: 'Jan', sales: 150000, rentals: 25000 },
  { month: 'Feb', sales: 165000, rentals: 28000 },
  { month: 'Mar', sales: 172000, rentals: 31000 },
  { month: 'Apr', sales: 180000, rentals: 34000 },
  { month: 'May', sales: 195000, rentals: 38000 },
  { month: 'Jun', sales: 210000, rentals: 42000 },
  { month: 'Jul', sales: 225000, rentals: 47000 },
  { month: 'Aug', sales: 240000, rentals: 52000 },
  { month: 'Sep', sales: 255000, rentals: 58000 },
  { month: 'Oct', sales: 270000, rentals: 64000 },
  { month: 'Nov', sales: 290000, rentals: 70000 },
  { month: 'Dec', sales: 310000, rentals: 76000 },
];

const productCategoryData = [
  { name: 'Business Laptops', value: 35 },
  { name: 'Gaming Laptops', value: 30 },
  { name: 'Ultrabooks', value: 25 },
  { name: 'Budget Models', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState("year");

  // If user is not admin, redirect to login
  if (!user || user.role !== 'admin') {
    navigate('/login');
    return null;
  }

  // Calculate quick stats
  const totalCompletedTransactions = transactions.filter(t => t.status === 'completed').length;
  const totalRevenue = transactions.reduce((sum, t) => t.status === 'completed' ? sum + t.total : sum, 0);
  const totalSales = transactions.filter(t => t.type === 'sale' && t.status === 'completed').length;
  const totalRentals = transactions.filter(t => t.type === 'rent' && t.status === 'completed').length;
  
  // Calculate growth (mock data)
  const revenueGrowth = 8.2; // percentage
  const customerGrowthPercent = 12.5; // percentage
  const salesGrowth = 5.7; // percentage
  const rentalGrowth = 15.3; // percentage

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
            <BarChart2 className="mr-2" /> Business Analytics
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center">
              <Calendar className="mr-2" size={18} />
              <select 
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm"
              >
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="all">All Time</option>
              </select>
            </Button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</h3>
                </div>
                <div className={`p-2 rounded-full ${revenueGrowth >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="flex items-center mt-2">
                {revenueGrowth >= 0 ? (
                  <ArrowUp size={16} className="text-green-600 mr-1" />
                ) : (
                  <ArrowDown size={16} className="text-red-600 mr-1" />
                )}
                <span className={`text-xs font-medium ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(revenueGrowth)}% {revenueGrowth >= 0 ? 'increase' : 'decrease'}
                </span>
                <span className="text-xs text-gray-500 ml-1">vs previous period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Customers</p>
                  <h3 className="text-2xl font-bold mt-1">{users.length}</h3>
                </div>
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <Users size={20} />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUp size={16} className="text-green-600 mr-1" />
                <span className="text-xs font-medium text-green-600">{customerGrowthPercent}% increase</span>
                <span className="text-xs text-gray-500 ml-1">vs previous period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Sales</p>
                  <h3 className="text-2xl font-bold mt-1">{totalSales}</h3>
                </div>
                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                  <ShoppingBag size={20} />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUp size={16} className="text-green-600 mr-1" />
                <span className="text-xs font-medium text-green-600">{salesGrowth}% increase</span>
                <span className="text-xs text-gray-500 ml-1">vs previous period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Rentals</p>
                  <h3 className="text-2xl font-bold mt-1">{totalRentals}</h3>
                </div>
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <Calendar size={20} />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUp size={16} className="text-green-600 mr-1" />
                <span className="text-xs font-medium text-green-600">{rentalGrowth}% increase</span>
                <span className="text-xs text-gray-500 ml-1">vs previous period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
            <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
            <TabsTrigger value="products">Product Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={revenueData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Area type="monotone" dataKey="sales" name="Sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="rentals" name="Rentals" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales vs Rentals</CardTitle>
                  <CardDescription>Transaction type distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={revenueData}
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
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="customers">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Growth</CardTitle>
                  <CardDescription>Monthly new customer acquisition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={customerGrowth}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="users" name="Customers" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer KYC Status</CardTitle>
                  <CardDescription>Verification status distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Verified', value: users.filter(u => u.kycVerified).length },
                            { name: 'Not Verified', value: users.filter(u => !u.kycVerified).length }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#4CAF50" />
                          <Cell fill="#F44336" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="products">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Categories</CardTitle>
                  <CardDescription>Distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {productCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Products</CardTitle>
                  <CardDescription>Top selling & renting laptops</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product, index) => (
                      <div key={product.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                        <div className="flex-shrink-0 mr-4 text-xl font-bold text-gray-500">#{index + 1}</div>
                        <div className="flex-shrink-0 w-16 h-12">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <div className="flex justify-between mt-1">
                            <div className="text-sm text-gray-500">{product.brand}</div>
                            <div className="text-sm font-medium">
                              {formatCurrency(product.price)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminDashboard>
  );
};

export default Analytics;
