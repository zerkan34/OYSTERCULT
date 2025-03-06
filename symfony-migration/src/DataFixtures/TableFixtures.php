<?php

namespace App\DataFixtures;

use App\Entity\Table;
use App\Entity\Cell;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class TableFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Créer des tables avec des positions représentant la vue satellite
        // Colonne gauche pour les triploïdes (bordeaux)
        $this->createTable($manager, 'Table Triploïde 1', 'Plates', 1, 1, 10, 10);
        $this->createTable($manager, 'Table Triploïde 2', 'Plates', 1, 2, 10, 10);
        $this->createTable($manager, 'Table Triploïde 3', 'Plates', 1, 3, 10, 10);
        
        // Colonne droite pour les diploïdes (bleue)
        $this->createTable($manager, 'Table Diploïde 1', 'Creuses', 2, 1, 10, 10);
        $this->createTable($manager, 'Table Diploïde 2', 'Creuses', 2, 2, 10, 10);
        $this->createTable($manager, 'Table Diploïde 3', 'Creuses', 2, 3, 10, 10);
        
        $manager->flush();
    }
    
    /**
     * Crée une table avec ses cellules
     */
    private function createTable(ObjectManager $manager, string $name, string $type, int $posX, int $posY, int $rows, int $cols): void
    {
        $table = new Table();
        $table->setName($name);
        $table->setType($type);
        $table->setPosX($posX);
        $table->setPosY($posY);
        $table->setRows($rows);
        $table->setColumns($cols);
        
        $manager->persist($table);
        
        // Créer les cellules pour cette table
        $this->createTableCells($manager, $table, $rows, $cols);
    }
    
    /**
     * Crée les cellules pour une table
     * Respecte la numérotation séquentielle de gauche à droite et de haut en bas
     */
    private function createTableCells(ObjectManager $manager, Table $table, int $rows, int $cols): void
    {
        $cellNumber = 1;
        
        // Créer les cellules dans l'ordre (de haut en bas)
        for ($row = 0; $row < $rows; $row++) {
            for ($col = 0; $col < $cols; $col++) {
                $cell = new Cell();
                $cell->setTable($table);
                $cell->setRowIndex($row);
                $cell->setColumnIndex($col);
                $cell->setNumber($cellNumber++);
                
                // Suivant le standard, remplir les 6 premières cellules (60%)
                // Colonne de gauche pour les triploïdes, droite pour les diploïdes
                if ($cellNumber <= 7) {
                    $cell->setStatus('filled');
                    $cell->setQuantity(100); // Quantité arbitraire
                } else {
                    $cell->setStatus('empty');
                    $cell->setQuantity(0);
                }
                
                $manager->persist($cell);
            }
        }
    }
}
