<?php

namespace App\Service;

use App\Entity\Supplier\Supplier;
use App\Entity\Supplier\SupplierProduct;
use App\Repository\Supplier\SupplierRepository;
use App\Repository\Supplier\SupplierProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class SupplierService
{
    private $entityManager;
    private $supplierRepository;
    private $productRepository;
    
    public function __construct(
        EntityManagerInterface $entityManager,
        SupplierRepository $supplierRepository,
        SupplierProductRepository $productRepository
    ) {
        $this->entityManager = $entityManager;
        $this->supplierRepository = $supplierRepository;
        $this->productRepository = $productRepository;
    }
    
    /**
     * Récupère tous les fournisseurs
     * 
     * @param bool $includeProducts
     * @return Supplier[]
     */
    public function getAllSuppliers(bool $includeProducts = false): array
    {
        if ($includeProducts) {
            return $this->supplierRepository->findAllWithProducts();
        }
        
        return $this->supplierRepository->findAllSorted();
    }
    
    /**
     * Récupère un fournisseur par ID
     * 
     * @param string $id
     * @param bool $includeProducts
     * @return Supplier
     * @throws NotFoundHttpException
     */
    public function getSupplierById(string $id, bool $includeProducts = false): Supplier
    {
        if ($includeProducts) {
            $supplier = $this->supplierRepository->findWithProducts($id);
        } else {
            $supplier = $this->supplierRepository->find($id);
        }
        
        if (!$supplier) {
            throw new NotFoundHttpException('Fournisseur non trouvé');
        }
        
        return $supplier;
    }
    
    /**
     * Crée un nouveau fournisseur
     * 
     * @param array $data
     * @return Supplier
     */
    public function createSupplier(array $data): Supplier
    {
        $supplier = new Supplier();
        $supplier->setName($data['name']);
        
        if (isset($data['contact'])) {
            $supplier->setContact($data['contact']);
        }
        
        if (isset($data['email'])) {
            $supplier->setEmail($data['email']);
        }
        
        if (isset($data['phone'])) {
            $supplier->setPhone($data['phone']);
        }
        
        if (isset($data['address'])) {
            $supplier->setAddress($data['address']);
        }
        
        if (isset($data['notes'])) {
            $supplier->setNotes($data['notes']);
        }
        
        $this->entityManager->persist($supplier);
        $this->entityManager->flush();
        
        return $supplier;
    }
    
    /**
     * Met à jour un fournisseur existant
     * 
     * @param string $id
     * @param array $data
     * @return Supplier
     * @throws NotFoundHttpException
     */
    public function updateSupplier(string $id, array $data): Supplier
    {
        $supplier = $this->getSupplierById($id);
        
        if (isset($data['name'])) {
            $supplier->setName($data['name']);
        }
        
        if (array_key_exists('contact', $data)) {
            $supplier->setContact($data['contact']);
        }
        
        if (array_key_exists('email', $data)) {
            $supplier->setEmail($data['email']);
        }
        
        if (array_key_exists('phone', $data)) {
            $supplier->setPhone($data['phone']);
        }
        
        if (array_key_exists('address', $data)) {
            $supplier->setAddress($data['address']);
        }
        
        if (array_key_exists('notes', $data)) {
            $supplier->setNotes($data['notes']);
        }
        
        $this->entityManager->flush();
        
        return $supplier;
    }
    
    /**
     * Supprime un fournisseur
     * 
     * @param string $id
     * @return void
     * @throws NotFoundHttpException
     */
    public function deleteSupplier(string $id): void
    {
        $supplier = $this->getSupplierById($id);
        
        $this->entityManager->remove($supplier);
        $this->entityManager->flush();
    }
    
    /**
     * Recherche des fournisseurs
     * 
     * @param string $term
     * @return Supplier[]
     */
    public function searchSuppliers(string $term): array
    {
        return $this->supplierRepository->searchByTerm($term);
    }
    
    /**
     * Récupère tous les produits d'un fournisseur
     * 
     * @param string $supplierId
     * @return SupplierProduct[]
     * @throws NotFoundHttpException
     */
    public function getSupplierProducts(string $supplierId): array
    {
        $supplier = $this->getSupplierById($supplierId);
        
        return $this->productRepository->findBySupplier($supplierId);
    }
    
    /**
     * Crée un nouveau produit pour un fournisseur
     * 
     * @param string $supplierId
     * @param array $data
     * @return SupplierProduct
     * @throws NotFoundHttpException
     */
    public function createProduct(string $supplierId, array $data): SupplierProduct
    {
        $supplier = $this->getSupplierById($supplierId);
        
        $product = new SupplierProduct();
        $product->setSupplier($supplier);
        $product->setName($data['name']);
        $product->setType($data['type']);
        
        if (isset($data['size'])) {
            $product->setSize($data['size']);
        }
        
        if (isset($data['price'])) {
            $product->setPrice($data['price']);
        }
        
        if (isset($data['available'])) {
            $product->setAvailable((bool) $data['available']);
        }
        
        if (isset($data['description'])) {
            $product->setDescription($data['description']);
        }
        
        $this->entityManager->persist($product);
        $this->entityManager->flush();
        
        return $product;
    }
    
    /**
     * Récupère un produit par ID
     * 
     * @param string $id
     * @return SupplierProduct
     * @throws NotFoundHttpException
     */
    public function getProductById(string $id): SupplierProduct
    {
        $product = $this->productRepository->find($id);
        
        if (!$product) {
            throw new NotFoundHttpException('Produit non trouvé');
        }
        
        return $product;
    }
    
    /**
     * Met à jour un produit existant
     * 
     * @param string $id
     * @param array $data
     * @return SupplierProduct
     * @throws NotFoundHttpException
     */
    public function updateProduct(string $id, array $data): SupplierProduct
    {
        $product = $this->getProductById($id);
        
        if (isset($data['name'])) {
            $product->setName($data['name']);
        }
        
        if (isset($data['type'])) {
            $product->setType($data['type']);
        }
        
        if (array_key_exists('size', $data)) {
            $product->setSize($data['size']);
        }
        
        if (array_key_exists('price', $data)) {
            $product->setPrice($data['price']);
        }
        
        if (isset($data['available'])) {
            $product->setAvailable((bool) $data['available']);
        }
        
        if (array_key_exists('description', $data)) {
            $product->setDescription($data['description']);
        }
        
        $this->entityManager->flush();
        
        return $product;
    }
    
    /**
     * Supprime un produit
     * 
     * @param string $id
     * @return void
     * @throws NotFoundHttpException
     */
    public function deleteProduct(string $id): void
    {
        $product = $this->getProductById($id);
        
        $this->entityManager->remove($product);
        $this->entityManager->flush();
    }
    
    /**
     * Récupère les produits par type (triploid/diploid)
     * 
     * @param string $type
     * @return SupplierProduct[]
     */
    public function getProductsByType(string $type): array
    {
        return $this->productRepository->findByType($type);
    }
    
    /**
     * Récupère les produits disponibles
     * 
     * @return SupplierProduct[]
     */
    public function getAvailableProducts(): array
    {
        return $this->productRepository->findAvailable();
    }
    
    /**
     * Recherche des produits
     * 
     * @param string $term
     * @return SupplierProduct[]
     */
    public function searchProducts(string $term): array
    {
        return $this->productRepository->searchByTerm($term);
    }
}
