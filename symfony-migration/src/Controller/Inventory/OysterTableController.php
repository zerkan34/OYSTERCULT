<?php

namespace App\Controller\Inventory;

use App\Service\Inventory\OysterTableService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/inventory/tables", name="api_inventory_tables_")
 */
class OysterTableController extends AbstractController
{
    private $oysterTableService;

    public function __construct(OysterTableService $oysterTableService)
    {
        $this->oysterTableService = $oysterTableService;
    }

    /**
     * @Route("", name="list", methods={"GET"})
     */
    public function listTables(Request $request): JsonResponse
    {
        $query = $request->query->get('q');
        if ($query) {
            $tables = $this->oysterTableService->searchTables($query);
        } else {
            $tables = $this->oysterTableService->getAvailableTables();
        }

        return $this->json([
            'success' => true,
            'data' => $tables
        ]);
    }

    /**
     * @Route("", name="create", methods={"POST"})
     */
    public function createTable(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $table = $this->oysterTableService->createTable($data);
            return $this->json([
                'success' => true,
                'message' => 'Table créée avec succès',
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
     * @Route("/{id}", name="update", methods={"PUT"})
     */
    public function updateTable(string $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $table = $this->oysterTableService->updateTable($id, $data);
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
     * @Route("/{id}/cells/{cellId}", name="update_cell", methods={"PUT"})
     */
    public function updateCell(string $id, string $cellId, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $table = $this->oysterTableService->updateCell($id, $cellId, $data);
            return $this->json([
                'success' => true,
                'message' => 'Cellule mise à jour avec succès',
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
     * @Route("/{id}/cells/{cellId}", name="remove_cell", methods={"DELETE"})
     */
    public function removeCell(string $id, string $cellId): JsonResponse
    {
        try {
            $table = $this->oysterTableService->removeCell($id, $cellId);
            return $this->json([
                'success' => true,
                'message' => 'Cellule supprimée avec succès',
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
     * @Route("/{id}/maintenance", name="maintenance", methods={"POST"})
     */
    public function performMaintenance(string $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $table = $this->oysterTableService->performMaintenance($id, $data);
            return $this->json([
                'success' => true,
                'message' => 'Maintenance effectuée avec succès',
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
     * @Route("/maintenance-due", name="maintenance_due", methods={"GET"})
     */
    public function getTablesDueMaintenance(): JsonResponse
    {
        $threshold = new \DateTime('-30 days');
        $tables = $this->oysterTableService->getTablesDueMaintenance($threshold);

        return $this->json([
            'success' => true,
            'data' => $tables
        ]);
    }
}
