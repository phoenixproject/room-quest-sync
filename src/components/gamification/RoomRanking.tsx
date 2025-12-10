import React from 'react';
import { Trophy, Medal } from 'lucide-react';

interface RoomRankingProps {
  rooms: { roomName: string; count: number }[];
}

const RoomRanking: React.FC<RoomRankingProps> = ({ rooms }) => {
  const sortedRooms = [...rooms].sort((a, b) => b.count - a.count).slice(0, 5);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-warning" />;
    if (index === 1) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (index === 2) return <Medal className="w-5 h-5 text-warning/60" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{index + 1}</span>;
  };

  if (sortedRooms.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum dado de utilização disponível
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedRooms.map((room, index) => (
        <div
          key={room.roomName}
          className="flex items-center gap-4 p-4 bg-card border-2 border-border rounded-lg animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex-shrink-0">{getRankIcon(index)}</div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{room.roomName}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">{room.count}</span>
            <span className="text-sm text-muted-foreground">reservas</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomRanking;
