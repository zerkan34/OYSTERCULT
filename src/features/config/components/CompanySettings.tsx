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
        <h2 className="text-2xl font-bold bg-clip-text text-transparent mb-2"
          style={{ backgroundImage: "linear-gradient(90deg, #ffffff, #a5f3fc)" }}>
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
            <label className="block text-sm font-medium text-white/80 mb-2">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none"
              style={{
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)"
              }}
              placeholder="Oyster Cult Enterprise"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Numéro SIRET
            </label>
            <input
              type="text"
              name="siret"
              value={formData.siret}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none"
              style={{
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)"
              }}
              placeholder="123 456 789 00012"
              required
            />
          </div>
        </motion.div>

        <motion.div variants={inputVariants}>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Logo de l'entreprise
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-white/10 border-dashed rounded-xl transition-all duration-200 hover:border-[#00D1FF]/30 group"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)"
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
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
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
        </motion.div>

        <motion.div variants={inputVariants}>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none"
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)"
            }}
            placeholder="Description de votre entreprise..."
          />
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 gap-6"
          variants={inputVariants}
        >
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
                style={{
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)"
                }}
                placeholder="contact@example.com"
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
                style={{
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)"
                }}
                placeholder="+33 1 23 45 67 89"
                required
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={inputVariants}>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Adresse
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-white/40" size={20} />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none"
              style={{
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)"
              }}
              placeholder="Adresse complète..."
              required
            />
          </div>
        </motion.div>

        <motion.div variants={inputVariants}>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Site web
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white transition-all duration-200 focus:border-[#00D1FF]/50 focus:ring-2 focus:ring-[#00D1FF]/20 focus:outline-none"
              style={{
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)"
              }}
              placeholder="https://www.example.com"
            />
          </div>
        </motion.div>

        <motion.div 
          variants={inputVariants}
          className="flex justify-end"
        >
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-[#00D1FF] to-[#00D1FF]/80 text-white font-medium rounded-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/50"
            style={{
              boxShadow: "0 0 20px rgba(0, 209, 255, 0.3)"
            }}
          >
            Enregistrer les modifications
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}