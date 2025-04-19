import React from "react";
import { Bell, Users, ClipboardList, PlusCircle, Eye, History, Download, Mail, Phone, MapPin, Fish, Shell, Ship, Gem, QrCode, Printer, ArrowLeft, Clock, X } from "lucide-react";
import { DatePicker } from "../components/ui/DatePicker";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { QRCodeSVG } from "qrcode.react";
import { QrCodeCommandeGenerator } from "../features/digitalvault/components/QrCodeGenerator";

const villages = ["Vallon-Pont-d'Arc", "Ruoms", "Balazuc", "Labeaume"];

// On régénère un tableau commandesData avec des commandes réparties par village
// Chaque commande contient des produits : moules, huîtres, palourdes, crevettes, murex
const commandesData = [
  // Vallon-Pont-d'Arc
  {
    id: 1,
    client: "Jean Dupont",
    village: "Vallon-Pont-d'Arc",
    produits: [
      { nom: "Moules", quantite: 3, prix: 10, lot: "LOT123" },
      { nom: "Huîtres", quantite: 2, prix: 15, lot: "LOT456" },
      { nom: "Palourdes", quantite: 1, prix: 8, lot: "LOT789" },
      { nom: "Crevettes", quantite: 2, prix: 12, lot: "LOT012" },
      { nom: "Murex", quantite: 1, prix: 20, lot: "LOT345" }
    ],
    date: "2025-04-19",
    status: "En attente",
    urgence: true
  },
  {
    id: 2,
    client: "Lucie Martin",
    village: "Vallon-Pont-d'Arc",
    produits: [
      { nom: "Huîtres", quantite: 4, prix: 15, lot: "LOT901" },
      { nom: "Moules", quantite: 2, prix: 10, lot: "LOT234" },
      { nom: "Crevettes", quantite: 1, prix: 12, lot: "LOT567" }
    ],
    date: "2025-04-19",
    status: "Prête"
  },
  // Ruoms
  {
    id: 3,
    client: "Paul Bernard",
    village: "Ruoms",
    produits: [
      { nom: "Palourdes", quantite: 2, prix: 8, lot: "LOT890" },
      { nom: "Murex", quantite: 2, prix: 20, lot: "LOT123" },
      { nom: "Moules", quantite: 1, prix: 10, lot: "LOT456" }
    ],
    date: "2025-04-19",
    status: "En attente"
  },
  {
    id: 4,
    client: "Claire Leroy",
    village: "Ruoms",
    produits: [
      { nom: "Crevettes", quantite: 3, prix: 12, lot: "LOT789" },
      { nom: "Huîtres", quantite: 2, prix: 15, lot: "LOT012" }
    ],
    date: "2025-04-19",
    status: "Prête"
  },
  // Balazuc
  {
    id: 5,
    client: "Sophie Petit",
    village: "Balazuc",
    produits: [
      { nom: "Moules", quantite: 2, prix: 10, lot: "LOT345" },
      { nom: "Palourdes", quantite: 2, prix: 8, lot: "LOT678" },
      { nom: "Crevettes", quantite: 1, prix: 12, lot: "LOT901" }
    ],
    date: "2025-04-19",
    status: "En attente"
  },
  // Labeaume
  {
    id: 6,
    client: "Marc Dubois",
    village: "Labeaume",
    produits: [
      { nom: "Huîtres", quantite: 3, prix: 15, lot: "LOT234" },
      { nom: "Murex", quantite: 2, prix: 20, lot: "LOT567" },
      { nom: "Crevettes", quantite: 1, prix: 12, lot: "LOT890" }
    ],
    date: "2025-04-19",
    status: "Prête"
  }
];

// Données fictives clients avec fiche détaillée
const clientsFiches = [
  { nom: "Lucie Martin", email: "lucie.martin@email.com", tel: "06 12 34 56 01", adresse: "12 rue des Oliviers, 07120 Ruoms" },
  { nom: "Antoine Dubois", email: "antoine.dubois@email.com", tel: "06 12 34 56 02", adresse: "3 chemin du Moulin, 07120 Ruoms" },
  { nom: "Chloé Bernard", email: "chloe.bernard@email.com", tel: "06 12 34 56 03", adresse: "8 impasse des Vignes, 07120 Ruoms" },
  { nom: "Maxime Lefevre", email: "maxime.lefevre@email.com", tel: "06 12 34 56 04", adresse: "15 avenue des Platanes, 07120 Ruoms" },
  { nom: "Élise Laurent", email: "elise.laurent@email.com", tel: "06 12 34 56 05", adresse: "4 rue des Lauriers, 07120 Balazuc" },
  { nom: "Julien Petit", email: "julien.petit@email.com", tel: "06 12 34 56 06", adresse: "10 chemin du Pont, 07120 Balazuc" },
  { nom: "Camille Faure", email: "camille.faure@email.com", tel: "06 12 34 56 07", adresse: "21 place de l'Église, 07120 Balazuc" },
  { nom: "Romain Girard", email: "romain.girard@email.com", tel: "06 12 34 56 08", adresse: "7 route du Village, 07120 Balazuc" },
  { nom: "Sophie Morel", email: "sophie.morel@email.com", tel: "06 12 34 56 09", adresse: "5 rue du Château, 07120 Labeaume" },
  { nom: "Hugo Vidal", email: "hugo.vidal@email.com", tel: "06 12 34 56 10", adresse: "13 chemin des Mimosas, 07120 Labeaume" },
  { nom: "Nina Caron", email: "nina.caron@email.com", tel: "06 12 34 56 11", adresse: "2 rue des Fleurs, 07120 Labeaume" },
  { nom: "Paul Giraud", email: "paul.giraud@email.com", tel: "06 12 34 56 12", adresse: "18 avenue des Pins, 07120 Labeaume" }
];

