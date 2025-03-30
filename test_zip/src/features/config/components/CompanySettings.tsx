import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, Upload, FileText, Image } from 'lucide-react';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

export function CompanySettings() {
  const { companyInfo, setCompanyInfo } = useStore();
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
    <form className="space-y-6 max-w-3xl" onSubmit={handleSubmit}>
      <div className="relative p-6 rounded-xl bg-white/5 border border-white/10" style={{ backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-3 mb-6">
          <Building2 size={24} className="text-[#00D1FF]" />
          <h2 className="text-2xl font-semibold text-white">Informations de l'entreprise</h2>
        </div>
        <p className="text-white/60 mb-6">Gérez les informations principales de votre entreprise</p>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nom de l'entreprise
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none"
                  placeholder="Oyster Cult Enterprise"
                  style={{ backdropFilter: 'blur(10px)' }}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                SIRET
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="siret"
                  value={formData.siret}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none"
                  placeholder="123 456 789 00012"
                  style={{ backdropFilter: 'blur(10px)' }}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative p-6 rounded-xl bg-white/5 border border-white/10" style={{ backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-3 mb-6">
          <Image size={24} className="text-[#00D1FF]" />
          <h2 className="text-2xl font-semibold text-white">Logo</h2>
        </div>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-xl transition-all duration-200 hover:border-[#00D1FF]/30 group"
             style={{ 
               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
               backdropFilter: 'blur(10px)'
             }}>
          <div className="space-y-2 text-center">
            <Upload className="mx-auto h-12 w-12 text-white/40 group-hover:text-[#00D1FF]/60 transition-colors duration-200" />
            <div className="flex text-sm text-white/60">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-[#00D1FF] hover:text-[#00D1FF]/80 focus-within:outline-none transition-colors duration-200"
              >
                <span>Télécharger un fichier</span>
                <input 
                  id="file-upload" 
                  name="logo"
                  type="file" 
                  className="sr-only"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Pour l'instant, on stocke juste le nom du fichier
                      setFormData(prev => ({
                        ...prev,
                        logo: file.name
                      }));
                    }
                  }}
                />
              </label>
              <p className="pl-1">ou glisser-déposer</p>
            </div>
            <p className="text-xs text-white/40">PNG, JPG jusqu'à 10MB</p>
          </div>
        </div>
      </div>

      <div className="relative p-6 rounded-xl bg-white/5 border border-white/10" style={{ backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-3 mb-6">
          <FileText size={24} className="text-[#00D1FF]" />
          <h2 className="text-2xl font-semibold text-white">Description</h2>
        </div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none resize-none"
          placeholder="Description de votre entreprise..."
          style={{ backdropFilter: 'blur(10px)' }}
        />
      </div>

      <div className="relative p-6 rounded-xl bg-white/5 border border-white/10" style={{ backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-3 mb-6">
          <MapPin size={24} className="text-[#00D1FF]" />
          <h2 className="text-2xl font-semibold text-white">Contact</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
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
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none"
                placeholder="contact@example.com"
                style={{ backdropFilter: 'blur(10px)' }}
                required
              />
            </div>
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
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none"
                placeholder="+33 1 23 45 67 89"
                style={{ backdropFilter: 'blur(10px)' }}
              />
            </div>
          </div>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-white/40" size={20} />
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={2}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none resize-none"
            placeholder="Adresse complète..."
            style={{ backdropFilter: 'blur(10px)' }}
          />
        </div>
      </div>

      <div className="relative p-6 rounded-xl bg-white/5 border border-white/10" style={{ backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-3 mb-6">
          <Globe size={24} className="text-[#00D1FF]" />
          <h2 className="text-2xl font-semibold text-white">Site Web</h2>
        </div>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none"
            placeholder="https://www.example.com"
            style={{ backdropFilter: 'blur(10px)' }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setFormData({
            name: companyInfo?.name || '',
            siret: companyInfo?.siret || '',
            logo: companyInfo?.logo || '',
            description: companyInfo?.description || '',
            email: companyInfo?.email || '',
            phone: companyInfo?.phone || '',
            address: companyInfo?.address || '',
            website: companyInfo?.website || ''
          })}
          className="px-4 py-2 text-white/70 hover:text-white transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-[#00D1FF] to-[#00D1FF]/80 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/50"
          style={{ boxShadow: 'rgba(0, 209, 255, 0.3) 0px 0px 20px' }}
        >
          Enregistrer les modifications
        </button>
      </div>
    </form>
  );
}