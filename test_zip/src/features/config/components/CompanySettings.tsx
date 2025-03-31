import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, Upload, FileText, Image, Users, FileSpreadsheet, Settings2, Euro } from 'lucide-react';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

type SettingsTab = 'company' | 'employees' | 'documents';

export function CompanySettings() {
  const { companyInfo, setCompanyInfo } = useStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('company');
  const [formData, setFormData] = useState({
    name: companyInfo?.name || '',
    siret: companyInfo?.siret || '',
    logo: companyInfo?.logo || '',
    description: companyInfo?.description || '',
    email: companyInfo?.email || '',
    phone: companyInfo?.phone || '',
    address: companyInfo?.address || '',
    website: companyInfo?.website || ''
  });

  useEffect(() => {
    if (companyInfo) {
      setFormData({
        name: companyInfo.name,
        siret: companyInfo.siret,
        logo: companyInfo.logo || '',
        description: companyInfo.description || '',
        email: companyInfo.email,
        phone: companyInfo.phone,
        address: companyInfo.address,
        website: companyInfo.website || ''
      });
    }
  }, [companyInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyInfo(formData);
    toast.success('Informations de l\'entreprise enregistrées avec succès');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 border-b border-white/10 mb-6">
        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 ${
            activeTab === 'company'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          aria-current={activeTab === 'company' ? 'page' : undefined}
        >
          <Building2 size={16} />
          Entreprise
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 ${
            activeTab === 'employees'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          aria-current={activeTab === 'employees' ? 'page' : undefined}
        >
          <Users size={16} />
          Employés
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 ${
            activeTab === 'documents'
              ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          aria-current={activeTab === 'documents' ? 'page' : undefined}
        >
          <FileSpreadsheet size={16} />
          Documents
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-filter backdrop-blur-[10px] border border-white/10 hover:border-cyan-400/30 transition-all duration-300 transform hover:-translate-y-0.5">
            {activeTab === 'company' && (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">
                        Nom de l'entreprise
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="siret" className="block text-sm font-medium text-white/70 mb-1">
                        SIRET
                      </label>
                      <input
                        type="text"
                        id="siret"
                        name="siret"
                        value={formData.siret}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-1">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-white/70 mb-1">
                        Adresse
                      </label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-3 text-white/40" />
                        <textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          rows={3}
                          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white resize-none"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-white/70 mb-1">
                        Site web
                      </label>
                      <div className="relative">
                        <Globe size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
                        <input
                          type="url"
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-white/70 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)] hover:shadow-[0_6px_15px_rgba(0,0,0,0.3),0_0_20px_rgba(0,210,200,0.25)] transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Settings2 size={16} />
                    Enregistrer les modifications
                  </button>
                </div>
              </form>
            )}
            {activeTab === 'employees' && (
              <div className="text-white">
                Gestion des employés - En cours de développement
              </div>
            )}
            {activeTab === 'documents' && (
              <div className="text-white">
                Gestion des documents - En cours de développement
              </div>
            )}
          </div>
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Paramètres de l'entreprise</h3>
      </div>
    </div>
  );
}