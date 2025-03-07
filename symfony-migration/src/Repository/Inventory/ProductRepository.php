<?php

namespace App\Repository\Inventory;

use App\Entity\Inventory\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Product>
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function countLowStockProducts(): int
    {
        return $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.quantity <= p.minQuantity')
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function findLowStockProducts(int $limit = 5): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.quantity <= p.minQuantity')
            ->andWhere('p.status != :status')
            ->setParameter('status', 'out_of_stock')
            ->orderBy('p.quantity', 'ASC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function findByCategory(string $category)
    {
        return $this->createQueryBuilder('p')
            ->where('p.category = :category')
            ->setParameter('category', $category)
            ->getQuery()
            ->getResult();
    }

    public function findByStorageLocation(int $locationId)
    {
        return $this->createQueryBuilder('p')
            ->join('p.storageLocation', 'sl')
            ->where('sl.id = :locationId')
            ->setParameter('locationId', $locationId)
            ->getQuery()
            ->getResult();
    }

    public function findExpiringProducts(\DateTime $before)
    {
        return $this->createQueryBuilder('p')
            ->where('p.expiryDate <= :date')
            ->andWhere('p.expiryDate IS NOT NULL')
            ->setParameter('date', $before)
            ->getQuery()
            ->getResult();
    }

    public function searchProducts(string $query)
    {
        return $this->createQueryBuilder('p')
            ->where('p.name LIKE :query')
            ->orWhere('p.sku LIKE :query')
            ->orWhere('p.category LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->getQuery()
            ->getResult();
    }

    /**
     * Récupère les statistiques d'inventaire pour le tableau de bord
     *
     * @return array
     */
    public function getInventoryStatsForDashboard(): array
    {
        $totalItems = $this->count([]);
        
        $lowStock = $this->countLowStockProducts();
        
        // Compter les produits qui expirent dans les 7 prochains jours
        $expiringItems = $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.expiryDate IS NOT NULL')
            ->andWhere('p.expiryDate <= :date')
            ->setParameter('date', new \DateTime('+7 days'))
            ->getQuery()
            ->getSingleScalarResult();
        
        return [
            'totalItems' => $totalItems,
            'lowStock' => $lowStock,
            'expiringItems' => (int)$expiringItems
        ];
    }
}
