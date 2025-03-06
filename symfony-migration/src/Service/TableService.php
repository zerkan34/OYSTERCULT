<?php

namespace App\Service;

use App\Entity\Table;
use App\Entity\Cell;
use App\Repository\TableRepository;
use App\Repository\CellRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class TableService
{
    private $entityManager;
    private $tableRepository;
    private $cellRepository;
    
    public function __construct(
        EntityManagerInterface $entityManager,
        TableRepository $tableRepository,
        CellRepository $cellRepository
    ) {
        $this->entityManager = $entityManager;
        $this->tableRepository = $tableRepository;
        $this->cellRepository = $cellRepository;
    }
    
    /**
     * Récupère toutes les tables avec leurs cellules
     * 
     * @return Table[]
     */
    public function getAllTables(): array
    {
        return $this->tableRepository->findAllWithCells();
    }
    
    /**
     * Récupère les tables par type (triploid/diploid)
     * 
     * @param string $type
     * @return Table[]
     */
    public function getTablesByType(string $type): array
    {
        return $this->tableRepository->findByType($type);
    }
    
    /**
     * Récupère une table par son ID
     * 
     * @param string $id
     * @return Table
     * @throws NotFoundHttpException
     */
    public function getTableById(string $id): Table
    {
        $table = $this->tableRepository->findWithCells($id);
        
        if (!$table) {
            throw new NotFoundHttpException('Table non trouvée');
        }
        
        return $table;
    }
    
    /**
     * Crée une nouvelle table avec ses cellules
     * Respecte les règles de numérotation séquentielles et de code couleur
     * 
     * @param array $data
     * @return Table
     */
    public function createTable(array $data): Table
    {
        $table = new Table();
        $table->setName($data['name']);
        $table->setType($data['type']);
        $table->setPosition($data['position']);
        $table->setRows($data['rows']);
        $table->setColumns($data['columns']);
        
        $this->entityManager->persist($table);
        $this->entityManager->flush();
        
        // Création des cellules selon la règle de numérotation séquentielle
        $this->createTableCells($table);
        
        return $table;
    }
    
    /**
     * Met à jour une table existante
     * 
     * @param string $id
     * @param array $data
     * @return Table
     * @throws NotFoundHttpException
     */
    public function updateTable(string $id, array $data): Table
    {
        $table = $this->getTableById($id);
        
        if (isset($data['name'])) {
            $table->setName($data['name']);
        }
        
        if (isset($data['position'])) {
            $table->setPosition($data['position']);
        }
        
        $this->entityManager->flush();
        
        return $table;
    }
    
    /**
     * Supprime une table et toutes ses cellules
     * 
     * @param string $id
     * @return void
     * @throws NotFoundHttpException
     */
    public function deleteTable(string $id): void
    {
        $table = $this->getTableById($id);
        
        $this->entityManager->remove($table);
        $this->entityManager->flush();
    }
    
    /**
     * Crée les cellules pour une table selon les règles de numérotation séquentielles
     * La numérotation est organisée de gauche à droite et de haut en bas
     * Respecte la distinction des couleurs par type (triploïdes en bordeaux, diploïdes en bleu)
     * 
     * @param Table $table
     * @return void
     */
    private function createTableCells(Table $table): void
    {
        $rows = $table->getRows();
        $columns = $table->getColumns();
        $color = $table->getType() === 'triploid' ? 'bg-brand-burgundy' : 'bg-blue-600';
        
        // Créer les cellules en respectant l'ordre: gauche à droite, haut en bas
        for ($row = 0; $row < $rows; $row++) {
            for ($col = 0; $col < $columns; $col++) {
                $cell = new Cell();
                $cell->setTable($table);
                $cell->setRowIndex($row);
                $cell->setColumnIndex($col);
                
                // Calculer le numéro de cellule (séquentiel)
                $cellNumber = ($row * $columns) + $col + 1;
                $cell->setCellNumber($cellNumber);
                $cell->setColor($color);
                
                // Le standard est de remplir les 6 premières cellules (60%)
                if ($cellNumber <= 6) {
                    $cell->setStatus('filled');
                    $cell->setQuantity(100); // Quantité par défaut
                } else {
                    $cell->setStatus('empty');
                    $cell->setQuantity(0);
                }
                
                $this->entityManager->persist($cell);
            }
        }
        
        $this->entityManager->flush();
    }
    
    /**
     * Remplit une table avec une quantité donnée d'huîtres
     * 
     * @param string $tableId
     * @param int $quantity
     * @param bool $standardFill
     * @return array
     * @throws NotFoundHttpException
     */
    public function fillTable(string $tableId, int $quantity, bool $standardFill = true): array
    {
        $table = $this->getTableById($tableId);
        $cells = $this->cellRepository->findByTableOrderedByPosition($table);
        $filledCells = [];
        
        if ($standardFill) {
            // Respecte la règle des 60% des cellules (6 premières)
            $cellsToFill = array_slice($cells, 0, 6);
            $quantityPerCell = ceil($quantity / count($cellsToFill));
            
            foreach ($cellsToFill as $cell) {
                $cell->setStatus('filled');
                $cell->setQuantity($quantityPerCell);
                $filledCells[] = $cell;
            }
        } else {
            // Remplit toutes les cellules vides
            $emptyCells = array_filter($cells, function ($cell) {
                return $cell->getStatus() === 'empty';
            });
            
            if (count($emptyCells) > 0) {
                $quantityPerCell = ceil($quantity / count($emptyCells));
                
                foreach ($emptyCells as $cell) {
                    $cell->setStatus('filled');
                    $cell->setQuantity($quantityPerCell);
                    $filledCells[] = $cell;
                }
            }
        }
        
        $this->entityManager->flush();
        $this->logTableInteraction($table, 'fill', [
            'quantity' => $quantity,
            'standardFill' => $standardFill,
            'filledCellsCount' => count($filledCells)
        ]);
        
        return $filledCells;
    }
    
    /**
     * Vide une table ou des cellules spécifiques
     * 
     * @param string $tableId
     * @param array $options
     * @return array
     * @throws NotFoundHttpException
     */
    public function emptyTable(string $tableId, array $options = []): array
    {
        $table = $this->getTableById($tableId);
        $emptiedCells = [];
        
        if (isset($options['emptyAll']) && $options['emptyAll']) {
            // Vider toutes les cellules
            $filledCells = $this->cellRepository->findByTableAndStatus($table, 'filled');
            
            foreach ($filledCells as $cell) {
                $cell->setStatus('empty');
                $cell->setQuantity(0);
                $emptiedCells[] = $cell;
            }
        } elseif (isset($options['cellIds']) && is_array($options['cellIds'])) {
            // Vider des cellules spécifiques
            foreach ($options['cellIds'] as $cellId) {
                $cell = $this->cellRepository->find($cellId);
                
                if ($cell && $cell->getTable()->getId() === $tableId) {
                    $cell->setStatus('empty');
                    $cell->setQuantity(0);
                    $emptiedCells[] = $cell;
                }
            }
        }
        
        $this->entityManager->flush();
        $this->logTableInteraction($table, 'empty', [
            'emptiedCellsCount' => count($emptiedCells),
            'options' => $options
        ]);
        
        return $emptiedCells;
    }
    
    /**
     * Met à jour le statut d'une cellule spécifique
     * 
     * @param string $tableId
     * @param string $cellId
     * @param array $data
     * @return Cell
     * @throws NotFoundHttpException
     */
    public function updateCellStatus(string $tableId, string $cellId, array $data): Cell
    {
        $table = $this->getTableById($tableId);
        $cell = $this->cellRepository->find($cellId);
        
        if (!$cell) {
            throw new NotFoundHttpException('Cellule non trouvée');
        }
        
        if ($cell->getTable()->getId() !== $tableId) {
            throw new \InvalidArgumentException('La cellule n\'appartient pas à cette table');
        }
        
        if (isset($data['status'])) {
            $cell->setStatus($data['status']);
        }
        
        if (isset($data['quantity'])) {
            $cell->setQuantity($data['quantity']);
        }
        
        $this->entityManager->flush();
        $this->logTableInteraction($table, 'updateCell', [
            'cellId' => $cellId,
            'status' => $cell->getStatus(),
            'quantity' => $cell->getQuantity()
        ]);
        
        return $cell;
    }
    
    /**
     * Récupère les statistiques d'une table
     * 
     * @param string $tableId
     * @return array
     * @throws NotFoundHttpException
     */
    public function getTableStats(string $tableId): array
    {
        $table = $this->getTableById($tableId);
        $cells = $this->cellRepository->findByTableOrderedByPosition($table);
        
        $totalCells = count($cells);
        $filledCells = 0;
        $emptyCells = 0;
        $harvestedCells = 0;
        $maintenanceCells = 0;
        $totalQuantity = 0;
        
        foreach ($cells as $cell) {
            switch ($cell->getStatus()) {
                case 'filled':
                    $filledCells++;
                    $totalQuantity += $cell->getQuantity();
                    break;
                case 'empty':
                    $emptyCells++;
                    break;
                case 'harvested':
                    $harvestedCells++;
                    break;
                case 'maintenance':
                    $maintenanceCells++;
                    break;
            }
        }
        
        return [
            'totalCells' => $totalCells,
            'filledCells' => $filledCells,
            'emptyCells' => $emptyCells,
            'harvestedCells' => $harvestedCells,
            'maintenanceCells' => $maintenanceCells,
            'fillPercentage' => $totalCells > 0 ? ($filledCells / $totalCells) * 100 : 0,
            'totalQuantity' => $totalQuantity,
            'type' => $table->getType()
        ];
    }
    
    /**
     * Enregistre chaque interaction avec une table pour le suivi
     * 
     * @param Table $table
     * @param string $action
     * @param array $data
     * @return void
     */
    private function logTableInteraction(Table $table, string $action, array $data): void
    {
        // Cette méthode pourrait être étendue pour enregistrer les interactions
        // dans une table dédiée pour l'historique et l'analyse
        // Pour l'instant, on pourrait simplement logger l'action
    }
}
