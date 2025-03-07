<?php

namespace App\DataFixtures;

use App\Entity\Inventory\Product;
use App\Entity\Inventory\StorageLocation;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Création des emplacements de stockage
        $storageLocation1 = new StorageLocation();
        $storageLocation1->setName('Chambre froide 1');
        $storageLocation1->setType('refrigerated');
        $storageLocation1->setCapacity(1000);
        $storageLocation1->setDescription('Chambre froide principale');
        $storageLocation1->setTemperature(['min' => 2, 'max' => 4]);
        $manager->persist($storageLocation1);

        $storageLocation2 = new StorageLocation();
        $storageLocation2->setName('Stock sec');
        $storageLocation2->setType('dry');
        $storageLocation2->setCapacity(500);
        $storageLocation2->setDescription('Stockage matériel');
        $manager->persist($storageLocation2);

        // Création des produits
        $product1 = new Product();
        $product1->setName('Filets');
        $product1->setDescription('Filets pour le conditionnement des huîtres');
        $product1->setPrice('15.99');
        $product1->setQuantity(100);
        $product1->setMinQuantity(20);
        $product1->setUnit('pièce');
        $product1->setStatus('available');
        $product1->setStorageLocation($storageLocation2);
        $manager->persist($product1);

        $product2 = new Product();
        $product2->setName('Huîtres N°3');
        $product2->setDescription('Huîtres creuses calibre n°3');
        $product2->setPrice('9.50');
        $product2->setQuantity(1000);
        $product2->setMinQuantity(100);
        $product2->setUnit('kg');
        $product2->setStatus('available');
        $product2->setStorageLocation($storageLocation1);
        $manager->persist($product2);

        $product3 = new Product();
        $product3->setName('Poches ostréicoles');
        $product3->setDescription('Poches pour l\'élevage des huîtres');
        $product3->setPrice('12.99');
        $product3->setQuantity(15);
        $product3->setMinQuantity(20);
        $product3->setUnit('pièce');
        $product3->setStatus('low_stock');
        $product3->setStorageLocation($storageLocation2);
        $manager->persist($product3);

        $product4 = new Product();
        $product4->setName('Huîtres plates');
        $product4->setDescription('Huîtres plates de Cancale');
        $product4->setPrice('12.50');
        $product4->setQuantity(500);
        $product4->setMinQuantity(50);
        $product4->setUnit('kg');
        $product4->setStatus('available');
        $product4->setStorageLocation($storageLocation1);
        $manager->persist($product4);

        $product5 = new Product();
        $product5->setName('Gants de protection');
        $product5->setDescription('Gants pour la manipulation des huîtres');
        $product5->setPrice('8.99');
        $product5->setQuantity(5);
        $product5->setMinQuantity(10);
        $product5->setUnit('paire');
        $product5->setStatus('low_stock');
        $product5->setStorageLocation($storageLocation2);
        $manager->persist($product5);

        $manager->flush();
    }
}
