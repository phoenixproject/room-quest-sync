import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Room } from '@/types';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import FormModal from '@/components/common/FormModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';

const Rooms: React.FC = () => {
  const { rooms, statuses, addRoom, updateRoom, deleteRoom, getStatusById } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    statusId: '',
    capacity: '',
    description: '',
  });

  const resetForm = () => {
    setFormData({ name: '', statusId: '', capacity: '', description: '' });
    setEditingRoom(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      statusId: room.statusId,
      capacity: room.capacity.toString(),
      description: room.description || '',
    });
    setIsModalOpen(true);
  };

  const openDeleteDialog = (room: Room) => {
    setDeletingRoom(room);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Nome da sala é obrigatório');
      return;
    }

    if (!formData.statusId) {
      toast.error('Status é obrigatório');
      return;
    }

    const capacity = parseInt(formData.capacity);
    if (isNaN(capacity) || capacity < 1) {
      toast.error('Capacidade deve ser um número válido');
      return;
    }

    const roomData = {
      name: formData.name.trim(),
      statusId: formData.statusId,
      capacity,
      description: formData.description.trim() || undefined,
    };

    if (editingRoom) {
      updateRoom({ ...roomData, id: editingRoom.id });
      toast.success('Sala atualizada com sucesso!');
    } else {
      addRoom(roomData);
      toast.success('Sala criada com sucesso!');
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingRoom) {
      deleteRoom(deletingRoom.id);
      toast.success('Sala excluída com sucesso!');
      setIsDeleteOpen(false);
      setDeletingRoom(null);
    }
  };

  const columns = [
    { key: 'id' as keyof Room, header: 'Código' },
    { key: 'name' as keyof Room, header: 'Nome' },
    {
      key: 'statusId' as keyof Room,
      header: 'Status',
      render: (room: Room) => {
        const status = getStatusById(room.statusId);
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            status?.name === 'Ativo' ? 'bg-success/10 text-success' :
            status?.name === 'Inativo' ? 'bg-destructive/10 text-destructive' :
            'bg-warning/10 text-warning'
          }`}>
            {status?.name || '-'}
          </span>
        );
      },
    },
    { key: 'capacity' as keyof Room, header: 'Capacidade' },
    { key: 'description' as keyof Room, header: 'Descrição' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salas de Reunião"
        description="Gerencie as salas disponíveis para agendamento"
        icon={Building2}
        actionLabel="Nova Sala"
        onAction={openCreateModal}
      />

      <DataTable
        data={rooms}
        columns={columns}
        searchKeys={['name', 'description']}
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
        title={editingRoom ? 'Editar Sala' : 'Nova Sala'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Sala *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Sala Executiva"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.statusId}
              onValueChange={(value) => setFormData({ ...formData, statusId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacidade *</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              placeholder="Ex: 10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição opcional da sala"
              rows={3}
            />
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingRoom(null);
        }}
        onConfirm={handleDelete}
        title="Excluir Sala"
        description={`Tem certeza que deseja excluir a sala "${deletingRoom?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default Rooms;
