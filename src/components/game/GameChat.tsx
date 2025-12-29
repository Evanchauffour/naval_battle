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
    ? 'h-full flex flex-col bg-card/30 backdrop-blur-sm border border-border rounded-lg shadow-xl'
    : 'h-full flex flex-col bg-card/30 backdrop-blur-sm border border-border rounded-none shadow-xl';

  return (
    <Container className={containerClassName}>
      {!hideHeader && (
        <CardHeader className="border-b border-border p-4">
          <CardTitle className="text-base sm:text-lg text-foreground font-semibold">
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
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
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
        <div className="border-t border-border p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 text-sm bg-muted border-border text-foreground placeholder:text-muted-foreground focus:bg-muted/80"
            />
            <Button
              type="submit"
              disabled={!newMessage.trim()}
              className="text-sm px-4 bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
            >
              Envoyer
            </Button>
          </form>
        </div>
      </div>
    </Container>
  );
}

