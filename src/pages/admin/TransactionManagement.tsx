import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import {
  ShoppingCart,
  Search,
  Eye,
  Download,
  Calendar,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import AdminDashboard from "./AdminDashboard";
import { Dialog } from "@/components/ui/dialog";
import { BASE_URL } from "@/routes";
const TransactionManagement = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const limit = 10;

  useEffect(() => {
    fetch(`${BASE_URL}/api/v1/transaction/list?skip=${(page - 1) * limit}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => {
        console.error("Failed to fetch transactions:", err);
        toast({ title: "Error", description: "Could not load transactions" });
      });
  }, [page]);

  const filtered = transactions.filter((t) =>
    t.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (d) => new Date(d).toLocaleDateString("en-IN");
  const formatPrice = (p) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(p);

  return (
    <AdminDashboard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold flex items-center">
            <ShoppingCart className="mr-2" /> Transaction Management
          </h1>
          <Button onClick={() => toast({ title: "Export", description: "Exported" })}>
            <Download size={18} className="mr-2" /> Export
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by transaction ID or user"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="px-6 py-3">Transaction ID</th>
                <th className="px-6 py-3">User Info</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{t.transaction_id}</td>
                  <td className="px-6 py-4">
                    <div>{t.user_name}</div>
                    <div className="text-xs text-gray-500">{t.user_email}</div>
                    <div className="text-xs text-gray-400">{t.user_phone}</div>
                  </td>
                  <td className="px-6 py-4">{formatDate(t.created_at)}</td>
                  <td className="px-6 py-4 capitalize">{t.type}</td>
                  <td className="px-6 py-4 font-medium">{formatPrice(t.amount)}</td>
                  <td className="px-6 py-4 capitalize">{t.status}</td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm" onClick={() => setSelectedTransaction(t)}>
                      <Eye size={16} className="mr-1" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
          <span className="self-center">Page {page}</span>
          <Button onClick={() => setPage(page + 1)}>Next</Button>
        </div>

        {/* View Transaction Modal */}
        {selectedTransaction && (
          <Dialog open={true} onOpenChange={() => setSelectedTransaction(null)}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
                <button className="absolute top-2 right-2" onClick={() => setSelectedTransaction(null)}>
                  <X />
                </button>
                <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
                <div className="text-sm space-y-2">
                  <p><strong>ID:</strong> {selectedTransaction.transaction_id}</p>
                  <p><strong>User:</strong> {selectedTransaction.user_name} ({selectedTransaction.user_email})</p>
                  <p><strong>Phone:</strong> {selectedTransaction.user_phone}</p>
                  <p><strong>Type:</strong> {selectedTransaction.type}</p>
                  <p><strong>Method:</strong> {selectedTransaction.method}</p>
                  <p><strong>Amount:</strong> {formatPrice(selectedTransaction.amount)}</p>
                  <p><strong>Status:</strong> {selectedTransaction.status}</p>
                  <p><strong>Date:</strong> {formatDate(selectedTransaction.created_at)}</p>
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </AdminDashboard>
  );
};

export default TransactionManagement;
