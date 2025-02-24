import React, { useState } from 'react';
import { Shield, Plus, Edit2, Trash2, Mail, Phone, MapPin, Building2, Calendar, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  users: User[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  startDate: string;
  employeeId: string;
  emergencyContact: string;
  role: string;
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
    permissions: ['all'],
    users: [
      {
        id: '1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com',
        phone: '06 12 34 56 78',
        position: 'Directeur',
        department: 'Direction',
        location: 'Site A',
        startDate: '2024-01-15',
        employeeId: 'EMP001',
        emergencyContact: 'Marie Dupont - 06 98 76 54 32',
        role: 'Administrateur'
      }
    ]
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Gestion des équipes et des tâches',
    permissions: ['read:all', 'write:tasks', 'manage:users'],
    users: [
      {
        id: '2',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@example.com',
        phone: '06 23 45 67 89',
        position: 'Chef d\'équipe',
        department: 'Production',
        location: 'Site B',
        startDate: '2024-02-01',
        employeeId: 'EMP002',
        emergencyContact: 'Pierre Martin - 06 12 34 56 78',
        role: 'Manager'
      }
    ]
  },
  {
    id: '3',
    name: 'Opérateur',
    description: 'Exécution des tâches quotidiennes',
    permissions: ['read:tasks', 'write:tasks'],
    users: []
  },
  {
    id: '4',
    name: 'Comptable',
    description: 'Gestion de la comptabilité et des finances',
    permissions: [
      'read:sales',
      'write:sales',
      'read:purchases',
      'write:purchases',
      'read:inventory',
      'read:reports'
    ],
    users: []
  }
];

function generatePassword() {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export function UserRoles() {
  const [showNewUser, setShowNewUser] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleAddUser = async (data: Partial<User>) => {
    const password = generatePassword();
    // TODO: Créer l'utilisateur et envoyer l'email avec le mot de passe
    console.log('Nouveau utilisateur:', { ...data, password });
    setShowNewUser(false);
  };

  const handleDeleteUser = async (userId: string) => {
    // TODO: Implémenter la suppression d'utilisateur
    console.log('Suppression de l\'utilisateur:', userId);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Rôles & Permissions</h2>
        <button
          onClick={() => setShowNewUser(true)}
          className="flex items-center px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Ajouter un utilisateur
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockRoles.map((role) => (
          <div
            key={role.id}
            className="bg-white/5 border border-white/10 rounded-lg p-6 group relative overflow-hidden hover:border-brand-primary/20 transition-all duration-300"
          >
            {/* Effet de surlignage glacé */}
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-primary/0 via-brand-primary/20 to-brand-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                  <Shield size={20} className="text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{role.name}</h3>
                  <p className="text-sm text-white/60 mt-1">{role.description}</p>

                  {/* Liste des utilisateurs du rôle */}
                  {role.users.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <h4 className="text-sm font-medium text-white">Utilisateurs</h4>
                      {role.users.map(user => (
                        <div key={user.id} className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-white/60 mt-1">
                                {user.position}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => setShowNewUser(true)}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <Edit2 size={16} className="text-white/60" />
                              </button>
                              <button 
                                onClick={() => setShowDeleteConfirm(user.id)}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} className="text-white/60" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNewUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg w-full max-w-xl">
            <h2 className="text-xl font-bold text-white mb-6">Nouvel utilisateur</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Poste
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Département
                  </label>
                  <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                    <option value="production">Production</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="quality">Contrôle Qualité</option>
                    <option value="logistics">Logistique</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Site
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Rôle
                </label>
                <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                  {mockRoles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Contact d'urgence
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="Nom et numéro de téléphone"
                />
              </div>

              <div className="p-4 bg-brand-primary/10 rounded-lg">
                <div className="flex items-center text-brand-primary mb-2">
                  <Mail size={20} className="mr-2" />
                  <span className="font-medium">Email de bienvenue</span>
                </div>
                <p className="text-sm text-white/70">
                  Un email sera automatiquement envoyé à l'utilisateur avec ses identifiants de connexion.
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowNewUser(false)}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                >
                  Ajouter l'utilisateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg w-full max-w-md">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={24} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Confirmer la suppression</h3>
                <p className="mt-2 text-sm text-white/70">
                  Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
                </p>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDeleteUser(showDeleteConfirm)}
                    className="px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}