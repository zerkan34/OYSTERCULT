import React, { useState } from 'react';
import { Shield, Plus, Edit2, Trash2, Mail, Phone, MapPin, Building2, Calendar, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

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

interface UserFormData {
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

const initialFormData: UserFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  department: 'production',
  location: '',
  startDate: '',
  employeeId: '',
  emergencyContact: '',
  role: '1'
};

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
    permissions: ['all'],
    users: []
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Gestion des équipes et des tâches',
    permissions: ['read:all', 'write:tasks', 'manage:users'],
    users: []
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
  const { addUser, deleteUser, updateUser, users } = useStore();
  const [showNewUser, setShowNewUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      position: user.position,
      department: user.department,
      location: user.location,
      startDate: user.startDate,
      employeeId: user.employeeId,
      emergencyContact: user.emergencyContact,
      role: user.role
    });
    setShowNewUser(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (validateForm()) {
      try {
        await updateUser(editingUser.id, formData);
        toast.success('Utilisateur modifié avec succès');
        setEditingUser(null);
        setFormData(initialFormData);
      } catch (error) {
        toast.error('Erreur lors de la modification de l\'utilisateur');
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleCancel = () => {
    setShowNewUser(false);
    setEditingUser(null);
    setFormData(initialFormData);
    setFormErrors({});
  };

  const handleAddUser = async (data: Partial<User>) => {
    const password = generatePassword();
    try {
      addUser({
        ...data,
        employeeId: `EMP${Date.now().toString().slice(-4)}`
      });
      toast.success('Utilisateur ajouté avec succès');
      setShowNewUser(false);
      setFormData(initialFormData);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'utilisateur');
    }
  };

  const handleDeleteConfirm = (id: string) => {
    deleteUser(id);
    setShowDeleteConfirm(null);
    toast.success('Utilisateur supprimé avec succès');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: UserFormData = {};
    if (!formData.firstName) {
      errors.firstName = 'Le prénom est obligatoire';
    }
    if (!formData.lastName) {
      errors.lastName = 'Le nom est obligatoire';
    }
    if (!formData.email) {
      errors.email = 'L\'email est obligatoire';
    }
    if (!formData.phone) {
      errors.phone = 'Le téléphone est obligatoire';
    }
    if (!formData.position) {
      errors.position = 'Le rôle est obligatoire';
    }
    if (!formData.startDate) {
      errors.startDate = 'La date de début est obligatoire';
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      handleAddUser(formData);
    }
  };

  const validateForm = () => {
    const errors: UserFormData = {};
    if (!formData.firstName) {
      errors.firstName = 'Le prénom est obligatoire';
    }
    if (!formData.lastName) {
      errors.lastName = 'Le nom est obligatoire';
    }
    if (!formData.email) {
      errors.email = 'L\'email est obligatoire';
    }
    if (!formData.phone) {
      errors.phone = 'Le téléphone est obligatoire';
    }
    if (!formData.position) {
      errors.position = 'Le rôle est obligatoire';
    }
    if (!formData.startDate) {
      errors.startDate = 'La date de début est obligatoire';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-primary/0 via-brand-primary/20 to-brand-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                  <Shield size={20} className="text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{role.name}</h3>
                  <p className="text-sm text-white/60 mt-1">{role.description}</p>

                  <div className="mt-4 space-y-3">
                    <h4 className="text-sm font-medium text-white">Utilisateurs</h4>
                    {users.filter(user => user.role === role.id).map(user => (
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
                              onClick={() => handleEditUser(user)}
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(showNewUser || editingUser) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-brand-dark/95 to-brand-purple/95 backdrop-blur-md p-6 rounded-lg w-full max-w-xl">
            <h2 className="text-xl font-bold text-white mb-6">{editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</h2>
            <form className="space-y-6" onSubmit={editingUser ? handleUpdateUser : handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-white/5 border ${
                      formErrors.firstName ? 'border-red-500' : 'border-white/10'
                    } rounded-lg text-white`}
                    required
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-white/5 border ${
                      formErrors.lastName ? 'border-red-500' : 'border-white/10'
                    } rounded-lg text-white`}
                    required
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-white/5 border ${
                      formErrors.email ? 'border-red-500' : 'border-white/10'
                    } rounded-lg text-white`}
                    required
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-white/5 border ${
                      formErrors.phone ? 'border-red-500' : 'border-white/10'
                    } rounded-lg text-white`}
                    required
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Rôle
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-white/5 border ${
                      formErrors.position ? 'border-red-500' : 'border-white/10'
                    } rounded-lg text-white`}
                    required
                  >
                    <option value="">Sélectionner un rôle</option>
                    <option value="manageur">Manageur</option>
                    <option value="operateur">Opérateur</option>
                    <option value="comptable_full">Comptable Tout accès</option>
                    <option value="comptable">Comptable</option>
                  </select>
                  {formErrors.position && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.position}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Département
                  </label>
                  <select 
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
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
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 bg-white/5 border ${
                      formErrors.startDate ? 'border-red-500' : 'border-white/10'
                    } rounded-lg text-white`}
                    required
                  />
                  {formErrors.startDate && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.startDate}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Contact d'urgence
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
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
                  onClick={handleCancel}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary rounded-lg text-white hover:bg-brand-primary/90 transition-colors"
                >
                  {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter l\'utilisateur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-2 text-red-500 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-medium">Confirmer la suppression</h3>
            </div>
            <p className="text-white/60 mb-6">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-white/60 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}