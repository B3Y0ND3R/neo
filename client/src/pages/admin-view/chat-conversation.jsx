import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ChatWindow from '@/components/chat/ChatWindow';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelector } from 'react-redux';

const AdminChatConversation = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (location.state?.userName) {
      setUserName(location.state.userName);
    }
  }, [location.state]);

  if (user?.role !== 'admin') {
    return <div>Access denied. Admin only area.</div>;
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/chats')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chats
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              {userName ? userName[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{userName || 'Customer'}</h1>
              <p className="text-muted-foreground">Customer Support Chat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="h-[calc(100vh-12rem)] bg-white rounded-lg shadow-lg overflow-hidden">
        <ChatWindow selectedUserId={userId} />
      </div>
    </div>
  );
};

export default AdminChatConversation; 