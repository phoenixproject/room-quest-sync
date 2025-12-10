import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Booking } from '@/types';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import FormModal from '@/components/common/FormModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Bookings: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const {
    bookings,
    rooms,
    addBooking,
    updateBooking,
    deleteBooking,
    getRoomById,
    getUserById,
    checkBookingConflict,
  } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [deletingBooking, setDeletingBooking] = useState<Booking | null>(null);
  const [conflictError, setConflictError] = useState('');

  const [formData, setFormData] = useState({
    description: '',
    roomId: '',
    startDateTime: '',
    endDateTime: '',
  });

  const activeRooms = rooms.filter((r) => {
    const status = r.statusId;
    return status === '1'; // Active status
  });

  const resetForm = () => {
    setFormData({
      description: '',
      roomId: '',
      startDateTime: '',
      endDateTime: '',
    });
    setEditingBooking(null);
    setConflictError('');
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (booking: Booking) => {
    setEditingBooking(booking);
    setFormData({
      description: booking.description,
      roomId: booking.roomId,
      startDateTime: new Date(booking.startDateTime).toISOString().slice(0, 16),
      endDateTime: new Date(booking.endDateTime).toISOString().slice(0, 16),
    });
    setIsModalOpen(true);
  };

  const openDeleteDialog = (booking: Booking) => {
    setDeletingBooking(booking);
    setIsDeleteOpen(true);
  };

  const calculateDuration = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    return Math.round(hours * 10) / 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError('');

    if (!formData.description.trim()) {
      toast.error('Descrição é obrigatória');
      return;
    }

    if (!formData.roomId) {
      toast.error('Sala é obrigatória');
      return;
    }

    if (!formData.startDateTime || !formData.endDateTime) {
      toast.error('Data e hora são obrigatórias');
      return;
    }

    const startDate = new Date(formData.startDateTime);
    const endDate = new Date(formData.endDateTime);

    if (endDate <= startDate) {
      toast.error('Data/hora final deve ser maior que a inicial');
      return;
    }

    // Check for conflicts
    const hasConflict = checkBookingConflict(
      formData.roomId,
      startDate,
      endDate,
      editingBooking?.id
    );

    if (hasConflict) {
      setConflictError('Conflito detectado! Já existe uma reserva para esta sala no horário selecionado.');
      return;
    }

    const duration = calculateDuration(formData.startDateTime, formData.endDateTime);

    const bookingData = {
      description: formData.description.trim(),
      roomId: formData.roomId,
      userId: user!.id,
      startDateTime: startDate,
      endDateTime: endDate,
      durationHours: duration,
    };

    if (editingBooking) {
      const success = updateBooking({ ...bookingData, id: editingBooking.id });
      if (success) {
        toast.success('Agendamento atualizado com sucesso!');
        setIsModalOpen(false);
        resetForm();
      }
    } else {
      const success = addBooking(bookingData);
      if (success) {
        toast.success('Agendamento criado com sucesso!');
        setIsModalOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = () => {
    if (deletingBooking) {
      deleteBooking(deletingBooking.id);
      toast.success('Agendamento excluído com sucesso!');
      setIsDeleteOpen(false);
      setDeletingBooking(null);
    }
  };

  // Filter bookings based on user role
  const displayedBookings = isAdmin
    ? bookings
    : bookings.filter((b) => b.userId === user?.id);

  const columns = [
    {
      key: 'roomId' as keyof Booking,
      header: 'Sala',
      render: (booking: Booking) => getRoomById(booking.roomId)?.name || '-',
    },
    {
      key: 'userId' as keyof Booking,
      header: 'Usuário',
      render: (booking: Booking) => getUserById(booking.userId)?.name || '-',
    },
    {
      key: 'startDateTime' as keyof Booking,
      header: 'Início',
      render: (booking: Booking) =>
        new Date(booking.startDateTime).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      key: 'endDateTime' as keyof Booking,
      header: 'Fim',
      render: (booking: Booking) =>
        new Date(booking.endDateTime).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      key: 'durationHours' as keyof Booking,
      header: 'Duração',
      render: (booking: Booking) => `${booking.durationHours}h`,
    },
    { key: 'description' as keyof Booking, header: 'Descrição' },
  ];

  const duration = calculateDuration(formData.startDateTime, formData.endDateTime);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agendamentos"
        description="Gerencie suas reservas de salas"
        icon={Calendar}
        actionLabel="Novo Agendamento"
        onAction={openCreateModal}
      />

      <DataTable
        data={displayedBookings}
        columns={columns}
        searchKeys={['description']}
        onEdit={openEditModal}
        onDelete={openDeleteDialog}
      />

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingBooking ? 'Editar Agendamento' : 'Novo Agendamento'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          {conflictError && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border-2 border-destructive rounded-lg text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{conflictError}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Descrição do Evento *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Reunião de planejamento"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Sala *</Label>
            <Select
              value={formData.roomId}
              onValueChange={(value) => {
                setFormData({ ...formData, roomId: value });
                setConflictError('');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a sala" />
              </SelectTrigger>
              <SelectContent>
                {activeRooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} (Cap: {room.capacity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDateTime">Data/Hora Inicial *</Label>
              <Input
                id="startDateTime"
                type="datetime-local"
                value={formData.startDateTime}
                onChange={(e) => {
                  setFormData({ ...formData, startDateTime: e.target.value });
                  setConflictError('');
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDateTime">Data/Hora Final *</Label>
              <Input
                id="endDateTime"
                type="datetime-local"
                value={formData.endDateTime}
                onChange={(e) => {
                  setFormData({ ...formData, endDateTime: e.target.value });
                  setConflictError('');
                }}
              />
            </div>
          </div>

          {duration > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Duração: <span className="font-semibold text-foreground">{duration} horas</span>
              </p>
            </div>
          )}

          <div className="p-3 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Responsável: <span className="font-semibold text-foreground">{user?.name}</span>
            </p>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingBooking(null);
        }}
        onConfirm={handleDelete}
        title="Excluir Agendamento"
        description={`Tem certeza que deseja excluir o agendamento "${deletingBooking?.description}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default Bookings;
