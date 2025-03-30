import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const inputVariants = {
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
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <motion.div variants={inputVariants}>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
          Informations de l'entreprise
        </h2>
        <p className="text-white/60 mb-6">
          Gérez les informations principales de votre entreprise
        </p>
      </motion.div>
        
      <form className="space-y-6" onSubmit={handleSubmit}>
        <motion.div 
          className="grid grid-cols-2 gap-6"
          variants={inputVariants}
        >
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="name">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="config-input"
              placeholder="Oyster Cult Enterprise"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="siret">
              Numéro SIRET
            </label>
            <input
              type="text"
              id="siret"
              name="siret"
              value={formData.siret}
              onChange={handleChange}
              className="config-input"
              placeholder="123 456 789 00012"
              required
              aria-required="true"
            />
          </div>
        </motion.div>

        <motion.div variants={inputVariants}>
          <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="logo">
            Logo de l'entreprise
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-xl transition-all duration-200 hover:border-white/30 group config-container">
            <div className="space-y-2 text-center">
              <Upload className="mx-auto h-12 w-12 text-white/40 group-hover:text-white/60 transition-colors duration-200" />
              <div className="flex text-sm text-white/60">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-white hover:text-white/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-white/20 transition-colors duration-200"
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
                        setFormData(prev => ({
                          ...prev,
                          logo: file.name
                        }));
                      }
                    }}
                    accept="image/*"
                  />
                </label>
                <p className="pl-1">ou glisser-déposer</p>
              </div>
              <p className="text-xs text-white/40">
                PNG, JPG, GIF jusqu'à 10MB
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={inputVariants}>
          <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="config-input"
            placeholder="Une brève description de votre entreprise..."
            rows={4}
          />
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 gap-6"
          variants={inputVariants}
        >
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="config-input"
                placeholder="contact@oystercult.com"
                required
                aria-required="true"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="phone">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="config-input"
                placeholder="+33 1 23 45 67 89"
                required
                aria-required="true"
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={inputVariants}>
          <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="address">
            Adresse
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-white/40" size={20} />
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="config-input"
              placeholder="123 rue de la Mer, 75001 Paris"
              required
              aria-required="true"
            />
          </div>
        </motion.div>

        <motion.div variants={inputVariants}>
          <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="website">
            Site web
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="config-input"
              placeholder="https://www.oystercult.com"
            />
          </div>
        </motion.div>

        <motion.div 
          className="flex justify-end"
          variants={inputVariants}
        >
          <button
            type="submit"
            className="config-button bg-white/10 text-white hover:bg-white/15"
          >
            Enregistrer les modifications
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}