const clientsInventes = clientsFiches.map(c => c.nom);

const onglets = [
  { key: "tournee", label: <><ClipboardList className="inline mr-2" size={18} aria-hidden="true"/>Tournée</> },
  { key: "clients", label: <><Users className="inline mr-2" size={18} aria-hidden="true"/>Clients</> },
  { key: "notifications", label: (
    <span className="relative flex items-center justify-center" style={{width: 44, height: 44}}>
      <Bell className="inline" size={22} aria-hidden="true"/>
      <span className="sr-only">Notifications</span>
      <span className="absolute top-0 right-0 translate-x-2/3 -translate-y-2/3 bg-cyan-500 text-white text-base font-bold rounded-full px-3 py-1 shadow min-w-[28px] min-h-[28px] flex items-center justify-center">3</span>
    </span>
  )},
  { key: "historique", label: <><History className="inline mr-2" size={18} aria-hidden="true"/>Historique</> }
];

function prixTotal(produits) {
  return produits.reduce((acc, p) => acc + p.prix * p.quantite, 0);
}

const notificationsInit = [
  { id: 1, message: "Nouvelle commande urgente à Vallon-Pont-d'Arc (Sophie Lenoir)", date: "2025-04-19", read: false, commandeId: 1 },
  { id: 2, message: "Commande validée pour Ruoms (Lucie Martin)", date: "2025-04-19", read: false, commandeId: 2 },
  { id: 3, message: "Commande en attente à Balazuc (Élise Laurent)", date: "2025-04-19", read: false, commandeId: 5 },
  { id: 4, message: "Nouveau client à Labeaume (Sophie Morel)", date: "2025-04-19", read: false, commandeId: 6 }
];

const historiqueData = [
  { id: "hist-1", commandeId: 2, village: "Ruoms", client: "Lucie Martin", date: "2025-03-12", total: 210, status: "validée" },
  { id: "hist-2", commandeId: 5, village: "Balazuc", client: "Élise Laurent", date: "2025-03-10", total: 180, status: "validée" },
  { id: "hist-3", commandeId: 6, village: "Labeaume", client: "Sophie Morel", date: "2025-03-08", total: 160, status: "refusée" },
  { id: "hist-4", commandeId: 1, village: "Ruoms", client: "Antoine Dubois", date: "2025-02-28", total: 230, status: "validée" }
];

function LucideIconFor(nom) {
  switch (nom) {
    case "Moules":
      return Fish;
    case "Huîtres":
      return Shell;
    case "Palourdes":
      return Shell;
    case "Crevettes":
      return Ship;
    case "Murex":
      return Gem;
    default:
      return Fish;
  }
}

const notifArdeche = 3;

// Données clients par localisation (20 Ardèche, 14 Hérault, tous différents)
const clientsParRegion = {
  ardeche: [
    { nom: "Jean Dupont", tel: "06 12 34 56 78", email: "jean.dupont@email.com" },
    { nom: "Marie Martin", tel: "06 98 76 54 32", email: "marie.martin@email.com" },
    { nom: "Luc Morel", tel: "06 23 11 45 67", email: "luc.morel@email.com" },
    { nom: "Sophie Girard", tel: "06 45 67 89 01", email: "sophie.girard@email.com" },
    { nom: "Pierre Lefevre", tel: "06 56 78 90 12", email: "pierre.lefevre@email.com" },
    { nom: "Camille Robert", tel: "06 34 56 78 90", email: "camille.robert@email.com" },
    { nom: "Antoine Petit", tel: "06 78 12 34 56", email: "antoine.petit@email.com" },
    { nom: "Julie Faure", tel: "06 89 67 45 23", email: "julie.faure@email.com" },
    { nom: "Nicolas Caron", tel: "06 90 12 34 56", email: "nicolas.caron@email.com" },
    { nom: "Claire Mercier", tel: "06 87 65 43 21", email: "claire.mercier@email.com" },
    { nom: "Louis Garnier", tel: "06 77 88 99 00", email: "louis.garnier@email.com" },
    { nom: "Emma Mathieu", tel: "06 66 55 44 33", email: "emma.mathieu@email.com" },
    { nom: "Pauline Roche", tel: "06 55 44 33 22", email: "pauline.roche@email.com" },
    { nom: "Hugo Blanchard", tel: "06 44 33 22 11", email: "hugo.blanchard@email.com" },
    { nom: "Chloé Vidal", tel: "06 33 22 11 00", email: "chloe.vidal@email.com" },
    { nom: "Alexis Leroy", tel: "06 22 11 00 99", email: "alexis.leroy@email.com" },
    { nom: "Laura Dupuis", tel: "06 11 00 99 88", email: "laura.dupuis@email.com" },
    { nom: "Maxime Fontaine", tel: "06 00 99 88 77", email: "maxime.fontaine@email.com" },
    { nom: "Elodie Henry", tel: "06 99 88 77 66", email: "elodie.henry@email.com" },
    { nom: "Thomas Marchand", tel: "06 88 77 66 55", email: "thomas.marchand@email.com" }
  ],
  herault: [
    { nom: "Paul Bernard", tel: "07 11 22 33 44", email: "paul.bernard@email.com" },
    { nom: "Sophie Petit", tel: "07 99 88 77 66", email: "sophie.petit@email.com" },
    { nom: "Lucas Fabre", tel: "07 88 77 66 55", email: "lucas.fabre@email.com" },
    { nom: "Manon Roussel", tel: "07 77 66 55 44", email: "manon.roussel@email.com" },
    { nom: "Julien Rey", tel: "07 66 55 44 33", email: "julien.rey@email.com" },
    { nom: "Anaïs Giraud", tel: "07 55 44 33 22", email: "anais.giraud@email.com" },
    { nom: "Baptiste Lemoine", tel: "07 44 33 22 11", email: "baptiste.lemoine@email.com" },
    { nom: "Léa Moulin", tel: "07 33 22 11 00", email: "lea.moulin@email.com" },
    { nom: "Arthur Dupuy", tel: "07 22 11 00 99", email: "arthur.dupuy@email.com" },
    { nom: "Eva Renard", tel: "07 11 00 99 88", email: "eva.renard@email.com" },
    { nom: "Clément Schmitt", tel: "07 00 99 88 77", email: "clement.schmitt@email.com" },
    { nom: "Sarah Pires", tel: "07 99 88 77 55", email: "sarah.pires@email.com" },
    { nom: "Romain Texier", tel: "07 88 77 55 44", email: "romain.texier@email.com" },
    { nom: "Julie Lefort", tel: "07 77 55 44 33", email: "julie.lefort@email.com" }
  ]
};

