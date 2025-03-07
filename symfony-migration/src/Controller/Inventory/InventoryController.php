<?php

namespace App\Controller\Inventory;

use App\Entity\Inventory\Product;
use App\Service\Inventory\InventoryService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
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
     * @Route("/locations", name="locations_list", methods={"GET"})
     */
    public function listLocations(): JsonResponse
    {
        $locations = $this->inventoryService->getAllLocations();
        
        return $this->json([
            'success' => true,
            'data' => $locations
        ]);
    }
    
    /**
     * @Route("/locations/{id}", name="locations_get", methods={"GET"})
     */
    public function getLocation(string $id): JsonResponse
    {
        try {
            $location = $this->inventoryService->getLocationById($id);
            return $this->json([
                'success' => true,
                'data' => $location
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
    
    /**
     * @Route("/locations", name="locations_create", methods={"POST"})
     */
    public function createLocation(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        try {
            $location = $this->inventoryService->addLocation($data);
            return $this->json([
                'success' => true,
                'message' => 'Emplacement ajouté avec succès',
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

    #[Route('/', name: 'app_inventory_index', methods: ['GET'])]
    public function index(): Response
    {
        // Données simulées pour l'affichage (à remplacer par les données réelles de la base de données)
        $storageLocations = [
            'Frigo 1' => [
                ['id' => 'F1-01', 'name' => 'Huîtres Fines de Claire', 'quantity' => '50kg', 'arrivalDate' => '2025-02-25', 'expiryDate' => '2025-03-10'],
                ['id' => 'F1-02', 'name' => 'Moules de Bouchot', 'quantity' => '25kg', 'arrivalDate' => '2025-03-01', 'expiryDate' => '2025-03-08'],
                ['id' => 'F1-03', 'name' => 'Palourdes', 'quantity' => '15kg', 'arrivalDate' => '2025-02-28', 'expiryDate' => '2025-03-07']
            ],
            'Frigo 2' => [
                ['id' => 'F2-01', 'name' => 'Huîtres Spéciales', 'quantity' => '30kg', 'arrivalDate' => '2025-02-27', 'expiryDate' => '2025-03-12'],
                ['id' => 'F2-02', 'name' => 'Crevettes Royales', 'quantity' => '10kg', 'arrivalDate' => '2025-03-01', 'expiryDate' => '2025-03-05']
            ],
            'Congélateur 1' => [
                ['id' => 'C1-01', 'name' => 'Saumon Frais', 'quantity' => '40kg', 'arrivalDate' => '2025-01-15', 'expiryDate' => '2025-04-15'],
                ['id' => 'C1-02', 'name' => 'Huîtres Surgelées', 'quantity' => '60kg', 'arrivalDate' => '2025-02-10', 'expiryDate' => '2025-08-10'],
                ['id' => 'C1-03', 'name' => 'Coquilles St-Jacques', 'quantity' => '35kg', 'arrivalDate' => '2025-02-20', 'expiryDate' => '2025-05-20']
            ],
            'Congélateur 2' => [
                ['id' => 'C2-01', 'name' => 'Filets de Poisson', 'quantity' => '25kg', 'arrivalDate' => '2025-02-15', 'expiryDate' => '2025-06-15'],
                ['id' => 'C2-02', 'name' => 'Fruits de Mer', 'quantity' => '20kg', 'arrivalDate' => '2025-02-25', 'expiryDate' => '2025-05-25']
            ],
            'Remise' => [
                ['id' => 'R-01', 'name' => 'Matériel d\'emballage', 'quantity' => '200 unités', 'arrivalDate' => '2025-01-10', 'expiryDate' => 'N/A'],
                ['id' => 'R-02', 'name' => 'Sachets biodégradables', 'quantity' => '500 unités', 'arrivalDate' => '2025-02-01', 'expiryDate' => 'N/A']
            ],
            'Cave' => [
                ['id' => 'CA-01', 'name' => 'Vin blanc', 'quantity' => '50 bouteilles', 'arrivalDate' => '2024-10-15', 'expiryDate' => '2026-10-15'],
                ['id' => 'CA-02', 'name' => 'Huîtres affinées', 'quantity' => '100kg', 'arrivalDate' => '2025-02-20', 'expiryDate' => '2025-04-20']
            ]
        ];

        // Données pour les tables ostréicoles
        $oysterTables = [
            ['id' => 'T1', 'name' => 'Table A1', 'type' => 'Plates N°3', 'occupation' => 85, 'harvestDate' => '15/06/25'],
            ['id' => 'T2', 'name' => 'Table A2', 'type' => 'Creuses N°2', 'occupation' => 75, 'harvestDate' => '20/06/25'],
            ['id' => 'T3', 'name' => 'Table B1', 'type' => 'Plates N°4', 'occupation' => 90, 'harvestDate' => '01/07/25'],
            ['id' => 'T4', 'name' => 'Table B2', 'type' => 'Creuses N°3', 'occupation' => 65, 'harvestDate' => '05/07/25']
        ];

        // Données pour les bassins de purification
        $purificationPools = [
            ['id' => 'P1', 'name' => 'Bassin A1', 'type' => 'Purification', 'capacity' => 1000, 'currentLoad' => 800],
            ['id' => 'P2', 'name' => 'Bassin A2', 'type' => 'Purification', 'capacity' => 1000, 'currentLoad' => 650],
            ['id' => 'P3', 'name' => 'Bassin B1', 'type' => 'Stockage', 'capacity' => 1500, 'currentLoad' => 1350]
        ];

        return $this->render('inventory/index.html.twig', [
            'storageLocations' => $storageLocations,
            'oysterTables' => $oysterTables,
            'purificationPools' => $purificationPools,
        ]);
    }
}
