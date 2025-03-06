<?php

namespace App\DataFixtures;

use App\Entity\InventoryItem;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class InventoryFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Créer des items d'inventaire pour les huîtres triploïdes (Plates)
        $this->createInventoryItem(
            $manager, 
            'Huîtres Plates Calibre 3', 
            'Plates', 
            150, 
            'Stock principal', 
            new \DateTime('2024-02-15'), 
            'Lot P-2024-001'
        );
        
        $this->createInventoryItem(
            $manager, 
            'Huîtres Plates Calibre 2', 
            'Plates', 
            120, 
            'Stock principal', 
            new \DateTime('2024-02-10'), 
            'Lot P-2024-002'
        );
        
        $this->createInventoryItem(
            $manager, 
            'Huîtres Plates Spéciales', 
            'Plates', 
            80, 
            'Réserve', 
            new \DateTime('2024-01-20'), 
            'Lot P-2024-003'
        );
        
        // Créer des items d'inventaire pour les huîtres diploïdes (Creuses)
        $this->createInventoryItem(
            $manager, 
            'Huîtres Creuses Calibre 3', 
            'Creuses', 
            200, 
            'Stock principal', 
            new \DateTime('2024-02-20'), 
            'Lot C-2024-001'
        );
        
        $this->createInventoryItem(
            $manager, 
            'Huîtres Creuses Calibre 2', 
            'Creuses', 
            180, 
            'Stock principal', 
            new \DateTime('2024-02-05'), 
            'Lot C-2024-002'
        );
        
        $this->createInventoryItem(
            $manager, 
            'Huîtres Creuses Spéciales', 
            'Creuses', 
            100, 
            'Réserve', 
            new \DateTime('2024-01-15'), 
            'Lot C-2024-003'
        );
        
        // Créer quelques items à faible stock pour le tableau de bord
        $this->createInventoryItem(
            $manager, 
            'Huîtres Plates Fines de Claire', 
            'Plates', 
            5, 
            'Réserve spéciale', 
            new \DateTime('2024-01-05'), 
            'Lot P-2024-004'
        );
        
        $this->createInventoryItem(
            $manager, 
            'Huîtres Creuses Fines de Claire', 
            'Creuses', 
            8, 
            'Réserve spéciale', 
            new \DateTime('2024-01-10'), 
            'Lot C-2024-004'
        );
        
        $manager->flush();
    }
    
    /**
     * Crée un item d'inventaire
     */
    private function createInventoryItem(
        ObjectManager $manager, 
        string $name, 
        string $type, 
        int $quantity, 
        string $location, 
        \DateTime $harvestDate, 
        string $batchNumber
    ): void {
        $item = new InventoryItem();
        $item->setName($name);
        $item->setType($type);
        $item->setQuantity($quantity);
        $item->setLocation($location);
        $item->setHarvestDate($harvestDate);
        $item->setBatchNumber($batchNumber);
        $item->setCreatedAt(new \DateTime());
        
        $manager->persist($item);
    }
}
