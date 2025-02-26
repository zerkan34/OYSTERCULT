import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, Upload } from 'lucide-react';
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
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Informations de l'entreprise</h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Nom de l'entreprise
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="Oyster Cult Enterprise"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Numéro SIRET
              </label>
              <input
                type="text"
                name="siret"
                value={formData.siret}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="123 456 789 00012"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Logo de l'entreprise
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-white/40" />
                <div className="flex text-sm text-white/60">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-brand-burgundy hover:text-brand-burgundy/80 focus-within:outline-none"
                  >
                    <span>Télécharger un fichier</span>
                    <input 
                      id="file-upload" 
                      name="logo"
                      type="file" 
                      className="sr-only"
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
                <p className="text-xs text-white/40">
                  PNG, JPG jusqu'à 10MB
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              placeholder="Description de votre entreprise..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="contact@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  placeholder="+33 1 23 45 67 89"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Adresse
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-white/40" size={20} />
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="Adresse complète..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Site web
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                placeholder="https://www.example.com"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
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
              className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}