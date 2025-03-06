<?php

namespace App\Service\Inventory;

use App\Entity\Inventory\Product;
use App\Entity\Inventory\StorageLocation;
use App\Repository\Inventory\ProductRepository;
use App\Repository\Inventory\StorageLocationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class InventoryService
{
    private $entityManager;
    private $productRepository;
    private $storageLocationRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        ProductRepository $productRepository,
        StorageLocationRepository $storageLocationRepository
    ) {
        $this->entityManager = $entityManager;
        $this->productRepository = $productRepository;
        $this->storageLocationRepository = $storageLocationRepository;
    }

    public function addProduct(array $data): Product
    {
        $storageLocation = $this->storageLocationRepository->find($data['storageLocationId']);
        if (!$storageLocation) {
            throw new NotFoundHttpException('Emplacement de stockage non trouvé');
        }

        $product = new Product();
        $product->setName($data['name']);
        $product->setSku($data['sku']);
        $product->setCategory($data['category']);
        $product->setQuantity($data['quantity']);
        $product->setUnit($data['unit']);
        $product->setArrivalDate(new \DateTime($data['arrivalDate']));
        if (isset($data['expiryDate'])) {
            $product->setExpiryDate(new \DateTime($data['expiryDate']));
        }
        $product->setMinimumStock($data['minimumStock']);
        $product->setMaximumStock($data['maximumStock']);
        $product->setStorageLocation($storageLocation);

        $this->entityManager->persist($product);
        $this->entityManager->flush();

        return $product;
    }

    public function updateProduct(string $id, array $data): Product
    {
        $product = $this->productRepository->find($id);
        if (!$product) {
            throw new NotFoundHttpException('Produit non trouvé');
        }

        if (isset($data['name'])) {
            $product->setName($data['name']);
        }
        if (isset($data['quantity'])) {
            $product->setQuantity($data['quantity']);
        }
        if (isset($data['unit'])) {
            $product->setUnit($data['unit']);
        }
        if (isset($data['expiryDate'])) {
            $product->setExpiryDate(new \DateTime($data['expiryDate']));
        }
        if (isset($data['minimumStock'])) {
            $product->setMinimumStock($data['minimumStock']);
        }
        if (isset($data['maximumStock'])) {
            $product->setMaximumStock($data['maximumStock']);
        }
        if (isset($data['storageLocationId'])) {
            $storageLocation = $this->storageLocationRepository->find($data['storageLocationId']);
            if (!$storageLocation) {
                throw new NotFoundHttpException('Emplacement de stockage non trouvé');
            }
            $product->setStorageLocation($storageLocation);
        }

        $this->entityManager->flush();

        return $product;
    }

    public function removeProduct(string $id): void
    {
        $product = $this->productRepository->find($id);
        if (!$product) {
            throw new NotFoundHttpException('Produit non trouvé');
        }

        $this->entityManager->remove($product);
        $this->entityManager->flush();
    }

    public function addStorageLocation(array $data): StorageLocation
    {
        $location = new StorageLocation();
        $location->setName($data['name']);
        $location->setType($data['type']);
        $location->setCapacity($data['capacity']);
        if (isset($data['description'])) {
            $location->setDescription($data['description']);
        }
        if (isset($data['temperature'])) {
            $location->setTemperature($data['temperature']);
        }

        $this->entityManager->persist($location);
        $this->entityManager->flush();

        return $location;
    }

    public function updateStorageLocation(string $id, array $data): StorageLocation
    {
        $location = $this->storageLocationRepository->find($id);
        if (!$location) {
            throw new NotFoundHttpException('Emplacement de stockage non trouvé');
        }

        if (isset($data['name'])) {
            $location->setName($data['name']);
        }
        if (isset($data['type'])) {
            $location->setType($data['type']);
        }
        if (isset($data['capacity'])) {
            $location->setCapacity($data['capacity']);
        }
        if (isset($data['description'])) {
            $location->setDescription($data['description']);
        }
        if (isset($data['temperature'])) {
            $location->setTemperature($data['temperature']);
        }

        $this->entityManager->flush();

        return $location;
    }

    public function removeStorageLocation(string $id): void
    {
        $location = $this->storageLocationRepository->find($id);
        if (!$location) {
            throw new NotFoundHttpException('Emplacement de stockage non trouvé');
        }

        if (!$location->getProducts()->isEmpty()) {
            throw new \Exception('Impossible de supprimer un emplacement contenant des produits');
        }

        $this->entityManager->remove($location);
        $this->entityManager->flush();
    }

    public function getLowStockProducts(): array
    {
        return $this->productRepository->findLowStock();
    }

    public function getExpiringProducts(\DateTime $before): array
    {
        return $this->productRepository->findExpiringProducts($before);
    }

    public function searchProducts(string $query): array
    {
        return $this->productRepository->searchProducts($query);
    }

    public function getAvailableStorageLocations(): array
    {
        return $this->storageLocationRepository->findAvailableLocations();
    }
}
