import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminDashboard from "./AdminDashboard";
import moment from 'moment-timezone';
import { BASE_URL } from "@/routes";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/contact`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(res.data);
    } catch (error) {
      console.error("Failed to fetch contact messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);


  return (
    <>
      <AdminDashboard>
        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Contact Messages</h2>

          {loading ? (
            <p>Loading...</p>
          ) : contacts.length === 0 ? (
            <p>No contact messages found.</p>
          ) : (
            <div className="grid gap-4">
              {contacts.map((contact) => (
                <Card key={contact.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">{contact.name}</h3>
                      <Badge>
                        {moment(contact.created_at).tz('Asia/Kolkata').format('MMMM Do YYYY')}
                      </Badge>
                    </div>
                    <p>
                      <strong>Email:</strong> {contact.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {contact.phone}
                    </p>
                    <p>
                      <strong>Message:</strong> {contact.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </AdminDashboard>
    </>
  );
};

export default ContactList;
