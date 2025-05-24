import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Globe } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="sticky bottom-0 left-0 right-0 w-full glass-effect border-t border-white/10 py-8 px-6 z-50 shadow-[0_-8px_16px_-6px_rgba(0,0,0,0.2)] bg-black/40" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-brand-secondary/10 to-brand-tertiary/10 animate-gradient-x" />
      <div className="relative max-w-7xl mx-auto">
        {/* Grille principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* À propos */}
          <div className="space-y-4">
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary font-semibold mb-2">À propos d'Oyster Cult</h3>
            <p className="text-white/60 text-xs leading-relaxed">
              Oyster Cult révolutionne la gestion des huîtres avec des solutions innovantes pour les ostréiculteurs. Notre plateforme combine technologie de pointe et expertise du secteur.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="text-white/60 hover:text-brand-primary hover:scale-110 transform transition-all duration-200">
                <Facebook size={16} />
              </a>
              <a href="#" className="text-white/60 hover:text-brand-primary hover:scale-110 transform transition-all duration-200">
                <Twitter size={16} />
              </a>
              <a href="#" className="text-white/60 hover:text-brand-primary hover:scale-110 transform transition-all duration-200">
                <Instagram size={16} />
              </a>
              <a href="#" className="text-white/60 hover:text-brand-primary hover:scale-110 transform transition-all duration-200">
                <Linkedin size={16} />
              </a>
              <a href="#" className="text-white/60 hover:text-brand-primary hover:scale-110 transform transition-all duration-200">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary font-semibold mb-2">Liens rapides</h3>
            <div className="grid grid-cols-1 gap-2">
              <a href="/dashboard" className="text-white/60 hover:text-brand-primary hover:-translate-y-0.5 transform transition-all duration-200 text-sm">Dashboard</a>
              <a href="/tasks" className="text-white/60 hover:text-brand-primary hover:-translate-y-0.5 transform transition-all duration-200 text-sm">Tâches</a>
              <a href="/stocks" className="text-white/60 hover:text-brand-primary hover:-translate-y-0.5 transform transition-all duration-200 text-sm">Stocks</a>
              <a href="/analyses" className="text-white/60 hover:text-brand-primary hover:-translate-y-0.5 transform transition-all duration-200 text-sm">Analyses</a>
              <a href="/surveillance" className="text-white/60 hover:text-brand-primary hover:-translate-y-0.5 transform transition-all duration-200 text-sm">Surveillance</a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary font-semibold mb-2">Support</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/60">
                <Phone size={16} />
                <span className="text-sm">+33 (0)2 40 00 00 00</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Mail size={16} />
                <span className="text-sm">contact@oystercult.com</span>
              </div>
              <div className="flex items-start gap-2 text-white/60">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="text-sm">123 Avenue des Huîtres<br />44000 Nantes, France</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Globe size={16} />
                <span className="text-sm">www.oystercult.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary font-semibold mb-2">Newsletter</h3>
            <p className="text-white/60 text-sm mb-4">Restez informé des dernières actualités et innovations.</p>
            <form className="space-y-2">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="w-full px-4 py-2 glass-effect border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 transition-all duration-200"
              />
              <button 
                type="submit" 
                className="w-full px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/90 hover:to-brand-secondary/90 text-white rounded-lg transition-all duration-200 text-sm font-medium hover:shadow-neon"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>

        {/* Barre de bas de page */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white/60 text-sm">
            © {currentYear} OYSTER CULT. Tous droits réservés.
          </div>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <a href="/mentions-legales" className="text-white/60 hover:text-cyan-400 text-sm transition-colors duration-200">
              Mentions légales
            </a>
            <a href="/confidentialite" className="text-white/60 hover:text-cyan-400 text-sm transition-colors duration-200">
              Politique de confidentialité
            </a>
            <a href="/cgv" className="text-white/60 hover:text-cyan-400 text-sm transition-colors duration-200">
              CGV
            </a>
            <a href="/faq" className="text-white/60 hover:text-cyan-400 text-sm transition-colors duration-200">
              FAQ
            </a>
            <a href="/contact" className="text-white/60 hover:text-cyan-400 text-sm transition-colors duration-200">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
