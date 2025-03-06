<?php

namespace App\Controller\Inventory;

use App\Service\Inventory\PurificationPoolService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/inventory/pools", name="api_inventory_pools_")
 */
class PurificationPoolController extends AbstractController
{
    private $purificationPoolService;

    public function __construct(PurificationPoolService $purificationPoolService)
    {
        $this->purificationPoolService = $purificationPoolService;
    }

    /**
     * @Route("", name="list", methods={"GET"})
     */
    public function listPools(Request $request): JsonResponse
    {
        $query = $request->query->get('q');
        if ($query) {
            $pools = $this->purificationPoolService->searchPools($query);
        } else {
            $pools = $this->purificationPoolService->getAvailablePools();
        }

        return $this->json([
            'success' => true,
            'data' => $pools
        ]);
    }

    /**
     * @Route("", name="create", methods={"POST"})
     */
    public function createPool(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $pool = $this->purificationPoolService->createPool($data);
            return $this->json([
                'success' => true,
                'message' => 'Bassin créé avec succès',
                'data' => $pool
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
    public function updatePool(string $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $pool = $this->purificationPoolService->updatePool($id, $data);
            return $this->json([
                'success' => true,
                'message' => 'Bassin mis à jour avec succès',
                'data' => $pool
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
            $pool = $this->purificationPoolService->performMaintenance($id, $data);
            return $this->json([
                'success' => true,
                'message' => 'Maintenance effectuée avec succès',
                'data' => $pool
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * @Route("/{id}/water-parameters", name="update_parameters", methods={"PUT"})
     */
    public function updateWaterParameters(string $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $pool = $this->purificationPoolService->updateWaterParameters($id, $data);
            return $this->json([
                'success' => true,
                'message' => 'Paramètres de l\'eau mis à jour avec succès',
                'data' => $pool
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * @Route("/{id}/uv-lamp", name="increment_uv_hours", methods={"POST"})
     */
    public function incrementUvLampHours(string $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $hours = $data['hours'] ?? 1;

        try {
            $pool = $this->purificationPoolService->incrementUvLampHours($id, $hours);
            return $this->json([
                'success' => true,
                'message' => 'Heures UV mises à jour avec succès',
                'data' => $pool
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
    public function getPoolsDueMaintenance(): JsonResponse
    {
        $threshold = new \DateTime('-7 days');
        $pools = $this->purificationPoolService->getPoolsDueMaintenance($threshold);

        return $this->json([
            'success' => true,
            'data' => $pools
        ]);
    }

    /**
     * @Route("/uv-lamp-check", name="uv_lamp_check", methods={"GET"})
     */
    public function getPoolsNeedingUvLampCheck(): JsonResponse
    {
        $pools = $this->purificationPoolService->getPoolsByUvLampHours(5000);

        return $this->json([
            'success' => true,
            'data' => $pools
        ]);
    }
}
