<?php

namespace App\Controller;

use App\Entity\Table;
use App\Service\TableService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * @Route("/api/tables", name="api_tables_")
 */
class TableController extends AbstractController
{
    private $tableService;
    private $validator;
    
    public function __construct(TableService $tableService, ValidatorInterface $validator)
    {
        $this->tableService = $tableService;
        $this->validator = $validator;
    }

    /**
     * @Route("", name="get_all", methods={"GET"})
     */
    public function getAllTables(): JsonResponse
    {
        $tables = $this->tableService->getAllTables();
        
        return $this->json([
            'success' => true,
            'data' => $tables
        ]);
    }

    /**
     * @Route("/by-type/{type}", name="get_by_type", methods={"GET"})
     */
    public function getTablesByType(string $type): JsonResponse
    {
        if (!in_array($type, ['triploid', 'diploid'])) {
            return $this->json([
                'success' => false,
                'message' => 'Le type doit être triploid ou diploid'
            ], 400);
        }
        
        $tables = $this->tableService->getTablesByType($type);
        
        return $this->json([
            'success' => true,
            'data' => $tables
        ]);
    }

    /**
     * @Route("/{id}", name="get_one", methods={"GET"})
     */
    public function getTableById(string $id): JsonResponse
    {
        try {
            $table = $this->tableService->getTableById($id);
            
            return $this->json([
                'success' => true,
                'data' => $table
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
    public function createTable(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Validation des données
        if (!isset($data['name']) || !isset($data['type']) || !isset($data['position']) || 
            !isset($data['rows']) || !isset($data['columns'])) {
            return $this->json([
                'success' => false,
                'message' => 'Données incomplètes. Nom, type, position, lignes et colonnes sont requis.'
            ], 400);
        }
        
        if (!in_array($data['type'], ['triploid', 'diploid'])) {
            return $this->json([
                'success' => false,
                'message' => 'Le type doit être triploid ou diploid'
            ], 400);
        }
        
        try {
            $table = $this->tableService->createTable($data);
            
            return $this->json([
                'success' => true,
                'message' => 'Table créée avec succès',
                'data' => $table
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
    public function updateTable(string $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        try {
            $table = $this->tableService->updateTable($id, $data);
            
            return $this->json([
                'success' => true,
                'message' => 'Table mise à jour avec succès',
                'data' => $table
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
    public function deleteTable(string $id): JsonResponse
    {
        try {
            $this->tableService->deleteTable($id);
            
            return $this->json([
                'success' => true,
                'message' => 'Table supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    /**
     * @Route("/{id}/cells", name="get_cells", methods={"GET"})
     */
    public function getTableCells(string $id): JsonResponse
    {
        try {
            $table = $this->tableService->getTableById($id);
            $cells = $table->getCells();
            
            // Trier les cellules selon la règle de numérotation : gauche à droite, haut en bas
            $cellsArray = $cells->toArray();
            usort($cellsArray, function($a, $b) {
                if ($a->getRowIndex() === $b->getRowIndex()) {
                    return $a->getColumnIndex() <=> $b->getColumnIndex();
                }
                return $a->getRowIndex() <=> $b->getRowIndex();
            });
            
            return $this->json([
                'success' => true,
                'data' => $cellsArray
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
    
    /**
     * @Route("/{id}/fill", name="fill", methods={"POST"})
     */
    public function fillTable(string $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['quantity']) || !is_numeric($data['quantity']) || $data['quantity'] <= 0) {
            return $this->json([
                'success' => false,
                'message' => 'La quantité doit être un nombre positif'
            ], 400);
        }
        
        $standardFill = isset($data['standardFill']) ? (bool) $data['standardFill'] : true;
        
        try {
            $filledCells = $this->tableService->fillTable($id, (int) $data['quantity'], $standardFill);
            
            return $this->json([
                'success' => true,
                'message' => 'Table remplie avec succès',
                'data' => [
                    'filledCellsCount' => count($filledCells),
                    'cells' => $filledCells
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    /**
     * @Route("/{id}/empty", name="empty", methods={"POST"})
     */
    public function emptyTable(string $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $options = [];
        
        if (isset($data['emptyAll'])) {
            $options['emptyAll'] = (bool) $data['emptyAll'];
        }
        
        if (isset($data['cellIds']) && is_array($data['cellIds'])) {
            $options['cellIds'] = $data['cellIds'];
        }
        
        try {
            $emptiedCells = $this->tableService->emptyTable($id, $options);
            
            return $this->json([
                'success' => true,
                'message' => 'Cellules vidées avec succès',
                'data' => [
                    'emptiedCellsCount' => count($emptiedCells),
                    'cells' => $emptiedCells
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    /**
     * @Route("/{tableId}/cells/{cellId}", name="update_cell", methods={"PATCH"})
     */
    public function updateCellStatus(string $tableId, string $cellId, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['status']) || !in_array($data['status'], ['empty', 'filled', 'harvested', 'maintenance'])) {
            return $this->json([
                'success' => false,
                'message' => 'Statut invalide. Doit être empty, filled, harvested ou maintenance.'
            ], 400);
        }
        
        try {
            $cell = $this->tableService->updateCellStatus($tableId, $cellId, $data);
            
            return $this->json([
                'success' => true,
                'message' => 'Statut de la cellule mis à jour',
                'data' => $cell
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    /**
     * @Route("/{id}/stats", name="get_stats", methods={"GET"})
     */
    public function getTableStats(string $id): JsonResponse
    {
        try {
            $stats = $this->tableService->getTableStats($id);
            
            return $this->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
}
