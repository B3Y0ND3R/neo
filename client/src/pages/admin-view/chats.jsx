import { useEffect, useState } from 'react';
import ChatWindow from '@/components/chat/ChatWindow';
import { Badge } from "@/components/ui/badge";
import { useSelector } from 'react-redux';
import { Search, MessageCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const AdminChats = () => {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);

  const fetchConversations = async () => {
    try {
      console.log('Fetching conversations...');
      const response = await fetch('http://localhost:5000/api/chat/conversations', {
        credentials: 'include'
      });
      const data = await response.json();
      console.log('Fetched conversations:', data);
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchConversations();
      const interval = setInterval(fetchConversations, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (location.state?.selectedUser) {
      console.log('Selected user from contact:', location.state.selectedUser);
      setSelectedUser(location.state.selectedUser);
      
      if (location.state.selectedUser.id) {
        fetchChatHistory(location.state.selectedUser.id);
      }
    }
  }, [location.state]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/chat/users', {
        withCredentials: true
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchChatHistory = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chat/history/${userId}`, {
        withCredentials: true
      });
      // Handle chat history
      setChatHistory(response.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleSelectUser = async (userId) => {
    console.log('Selected user ID:', userId); // Debug log
    setSelectedUser(userId);
    try {
      await fetch(`http://localhost:5000/api/chat/${userId}/read`, {
        method: 'PUT',
        credentials: 'include'
      });
      fetchConversations();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const filteredConversations = conversations.filter(chat => 
    chat.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (user?.role !== 'admin') {
    return <div>Access denied. Admin only area.</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Sidebar with conversations */}
      <div className="w-80 border-r flex flex-col bg-gray-50">
        <div className="p-4 border-b bg-white">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-9 bg-gray-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map(chat => (
              <div
                key={chat._id}
                onClick={() => handleSelectUser(chat.user._id || chat.user)}
                className={`p-4 hover:bg-gray-100 cursor-pointer border-b transition-colors duration-150
                  ${selectedUser === (chat.user._id || chat.user) ? 'bg-gray-100' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                    {chat.userName[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{chat.userName}</h3>
                      {chat.messages && chat.messages.length > 0 && (
                        <span className="text-xs text-gray-500">
                          {new Date(chat.messages[chat.messages.length - 1].timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    {chat.messages && chat.messages.length > 0 && (
                      <p className="text-sm text-gray-500 truncate">
                        {chat.messages[chat.messages.length - 1].content}
                      </p>
                    )}
                    {chat.unreadCount > 0 && (
                      <Badge variant="destructive" className="mt-1">
                        {chat.unreadCount} new
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No conversations found
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex">
        {selectedUser ? (
          <ChatWindow selectedUserId={selectedUser} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChats; 