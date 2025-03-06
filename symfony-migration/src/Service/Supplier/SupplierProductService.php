<?php

namespace App\Service\Supplier;

use App\Entity\Supplier\Supplier;
use App\Entity\Supplier\SupplierProduct;
use App\Repository\Supplier\SupplierProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SupplierProductService
{
    private $productRepository;
    private $entityManager;
    private $validator;

    public function __construct(
        SupplierProductRepository $productRepository,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ) {
        $this->productRepository = $productRepository;
        $this->entityManager = $entityManager;
        $this->validator = $validator;
    }

    public function getSupplierProducts(string $supplierId): array
    {
        return $this->productRepository->findBySupplierId($supplierId);
    }

    public function createProduct(Supplier $supplier, array $data): SupplierProduct
    {
        $product = new SupplierProduct();
        $product->setSupplier($supplier);
        $this->updateProductData($product, $data);

        $errors = $this->validator->validate($product);
        if (count($errors) > 0) {
            throw new \InvalidArgumentException((string) $errors);
        }

        $this->productRepository->save($product, true);
        return $product;
    }

    public function updateProduct(SupplierProduct $product, array $data): SupplierProduct
    {
        $this->updateProductData($product, $data);

        $errors = $this->validator->validate($product);
        if (count($errors) > 0) {
            throw new \InvalidArgumentException((string) $errors);
        }

        $this->productRepository->save($product, true);
        return $product;
    }

    public function deleteProduct(SupplierProduct $product): void
    {
        $this->productRepository->remove($product, true);
    }

    private function updateProductData(SupplierProduct $product, array $data): void
    {
        if (isset($data['name'])) {
            $product->setName($data['name']);
        }
        if (array_key_exists('reference', $data)) {
            $product->setReference($data['reference']);
        }
        if (isset($data['price'])) {
            $product->setPrice((string) $data['price']);
        }
        if (array_key_exists('description', $data)) {
            $product->setDescription($data['description']);
        }
        if (array_key_exists('metadata', $data)) {
            $product->setMetadata($data['metadata']);
        }
    }
}
