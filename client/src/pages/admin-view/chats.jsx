import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { useSelector } from 'react-redux';
import { Search, MessageCircle, Clock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminChats = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/chat/conversations', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchConversations();
    }
  }, []); // Only run once on mount

  const handleSelectConversation = (userId, userName) => {
    navigate(`/admin/chat/${userId}`, { 
      state: { userName, userId } 
    });
  };

  const filteredConversations = conversations.filter(chat => 
    chat.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return <div>Access denied. Admin only area.</div>;
  }

  return (
    <div className="p-2 space-y-4 max-w-full overflow-hidden">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Customer Chats</h1>
        <p className="text-muted-foreground">Manage customer conversations</p>
      </div>

      {/* Search and Refresh */}
      <div className="flex flex-col gap-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={fetchConversations}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Refresh
        </Button>
      </div>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Conversations ({filteredConversations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Loading conversations...</span>
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="space-y-3">
              {filteredConversations.map((chat) => (
                <div 
                  key={chat._id}
                  className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors max-w-full"
                  onClick={() => handleSelectConversation(chat.user._id || chat.user, chat.userName)}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold flex-shrink-0">
                    {chat.userName[0].toUpperCase()}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate">{chat.userName}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {chat.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {chat.unreadCount} new
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {chat.messages && chat.messages.length > 0 
                            ? formatTime(chat.messages[chat.messages.length - 1].timestamp)
                            : '-'
                          }
                        </span>
                      </div>
                    </div>
                    {chat.messages && chat.messages.length > 0 ? (
                      <p className="text-sm text-muted-foreground truncate max-w-full">
                        {chat.messages[chat.messages.length - 1].content.length > 50 
                          ? chat.messages[chat.messages.length - 1].content.substring(0, 30) + '...'
                          : chat.messages[chat.messages.length - 1].content
                        }
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">No messages yet</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No conversations found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try adjusting your search terms.' : 'Customer messages will appear here when they start conversations.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminChats; 