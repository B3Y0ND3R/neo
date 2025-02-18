import { useSelector } from 'react-redux';
import ChatWindow from '@/components/chat/ChatWindow';
import { MessageCircle } from 'lucide-react';
import ShoppingHeader from '@/components/shopping-view/header';

function UserChat() {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      {/* Main Shopping Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <ShoppingHeader />
      </div>

      {/* Main content area with fixed top padding */}
      <div className="pt-16"> {/* pt-16 matches header height */}
        <div className="container mx-auto px-4 py-6 h-[calc(100vh-4rem)]"> {/* Subtract header height */}
          <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
            {/* Chat title */}
            <div className="border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Chat with Admin</h1>
              </div>
            </div>
            
            {/* Chat window with flex-1 to take remaining height */}
            <div className="flex-1 overflow-hidden">
              <ChatWindow />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserChat;