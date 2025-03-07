<?php

namespace App\Controller;

use App\Repository\OrderRepository;
use App\Repository\Inventory\ProductRepository;
use App\Repository\Supplier\SupplierProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractController
{
    #[Route('/', name: 'app_dashboard')]
    public function index(
        OrderRepository $orderRepository,
        ProductRepository $productRepository,
        SupplierProductRepository $supplierProductRepository
    ): Response {
        // Statistiques globales
        $stats = [
            'totalProducts' => $productRepository->count([]),
            'monthlySales' => $orderRepository->getMonthlyTotalSales(),
            'lowStockAlerts' => $productRepository->countLowStockProducts(),
        ];

        // Dernières commandes
        $recentOrders = $orderRepository->findRecentOrders(5);

        // Produits en stock faible
        $lowStockProducts = $productRepository->findLowStockProducts(5);

        return $this->render('dashboard/index.html.twig', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
        ]);
    }
}
