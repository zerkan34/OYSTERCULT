<?php

namespace App\Controller\Supplier;

use App\Service\Supplier\SupplierProductService;
use App\Service\Supplier\SupplierService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/suppliers/{supplierId}/products", name="api_supplier_products_")
 */
class SupplierProductController extends AbstractController
{
    private $supplierService;
    private $productService;

    public function __construct(
        SupplierService $supplierService,
        SupplierProductService $productService
    ) {
        $this->supplierService = $supplierService;
        $this->productService = $productService;
    }

    /**
     * @Route("", name="list", methods={"GET"})
     */
    public function getProducts(string $supplierId): JsonResponse
    {
        $products = $this->productService->getSupplierProducts($supplierId);

        return $this->json([
            'success' => true,
            'count' => count($products),
            'data' => $products
        ]);
    }

    /**
     * @Route("", name="create", methods={"POST"})
     */
    public function createProduct(string $supplierId, Request $request): JsonResponse
    {
        try {
            $supplier = $this->supplierService->getSupplierById($supplierId);
            if (!$supplier) {
                return $this->json([
                    'success' => false,
                    'message' => 'Fournisseur non trouvé'
                ], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);
            $product = $this->productService->createProduct($supplier, $data);

            return $this->json([
                'success' => true,
                'message' => 'Produit créé avec succès',
                'data' => $product
            ], Response::HTTP_CREATED);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @Route("/{productId}", name="update", methods={"PUT"})
     */
    public function updateProduct(
        string $supplierId,
        string $productId,
        Request $request
    ): JsonResponse {
        try {
            $products = $this->productService->getSupplierProducts($supplierId);
            $product = null;
            foreach ($products as $p) {
                if ($p->getId() === $productId) {
                    $product = $p;
                    break;
                }
            }

            if (!$product) {
                return $this->json([
                    'success' => false,
                    'message' => 'Produit non trouvé'
                ], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);
            $product = $this->productService->updateProduct($product, $data);

            return $this->json([
                'success' => true,
                'message' => 'Produit mis à jour avec succès',
                'data' => $product
            ]);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @Route("/{productId}", name="delete", methods={"DELETE"})
     */
    public function deleteProduct(string $supplierId, string $productId): JsonResponse
    {
        $products = $this->productService->getSupplierProducts($supplierId);
        $product = null;
        foreach ($products as $p) {
            if ($p->getId() === $productId) {
                $product = $p;
                break;
            }
        }

        if (!$product) {
            return $this->json([
                'success' => false,
                'message' => 'Produit non trouvé'
            ], Response::HTTP_NOT_FOUND);
        }

        try {
            $this->productService->deleteProduct($product);

            return $this->json([
                'success' => true,
                'message' => 'Produit supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Impossible de supprimer le produit'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
