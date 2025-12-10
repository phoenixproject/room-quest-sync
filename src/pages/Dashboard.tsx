import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Achievement, UserStats, AdminStats } from '@/types';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/gamification/StatCard';
import AchievementBadge from '@/components/gamification/AchievementBadge';
import MotivationalMessage from '@/components/gamification/MotivationalMessage';
import RoomRanking from '@/components/gamification/RoomRanking';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Building2,
  Users,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { bookings, rooms, users, getRoomById } = useData();

  // Calculate user stats
  const userStats = useMemo<UserStats>(() => {
    const userBookings = bookings.filter((b) => b.userId === user?.id);
    const totalHours = userBookings.reduce((sum, b) => sum + b.durationHours, 0);
    const sortedBookings = [...userBookings].sort(
      (a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
    );

    const roomCounts: Record<string, number> = {};
    userBookings.forEach((b) => {
      roomCounts[b.roomId] = (roomCounts[b.roomId] || 0) + 1;
    });
    const favoriteRoomId = Object.entries(roomCounts).sort(([, a], [, b]) => b - a)[0]?.[0];
    const favoriteRoom = favoriteRoomId ? getRoomById(favoriteRoomId)?.name : undefined;

    return {
      totalBookings: userBookings.length,
      totalHours: Math.round(totalHours * 10) / 10,
      firstBookingDate: sortedBookings[sortedBookings.length - 1]
        ? new Date(sortedBookings[sortedBookings.length - 1].startDateTime)
        : undefined,
      lastBookingDate: sortedBookings[0]
        ? new Date(sortedBookings[0].startDateTime)
        : undefined,
      longestMeetingHours: Math.max(...userBookings.map((b) => b.durationHours), 0),
      favoriteRoom,
    };
  }, [bookings, user?.id, getRoomById]);

  // Calculate admin stats
  const adminStats = useMemo<AdminStats>(() => {
    const roomCounts: Record<string, number> = {};
    bookings.forEach((b) => {
      const room = getRoomById(b.roomId);
      if (room) {
        roomCounts[room.name] = (roomCounts[room.name] || 0) + 1;
      }
    });

    const mostUsedRooms = Object.entries(roomCounts)
      .map(([roomName, count]) => ({ roomName, count }))
      .sort((a, b) => b.count - a.count);

    const now = new Date();
    const completedEvents = bookings.filter(
      (b) => new Date(b.endDateTime) < now
    ).length;

    const totalPossibleHours = rooms.length * 8 * 22; // 8 hours/day, 22 business days
    const totalBookedHours = bookings.reduce((sum, b) => sum + b.durationHours, 0);
    const utilizationRate = totalPossibleHours > 0
      ? Math.round((totalBookedHours / totalPossibleHours) * 100)
      : 0;

    return {
      totalRooms: rooms.length,
      totalUsers: users.length,
      totalBookings: bookings.length,
      utilizationRate,
      completedEvents,
      mostUsedRooms,
    };
  }, [bookings, rooms, users, getRoomById]);

  // User achievements
  const userAchievements = useMemo<Achievement[]>(() => [
    {
      id: '1',
      title: 'Primeiro Passo',
      description: 'Primeiro agendamento realizado',
      icon: 'star',
      unlocked: userStats.totalBookings >= 1,
    },
    {
      id: '2',
      title: 'Organizador',
      description: '5 agendamentos realizados',
      icon: 'calendar',
      unlocked: userStats.totalBookings >= 5,
    },
    {
      id: '3',
      title: 'Maratonista',
      description: 'Reunião de 2+ horas',
      icon: 'clock',
      unlocked: userStats.longestMeetingHours >= 2,
    },
    {
      id: '4',
      title: 'Expert',
      description: '10+ horas em reuniões',
      icon: 'trophy',
      unlocked: userStats.totalHours >= 10,
    },
  ], [userStats]);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Olá, ${user?.name}!`}
        description={isAdmin ? 'Painel Administrativo' : 'Seu painel de conquistas'}
        icon={LayoutDashboard}
      />

      {/* Motivational Message */}
      <MotivationalMessage />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin ? (
          <>
            <StatCard
              title="Total de Salas"
              value={adminStats.totalRooms}
              icon={Building2}
              variant="primary"
            />
            <StatCard
              title="Usuários"
              value={adminStats.totalUsers}
              icon={Users}
              variant="secondary"
            />
            <StatCard
              title="Taxa de Utilização"
              value={`${adminStats.utilizationRate}%`}
              icon={TrendingUp}
              variant="success"
            />
            <StatCard
              title="Eventos Finalizados"
              value={adminStats.completedEvents}
              icon={CheckCircle}
            />
          </>
        ) : (
          <>
            <StatCard
              title="Seus Agendamentos"
              value={userStats.totalBookings}
              icon={Calendar}
              variant="primary"
            />
            <StatCard
              title="Horas em Reuniões"
              value={`${userStats.totalHours}h`}
              icon={Clock}
              variant="secondary"
            />
            <StatCard
              title="Reunião Mais Longa"
              value={`${userStats.longestMeetingHours}h`}
              icon={TrendingUp}
            />
            <StatCard
              title="Sala Favorita"
              value={userStats.favoriteRoom || '-'}
              icon={Building2}
            />
          </>
        )}
      </div>

      {/* Admin: Room Ranking */}
      {isAdmin && (
        <div className="bg-card border-2 border-border rounded-xl p-6 shadow-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Ranking de Salas Mais Utilizadas
          </h2>
          <RoomRanking rooms={adminStats.mostUsedRooms} />
        </div>
      )}

      {/* User: Achievements */}
      {!isAdmin && (
        <div className="bg-card border-2 border-border rounded-xl p-6 shadow-card">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Suas Conquistas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {userAchievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-card border-2 border-border rounded-xl p-6 shadow-card">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Atividade Recente
        </h2>
        {bookings.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum agendamento realizado ainda
          </p>
        ) : (
          <div className="space-y-3">
            {bookings
              .filter((b) => (isAdmin ? true : b.userId === user?.id))
              .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime())
              .slice(0, 5)
              .map((booking) => {
                const room = getRoomById(booking.roomId);
                return (
                  <div
                    key={booking.id}
                    className="flex items-center gap-4 p-4 bg-muted rounded-lg"
                  >
                    <div className="p-2 bg-secondary rounded-lg">
                      <Calendar className="w-4 h-4 text-secondary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {booking.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {room?.name} • {booking.durationHours}h
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.startDateTime).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
