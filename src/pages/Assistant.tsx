import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Send, Loader2, Bot, User, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Como calcular o preço de uma fachada luminosa?',
  'Quais materiais usar para sinalização externa?',
  'Dicas para impressão em adesivo perfurado',
  'Organizar a produção para entregas urgentes',
];

export default function AssistantPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { messages: [...messages, userMessage] }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content || 'Desculpe, não consegui processar sua mensagem.'
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('AI error:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível conectar ao assistente. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen p-3 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-accent shrink-0" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground truncate">
              Assistente IA
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            Seu assistente inteligente para produção gráfica
          </p>
        </motion.div>

        {/* Messages Area */}
        <Card className="flex-1 overflow-hidden flex flex-col shadow-soft border-border/50">
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center px-4"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent/10 flex items-center justify-center mb-4 sm:mb-6">
                  <Bot className="h-8 w-8 sm:h-10 sm:w-10 text-accent" />
                </div>
                <h2 className="text-lg sm:text-xl font-display font-semibold mb-2">
                  Olá! Sou o assistente da Centurial
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-6 sm:mb-8">
                  Posso ajudar com dúvidas sobre produção gráfica, orçamentos,
                  materiais e processos de fabricação.
                </p>

                {/* Suggestions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-2xl">
                  {SUGGESTIONS.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => sendMessage(suggestion)}
                      className="flex items-center sm:items-start gap-3 p-3 sm:p-4 text-left rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-accent/30 transition-all active:scale-[0.98]"
                    >
                      <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-accent shrink-0" />
                      <span className="text-[11px] sm:text-sm line-clamp-2">{suggestion}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm ${message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-none'
                          : 'bg-muted rounded-tl-none'
                        }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="leading-relaxed">{message.content}</p>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 sm:gap-3"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" />
                </div>
                <div className="bg-muted rounded-2xl px-3 sm:px-4 py-2 flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-1" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Pensando...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 border-t border-border bg-card/50">
            <div className="flex gap-2 sm:gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte ao assistente..."
                disabled={isLoading}
                className="flex-1 h-10 sm:h-12 text-sm sm:text-base"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="h-10 sm:h-12 w-10 sm:w-12 bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 shadow-glow"
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
