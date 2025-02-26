-- Insertion des fournisseurs
INSERT INTO suppliers (name, email, phone, address, friend_code, is_friend) VALUES
('Huîtres Marennes Oléron', 'contact@huitres-mo.fr', '05 46 85 12 34', '12 Route des Claires, 17320 Marennes', 'HMO17320', true),
('Les Parcs de l\'Estuaire', 'commandes@parcs-estuaire.fr', '05 46 36 45 78', '8 Quai des Ostréiculteurs, 17390 La Tremblade', 'LPE17390', true),
('Atlantique Coquillages', 'ventes@atlantique-coq.fr', '02 51 68 23 45', '45 Avenue du Port, 85230 Bouin', 'ACQ85230', false),
('Cancale Premium', 'service@cancale-premium.fr', '02 99 89 67 89', '23 Rue du Port, 35260 Cancale', 'CAN35260', true),
('Arcachon Huîtres', 'pro@arcachon-huitres.com', '05 57 72 34 56', '56 Boulevard de la Plage, 33120 Arcachon', 'ARC33120', false),
('Normandie Mer', 'contact@normandie-mer.fr', '02 31 97 45 67', '34 Quai Charcot, 14520 Port-en-Bessin', 'NOM14520', false),
('Méditerranée Coquillages', 'info@med-coquillages.fr', '04 67 43 89 12', '78 Quai des Pêcheurs, 34140 Bouzigues', 'MED34140', true),
('Bretagne Iodée', 'pro@bretagne-iodee.fr', '02 98 58 65 43', '12 Route de la Mer, 29760 Saint-Guénolé', 'BIO29760', false),
('Vendée Atlantique', 'contact@vendee-atlantique.fr', '02 51 39 78 90', '67 Rue du Port, 85100 Les Sables-d\'Olonne', 'VAT85100', true),
('Cap Ferret Select', 'business@capferret-select.fr', '05 56 60 23 45', '89 Avenue des Dunes, 33970 Cap Ferret', 'CFS33970', false);

-- Insertion des produits pour chaque fournisseur
INSERT INTO supplier_products (supplier_id, name, description, price, unit) 
SELECT 
  s.id,
  'Huîtres Spéciales N°3',
  'Huîtres de qualité supérieure, calibre 3',
  8.50,
  'douzaine'
FROM suppliers s
WHERE s.name = 'Huîtres Marennes Oléron';

INSERT INTO supplier_products (supplier_id, name, description, price, unit)
SELECT 
  s.id,
  'Huîtres Fines de Claire N°2',
  'Huîtres affinées en claire, calibre 2',
  9.50,
  'douzaine'
FROM suppliers s
WHERE s.name = 'Les Parcs de l\'Estuaire';

-- Et ainsi de suite pour les autres produits...
