import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Trash2, User, UserCircle, Loader2, Mail, Calendar, MessageSquare } from 'lucide-react';
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
    <div className="p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Contact Queries</h1>
      
      {/* Desktop Table View */}
      <div className="hidden xl:block">
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Info</TableHead>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-20">
                    <span className="sr-only">Actions</span>
                  </TableHead>
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
                    <TableCell className="whitespace-nowrap">{query.email}</TableCell>
                    <TableCell className="max-w-md">
                      <Textarea
                        value={query.message}
                        readOnly
                        className="min-h-[100px] resize-none bg-gray-50"
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(query.createdAt)}</TableCell>
                    <TableCell className="w-20">
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
          </CardContent>
        </Card>
      </div>

      {/* Medium Screen Table View */}
      <div className="hidden lg:block xl:hidden">
        <Card>
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-16">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queries.map((query) => (
                  <TableRow key={query._id}>
                    <TableCell>
                      {query.userId ? (
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3 text-green-500" />
                          <span className="text-xs font-medium text-green-600 truncate">
                            {query.username}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <UserCircle className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Guest</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-sm max-w-24 truncate">
                      {query.fullName}
                    </TableCell>
                    <TableCell className="text-xs max-w-32 truncate">{query.email}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">
                      {new Date(query.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="w-16">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(query._id)}
                        disabled={deleteLoading === query._id}
                        className="h-7 w-7 p-0"
                      >
                        {deleteLoading === query._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {queries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No contact queries found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {queries.map((query) => (
          <Card key={query._id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {query.userId ? (
                    <>
                      <User className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        {query.username}
                      </span>
                    </>
                  ) : (
                    <>
                      <UserCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Guest User</span>
                    </>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-1">{query.fullName}</h3>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(query._id)}
                disabled={deleteLoading === query._id}
                className="flex-shrink-0"
              >
                {deleteLoading === query._id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 break-all">{query.email}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{formatDate(query.createdAt)}</span>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Message</span>
                </div>
                <Textarea
                  value={query.message}
                  readOnly
                  className="min-h-[80px] resize-none bg-gray-50 text-sm"
                />
              </div>
            </div>
          </Card>
        ))}

        {queries.length === 0 && (
          <Card className="p-8">
            <div className="text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No contact queries found</p>
              <p className="text-sm">When users submit contact forms, they will appear here.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ContactQueries; 