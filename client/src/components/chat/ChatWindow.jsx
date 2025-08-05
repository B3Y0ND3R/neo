import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { Send, ArrowLeft, MoreVertical, Image, Trash2, Edit } from 'lucide-react';
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
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState('');

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
        // Ensure the message has all required properties for proper rendering
        const messageWithDefaults = {
          _id: data._id || `temp_${Date.now()}`,
          sender: data.sender,
          senderRole: data.senderRole,
          content: data.content,
          messageType: data.messageType || 'text',
          timestamp: data.timestamp || new Date(),
          edited: data.edited || false
        };
        setMessages(prev => [...prev, messageWithDefaults]);
      }
      messageAddedRef.current = false;
    });

    socket.on('delete_message', (data) => {
      console.log('Message deleted:', data);
      setMessages(prev => prev.filter(msg => msg._id !== data.messageId));
    });

    socket.on('edit_message', (data) => {
      console.log('Message edited:', data);
      setMessages(prev => prev.map(msg => 
        msg._id === data.messageId 
          ? { ...msg, content: data.content, edited: true }
          : msg
      ));
    });

    return () => {
      socket.off('receive_message');
      socket.off('delete_message');
      socket.off('edit_message');
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
        // Get the saved message with proper ID from server response
        const savedMessage = data.messages[data.messages.length - 1];
        messageAddedRef.current = true;
        
        // Emit socket event with the saved message data
        socket.emit('send_message', {
          ...savedMessage,
          room: chatId
        });
        
        setNewMessage('');
        // Add the saved message with proper ID to local state
        setMessages(prev => [...prev, savedMessage]);
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
        // Emit socket event to notify other users about the deletion
        socket.emit('delete_message', {
          messageId: messageId,
          room: chatId
        });
        
        // Update local state immediately
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
      } else {
        console.error('Failed to delete message:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    try {
      const chatId = user.role === 'admin' ? selectedUserId : user.id;
      const response = await fetch(
        `http://localhost:5000/api/chat/${chatId}/messages/${messageId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ content: newContent })
        }
      );
  
      if (response.ok) {
        // Emit socket event to notify other users about the edit
        socket.emit('edit_message', {
          messageId: messageId,
          content: newContent,
          room: chatId
        });
        
        setMessages(prev => prev.map(msg => 
          msg._id === messageId 
            ? { ...msg, content: newContent, edited: true }
            : msg
        ));
        
        setEditingMessageId(null);
        setEditMessageText('');
      }
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate files
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Must be less than 5MB.`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} is not an image.`);
        return;
      }
    }

    const chatId = user.role === 'admin' ? selectedUserId : user.id;

    // Upload each image
    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('sender', user.id);
      formData.append('senderRole', user.role);

      try {
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
          
          // Add room property for socket event
          const socketMessage = {
            ...newMessage,
            room: chatId
          };
          
          socket.emit('send_message', socketMessage);
          setMessages(prev => [...prev, newMessage]);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert(`Failed to upload ${file.name}`);
      }
    }

    // Clear the file input
    e.target.value = '';
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
                    ) : editingMessageId === msg._id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editMessageText}
                          onChange={(e) => setEditMessageText(e.target.value)}
                          className="w-full p-2 border rounded bg-white text-black"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditMessage(msg._id, editMessageText)}
                            className="text-xs"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingMessageId(null);
                              setEditMessageText('');
                            }}
                            className="text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs ${isCurrentUser ? 'text-primary-foreground/70' : 'text-gray-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {msg.edited && (
                          <span className="ml-1 italic">(edited)</span>
                        )}
                      </p>
                      {isCurrentUser && msg._id && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {msg.messageType === 'text' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                setEditingMessageId(msg._id);
                                setEditMessageText(msg.content);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDeleteMessage(msg._id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </div>
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
              multiple
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