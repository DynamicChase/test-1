import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { authApi, messageApi, userApi } from '@/services/api';
import type { User, Message } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

export default function Messages() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const user = authApi.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    const userId = searchParams.get('user');
    if (userId) {
      const otherUser = userApi.getById(userId);
      if (otherUser) {
        setSelectedUser(otherUser);
        loadMessages(user.id, userId);
      }
    }
  }, [navigate, searchParams]);

  const loadMessages = (userId1: string, userId2: string) => {
    const msgs = messageApi.getConversation(userId1, userId2);
    setMessages(msgs);
  };

  const handleSendMessage = () => {
    if (!currentUser || !selectedUser || !newMessage.trim()) return;

    const message = messageApi.send({
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content: newMessage,
    });

    setMessages([...messages, message]);
    setNewMessage('');

    toast({
      title: 'Message sent',
      description: 'Your message has been delivered',
    });
  };

  if (!currentUser) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Select a conversation or start a new one from a gig page
            </p>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          {selectedUser ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedUser.name}</CardTitle>
                    <p className="text-sm text-muted-foreground capitalize">{selectedUser.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-96 p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No messages yet. Start the conversation!
                      </p>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs xl:max-w-md rounded-lg p-3 ${
                              msg.senderId === currentUser.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Select a conversation to start messaging
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
