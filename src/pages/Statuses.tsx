import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { RoomStatus } from '@/types';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import FormModal from '@/components/common/FormModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tag } from 'lucide-react';
import { toast } from 'sonner';

const Statuses: React.FC = () => {
  const { statuses, addStatus, updateStatus, deleteStatus } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<RoomStatus | null>(null);
  const [deletingStatus, setDeletingStatus] = useState<RoomStatus | null>(null);

  const [formData, setFormData] = useState({ name: '' });

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingStatus(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (status: RoomStatus) => {
    setEditingStatus(status);
    setFormData({ name: status.name });
    setIsModalOpen(true);
  };

  const openDeleteDialog = (status: RoomStatus) => {
    setDeletingStatus(status);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Nome do status é obrigatório');
      return;
    }

    if (editingStatus) {
      updateStatus({ ...editingStatus, name: formData.name.trim() });
      toast.success('Status atualizado com sucesso!');
    } else {
      addStatus({ name: formData.name.trim() });
      toast.success('Status criado com sucesso!');
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingStatus) {
      deleteStatus(deletingStatus.id);
      toast.success('Status excluído com sucesso!');
      setIsDeleteOpen(false);
      setDeletingStatus(null);
    }
  };

  const columns = [
    { key: 'id' as keyof RoomStatus, header: 'Código' },
    { key: 'name' as keyof RoomStatus, header: 'Nome do Status' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Status das Salas"
        description="Gerencie os status disponíveis para as salas"
        icon={Tag}
        actionLabel="Novo Status"
        onAction={openCreateModal}
      />

      <DataTable
        data={statuses}
        columns={columns}
        searchKeys={['name']}
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
        title={editingStatus ? 'Editar Status' : 'Novo Status'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Status *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Ativo, Inativo, Manutenção"
            />
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingStatus(null);
        }}
        onConfirm={handleDelete}
        title="Excluir Status"
        description={`Tem certeza que deseja excluir o status "${deletingStatus?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default Statuses;
