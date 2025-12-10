export interface User {
  id: string;
  name: string;
  login: string;
  password: string;
  type: 'admin' | 'user';
  createdAt: Date;
}

export interface RoomStatus {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
  statusId: string;
  capacity: number;
  description?: string;
}

export interface Booking {
  id: string;
  description: string;
  roomId: string;
  userId: string;
  startDateTime: Date;
  endDateTime: Date;
  durationHours: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface UserStats {
  totalBookings: number;
  totalHours: number;
  firstBookingDate?: Date;
  lastBookingDate?: Date;
  longestMeetingHours: number;
  favoriteRoom?: string;
}

export interface AdminStats {
  totalRooms: number;
  totalUsers: number;
  totalBookings: number;
  utilizationRate: number;
  completedEvents: number;
  mostUsedRooms: { roomName: string; count: number }[];
}

export type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};
