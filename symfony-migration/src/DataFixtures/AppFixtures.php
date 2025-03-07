<?php

namespace App\DataFixtures;

use App\Entity\Supplier;
use App\Entity\SupplierProduct;
use App\Entity\Inventory\OysterTable;
use App\Entity\Inventory\Product;
use App\Entity\Inventory\PurificationPool;
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
        $product1->setSku('FIL001');
        $product1->setCategory('equipment');
        $product1->setQuantity(100);
        $product1->setUnit('piece');
        $product1->setArrivalDate(new \DateTime());
        $product1->setMinimumStock(20);
        $product1->setMaximumStock(200);
        $product1->setStorageLocation($storageLocation2);
        $manager->persist($product1);

        $product2 = new Product();
        $product2->setName('Huîtres N°3');
        $product2->setSku('HUI003');
        $product2->setCategory('oysters');
        $product2->setQuantity(1000);
        $product2->setUnit('kg');
        $product2->setArrivalDate(new \DateTime());
        $product2->setExpiryDate((new \DateTime())->modify('+2 weeks'));
        $product2->setMinimumStock(100);
        $product2->setMaximumStock(2000);
        $product2->setStorageLocation($storageLocation1);
        $manager->persist($product2);

        // Création des bassins de purification
        $pool1 = new PurificationPool();
        $pool1->setPoolNumber('P001');
        $pool1->setStatus('active');
        $pool1->setLastMaintenanceDate(new \DateTime());
        $pool1->setUvLampHours(120);
        $pool1->setWaterParameters(['temperature' => 15, 'salinity' => 35]);
        $pool1->setCapacity(1000);
        $pool1->setCurrentOccupancy(800);
        $manager->persist($pool1);

        $pool2 = new PurificationPool();
        $pool2->setPoolNumber('P002');
        $pool2->setStatus('maintenance');
        $pool2->setLastMaintenanceDate(new \DateTime());
        $pool2->setUvLampHours(500);
        $pool2->setWaterParameters(['temperature' => 14, 'salinity' => 34]);
        $pool2->setCapacity(1000);
        $pool2->setCurrentOccupancy(0);
        $manager->persist($pool2);

        // Création des tables à huîtres
        $table1 = new OysterTable();
        $table1->setTableNumber('T001');
        $table1->setCells(['A1' => 'empty', 'A2' => 'occupied', 'B1' => 'occupied', 'B2' => 'empty']);
        $table1->setStatus('active');
        $table1->setLastMaintenanceDate(new \DateTime());
        $table1->setCapacity(100);
        $manager->persist($table1);

        $table2 = new OysterTable();
        $table2->setTableNumber('T002');
        $table2->setCells(['A1' => 'occupied', 'A2' => 'occupied', 'B1' => 'occupied', 'B2' => 'occupied']);
        $table2->setStatus('full');
        $table2->setLastMaintenanceDate(new \DateTime());
        $table2->setCapacity(100);
        $manager->persist($table2);

        // Création des fournisseurs
        $supplier1 = new Supplier();
        $supplier1->setName('Huîtres de Bretagne');
        $supplier1->setContact('Jean Martin');
        $supplier1->setEmail('contact@huitres-bretagne.fr');
        $supplier1->setPhone('0123456789');
        $supplier1->setAddress('1 rue de la Mer, 56000 Vannes');
        $supplier1->setNotes('Fournisseur principal d\'huîtres');
        $manager->persist($supplier1);

        $supplier2 = new Supplier();
        $supplier2->setName('MatériOyster');
        $supplier2->setContact('Marie Dupont');
        $supplier2->setEmail('contact@materioyster.fr');
        $supplier2->setPhone('0987654321');
        $supplier2->setAddress('42 rue du Port, 44000 Nantes');
        $supplier2->setNotes('Fournisseur de matériel ostréicole');
        $manager->persist($supplier2);

        // Création des produits fournisseurs
        $supplierProduct1 = new SupplierProduct();
        $supplierProduct1->setSupplier($supplier1);
        $supplierProduct1->setName('Huîtres plates');
        $supplierProduct1->setType('diploid');
        $supplierProduct1->setSize('3');
        $supplierProduct1->setPrice(8.50);
        $supplierProduct1->setDescription('Huîtres plates de Cancale');
        $manager->persist($supplierProduct1);

        $supplierProduct2 = new SupplierProduct();
        $supplierProduct2->setSupplier($supplier1);
        $supplierProduct2->setName('Huîtres creuses');
        $supplierProduct2->setType('triploid');
        $supplierProduct2->setSize('2');
        $supplierProduct2->setPrice(7.20);
        $supplierProduct2->setDescription('Huîtres creuses de Marennes');
        $manager->persist($supplierProduct2);

        $supplierProduct3 = new SupplierProduct();
        $supplierProduct3->setSupplier($supplier2);
        $supplierProduct3->setName('Poches ostréicoles');
        $supplierProduct3->setType('equipment');
        $supplierProduct3->setSize('standard');
        $supplierProduct3->setPrice(12.99);
        $supplierProduct3->setDescription('Poches ostréicoles 14mm');
        $manager->persist($supplierProduct3);

        $manager->flush();
    }
}
