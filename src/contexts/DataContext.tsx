import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Room, RoomStatus, Booking, User } from '@/types';

interface DataContextType {
  rooms: Room[];
  statuses: RoomStatus[];
  bookings: Booking[];
  users: User[];
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  addStatus: (status: Omit<RoomStatus, 'id'>) => void;
  updateStatus: (status: RoomStatus) => void;
  deleteStatus: (id: string) => void;
  addBooking: (booking: Omit<Booking, 'id'>) => boolean;
  updateBooking: (booking: Booking) => boolean;
  deleteBooking: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  checkBookingConflict: (roomId: string, startDateTime: Date, endDateTime: Date, excludeBookingId?: string) => boolean;
  getRoomById: (id: string) => Room | undefined;
  getStatusById: (id: string) => RoomStatus | undefined;
  getUserById: (id: string) => User | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Default data
const defaultStatuses: RoomStatus[] = [
  { id: '1', name: 'Ativo' },
  { id: '2', name: 'Inativo' },
  { id: '3', name: 'Manutenção' },
];

const defaultRooms: Room[] = [
  { id: '1', name: 'Sala Executiva', statusId: '1', capacity: 12, description: 'Sala principal para reuniões executivas' },
  { id: '2', name: 'Sala Criativa', statusId: '1', capacity: 8, description: 'Espaço para brainstorming e workshops' },
  { id: '3', name: 'Sala de Treinamento', statusId: '1', capacity: 20, description: 'Equipada com projetor e quadro interativo' },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [statuses, setStatuses] = useState<RoomStatus[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load data from localStorage or use defaults
    const storedRooms = localStorage.getItem('rooms');
    const storedStatuses = localStorage.getItem('statuses');
    const storedBookings = localStorage.getItem('bookings');
    const storedUsers = localStorage.getItem('users');

    setStatuses(storedStatuses ? JSON.parse(storedStatuses) : defaultStatuses);
    setRooms(storedRooms ? JSON.parse(storedRooms) : defaultRooms);
    setBookings(storedBookings ? JSON.parse(storedBookings) : []);
    setUsers(storedUsers ? JSON.parse(storedUsers) : []);

    // Initialize defaults if empty
    if (!storedStatuses) {
      localStorage.setItem('statuses', JSON.stringify(defaultStatuses));
    }
    if (!storedRooms) {
      localStorage.setItem('rooms', JSON.stringify(defaultRooms));
    }
  }, []);

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  // Room operations
  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom = { ...room, id: generateId() };
    const updated = [...rooms, newRoom];
    setRooms(updated);
    localStorage.setItem('rooms', JSON.stringify(updated));
  };

  const updateRoom = (room: Room) => {
    const updated = rooms.map((r) => (r.id === room.id ? room : r));
    setRooms(updated);
    localStorage.setItem('rooms', JSON.stringify(updated));
  };

  const deleteRoom = (id: string) => {
    const updated = rooms.filter((r) => r.id !== id);
    setRooms(updated);
    localStorage.setItem('rooms', JSON.stringify(updated));
  };

  // Status operations
  const addStatus = (status: Omit<RoomStatus, 'id'>) => {
    const newStatus = { ...status, id: generateId() };
    const updated = [...statuses, newStatus];
    setStatuses(updated);
    localStorage.setItem('statuses', JSON.stringify(updated));
  };

  const updateStatus = (status: RoomStatus) => {
    const updated = statuses.map((s) => (s.id === status.id ? status : s));
    setStatuses(updated);
    localStorage.setItem('statuses', JSON.stringify(updated));
  };

  const deleteStatus = (id: string) => {
    const updated = statuses.filter((s) => s.id !== id);
    setStatuses(updated);
    localStorage.setItem('statuses', JSON.stringify(updated));
  };

  // Booking operations
  const checkBookingConflict = (
    roomId: string,
    startDateTime: Date,
    endDateTime: Date,
    excludeBookingId?: string
  ): boolean => {
    const start = new Date(startDateTime).getTime();
    const end = new Date(endDateTime).getTime();

    return bookings.some((booking) => {
      if (booking.roomId !== roomId) return false;
      if (excludeBookingId && booking.id === excludeBookingId) return false;

      const bookingStart = new Date(booking.startDateTime).getTime();
      const bookingEnd = new Date(booking.endDateTime).getTime();

      return (start < bookingEnd && end > bookingStart);
    });
  };

  const addBooking = (booking: Omit<Booking, 'id'>): boolean => {
    if (checkBookingConflict(booking.roomId, booking.startDateTime, booking.endDateTime)) {
      return false;
    }
    const newBooking = { ...booking, id: generateId() };
    const updated = [...bookings, newBooking];
    setBookings(updated);
    localStorage.setItem('bookings', JSON.stringify(updated));
    return true;
  };

  const updateBooking = (booking: Booking): boolean => {
    if (checkBookingConflict(booking.roomId, booking.startDateTime, booking.endDateTime, booking.id)) {
      return false;
    }
    const updated = bookings.map((b) => (b.id === booking.id ? booking : b));
    setBookings(updated);
    localStorage.setItem('bookings', JSON.stringify(updated));
    return true;
  };

  const deleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem('bookings', JSON.stringify(updated));
  };

  // User operations
  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: generateId() };
    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  };

  const updateUser = (user: User) => {
    const updated = users.map((u) => (u.id === user.id ? user : u));
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  };

  const deleteUser = (id: string) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  };

  // Getters
  const getRoomById = (id: string) => rooms.find((r) => r.id === id);
  const getStatusById = (id: string) => statuses.find((s) => s.id === id);
  const getUserById = (id: string) => users.find((u) => u.id === id);

  return (
    <DataContext.Provider
      value={{
        rooms,
        statuses,
        bookings,
        users,
        addRoom,
        updateRoom,
        deleteRoom,
        addStatus,
        updateStatus,
        deleteStatus,
        addBooking,
        updateBooking,
        deleteBooking,
        addUser,
        updateUser,
        deleteUser,
        checkBookingConflict,
        getRoomById,
        getStatusById,
        getUserById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
