<?php

namespace App\Controller\Inventory;

use App\Service\Inventory\InventoryService;
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
     * @Route("/products", name="products_list", methods={"GET"})
     */
    public function listProducts(Request $request): JsonResponse
    {
        $query = $request->query->get('q');
        if ($query) {
            $products = $this->inventoryService->searchProducts($query);
        } else {
            $products = $this->inventoryService->getLowStockProducts();
        }

        return $this->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * @Route("/products", name="products_create", methods={"POST"})
     */
    public function createProduct(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $product = $this->inventoryService->addProduct($data);
            return $this->json([
                'success' => true,
                'message' => 'Produit ajouté avec succès',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * @Route("/products/{id}", name="products_update", methods={"PUT"})
     */
    public function updateProduct(string $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $product = $this->inventoryService->updateProduct($id, $data);
            return $this->json([
                'success' => true,
                'message' => 'Produit mis à jour avec succès',
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * @Route("/products/{id}", name="products_delete", methods={"DELETE"})
     */
    public function deleteProduct(string $id): JsonResponse
    {
        try {
            $this->inventoryService->removeProduct($id);
            return $this->json([
                'success' => true,
                'message' => 'Produit supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * @Route("/storage-locations", name="locations_list", methods={"GET"})
     */
    public function listStorageLocations(): JsonResponse
    {
        $locations = $this->inventoryService->getAvailableStorageLocations();
        return $this->json([
            'success' => true,
            'data' => $locations
        ]);
    }

    /**
     * @Route("/storage-locations", name="locations_create", methods={"POST"})
     */
    public function createStorageLocation(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $location = $this->inventoryService->addStorageLocation($data);
            return $this->json([
                'success' => true,
                'message' => 'Emplacement de stockage ajouté avec succès',
                'data' => $location
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * @Route("/storage-locations/{id}", name="locations_update", methods={"PUT"})
     */
    public function updateStorageLocation(string $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {
            $location = $this->inventoryService->updateStorageLocation($id, $data);
            return $this->json([
                'success' => true,
                'message' => 'Emplacement de stockage mis à jour avec succès',
                'data' => $location
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * @Route("/storage-locations/{id}", name="locations_delete", methods={"DELETE"})
     */
    public function deleteStorageLocation(string $id): JsonResponse
    {
        try {
            $this->inventoryService->removeStorageLocation($id);
            return $this->json([
                'success' => true,
                'message' => 'Emplacement de stockage supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * @Route("/dashboard", name="dashboard", methods={"GET"})
     */
    public function getDashboardData(): JsonResponse
    {
        $lowStock = $this->inventoryService->getLowStockProducts();
        $expiringProducts = $this->inventoryService->getExpiringProducts(
            new \DateTime('+7 days')
        );
        $availableLocations = $this->inventoryService->getAvailableStorageLocations();

        return $this->json([
            'success' => true,
            'data' => [
                'lowStock' => $lowStock,
                'expiringProducts' => $expiringProducts,
                'availableLocations' => $availableLocations
            ]
        ]);
    }
}
