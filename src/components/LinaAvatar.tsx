import linaImage from '../assets/LinaGenAI.png';

interface LinaAvatarProps {
  emotion?: 'happy' | 'welcoming' | 'thinking' | 'excited';
  className?: string;
}

export function LinaAvatar({ emotion = 'welcoming', className = '' }: LinaAvatarProps) {
  return (
    <div className={`relative ${className}`}>
      <img 
        src={linaImage} 
        alt="Lina - Agente GenIA" 
        className="w-full h-full object-contain max-w-full max-h-full"
      />
    </div>
  );
}
