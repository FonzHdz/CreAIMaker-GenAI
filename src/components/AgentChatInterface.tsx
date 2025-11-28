import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { AgentAvatar } from './AgentAvatar';
import { motion, AnimatePresence } from 'motion/react';

export interface ChatMessage {
  id: string;
  from: 'user' | 'agent';
  message: string;
  timestamp: string;
}

interface AgentChatInterfaceProps {
  agentName: string;
  agentType: 'lina' | 'juan' | 'rosa';
  agentColor: string;
  agentGradient: string;
  welcomeMessage: string;
  onSendMessage: (message: string) => Promise<string>;
  chatHistory: ChatMessage[];
  isTyping?: boolean;
}

export function AgentChatInterface({
  agentName,
  agentType,
  agentColor,
  agentGradient,
  welcomeMessage,
  onSendMessage,
  chatHistory,
  isTyping = false
}: AgentChatInterfaceProps) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isSending) return;

    const message = currentMessage.trim();
    setCurrentMessage('');
    setIsSending(true);

    try {
      await onSendMessage(message);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm h-full max-h-full">
      {/* Chat header */}
      <div className={`${agentGradient} px-4 py-3 rounded-t-lg flex-shrink-0`}>
        <h3 className="text-white">Chat con {agentName}</h3>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-gray-50 to-white min-h-0">
        {/* Welcome message - only shown when chat history is empty */}
        {chatHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white border-2 border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[85%]">
              <p className="text-gray-800 text-[14px]">{welcomeMessage}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-2">Justo ahora</p>
          </motion.div>
        )}

        {/* Chat history */}
        <AnimatePresence>
          {chatHistory.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={msg.from === 'user' ? 'flex justify-end' : ''}
            >
              <div>
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                    msg.from === 'user'
                      ? `${agentColor} text-white rounded-tr-none`
                      : 'bg-white border-2 border-gray-200 rounded-tl-none'
                  }`}
                >
                  <p className={`text-[14px] ${msg.from === 'user' ? 'text-white' : 'text-gray-800'}`}>
                    {msg.message}
                  </p>
                </div>
                <p className={`text-xs text-gray-500 mt-1 ${msg.from === 'user' ? 'mr-2 text-right' : 'ml-2'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-white border-2 border-gray-200 rounded-2xl rounded-tl-none p-4 shadow-sm max-w-[85%]">
              <div className="flex gap-1">
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Chat input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-xl flex-shrink-0">
        <div className="flex gap-2">
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje..."
            className="flex-1 min-h-[60px] max-h-[120px] resize-none border-gray-300 focus:border-gray-400 rounded-lg"
            disabled={isSending}
          />
          <Button
            type="submit"
            disabled={!currentMessage.trim() || isSending}
            className={`${agentColor} text-white px-4 rounded-lg hover:opacity-90 transition-opacity self-end`}
          >
            {isSending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Presiona Enter para enviar, Shift + Enter para nueva línea
        </p>
      </form>
    </div>
  );
}
