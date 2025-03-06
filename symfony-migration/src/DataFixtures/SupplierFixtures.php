<?php

namespace App\DataFixtures;

use App\Entity\Supplier;
use App\Entity\SupplierProduct;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class SupplierFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Créer plusieurs fournisseurs avec leurs produits
        $supplier1 = $this->createSupplier(
            $manager,
            'Huîtres de Cancale',
            'Jean Dupont',
            'contact@huitres-cancale.fr',
            '01 23 45 67 89',
            '12 rue des Marins, 35260 Cancale',
            'Fournisseur spécialisé en huîtres de Cancale'
        );
        
        $this->createSupplierProduct(
            $manager,
            $supplier1,
            'Naissain Triploïde',
            'Plates',
            'T1',
            15.50,
            true,
            'Naissain de haute qualité pour huîtres plates triploïdes'
        );
        
        $this->createSupplierProduct(
            $manager,
            $supplier1,
            'Naissain Diploïde',
            'Creuses',
            'D1',
            12.75,
            true,
            'Naissain traditionnel pour huîtres creuses diploïdes'
        );
        
        $supplier2 = $this->createSupplier(
            $manager,
            'Ostréiculture Bretonne',
            'Marie Martin',
            'contact@ostreiculture-bretonne.fr',
            '02 34 56 78 90',
            '3 quai des Ostréiculteurs, 56470 La Trinité-sur-Mer',
            'Producteur breton spécialisé en huîtres de qualité supérieure'
        );
        
        $this->createSupplierProduct(
            $manager,
            $supplier2,
            'Huîtres Plates Adultes',
            'Plates',
            'T2',
            25.00,
            true,
            'Huîtres plates adultes prêtes pour l\'élevage'
        );
        
        $this->createSupplierProduct(
            $manager,
            $supplier2,
            'Huîtres Creuses Adultes',
            'Creuses',
            'D2',
            22.50,
            true,
            'Huîtres creuses adultes prêtes pour l\'élevage'
        );
        
        $supplier3 = $this->createSupplier(
            $manager,
            'Équipements Maritimes Pro',
            'Pierre Dubois',
            'info@equipements-maritimes.fr',
            '03 45 67 89 01',
            '45 zone industrielle, 17390 La Tremblade',
            'Fournisseur de matériel et équipements pour l\'ostréiculture'
        );
        
        $this->createSupplierProduct(
            $manager,
            $supplier3,
            'Poches à huîtres 14mm',
            'Matériel',
            'M1',
            35.00,
            true,
            'Poches à huîtres professionnelles, maille 14mm'
        );
        
        $this->createSupplierProduct(
            $manager,
            $supplier3,
            'Poches à huîtres 9mm',
            'Matériel',
            'M2',
            38.50,
            true,
            'Poches à huîtres professionnelles, maille 9mm'
        );
        
        $this->createSupplierProduct(
            $manager,
            $supplier3,
            'Tables métalliques',
            'Matériel',
            'M3',
            125.00,
            true,
            'Tables métalliques de support pour l\'élevage'
        );
        
        $manager->flush();
    }
    
    /**
     * Crée un fournisseur
     */
    private function createSupplier(
        ObjectManager $manager,
        string $name,
        string $contactName,
        string $email,
        string $phone,
        string $address,
        string $notes
    ): Supplier {
        $supplier = new Supplier();
        $supplier->setName($name);
        $supplier->setContactName($contactName);
        $supplier->setEmail($email);
        $supplier->setPhone($phone);
        $supplier->setAddress($address);
        $supplier->setNotes($notes);
        $supplier->setCreatedAt(new \DateTime());
        
        $manager->persist($supplier);
        
        return $supplier;
    }
    
    /**
     * Crée un produit pour un fournisseur
     */
    private function createSupplierProduct(
        ObjectManager $manager,
        Supplier $supplier,
        string $name,
        string $type,
        string $size,
        float $price,
        bool $available,
        string $description
    ): void {
        $product = new SupplierProduct();
        $product->setSupplier($supplier);
        $product->setName($name);
        $product->setType($type);
        $product->setSize($size);
        $product->setPrice($price);
        $product->setAvailable($available);
        $product->setDescription($description);
        $product->setCreatedAt(new \DateTime());
        
        $manager->persist($product);
    }
}
