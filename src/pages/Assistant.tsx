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
  'Quais materiais usar para placas de sinalização externa?',
  'Dicas para impressão em adesivo perfurado',
  'Como organizar a produção para entregas urgentes?',
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
      <div className="flex flex-col h-[calc(100vh-2rem)] p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-accent" />
            Assistente IA
          </h1>
          <p className="text-muted-foreground mt-1">
            Seu assistente inteligente para produção gráfica
          </p>
        </motion.div>

        {/* Messages Area */}
        <Card className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                  <Bot className="h-10 w-10 text-accent" />
                </div>
                <h2 className="text-xl font-display font-semibold mb-2">
                  Olá! Sou o assistente da Centurial
                </h2>
                <p className="text-muted-foreground max-w-md mb-8">
                  Posso ajudar com dúvidas sobre produção gráfica, orçamentos, 
                  materiais e processos de fabricação.
                </p>
                
                {/* Suggestions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                  {SUGGESTIONS.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => sendMessage(suggestion)}
                      className="flex items-start gap-3 p-4 text-left rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-accent/30 transition-all"
                    >
                      <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm">{suggestion}</span>
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
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-accent" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p>{message.content}</p>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-primary" />
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
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-accent" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua pergunta..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
