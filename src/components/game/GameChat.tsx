'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Message } from './Game';
import { Socket } from 'socket.io-client';

interface GameChatProps {
  messages: Message[];
  currentUserId: string;
  socket: Socket;
  gameId: string;
  hideHeader?: boolean;
}

export default function GameChat({
  messages,
  currentUserId,
  socket,
  gameId,
  hideHeader = false,
}: GameChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim()) {
      socket.emit('send-message', {
        gameId,
        message: newMessage.trim(),
      });
      setNewMessage('');
    }
  };

  const Container = hideHeader ? 'div' : Card;
  const containerClassName = hideHeader
    ? 'h-full flex flex-col bg-[#1A1A1A] border border-white/20 rounded-lg'
    : 'h-[300px] sm:h-full lg:h-full flex flex-col bg-[#1A1A1A] border border-white/20 rounded-lg';

  return (
    <Container className={containerClassName}>
      {!hideHeader && (
        <CardHeader className="border-b border-white/20 p-4 bg-[#1A1A1A]">
          <CardTitle className="text-base sm:text-lg text-foreground">
            Chat de la partie
          </CardTitle>
        </CardHeader>
      )}
      <div className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Aucun message pour le moment
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${message.timestamp}-${index}`}
                className={`flex flex-col ${
                  message.userId === currentUserId ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 ${
                    message.userId === currentUserId
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-foreground'
                  }`}
                >
                  <div className="text-xs font-semibold mb-1 opacity-90">
                    {message.username}
                  </div>
                  <div className="text-sm">{message.message}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1 px-1">
                  {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-white/20 p-4 bg-[#1A1A1A]">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 text-sm bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              className="text-sm px-4 bg-primary hover:bg-primary/90 text-white"
            >
              Envoyer
            </Button>
          </form>
        </div>
      </div>
    </Container>
  );
}

