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
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 bg-gradient-to-br from-gray-50 to-white min-h-0">
        {/* Welcome message - only shown when chat history is empty */}
        {chatHistory.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-start"
          >
            <div className="flex flex-col max-w-[85%]">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-md hover:shadow-lg transition-shadow">
                <p className="text-gray-800 text-[14px] leading-relaxed whitespace-pre-wrap break-words">
                  {welcomeMessage}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1.5 ml-3">Justo ahora</p>
            </div>
          </motion.div>
        )}

        {/* Chat history */}
        <AnimatePresence>
          {chatHistory.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex w-full ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                <div
                  className={`rounded-2xl px-4 py-3 shadow-md hover:shadow-lg transition-all duration-200 ${
                    msg.from === 'user'
                      ? `${agentColor} text-white rounded-tr-sm`
                      : 'bg-white border border-gray-200 rounded-tl-sm'
                  }`}
                >
                  <p 
                    className={`text-[14px] leading-relaxed whitespace-pre-wrap break-words ${
                      msg.from === 'user' 
                        ? 'text-white' 
                        : 'text-gray-800'
                    }`}
                  >
                    {msg.message}
                  </p>
                </div>
                <p 
                  className={`text-xs text-gray-500 mt-1.5 ${
                    msg.from === 'user' 
                      ? 'mr-3' 
                      : 'ml-3'
                  }`}
                >
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
            transition={{ duration: 0.3 }}
            className="flex justify-start"
          >
            <div className="flex flex-col max-w-[85%]">
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 shadow-md">
                <div className="flex gap-1.5 items-center">
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
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
