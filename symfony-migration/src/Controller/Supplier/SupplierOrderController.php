<?php

namespace App\Controller\Supplier;

use App\Service\Supplier\SupplierOrderService;
use App\Service\Supplier\SupplierService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/api/suppliers/{supplierId}/orders", name="api_supplier_orders_")
 */
class SupplierOrderController extends AbstractController
{
    private $supplierService;
    private $orderService;

    public function __construct(
        SupplierService $supplierService,
        SupplierOrderService $orderService
    ) {
        $this->supplierService = $supplierService;
        $this->orderService = $orderService;
    }

    /**
     * @Route("", name="list", methods={"GET"})
     */
    public function getOrders(string $supplierId): JsonResponse
    {
        $orders = $this->orderService->getSupplierOrders($supplierId);

        return $this->json([
            'success' => true,
            'count' => count($orders),
            'data' => $orders
        ]);
    }

    /**
     * @Route("/{orderId}", name="get", methods={"GET"})
     */
    public function getOrder(string $supplierId, string $orderId): JsonResponse
    {
        $order = $this->orderService->getOrderWithItems($orderId);

        if (!$order || $order->getSupplier()->getId() !== $supplierId) {
            return $this->json([
                'success' => false,
                'message' => 'Commande non trouvée'
            ], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * @Route("", name="create", methods={"POST"})
     */
    public function createOrder(string $supplierId, Request $request): JsonResponse
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
            $order = $this->orderService->createOrder($supplier, $data);

            return $this->json([
                'success' => true,
                'message' => 'Commande créée avec succès',
                'data' => $order
            ], Response::HTTP_CREATED);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @Route("/{orderId}", name="update", methods={"PUT"})
     */
    public function updateOrder(
        string $supplierId,
        string $orderId,
        Request $request
    ): JsonResponse {
        try {
            $order = $this->orderService->getOrderWithItems($orderId);
            if (!$order || $order->getSupplier()->getId() !== $supplierId) {
                return $this->json([
                    'success' => false,
                    'message' => 'Commande non trouvée'
                ], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);
            $order = $this->orderService->updateOrder($order, $data);

            return $this->json([
                'success' => true,
                'message' => 'Commande mise à jour avec succès',
                'data' => $order
            ]);
        } catch (\InvalidArgumentException $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage()
            ], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @Route("/{orderId}", name="delete", methods={"DELETE"})
     */
    public function deleteOrder(string $supplierId, string $orderId): JsonResponse
    {
        $order = $this->orderService->getOrderWithItems($orderId);
        if (!$order || $order->getSupplier()->getId() !== $supplierId) {
            return $this->json([
                'success' => false,
                'message' => 'Commande non trouvée'
            ], Response::HTTP_NOT_FOUND);
        }

        try {
            $this->orderService->deleteOrder($order);

            return $this->json([
                'success' => true,
                'message' => 'Commande supprimée avec succès'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'Impossible de supprimer la commande'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
