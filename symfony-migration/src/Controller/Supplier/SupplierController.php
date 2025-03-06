<?php

namespace App\Controller\Supplier;

use App\Service\Supplier\SupplierService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/suppliers", name="api_suppliers_")
 */
class SupplierController extends AbstractController
{
    private $supplierService;

    public function __construct(SupplierService $supplierService)
    {
        $this->supplierService = $supplierService;
    }

    /**
     * @Route("", name="list", methods={"GET"})
     */
    public function getAllSuppliers(): JsonResponse
    {
        $suppliers = $this->supplierService->getAllSuppliers();

        return $this->json([
            'success' => true,
            'count' => count($suppliers),
            'data' => $suppliers
        ]);
    }

    /**
     * @Route("/friends", name="friends", methods={"GET"})
     */
    public function getFriendSuppliers(): JsonResponse
    {
        $suppliers = $this->supplierService->getFriendSuppliers();

        return $this->json([
            'success' => true,
            'count' => count($suppliers),
            'data' => $suppliers
        ]);
    }

    /**
     * @Route("/{id}", name="get", methods={"GET"})
     */
    public function getSupplier(string $id): JsonResponse
    {
        $supplier = $this->supplierService->getSupplierById($id);

        if (!$supplier) {
            return $this->json([
                'success' => false,
                'message' => 'Fournisseur non trouvé'
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'data' => $supplier
        ]);
    }

    /**
     * @Route("", name="create", methods={"POST"})
     */
    public function createSupplier(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $supplier = $this->supplierService->createSupplier($data);

            return $this->json([
                'success' => true,
                'message' => 'Fournisseur créé avec succès',
                'data' => $supplier
            ], Response::HTTP_CREATED);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @Route("/{id}", name="update", methods={"PUT"})
     */
    public function updateSupplier(string $id, Request $request): JsonResponse
    {
        try {
            $supplier = $this->supplierService->getSupplierById($id);
            if (!$supplier) {
                return $this->json([
                    'success' => false,
                    'message' => 'Fournisseur non trouvé'
                ], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);
            $supplier = $this->supplierService->updateSupplier($supplier, $data);

            return $this->json([
                'success' => true,
                'message' => 'Fournisseur mis à jour avec succès',
                'data' => $supplier
            ]);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @Route("/{id}", name="delete", methods={"DELETE"})
     */
    public function deleteSupplier(string $id): JsonResponse
    {
        $supplier = $this->supplierService->getSupplierById($id);
        if (!$supplier) {
            return $this->json([
                'success' => false,
                'message' => 'Fournisseur non trouvé'
            ], Response::HTTP_NOT_FOUND);
        }

        try {
            $this->supplierService->deleteSupplier($supplier);

            return $this->json([
                'success' => true,
                'message' => 'Fournisseur supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Impossible de supprimer le fournisseur'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @Route("/{id}/products", name="products", methods={"GET"})
     */
    public function getSupplierProducts(string $id): JsonResponse
    {
        $supplier = $this->supplierService->getSupplierWithProducts($id);
        if (!$supplier) {
            return $this->json([
                'success' => false,
                'message' => 'Fournisseur non trouvé'
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'data' => $supplier->getProducts()
        ]);
    }

    /**
     * @Route("/{id}/orders", name="orders", methods={"GET"})
     */
    public function getSupplierOrders(string $id): JsonResponse
    {
        $supplier = $this->supplierService->getSupplierWithOrders($id);
        if (!$supplier) {
            return $this->json([
                'success' => false,
                'message' => 'Fournisseur non trouvé'
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'data' => $supplier->getOrders()
        ]);
    }
}
