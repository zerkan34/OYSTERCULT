<?php

namespace App\Service;

use App\Entity\InventoryItem;
use App\Entity\Table;
use App\Entity\Cell;
use App\Repository\InventoryItemRepository;
use App\Repository\TableRepository;
use App\Repository\CellRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class InventoryService
{
    private $entityManager;
    private $inventoryRepository;
    private $tableRepository;
    private $cellRepository;
    
    public function __construct(
        EntityManagerInterface $entityManager,
        InventoryItemRepository $inventoryRepository,
        TableRepository $tableRepository,
        CellRepository $cellRepository
    ) {
        $this->entityManager = $entityManager;
        $this->inventoryRepository = $inventoryRepository;
        $this->tableRepository = $tableRepository;
        $this->cellRepository = $cellRepository;
    }
    
    /**
     * Récupère tous les éléments d'inventaire
     * 
     * @return InventoryItem[]
     */
    public function getAllItems(): array
    {
        return $this->inventoryRepository->findAllSorted();
    }
    
    /**
     * Récupère les éléments d'inventaire par type
     * 
     * @param string $type
     * @return InventoryItem[]
     */
    public function getItemsByType(string $type): array
    {
        return $this->inventoryRepository->findByType($type);
    }
    
    /**
     * Récupère un élément d'inventaire par ID
     * 
     * @param string $id
     * @return InventoryItem
     * @throws NotFoundHttpException
     */
    public function getItemById(string $id): InventoryItem
    {
        $item = $this->inventoryRepository->find($id);
        
        if (!$item) {
            throw new NotFoundHttpException('Élément d\'inventaire non trouvé');
        }
        
        return $item;
    }
    
    /**
     * Crée un nouvel élément d'inventaire
     * 
     * @param array $data
     * @return InventoryItem
     */
    public function createItem(array $data): InventoryItem
    {
        $item = new InventoryItem();
        $item->setName($data['name']);
        $item->setType($data['type']);
        $item->setQuantity($data['quantity'] ?? 0);
        
        if (isset($data['location'])) {
            $item->setLocation($data['location']);
        }
        
        if (isset($data['size'])) {
            $item->setSize($data['size']);
        }
        
        if (isset($data['harvestDate'])) {
            $item->setHarvestDate(new \DateTime($data['harvestDate']));
        }
        
        if (isset($data['notes'])) {
            $item->setNotes($data['notes']);
        }
        
        $this->entityManager->persist($item);
        $this->entityManager->flush();
        
        return $item;
    }
    
    /**
     * Met à jour un élément d'inventaire existant
     * 
     * @param string $id
     * @param array $data
     * @return InventoryItem
     * @throws NotFoundHttpException
     */
    public function updateItem(string $id, array $data): InventoryItem
    {
        $item = $this->getItemById($id);
        
        if (isset($data['name'])) {
            $item->setName($data['name']);
        }
        
        if (isset($data['type'])) {
            $item->setType($data['type']);
        }
        
        if (isset($data['quantity'])) {
            $item->setQuantity($data['quantity']);
        }
        
        if (isset($data['location'])) {
            $item->setLocation($data['location']);
        }
        
        if (isset($data['size'])) {
            $item->setSize($data['size']);
        }
        
        if (isset($data['harvestDate'])) {
            $item->setHarvestDate(new \DateTime($data['harvestDate']));
        }
        
        if (isset($data['notes'])) {
            $item->setNotes($data['notes']);
        }
        
        $this->entityManager->flush();
        
        return $item;
    }
    
    /**
     * Supprime un élément d'inventaire
     * 
     * @param string $id
     * @return void
     * @throws NotFoundHttpException
     */
    public function deleteItem(string $id): void
    {
        $item = $this->getItemById($id);
        
        $this->entityManager->remove($item);
        $this->entityManager->flush();
    }
    
    /**
     * Transfère des huîtres depuis l'inventaire vers une table
     * Respecte le code couleur par type (triploïdes en bordeaux, diploïdes en bleu)
     * 
     * @param string $itemId
     * @param string $tableId
     * @param int $quantity
     * @param bool $standardFill
     * @return array
     * @throws NotFoundHttpException
     * @throws \InvalidArgumentException
     */
    public function transferToTable(string $itemId, string $tableId, int $quantity, bool $standardFill = true): array
    {
        $item = $this->getItemById($itemId);
        $table = $this->tableRepository->find($tableId);
        
        if (!$table) {
            throw new NotFoundHttpException('Table non trouvée');
        }
        
        // Vérifier la cohérence des types (triploïde/diploïde)
        if ($item->getType() !== $table->getType()) {
            throw new \InvalidArgumentException('Le type d\'huître ne correspond pas au type de la table');
        }
        
        // Vérifier la quantité disponible
        if ($item->getQuantity() < $quantity) {
            throw new \InvalidArgumentException('Quantité insuffisante dans l\'inventaire');
        }
        
        // Récupérer les cellules de la table
        $cells = $this->cellRepository->findByTableOrderedByPosition($table);
        
        if ($standardFill) {
            // Remplir les 6 premières cellules (60%) selon la règle standard
            $cellsToFill = array_slice($cells, 0, 6);
        } else {
            // Remplir toutes les cellules vides
            $cellsToFill = array_filter($cells, function ($cell) {
                return $cell->getStatus() === 'empty';
            });
        }
        
        if (empty($cellsToFill)) {
            throw new \InvalidArgumentException('Aucune cellule disponible pour le transfert');
        }
        
        $quantityPerCell = ceil($quantity / count($cellsToFill));
        $filledCells = [];
        
        foreach ($cellsToFill as $cell) {
            $cell->setStatus('filled');
            $cell->setQuantity($quantityPerCell);
            $filledCells[] = $cell;
        }
        
        // Déduire la quantité de l'inventaire
        $item->setQuantity($item->getQuantity() - $quantity);
        
        $this->entityManager->flush();
        
        return [
            'filledCells' => $filledCells,
            'remainingQuantity' => $item->getQuantity()
        ];
    }
    
    /**
     * Récolte des huîtres depuis une table vers l'inventaire
     * 
     * @param string $tableId
     * @param array $cellIds
     * @param string $targetItemId
     * @return array
     * @throws NotFoundHttpException
     */
    public function harvestFromTable(string $tableId, array $cellIds, ?string $targetItemId = null): array
    {
        $table = $this->tableRepository->find($tableId);
        
        if (!$table) {
            throw new NotFoundHttpException('Table non trouvée');
        }
        
        $harvestedQuantity = 0;
        $harvestedCells = [];
        
        foreach ($cellIds as $cellId) {
            $cell = $this->cellRepository->find($cellId);
            
            if ($cell && $cell->getTable()->getId() === $tableId && $cell->getStatus() === 'filled') {
                $harvestedQuantity += $cell->getQuantity();
                $cell->setStatus('harvested');
                $cell->setQuantity(0);
                $harvestedCells[] = $cell;
            }
        }
        
        // Ajouter la quantité récoltée à l'inventaire
        if ($harvestedQuantity > 0) {
            if ($targetItemId) {
                // Ajouter à un élément d'inventaire existant
                $targetItem = $this->getItemById($targetItemId);
                $targetItem->setQuantity($targetItem->getQuantity() + $harvestedQuantity);
            } else {
                // Créer un nouvel élément d'inventaire
                $harvestName = 'Récolte ' . (new \DateTime())->format('d/m/Y');
                $item = new InventoryItem();
                $item->setName($harvestName);
                $item->setType($table->getType());
                $item->setQuantity($harvestedQuantity);
                $item->setHarvestDate(new \DateTime());
                $item->setNotes('Récolté depuis la table ' . $table->getName());
                
                $this->entityManager->persist($item);
            }
        }
        
        $this->entityManager->flush();
        
        return [
            'harvestedQuantity' => $harvestedQuantity,
            'harvestedCells' => $harvestedCells
        ];
    }
    
    /**
     * Récupère les statistiques d'inventaire
     * 
     * @return array
     */
    public function getInventoryStats(): array
    {
        return $this->inventoryRepository->getInventoryStats();
    }
}
