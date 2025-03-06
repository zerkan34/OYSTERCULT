<?php

namespace App\Controller;

use App\Service\SupplierService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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
     * @Route("", name="get_all", methods={"GET"})
     */
    public function getAllSuppliers(Request $request): JsonResponse
    {
        $includeProducts = $request->query->getBoolean('includeProducts', false);
        $suppliers = $this->supplierService->getAllSuppliers($includeProducts);
        
        return $this->json([
            'success' => true,
            'data' => $suppliers
        ]);
    }
    
    /**
     * @Route("/{id}", name="get_one", methods={"GET"})
     */
    public function getSupplierById(string $id, Request $request): JsonResponse
    {
        $includeProducts = $request->query->getBoolean('includeProducts', false);
        
        try {
            $supplier = $this->supplierService->getSupplierById($id, $includeProducts);
            
            return $this->json([
                'success' => true,
                'data' => $supplier
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
    public function createSupplier(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Validation des données
        if (!isset($data['name'])) {
            return $this->json([
                'success' => false,
                'message' => 'Le nom est requis'
            ], 400);
        }
        
        try {
            $supplier = $this->supplierService->createSupplier($data);
            
            return $this->json([
                'success' => true,
                'message' => 'Fournisseur créé avec succès',
                'data' => $supplier
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
    public function updateSupplier(string $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        try {
            $supplier = $this->supplierService->updateSupplier($id, $data);
            
            return $this->json([
                'success' => true,
                'message' => 'Fournisseur mis à jour avec succès',
                'data' => $supplier
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
    public function deleteSupplier(string $id): JsonResponse
    {
        try {
            $this->supplierService->deleteSupplier($id);
            
            return $this->json([
                'success' => true,
                'message' => 'Fournisseur supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
    
    /**
     * @Route("/search/{term}", name="search", methods={"GET"})
     */
    public function searchSuppliers(string $term): JsonResponse
    {
        $suppliers = $this->supplierService->searchSuppliers($term);
        
        return $this->json([
            'success' => true,
            'data' => $suppliers
        ]);
    }
    
    /**
     * @Route("/{supplierId}/products", name="get_products", methods={"GET"})
     */
    public function getSupplierProducts(string $supplierId): JsonResponse
    {
        try {
            $products = $this->supplierService->getSupplierProducts($supplierId);
            
            return $this->json([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
    
    /**
     * @Route("/{supplierId}/products", name="create_product", methods={"POST"})
     */
    public function createProduct(string $supplierId, Request $request): JsonResponse
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
            $product = $this->supplierService->createProduct($supplierId, $data);
            
            return $this->json([
                'success' => true,
                'message' => 'Produit créé avec succès',
                'data' => $product
            ], 201);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }
    
    /**
     * @Route("/products/{id}", name="get_product", methods={"GET"})
     */
    public function getProductById(string $id): JsonResponse
    {
        try {
            $product = $this->supplierService->getProductById($id);
            
            return $this->json([
                'success' => true,
                'data' => $product
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
    
    /**
     * @Route("/products/{id}", name="update_product", methods={"PUT"})
     */
    public function updateProduct(string $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        try {
            $product = $this->supplierService->updateProduct($id, $data);
            
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
     * @Route("/products/{id}", name="delete_product", methods={"DELETE"})
     */
    public function deleteProduct(string $id): JsonResponse
    {
        try {
            $this->supplierService->deleteProduct($id);
            
            return $this->json([
                'success' => true,
                'message' => 'Produit supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
    
    /**
     * @Route("/products/by-type/{type}", name="get_products_by_type", methods={"GET"})
     */
    public function getProductsByType(string $type): JsonResponse
    {
        if (!in_array($type, ['triploid', 'diploid'])) {
            return $this->json([
                'success' => false,
                'message' => 'Le type doit être triploid ou diploid'
            ], 400);
        }
        
        $products = $this->supplierService->getProductsByType($type);
        
        return $this->json([
            'success' => true,
            'data' => $products
        ]);
    }
    
    /**
     * @Route("/products/available", name="get_available_products", methods={"GET"})
     */
    public function getAvailableProducts(): JsonResponse
    {
        $products = $this->supplierService->getAvailableProducts();
        
        return $this->json([
            'success' => true,
            'data' => $products
        ]);
    }
    
    /**
     * @Route("/products/search/{term}", name="search_products", methods={"GET"})
     */
    public function searchProducts(string $term): JsonResponse
    {
        $products = $this->supplierService->searchProducts($term);
        
        return $this->json([
            'success' => true,
            'data' => $products
        ]);
    }
}
