import React, { useState } from 'react';
import { Shield, Plus, Edit2, Trash2, Mail, Phone, MapPin, Building2, Calendar, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

interface UserBase {
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
  password?: string;
}

interface User extends UserBase {
  id: string;
}

interface UserWithId extends User {}

type UserFormData = UserBase;

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  users: User[];
}

interface FormErrors {
  [key: string]: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  startDate?: string;
  employeeId?: string;
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  }
};

export function UserRoles() {
  const { addUser, deleteUser, updateUser, users } = useStore() as unknown as { addUser: (user: UserFormData) => void, deleteUser: (id: string) => void, updateUser: (id: string, user: UserFormData) => void, users: User[] };
  const [showNewUser, setShowNewUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    const formData: UserFormData = {
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
    };
    setFormData(formData);
    setShowNewUser(true);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.firstName) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName) newErrors.lastName = 'Le nom est requis';
    if (!formData.email) newErrors.email = 'L\'email est requis';
    if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
    if (!formData.position) newErrors.position = 'Le poste est requis';
    if (!formData.employeeId) newErrors.employeeId = 'L\'ID employé est requis';
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const password = generatePassword();
    try {
      const newUser: UserFormData = {
        ...formData,
        password
      };
      await addUser(newUser);
      toast.success('Utilisateur ajouté avec succès');
      setFormData(initialFormData);
      setShowNewUser(false);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de l\'utilisateur');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.id || !validateForm()) return;

    try {
      await updateUser(editingUser.id, formData);
      toast.success('Utilisateur modifié avec succès');
      setEditingUser(null);
      setFormData(initialFormData);
      setShowNewUser(false);
    } catch (error) {
      toast.error('Erreur lors de la modification de l\'utilisateur');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is modified
    if (formErrors[name]) {
      const newErrors = { ...formErrors };
      delete newErrors[name];
      setFormErrors(newErrors);
    }
  };

  const handleCancel = () => {
    setShowNewUser(false);
    setEditingUser(null);
    setFormData(initialFormData);
    setFormErrors({});
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: FormErrors = {};
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
      handleAddUser(event);
    }
  };

  const handleDeleteConfirm = (id: string) => {
    deleteUser(id);
    setShowDeleteConfirm(null);
    toast.success('Utilisateur supprimé avec succès');
  };

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        variants={itemVariants}
        className="flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
          padding: "1.5rem",
          borderRadius: "1rem",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "rgba(0, 0, 0, 0.3) 0px 10px 25px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset"
        }}
      >
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#00D1FF]/20 blur-xl rounded-full" />
            <Shield size={24} className="text-[#00D1FF] relative z-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent" 
              style={{ backgroundImage: "linear-gradient(90deg, #ffffff, #a5f3fc)" }}>
              Rôles & Permissions
            </h2>
            <p className="text-white/60">Gérez les rôles et les permissions des utilisateurs</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewUser(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#00D1FF] to-[#00D1FF]/80 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#00D1FF]/20 focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/50"
          style={{
            boxShadow: "0 0 20px rgba(0, 209, 255, 0.3)"
          }}
        >
          <Plus size={20} className="inline-block mr-2" />
          Ajouter un utilisateur
        </motion.button>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 gap-6"
        variants={containerVariants}
      >
        {mockRoles.map((role) => (
          <motion.div
            key={role.id}
            variants={itemVariants}
            className="rounded-xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              boxShadow: "rgba(0, 0, 0, 0.2) 0px 10px 20px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset"
            }}
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-[#00D1FF]/10 flex items-center justify-center">
                  <Shield size={24} className="text-[#00D1FF]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold bg-clip-text text-transparent mb-1"
                    style={{ backgroundImage: "linear-gradient(90deg, #ffffff, #a5f3fc)" }}>
                    {role.name}
                  </h3>
                  <p className="text-white/60">{role.description}</p>

                  <div className="mt-6 space-y-4">
                    <h4 className="text-lg font-medium text-white/80">Utilisateurs</h4>
                    <div className="space-y-3">
                      {users.filter(user => user.role === role.id).map(user => (
                        <motion.div 
                          key={user.id} 
                          className="bg-white/5 rounded-xl p-4 group hover:bg-white/10 transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-white/60 mt-1">
                                {user.position}
                              </div>
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditUser(user)}
                                className="p-2 hover:bg-[#00D1FF]/10 rounded-lg transition-colors"
                              >
                                <Edit2 size={16} className="text-[#00D1FF]" />
                              </motion.button>
                              <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowDeleteConfirm(user.id)}
                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} className="text-red-400" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {(showNewUser || editingUser) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-xl rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 100, 120, 0.9) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
              }}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent mb-6"
                  style={{ backgroundImage: "linear-gradient(90deg, #ffffff, #a5f3fc)" }}>
                  {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
                </h2>

                <form className="space-y-6" onSubmit={editingUser ? handleUpdateUser : handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white/5 border ${
                          formErrors.firstName ? 'border-red-500' : 'border-white/10'
                        } rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none`}
                        style={{
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)"
                        }}
                        required
                      />
                      {formErrors.firstName && (
                        <p className="mt-2 text-sm text-red-400 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {formErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white/5 border ${
                          formErrors.lastName ? 'border-red-500' : 'border-white/10'
                        } rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none`}
                        style={{
                          backdropFilter: "blur(10px)",
                          WebkitBackdropFilter: "blur(10px)"
                        }}
                        required
                      />
                      {formErrors.lastName && (
                        <p className="mt-2 text-sm text-red-400 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {formErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${
                            formErrors.email ? 'border-red-500' : 'border-white/10'
                          } rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none`}
                          style={{
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)"
                          }}
                          required
                        />
                      </div>
                      {formErrors.email && (
                        <p className="mt-2 text-sm text-red-400 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${
                            formErrors.phone ? 'border-red-500' : 'border-white/10'
                          } rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none`}
                          style={{
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)"
                          }}
                          required
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="mt-2 text-sm text-red-400 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Rôle
                      </label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                        <select
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${
                            formErrors.position ? 'border-red-500' : 'border-white/10'
                          } rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none appearance-none`}
                          style={{
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)"
                          }}
                          required
                        >
                          <option value="">Sélectionner un rôle</option>
                          <option value="manageur">Manageur</option>
                          <option value="operateur">Opérateur</option>
                          <option value="comptable_full">Comptable Tout accès</option>
                          <option value="comptable">Comptable</option>
                        </select>
                      </div>
                      {formErrors.position && (
                        <p className="mt-2 text-sm text-red-400 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {formErrors.position}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Date de début
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${
                            formErrors.startDate ? 'border-red-500' : 'border-white/10'
                          } rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none`}
                          style={{
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)"
                          }}
                          required
                        />
                      </div>
                      {formErrors.startDate && (
                        <p className="mt-2 text-sm text-red-400 flex items-center">
                          <AlertCircle size={16} className="mr-1" />
                          {formErrors.startDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-8">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 text-white/70 hover:text-white transition-colors rounded-xl"
                    >
                      Annuler
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-[#00D1FF] to-[#00D1FF]/80 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#00D1FF]/20 focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/50"
                      style={{
                        boxShadow: "0 0 20px rgba(0, 209, 255, 0.3)"
                      }}
                    >
                      {editingUser ? 'Mettre à jour' : 'Ajouter'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div 
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(0, 10, 40, 0.95) 0%, rgba(0, 100, 120, 0.9) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 10px 20px -5px, rgba(0, 0, 0, 0.2) 0px 5px 10px -5px, rgba(255, 255, 255, 0.1) 0px -1px 3px 0px inset, rgba(0, 200, 200, 0.2) 0px 0px 15px inset"
              }}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Confirmer la suppression</h3>
                <p className="text-white/70 mb-6">
                  Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
                </p>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 text-white/70 hover:text-white transition-colors rounded-xl"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => showDeleteConfirm && handleDeleteConfirm(showDeleteConfirm)}
                    className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-xl transition-colors"
                  >
                    Supprimer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}