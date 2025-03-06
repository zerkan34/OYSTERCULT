<?php

namespace App\Controller;

use App\Service\InventoryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/inventory", name="api_inventory_")
 */
class InventoryController extends AbstractController
{
    private $inventoryService;
    
    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }
    
    /**
     * @Route("", name="get_all", methods={"GET"})
     */
    public function getAllItems(): JsonResponse
    {
        $items = $this->inventoryService->getAllItems();
        
        return $this->json([
            'success' => true,
            'data' => $items
        ]);
    }
    
    /**
     * @Route("/by-type/{type}", name="get_by_type", methods={"GET"})
     */
    public function getItemsByType(string $type): JsonResponse
    {
        if (!in_array($type, ['triploid', 'diploid'])) {
            return $this->json([
                'success' => false,
                'message' => 'Le type doit être triploid ou diploid'
            ], 400);
        }
        
        $items = $this->inventoryService->getItemsByType($type);
        
        return $this->json([
            'success' => true,
            'data' => $items
        ]);
    }
    
    /**
     * @Route("/{id}", name="get_one", methods={"GET"})
     */
    public function getItemById(string $id): JsonResponse
    {
        try {
            $item = $this->inventoryService->getItemById($id);
            
            return $this->json([
                'success' => true,
                'data' => $item
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
    
    /**
     * @Route("", name="create", methods={"POST"})
     */
    public function createItem(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Validation des données
        if (!isset($data['name']) || !isset($data['type'])) {
            return $this->json([
                'success' => false,
                'message' => 'Le nom et le type sont requis'
            ], 400);
        }
        
        if (!in_array($data['type'], ['triploid', 'diploid'])) {
            return $this->json([
                'success' => false,
                'message' => 'Le type doit être triploid ou diploid'
            ], 400);
        }
        
        try {
            $item = $this->inventoryService->createItem($data);
            
            return $this->json([
                'success' => true,
                'message' => 'Élément d\'inventaire créé avec succès',
                'data' => $item
            ], 201);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    /**
     * @Route("/{id}", name="update", methods={"PUT"})
     */
    public function updateItem(string $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        try {
            $item = $this->inventoryService->updateItem($id, $data);
            
            return $this->json([
                'success' => true,
                'message' => 'Élément d\'inventaire mis à jour avec succès',
                'data' => $item
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    /**
     * @Route("/{id}", name="delete", methods={"DELETE"})
     */
    public function deleteItem(string $id): JsonResponse
    {
        try {
            $this->inventoryService->deleteItem($id);
            
            return $this->json([
                'success' => true,
                'message' => 'Élément d\'inventaire supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
    
    /**
     * @Route("/transfer-to-table", name="transfer_to_table", methods={"POST"})
     */
    public function transferToTable(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Validation des données
        if (!isset($data['itemId']) || !isset($data['tableId']) || !isset($data['quantity'])) {
            return $this->json([
                'success' => false,
                'message' => 'L\'identifiant de l\'élément d\'inventaire, l\'identifiant de la table et la quantité sont requis'
            ], 400);
        }
        
        if (!is_numeric($data['quantity']) || $data['quantity'] <= 0) {
            return $this->json([
                'success' => false,
                'message' => 'La quantité doit être un nombre positif'
            ], 400);
        }
        
        $standardFill = isset($data['standardFill']) ? (bool) $data['standardFill'] : true;
        
        try {
            $result = $this->inventoryService->transferToTable(
                $data['itemId'],
                $data['tableId'],
                (int) $data['quantity'],
                $standardFill
            );
            
            return $this->json([
                'success' => true,
                'message' => 'Transfert effectué avec succès',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    /**
     * @Route("/harvest-from-table", name="harvest_from_table", methods={"POST"})
     */
    public function harvestFromTable(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Validation des données
        if (!isset($data['tableId']) || !isset($data['cellIds']) || !is_array($data['cellIds'])) {
            return $this->json([
                'success' => false,
                'message' => 'L\'identifiant de la table et les identifiants des cellules sont requis'
            ], 400);
        }
        
        try {
            $result = $this->inventoryService->harvestFromTable(
                $data['tableId'],
                $data['cellIds'],
                $data['targetItemId'] ?? null
            );
            
            return $this->json([
                'success' => true,
                'message' => 'Récolte effectuée avec succès',
                'data' => $result
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    /**
     * @Route("/stats", name="get_stats", methods={"GET"})
     */
    public function getInventoryStats(): JsonResponse
    {
        $stats = $this->inventoryService->getInventoryStats();
        
        return $this->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