export default function CommandesPage() {
  const [onglet, setOnglet] = React.useState("tournee");
  const [commandes, setCommandes] = React.useState(commandesData);
  const [commentaires, setCommentaires] = React.useState({});
  const [notifications, setNotifications] = React.useState(notificationsInit);
  const [modalFacture, setModalFacture] = React.useState(null); // commandeId ou null
  const [modalTournee, setModalTournee] = React.useState(false);
  const [modalMarche, setModalMarche] = React.useState(false);
  const [modalClient, setModalClient] = React.useState(null); // nom du client ou null
  const [villageOuvert, setVillageOuvert] = React.useState(null);
  const [dateDebut, setDateDebut] = React.useState("");
  const [dateFin, setDateFin] = React.useState("");
  const [qrCommandeOpen, setQrCommandeOpen] = React.useState(null);
  const [regionTournee, setRegionTournee] = React.useState(null);
  const [regionClients, setRegionClients] = React.useState<string|null>(null);
  const [clientHistoriqueOpen, setClientHistoriqueOpen] = React.useState(null);
  const [modalNouvelleTournee, setModalNouvelleTournee] = React.useState(false);
  const [modalNouveauMarche, setModalNouveauMarche] = React.useState(false);
  const [lieuTournee, setLieuTournee] = React.useState("");
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const lieuxTourneePossibles = ["Ardèche", "Hérault"];
  const lieuxSuggestions = lieuTournee
    ? lieuxTourneePossibles.filter(lieu => lieu.toLowerCase().includes(lieuTournee.toLowerCase()) && lieuTournee.trim() !== "")
    : lieuxTourneePossibles;
  const lieuxExistants = Array.from(new Set(commandes.map(c => c.village)));
  const regionsTournee = [
    { key: 'ardeche', label: 'Ardèche' },
    { key: 'herault', label: 'Hérault' }
  ];

  const handleValidation = (id, status) => {
    setCommandes(cmds => cmds.map(c => c.id === id ? { ...c, status } : c));
    setNotifications(nots => [{ id: Date.now(), message: `Commande ${status} pour ${id}`, date: new Date().toISOString().slice(0, 10), read: false, commandeId: id }, ...nots]);
  };
  const handleComment = (id, comment) => {
    setCommentaires(coms => ({ ...coms, [id]: comment }));
  };
  const markNotificationRead = id => {
    setNotifications(nots => nots.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const commandeModal = commandes.find(c => c.id === modalFacture);
  const clientModal = clientsFiches.find(c => c.nom === modalClient);

  const historiqueFiltre = historiqueData.filter(h => (!dateDebut || h.date >= dateDebut) && (!dateFin || h.date <= dateFin));

  const historiqueFiltreTrie = [...historiqueFiltre].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return a.client.localeCompare(b.client);
  });

  // Format date du jour
  const today = new Date();
  const dateTournee = today.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  function handleExportPDF() {
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 60;

    // Titre du rapport (barre colorée)
    doc.setFillColor(10, 42, 64);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Historique des commandes OYSTER CULT', pageWidth / 2, 15, { align: 'center' });

    // Informations d'export
    doc.setTextColor(10, 42, 64);
    doc.setFontSize(10);
    doc.text(`Date d'export : ${new Date().toLocaleDateString('fr-FR')}`, 14, 35);
    doc.text(`Exporté par : Utilisateur`, 14, 42);
    doc.text(`Période : ${dateDebut || '...'} - ${dateFin || '...'} `, 14, 49);

    // Helper pour l'en-tête de tableau
    const createTableHeader = (headers, columnWidths) => {
      doc.setFillColor(10, 42, 64);
      doc.rect(10, yPosition, pageWidth - 20, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      let xPosition = 10;
      headers.forEach((header, idx) => {
        doc.text(header, xPosition + columnWidths[idx] / 2, yPosition + 7, { align: 'center' });
        xPosition += columnWidths[idx];
      });
      yPosition += 10;
    };

    // Colonnes : Date, Client, Village, Statut, Total, Produits
    const columnWidths = [40, 45, 40, 28, 25, pageWidth - 20 - (40 + 45 + 40 + 28 + 25)];
    createTableHeader([
      'Date',
      'Client',
      'Village',
      'Statut',
      'Total (€)',
      'Produits'
    ], columnWidths);

    // Lignes du tableau
    historiqueFiltreTrie.forEach((h, idx) => {
      const y = yPosition + idx * 12;
      // Alternance couleur de fond
      if (idx % 2 === 0) {
        doc.setFillColor(240, 248, 255);
        doc.rect(10, y, pageWidth - 20, 12, 'F');
      }
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      let xPosition = 10;
      // Date
      doc.text(h.date, xPosition + columnWidths[0] / 2, y + 8, { align: 'center' });
      xPosition += columnWidths[0];
      // Client
      doc.text(h.client, xPosition + columnWidths[1] / 2, y + 8, { align: 'center' });
      xPosition += columnWidths[1];
      // Village
      doc.text(h.village, xPosition + columnWidths[2] / 2, y + 8, { align: 'center' });
      xPosition += columnWidths[2];
      // Statut
      doc.text(h.status, xPosition + columnWidths[3] / 2, y + 8, { align: 'center' });
      xPosition += columnWidths[3];
      // Total
      doc.text(String(h.total), xPosition + columnWidths[4] / 2, y + 8, { align: 'center' });
      xPosition += columnWidths[4];
      // Produits (liste)
      const commande = commandes.find(c => c.id === h.commandeId);
      let produitsText = '';
      if (commande) {
        produitsText = commande.produits.map(p => `${p.nom} ×${p.quantite} (${p.prix}€/kg, Lot ${p.lot})`).join(', ');
      }
      doc.text(produitsText, xPosition + 2, y + 8, { align: 'left', maxWidth: columnWidths[5] - 4 });
      // Séparateur
      if (idx < historiqueFiltreTrie.length - 1) {
        doc.setDrawColor(180);
        doc.line(10, y + 12, pageWidth - 10, y + 12);
      }
      // Gestion saut de page
      if ((y + 18) > pageHeight - 20 && idx < historiqueFiltreTrie.length - 1) {
        doc.addPage();
        yPosition = 30;
        createTableHeader([
          'Date', 'Client', 'Village', 'Statut', 'Total (€)', 'Produits'
        ], columnWidths);
      }
    });

    doc.save('historique-commandes.pdf');
  }

  function handlePrevenirTournee() {
    // TODO: intégrer l'envoi réel (API/emailing)
    alert("Un message sera envoyé à tous les contacts de la zone " + (regionsTournee.find(r=>r.key===regionTournee)?.label || ""));
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
          <ClipboardList size={22} className="text-cyan-400" aria-hidden="true"/>
          Commandes
        </h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 text-cyan-400 font-semibold shadow min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => setModalNouvelleTournee(true)}
          >
            <PlusCircle size={18} className="mr-1"/>Créer nouvelle tournée
          </button>
          <button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 text-cyan-400 font-semibold shadow min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => setModalNouveauMarche(true)}
          >
            <PlusCircle size={18} className="mr-1"/>Nouveau marché
          </button>
        </div>
      </div>
      <div className="flex gap-4 mb-6" role="tablist">
        {onglets.map(o => (
          <button
            key={o.key}
            role="tab"
            aria-selected={onglet === o.key}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 min-w-[44px] min-h-[44px] text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 ${onglet === o.key ? "bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]" : "text-white/60 hover:text-white hover:bg-white/5"}`}
            onClick={() => setOnglet(o.key)}
          >{o.label}</button>
        ))}
      </div>
      <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-blur-[10px] p-6 rounded-lg shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 transition-all duration-300">
        {onglet === "tournee" && !regionTournee && (
          <div className="flex flex-col items-center justify-center py-16">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Choisissez une région de tournée
            </h2>
            <div className="flex gap-6">
              {regionsTournee.map(r => (
                <button
                  key={r.key}
                  className={`relative flex items-center gap-2 px-8 py-4 rounded-xl text-xl font-semibold border border-white/10 bg-gradient-to-br from-cyan-800/40 to-cyan-900/30 text-cyan-200 shadow-lg hover:bg-cyan-500/20 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 min-w-[120px] min-h-[60px] transition-all duration-200 ${regionTournee===r.key? 'ring-2 ring-cyan-400/60':''}`}
                  onClick={() => setRegionTournee(r.key)}
                  aria-label={`Voir la tournée ${r.label}`}
                >
                  {r.label}
                  {r.key === 'ardeche' && notifArdeche > 0 && (
                    <span className="absolute -top-4 -right-4 bg-cyan-500 text-white text-base font-bold rounded-full px-3 py-1 shadow-lg animate-bounce z-20 min-w-[36px] min-h-[36px] flex items-center justify-center">
                      {notifArdeche}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        {onglet === "tournee" && regionTournee && (
          <>
            <div className="relative flex items-center justify-center mb-6 min-h-[60px]">
              <button
                type="button"
                className="absolute left-0 flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 shadow min-w-[44px] min-h-[44px] font-semibold hover:bg-cyan-600/30 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                onClick={() => setRegionTournee(null)}
                aria-label="Retour au choix de la région"
              >
                <ArrowLeft size={20} aria-hidden="true" />
                <span className="sr-only">Retour</span>
              </button>
              <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
                Villages de la tournée&nbsp;
                <span className="text-white/40 text-base font-normal">( {regionsTournee.find(r=>r.key===regionTournee)?.label} )</span>
                <span className="text-cyan-400/80 text-base font-medium bg-white/10 rounded px-3 py-1 ml-2 select-none">{dateTournee}</span>
              </h2>
              <div className="absolute left-1/2 top-14 -translate-x-1/2 flex items-center gap-2">
                <span className="text-green-400 bg-green-600/20 rounded px-2 py-1 text-sm font-semibold">commandes prêtes (1/2)</span>
              </div>
              <button
                type="button"
                className="absolute right-0 flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 shadow min-w-[44px] min-h-[44px] font-semibold hover:bg-cyan-600/30 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                onClick={handlePrevenirTournee}
                aria-label="Prévenir de la tournée"
              >
                <Mail className="text-cyan-400" size={18} aria-hidden="true"/>
                Prévenir de la tournée
              </button>
            </div>
            <ul className="flex flex-wrap gap-4 mb-6" role="tablist">
              {villages.map(village => (
                <li key={village}>
                  <button
                    role="tab"
                    aria-selected={villageOuvert === village}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 min-w-[44px] min-h-[44px] font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 ${villageOuvert === village ? "bg-cyan-500/20 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.25),0_0_15px_rgba(0,210,200,0.2)]" : "bg-white/5 text-white/80 hover:bg-cyan-500/10"}`}
                    onClick={() => setVillageOuvert(villageOuvert === village ? null : village)}
                  >{village}</button>
                </li>
              ))}
            </ul>
            {villages.map(village => (
              <div key={village} className={`transition-all duration-300 ${villageOuvert === village ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-cyan-400">{village}</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  {commandes.filter(c => c.village === village).map(cmd => (
                    <div key={cmd.id} className="relative group bg-gradient-to-br from-[rgba(15,23,42,0.7)] to-[rgba(20,100,100,0.6)] border border-cyan-400/20 rounded-2xl p-7 shadow-[0_8px_32px_rgba(0,0,0,0.25),0_0_40px_0_rgba(0,210,200,0.09)_inset] overflow-hidden backdrop-blur-[8px] transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_12px_40px_rgba(0,210,200,0.18),0_0_60px_0_rgba(0,210,200,0.13)_inset] flex flex-col justify-between min-h-[340px]">
                        <div className="absolute -inset-1 rounded-2xl opacity-40 pointer-events-none group-hover:opacity-70 transition-all blur-md bg-gradient-to-r from-cyan-400/20 to-blue-500/10" />
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg font-bold text-white">{cmd.client}</span>
                          {cmd.urgence && <span className="text-xs text-red-400 font-bold animate-pulse ml-2">⚠️ Urgent</span>}
                          {cmd.client === "Lucie Martin" ? (
                            <span className="flex items-center gap-1 text-green-400 bg-green-600/20 px-2 py-1 rounded font-semibold text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              ok
                            </span>
                          ) : cmd.client === "Jean Dupont" ? (
                            <span className="text-sm px-2 py-1 rounded font-semibold bg-orange-600/20 text-orange-400">en attente</span>
                          ) : (
                            <span className={`text-sm px-2 py-1 rounded font-semibold ${cmd.status === "Prête" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-300"}`}>{cmd.status}</span>
                          )}
                        </div>
                        <div className="text-base text-white/80 mb-1">{cmd.date}</div>
                        <ul className="divide-y divide-white/10 mt-3 mb-4">
                          {cmd.produits.map(p => {
                            const Icon = LucideIconFor(p.nom);
                            return (
                              <li key={p.nom} className="flex items-center gap-3 py-2">
                                <Icon className="text-cyan-400" size={22} aria-hidden="true" />
                                <span className="font-semibold text-white text-base">{p.nom}</span>
                                <span className="text-cyan-300 font-bold text-lg ml-auto">×{p.quantite}</span>
                                <span className="text-white/70 text-base ml-4">{p.prix}€/kg</span>
                                <span className="text-white/40 text-sm ml-2">Lot {p.lot}</span>
                              </li>
                            );
                          })}
                        </ul>
                        <div className="flex items-end justify-between mt-auto mb-2">
                          <div className="flex gap-2">
                            <button aria-label="Valider la commande" onClick={() => handleValidation(cmd.id, "validée")} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 shadow min-w-[44px] min-h-[44px] font-semibold hover:bg-cyan-600/30 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40" >Valider</button>
                            <button aria-label="Refuser la commande" onClick={() => handleValidation(cmd.id, "refusée")} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-white/10 shadow min-w-[44px] min-h-[44px] font-semibold hover:bg-red-600/30 hover:border-red-400/30 focus:outline-none focus:ring-2 focus:ring-red-500/40" >Refuser</button>
                          </div>
                          <div className="text-2xl font-extrabold text-cyan-400 bg-white/10 border border-cyan-400/30 rounded-lg px-5 py-2 shadow-lg min-w-[120px] text-right select-none" style={{letterSpacing:'0.02em'}}>
                            {prixTotal(cmd.produits)} €
                          </div>
                        </div>
                        <div className="mb-2">
                          <label htmlFor={`commentaire-${cmd.id}`} className="block text-white/70 text-sm mb-1">Commentaire :</label>
                          <textarea
                            id={`commentaire-${cmd.id}`}
                            className="w-full min-h-[44px] rounded-lg bg-white/10 border border-white/10 text-white p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 placeholder:text-white/40"
                            placeholder="Ajouter un commentaire..."
                            value={commentaires[cmd.id] || ''}
                            onChange={e => handleComment(cmd.id, e.target.value)}
                            aria-label="Commentaire sur la commande"
                          />
                        </div>
                        <div className="flex items-center gap-3 mt-2 mb-2">
                          <button
                            className="flex items-center justify-center p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 shadow min-w-[44px] min-h-[44px] font-semibold hover:bg-cyan-600/30 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                            aria-label="Générer QR code commande"
                            onClick={() => setQrCommandeOpen(cmd)}
                            type="button"
                          >
                            <QrCode size={20} className="mr-2 text-cyan-400 drop-shadow" aria-hidden="true" />
                            Générer QR code commande
                          </button>
                          <button
                            className="flex items-center justify-center p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 shadow min-w-[44px] min-h-[44px] font-semibold hover:bg-cyan-600/30 hover:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                            aria-label="Commande prête"
                            type="button"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            Commande prête
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </>
        )}
        {onglet === "clients" && !regionClients && (
          <div className="flex flex-col items-center justify-center py-16">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Choisissez une localité
            </h2>
            <div className="flex gap-6">
              {regionsTournee.map(r => (
                <button
                  key={r.key}
                  className={`relative flex items-center gap-2 px-8 py-4 rounded-xl text-xl font-semibold border border-white/10 bg-gradient-to-br from-cyan-800/40 to-cyan-900/30 text-cyan-200 shadow-lg hover:bg-cyan-500/20 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 min-w-[120px] min-h-[60px] transition-all duration-200 ${regionClients===r.key? 'ring-2 ring-cyan-400/60':''}`}
                  onClick={() => setRegionClients(r.key)}
                  aria-label={`Voir les clients de ${r.label}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {onglet === "clients" && regionClients && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Clients <span className="text-white/40 text-base font-normal">({regionsTournee.find(r=>r.key===regionClients)?.label})</span></h2>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 shadow min-w-[44px] min-h-[44px] font-semibold hover:bg-cyan-600/30 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Contacter tous les clients de la localité"
                type="button"
                onClick={() => alert('Contacter tous les clients de cette localité !')}
              >
                <Mail size={18} aria-hidden="true" />
                Contacter tous
              </button>
            </div>
            <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {(clientsParRegion[regionClients] || []).map((client, idx) => (
                <li
                  key={client.nom + idx}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-[0_6px_24px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.08)_inset] hover:border-cyan-400/30 hover:shadow-[0_10px_32px_rgba(0,0,0,0.22)] transition-all flex flex-col gap-1"
                  tabIndex={0}
                  aria-label={`Fiche client ${client.nom}`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-cyan-100 text-base truncate max-w-[110px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                      {client.nom.split(' ')[1]?.toUpperCase() || ''} {client.nom.split(' ')[0]}
                    </span>
                    <button
                      className="ml-auto flex items-center justify-center p-2 rounded-full bg-white/10 text-cyan-400 shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:bg-cyan-500/20 hover:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 min-w-[36px] min-h-[36px]"
                      aria-label={`Contacter ${client.nom}`}
                      type="button"
                      onClick={() => alert(`Contacter ${client.nom}`)}
                    >
                      <Mail size={17} aria-hidden="true" />
                    </button>
                    <button
                      className="flex items-center justify-center p-2 rounded-full bg-white/10 text-cyan-400 shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:bg-blue-500/20 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300 min-w-[36px] min-h-[36px] ml-1"
                      aria-label={`Voir l'historique des commandes de ${client.nom}`}
                      type="button"
                      onClick={() => setClientHistoriqueOpen(client)}
                    >
                      <Clock size={16} aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-0.5 ml-1 mt-0.5">
                    <span className="text-sm text-white/80 flex items-center"><Phone className="inline mr-1 text-cyan-400" size={15} aria-hidden="true"/>{client.tel}</span>
                    <span className="text-sm text-white/80 flex items-center"><Mail className="inline mr-1 text-cyan-400" size={15} aria-hidden="true"/>{client.email}</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {onglet === "notifications" && (
          <div className="mt-2"> 
            <h2 className="text-xl font-bold mb-4 text-cyan-400 flex items-center gap-2">
              <Bell className="inline" size={20} aria-hidden="true"/>
              Notifications
            </h2>
            <ul className="space-y-2">
              {notifications.map((notif, i) => (
                <li key={i} className={`flex items-center gap-3 py-2 px-0 ${notif.read ? 'opacity-50' : ''}`}>
                  <span className="text-xs text-white/60 w-24">{notif.date}</span>
                  <span className="flex-1 text-white/90">{notif.message}</span>
                  <button className="flex items-center gap-1 px-3 py-1 rounded bg-cyan-500/20 text-cyan-400 text-xs font-semibold hover:bg-cyan-600/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40" onClick={() => setModalFacture(notif.commandeId)}><Eye size={14}/> Voir</button>
                  {!notif.read && (
                    <button
                      className="ml-2 px-2 py-1 text-xs rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-600/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                      onClick={() => markNotificationRead(notif.id)}
                    >
                      Marquer comme lu
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {onglet === "historique" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
                <History className="text-cyan-400" size={20} aria-hidden="true"/>
                Historique des commandes
              </h2>
              <button onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/30 text-cyan-400 font-semibold shadow min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1"
              >
                <Download size={18} className="mr-1"/>Exporter PDF
              </button>
            </div>
            <div className="flex gap-4 mb-4">
              <DatePicker label="Début" value={dateDebut} onChange={setDateDebut} />
              <DatePicker label="Fin" value={dateFin} onChange={setDateFin} />
            </div>
            <ul className="divide-y divide-white/10">
              {historiqueFiltre.map(hist => (
                <li key={hist.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <span className="font-semibold text-cyan-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">{hist.client}</span>
                    <span className="ml-2 text-white/50 text-base">{hist.village}</span>
                    <span className="ml-2 text-white/60 text-base">{hist.date}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-cyan-400 font-bold">{hist.total} €</span>
                    <span className={`text-base font-semibold ${hist.status === "validée" ? "text-green-400" : "text-red-400"}`}>{hist.status}</span>
                    <button className="flex items-center gap-1 px-3 py-1 rounded bg-cyan-500/20 text-cyan-400 text-xs font-semibold hover:bg-cyan-600/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40" onClick={() => setModalFacture(hist.commandeId)}><Eye size={14}/> Voir</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Modal facture */}
      {modalFacture && commandeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gradient-to-br from-cyan-950/90 to-blue-900/90 p-10 rounded-2xl shadow-2xl max-w-lg w-full relative border border-cyan-400/30 backdrop-blur-[10px]">
            <button className="absolute top-2 right-2 text-white/70 hover:text-cyan-400 text-xl" onClick={() => setModalFacture(null)} aria-label="Fermer">×</button>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">Récapitulatif commande</h2>
            <div className="mb-2"><span className="font-semibold text-white text-lg">{commandeModal.client}</span> – <span className="text-white/70">{commandeModal.village}</span></div>
            <div className="text-base text-white/80 mb-2">{commandeModal.date}</div>
            <ul className="divide-y divide-white/10 mb-4">
              {commandeModal.produits.map(p => {
                const Icon = LucideIconFor(p.nom);
                return (
                  <li key={p.nom} className="flex items-center gap-3 py-2">
                    <Icon className="text-cyan-400" size={22} aria-hidden="true" />
                    <span className="font-semibold text-white text-base">{p.nom}</span>
                    <span className="text-cyan-300 font-bold text-lg ml-auto">×{p.quantite}</span>
                    <span className="text-white/70 text-base ml-4">{p.prix}€/kg</span>
                    <span className="text-white/40 text-sm ml-2">Lot {p.lot}</span>
                  </li>
                );
              })}
            </ul>
            <div className="text-base text-cyan-200 mb-2">Total : <span className="text-cyan-400 font-bold">{prixTotal(commandeModal.produits)} €</span></div>
          </div>
        </div>
      )}

      {/* Modal client */}
      {modalClient && clientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={(e) => { if (e.target === e.currentTarget) setModalClient(null); }}>
          <div className="bg-gradient-to-br from-cyan-950/90 to-blue-900/90 p-10 rounded-2xl shadow-2xl max-w-lg w-full relative border border-cyan-400/30 backdrop-blur-[10px]">
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-cyan-400 text-2xl min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              onClick={() => setModalClient(null)}
              aria-label="Fermer"
              tabIndex={0}
            >
              ×
            </button>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-3">Fiche client</h2>
            <div className="mb-2"><span className="font-semibold text-white text-lg">{clientModal.nom}</span></div>
            <div className="flex items-center gap-2 text-cyan-200 mb-2"><Mail size={16}/> <span>{clientModal.email}</span></div>
            <div className="flex items-center gap-2 text-cyan-200 mb-2"><Phone size={16}/> <span>{clientModal.tel}</span></div>
            <div className="flex items-center gap-2 text-cyan-200"><MapPin size={16}/> <span>{clientModal.adresse}</span></div>
          </div>
        </div>
      )}

      {/* Modal tournée */}
      {modalTournee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gradient-to-br from-cyan-950/90 to-blue-900/90 p-10 rounded-2xl shadow-2xl max-w-lg w-full relative border border-cyan-400/30 backdrop-blur-[10px]">
            <button className="absolute top-2 right-2 text-white/70 hover:text-cyan-400 text-xl" onClick={() => setModalTournee(false)} aria-label="Fermer">×</button>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">Créer une nouvelle tournée</h2>
            <div className="text-white/80 mb-2">(Formulaire à venir)</div>
            <button className="mt-4 px-4 py-2 rounded bg-cyan-500/20 text-cyan-400 font-semibold hover:bg-cyan-600/30 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40" onClick={() => setModalTournee(false)}>Fermer</button>
          </div>
        </div>
      )}
      {/* Modal marché */}
      {modalMarche && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gradient-to-br from-cyan-950/90 to-blue-900/90 p-10 rounded-2xl shadow-2xl max-w-lg w-full relative border border-cyan-400/30 backdrop-blur-[10px]">
            <button className="absolute top-2 right-2 text-white/70 hover:text-cyan-400 text-xl" onClick={() => setModalMarche(false)} aria-label="Fermer">×</button>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">Créer un nouveau marché</h2>
            <div className="text-white/80 mb-2">(Formulaire à venir)</div>
            <button className="mt-4 px-4 py-2 rounded bg-cyan-500/20 text-cyan-400 font-semibold hover:bg-cyan-600/30 min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-cyan-500/40" onClick={() => setModalMarche(false)}>Fermer</button>
          </div>
        </div>
      )}
      {qrCommandeOpen && (
        <QrCodeCommandeGenerator
          commande={qrCommandeOpen}
          onClose={() => setQrCommandeOpen(null)}
        />
      )}
      {clientHistoriqueOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          onClick={e => {
            if (e.target === e.currentTarget) setClientHistoriqueOpen(null);
          }}
        >
          <div className="relative bg-gradient-to-br from-[rgba(15,23,42,0.85)] to-[rgba(20,100,100,0.75)] rounded-2xl shadow-2xl p-7 w-full max-w-lg mx-2 border border-white/10" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-3 right-3 p-2 rounded-full bg-white/10 text-white/70 hover:bg-cyan-500/20 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              aria-label="Fermer l'historique"
              onClick={() => setClientHistoriqueOpen(null)}
              type="button"
            >
              <X size={18} />
            </button>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
              <ClipboardList size={22} aria-hidden="true" className="text-cyan-400"/>
              Historique des commandes
            </h3>
            {/* Données fictives d’historique pour l’exemple */}
            <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-2">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white/5 rounded-lg p-3 flex flex-col gap-1 border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white/90">Commande #{i}</span>
                    <span className="ml-2 text-white/50 text-base">{new Date(Date.now() - i*86400000).toLocaleDateString()}</span>
                    <span className="ml-auto text-cyan-400 font-bold">{(Math.random()*120+30).toFixed(2)} €</span>
                  </div>
                  <div className="text-white/80 text-sm">
                    <span className="font-semibold">Produits :</span> 2x Huîtres Fines, 1x Spéciales, 1x Crevettes
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {modalNouvelleTournee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="relative w-full max-w-md p-0">
            <div className="bg-gradient-to-br from-[rgba(15,23,42,0.3)] to-[rgba(20,100,100,0.3)] backdrop-blur-[10px] p-8 rounded-xl shadow-[rgba(0,0,0,0.2)_0px_10px_20px_-5px,rgba(0,150,255,0.1)_0px_8px_16px_-8px,rgba(255,255,255,0.07)_0px_-1px_2px_0px_inset,rgba(0,65,255,0.05)_0px_0px_8px_inset,rgba(0,0,0,0.05)_0px_0px_1px_inset] border border-white/10 hover:border-white/20 transition-all duration-300 relative">
              <button className="absolute top-2 right-2 p-2 text-white/70 hover:text-cyan-400 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500/40" onClick={() => setModalNouvelleTournee(false)} aria-label="Fermer modal">
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6 flex items-center gap-2">
                <PlusCircle size={20} className="text-cyan-400" aria-hidden="true"/>Créer une nouvelle tournée
              </h2>
              <form className="flex flex-col gap-5">
                <label className="flex flex-col gap-1 text-white/90 text-sm">
                  Localisation
                  <input
                    type="text"
                    value={lieuTournee}
                    onChange={e => {
                      setLieuTournee(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    placeholder="Ardèche, Hérault..."
                    className="rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/40 p-2 focus:ring-cyan-400 focus:border-cyan-400"
                    required
                  />
                  {showSuggestions && lieuxSuggestions.length > 0 && (
                    <ul className="absolute z-10 mt-1 bg-slate-900 border border-white/10 rounded-lg shadow-lg w-full">
                      {lieuxSuggestions.map(lieu => (
                        <li
                          key={lieu}
                          className="px-4 py-2 cursor-pointer hover:bg-cyan-500/10 text-white"
                          onMouseDown={() => {
                            setLieuTournee(lieu);
                            setShowSuggestions(false);
                          }}
                        >
                          {lieu}
                        </li>
                      ))}
                    </ul>
                  )}
                </label>
                <label className="flex flex-col gap-1 text-white/90 text-sm">
                  Date
                  <input type="date" className="rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/40 p-2 focus:ring-cyan-400 focus:border-cyan-400" required />
                </label>
                <label className="flex flex-col gap-1 text-white/90 text-sm">
                  Nom de la tournée
                  <input type="text" className="rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/40 p-2 focus:ring-cyan-400 focus:border-cyan-400" required />
                </label>
                <button type="submit" className="mt-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-white/10 shadow min-w-[44px] min-h-[44px] font-semibold hover:bg-cyan-600/30 hover:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1">Créer</button>
              </form>
            </div>
          </div>
        </div>
      )}
      {modalNouveauMarche && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl relative">
            <button className="absolute top-2 right-2 p-2 text-slate-400 hover:text-slate-600" onClick={() => setModalNouveauMarche(false)} aria-label="Fermer modal">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-cyan-600">Créer un nouveau marché</h2>
            <form className="flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-slate-700 text-sm">
                Nom du marché
                <input type="text" className="rounded border border-slate-300 p-2 focus:ring-cyan-400 focus:border-cyan-400" required />
              </label>
              <label className="flex flex-col gap-1 text-slate-700 text-sm">
                Localisation
                <input type="text" className="rounded border border-slate-300 p-2 focus:ring-cyan-400 focus:border-cyan-400" required />
              </label>
              <button type="submit" className="mt-2 px-4 py-2 rounded bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition">Créer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
