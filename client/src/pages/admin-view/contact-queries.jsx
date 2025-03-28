import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, User, UserCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const ContactQueries = () => {
  const [queries, setQueries] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contact', {
        withCredentials: true
      });
      setQueries(response.data);
    } catch (error) {
      console.error('Error fetching queries:', error);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      await axios.delete(`http://localhost:5000/api/contact/${id}`, {
        withCredentials: true
      });
      setQueries(queries.filter(query => query._id !== id));
    } catch (error) {
      console.error('Error deleting query:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Contact Queries</h1>
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Info</TableHead>
              <TableHead>Contact Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queries.map((query) => (
              <TableRow key={query._id}>
                <TableCell>
                  {query.userId ? (
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        {query.username}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <UserCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Guest User</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{query.fullName}</TableCell>
                <TableCell>{query.email}</TableCell>
                <TableCell className="max-w-md">
                  <Textarea
                    value={query.message}
                    readOnly
                    className="min-h-[100px] resize-none bg-gray-50"
                  />
                </TableCell>
                <TableCell>{formatDate(query.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(query._id)}
                    disabled={deleteLoading === query._id}
                  >
                    {deleteLoading === query._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {queries.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No contact queries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ContactQueries; 