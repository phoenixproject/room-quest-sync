import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { User } from '@/types';
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
import { Users } from 'lucide-react';
import { toast } from 'sonner';

const UsersManagement: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    login: '',
    password: '',
    type: '' as 'admin' | 'user' | '',
  });

  const resetForm = () => {
    setFormData({ name: '', login: '', password: '', type: '' });
    setEditingUser(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      login: user.login,
      password: '',
      type: user.type,
    });
    setIsModalOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setDeletingUser(user);
    setIsDeleteOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (!formData.login.trim()) {
      toast.error('Login é obrigatório');
      return;
    }

    if (!editingUser && !formData.password.trim()) {
      toast.error('Senha é obrigatória');
      return;
    }

    if (!formData.type) {
      toast.error('Tipo é obrigatório');
      return;
    }

    if (editingUser) {
      updateUser({
        ...editingUser,
        name: formData.name.trim(),
        login: formData.login.trim(),
        password: formData.password.trim() || editingUser.password,
        type: formData.type,
      });
      toast.success('Usuário atualizado com sucesso!');
    } else {
      addUser({
        name: formData.name.trim(),
        login: formData.login.trim(),
        password: formData.password.trim(),
        type: formData.type,
        createdAt: new Date(),
      });
      toast.success('Usuário criado com sucesso!');
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deletingUser) {
      deleteUser(deletingUser.id);
      toast.success('Usuário excluído com sucesso!');
      setIsDeleteOpen(false);
      setDeletingUser(null);
    }
  };

  const columns = [
    { key: 'id' as keyof User, header: 'Código' },
    { key: 'name' as keyof User, header: 'Nome' },
    { key: 'login' as keyof User, header: 'Login' },
    {
      key: 'type' as keyof User,
      header: 'Tipo',
      render: (user: User) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          user.type === 'admin'
            ? 'bg-primary/10 text-primary'
            : 'bg-secondary/10 text-secondary'
        }`}>
          {user.type === 'admin' ? 'Administrador' : 'Usuário'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuários"
        description="Gerencie os usuários do sistema"
        icon={Users}
        actionLabel="Novo Usuário"
        onAction={openCreateModal}
      />

      <DataTable
        data={users}
        columns={columns}
        searchKeys={['name', 'login']}
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
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nome completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login">Login *</Label>
            <Input
              id="login"
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              placeholder="Nome de usuário"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Senha {editingUser ? '(deixe em branco para manter)' : '*'}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Senha"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'admin' | 'user') =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Usuário</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingUser(null);
        }}
        onConfirm={handleDelete}
        title="Excluir Usuário"
        description={`Tem certeza que deseja excluir o usuário "${deletingUser?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default UsersManagement;
