import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Settings as SettingsIcon, Database, Shield, Bell } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Configurações do sistema"
        icon={SettingsIcon}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-card border-2 border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Dados</h3>
              <p className="text-sm text-muted-foreground">Backup e restauração</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Os dados são armazenados localmente no navegador. Para persistência em produção,
            conecte ao Lovable Cloud.
          </p>
        </div>

        <div className="bg-card border-2 border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Segurança</h3>
              <p className="text-sm text-muted-foreground">Autenticação e permissões</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Sistema de perfis com controle de acesso. Administradores têm acesso total.
          </p>
        </div>

        <div className="bg-card border-2 border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <Bell className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Notificações</h3>
              <p className="text-sm text-muted-foreground">Alertas e lembretes</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Notificações visuais para conflitos de agendamento e ações importantes.
          </p>
        </div>
      </div>

      <div className="bg-card border-2 border-border rounded-xl p-6 shadow-card">
        <h3 className="font-semibold text-foreground mb-4">Sobre o Sistema</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Versão:</strong> 1.0.0</p>
          <p><strong>Sistema:</strong> MeetRoom - Agendamento de Salas</p>
          <p><strong>Tecnologia:</strong> React + TypeScript + Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
