import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { Send, ArrowLeft, MoreVertical, Image, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const socket = io('http://localhost:5000');

function ChatWindow({ selectedUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const messageAddedRef = useRef(false);
  const fileInputRef = useRef(null);

  console.log('Current user:', user); // Debug user data
  console.log('Selected user ID:', selectedUserId); // Debug selected user

  const fetchMessages = async () => {
    try {
      const chatId = user.role === 'admin' ? selectedUserId : user.id;
      console.log('Fetching messages for chatId:', chatId);
      
      if (!chatId) {
        console.error('No valid chat ID available');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      console.log('Fetched chat data:', data);
      
      if (data && data.messages) {
        setMessages(data.messages);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.role === 'admin' && !selectedUserId) return;
    
    fetchMessages();
    messageAddedRef.current = false;
    
    const chatRoom = user.role === 'admin' ? selectedUserId : user.id;
    if (chatRoom) {
      socket.emit('join_chat', chatRoom);
      console.log('Joined chat room:', chatRoom);
    }

    socket.on('receive_message', (data) => {
      console.log('Received message:', data);
      if (!messageAddedRef.current || data.sender !== user.id) {
        setMessages(prev => [...prev, data]);
      }
      messageAddedRef.current = false;
    });

    socket.on('delete_message', (data) => {
      console.log('Message deleted:', data);
      setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
    });

    return () => {
      socket.off('receive_message');
      socket.off('delete_message');
      if (chatRoom) {
        socket.emit('leave_chat', chatRoom);
      }
    };
  }, [user.id, user.role, selectedUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!user || !user.id) {
      console.error('User data is missing', user);
      return;
    }

    const chatId = user.role === 'admin' ? selectedUserId : user.id;
    if (!chatId) {
      console.error('No valid chat ID available');
      return;
    }

    const messageData = {
      sender: user.id,
      senderRole: user.role,
      content: newMessage,
      room: chatId,
      timestamp: new Date()
    };

    console.log('Sending message data:', messageData);

    try {
      const response = await fetch(`http://localhost:5000/api/chat/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(messageData)
      });

      const data = await response.json();
      console.log('Message save response:', data);

      if (response.ok) {
        messageAddedRef.current = true;
        socket.emit('send_message', messageData);
        setNewMessage('');
        setMessages(prev => [...prev, messageData]);
      } else {
        console.error('Failed to save message:', data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const chatId = user.role === 'admin' ? selectedUserId : user.id;
      const response = await fetch(
        `http://localhost:5000/api/chat/${chatId}/messages/${messageId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );
  
      if (response.ok) {
        setMessages(messages.filter(msg => msg._id !== messageId));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('image', file);
    formData.append('sender', user.id);
    formData.append('senderRole', user.role);
  
    try {
      const chatId = user.role === 'admin' ? selectedUserId : user.id;
      const response = await fetch(
        `http://localhost:5000/api/chat/${chatId}/messages/image`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        const newMessage = data.messages[data.messages.length - 1];
        messageAddedRef.current = true;
        socket.emit('send_message', newMessage);
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  // Determine if this is the admin view
  const isAdminView = user.role === 'admin';

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat header - only show in admin view */}
      {isAdminView && (
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                {messages[0]?.senderRole === 'user' ? messages[0]?.sender[0]?.toUpperCase() : 'U'}
              </div>
              <div>
                <h3 className="font-medium">
                  {messages[0]?.senderRole === 'user' ? 'User' : 'Admin'}
                </h3>
                <p className="text-sm text-gray-500">
                  {messages.length > 0 ? 'Active' : 'No messages yet'}
                </p>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as read</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Clear chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Messages area */}
      <div className={`flex-1 overflow-y-auto bg-gray-50 ${isAdminView ? 'p-4' : 'p-6'}`}>
        <div className="max-w-3xl mx-auto space-y-4">
          {messages && messages.length > 0 ? (
            messages.map((msg, index) => {
              const isCurrentUser = msg.sender === user.id;
              const showAvatar = index === 0 || messages[index - 1]?.sender !== msg.sender;

              return (
                <div
                  key={index}
                  className={`flex items-start gap-2 group ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isCurrentUser && showAvatar && (
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                      {msg.senderRole === 'admin' ? 'A' : 'U'}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg p-3 relative ${
                      isCurrentUser
                        ? 'bg-primary text-white rounded-br-none'
                        : 'bg-white shadow-sm rounded-bl-none'
                    }`}
                  >
                    {msg.messageType === 'image' ? (
                      <img 
                        src={msg.content} 
                        alt="Chat image" 
                        className="rounded max-w-full h-auto"
                      />
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                    <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-gray-500'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {isCurrentUser && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteMessage(msg._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={sendMessage} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="Type your message..."
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image className="h-5 w-5" />
            </Button>
            <Button type="submit" size="icon" className="rounded-full">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow; 