import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

const messages = [
  'Continue assim! Cada reunião conta.',
  'Organização é o segredo do sucesso!',
  'Suas reservas ajudam a equipe a se organizar.',
  'Ótimo trabalho mantendo os horários em dia!',
  'Planejamento é a chave para a produtividade.',
  'Você está fazendo a diferença!',
];

const MotivationalMessage: React.FC = () => {
  const message = useMemo(() => {
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  return (
    <div className="flex items-center gap-3 p-4 bg-secondary/10 border-2 border-secondary rounded-lg animate-fade-in">
      <div className="p-2 bg-secondary rounded-full">
        <Sparkles className="w-5 h-5 text-secondary-foreground" />
      </div>
      <p className="text-foreground font-medium">{message}</p>
    </div>
  );
};

export default MotivationalMessage;
