import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { Send } from 'lucide-react';
import { useAuth } from '../lib/auth';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  currentUserId: string;
}

export const ChatModal = ({ isOpen, onClose, requestId, currentUserId }: ChatModalProps) => {
  const { user, role } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && requestId) {
      const q = query(
        collection(db, 'messages'), 
        where('request_id', '==', requestId)
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        msgs.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setMessages(msgs);
        scrollToBottom();
      });

      return () => unsubscribe();
    }
  }, [isOpen, requestId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        request_id: requestId,
        user_id: currentUserId,
        user_name: user.name || '',
        user_role: role || 'client',
        content: newMessage.trim(),
        createdAt: new Date().toISOString()
      });
      setNewMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#D4AF37]">Live Chat</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#050505] rounded-md border border-white/5">
          {messages.length === 0 ? (
            <div className="text-center text-white/40 mt-10">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.user_id === currentUserId;
              const senderName = msg.user_role === 'admin' ? 'Support' : (msg.user_name || 'Customer');
              
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className={`text-xs mb-1 ${isMe ? 'text-white/50' : 'text-[#D4AF37] font-semibold'}`}>
                    {isMe ? 'You' : senderName}
                  </span>
                  <div className={`max-w-[80%] p-3 rounded-lg ${isMe ? 'bg-[#D4AF37] text-black rounded-br-none' : 'bg-white/10 text-white rounded-bl-none'}`}>
                    <p className="text-sm">{msg.content}</p>
                    <span className={`text-[10px] opacity-70 block mt-1 ${isMe ? 'text-black/70' : 'text-white/50'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="mt-4 flex gap-2">
          <Input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="bg-[#050505] border-white/10 text-white focus-visible:ring-[#D4AF37]"
          />
          <Button type="submit" disabled={loading || !newMessage.trim()} className="bg-[#D4AF37] text-black hover:bg-[#F3C93F]">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
