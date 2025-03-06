<?php

namespace App\Service\Supplier;

use App\Entity\Supplier\Supplier;
use App\Entity\Supplier\SupplierOrder;
use App\Entity\Supplier\SupplierOrderItem;
use App\Repository\Supplier\SupplierOrderRepository;
use App\Repository\Supplier\SupplierProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SupplierOrderService
{
    private $orderRepository;
    private $productRepository;
    private $entityManager;
    private $validator;

    public function __construct(
        SupplierOrderRepository $orderRepository,
        SupplierProductRepository $productRepository,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ) {
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
        $this->entityManager = $entityManager;
        $this->validator = $validator;
    }

    public function getSupplierOrders(string $supplierId): array
    {
        return $this->orderRepository->findBySupplierId($supplierId);
    }

    public function getOrderWithItems(string $orderId): ?SupplierOrder
    {
        return $this->orderRepository->findOneWithItems($orderId);
    }

    public function createOrder(Supplier $supplier, array $data): SupplierOrder
    {
        $order = new SupplierOrder();
        $order->setSupplier($supplier);
        $this->updateOrderData($order, $data);

        if (isset($data['items']) && is_array($data['items'])) {
            foreach ($data['items'] as $itemData) {
                $this->addOrderItem($order, $itemData);
            }
        }

        $errors = $this->validator->validate($order);
        if (count($errors) > 0) {
            throw new \InvalidArgumentException((string) $errors);
        }

        $this->orderRepository->save($order, true);
        return $order;
    }

    public function updateOrder(SupplierOrder $order, array $data): SupplierOrder
    {
        $this->updateOrderData($order, $data);

        if (isset($data['items']) && is_array($data['items'])) {
            // Remove existing items
            foreach ($order->getItems() as $item) {
                $order->removeItem($item);
            }

            // Add new items
            foreach ($data['items'] as $itemData) {
                $this->addOrderItem($order, $itemData);
            }
        }

        $errors = $this->validator->validate($order);
        if (count($errors) > 0) {
            throw new \InvalidArgumentException((string) $errors);
        }

        $this->orderRepository->save($order, true);
        return $order;
    }

    public function deleteOrder(SupplierOrder $order): void
    {
        $this->orderRepository->remove($order, true);
    }

    private function updateOrderData(SupplierOrder $order, array $data): void
    {
        if (isset($data['delivery_date'])) {
            $order->setDeliveryDate(new \DateTime($data['delivery_date']));
        }
        if (isset($data['status'])) {
            $order->setStatus($data['status']);
        }
        if (array_key_exists('notes', $data)) {
            $order->setNotes($data['notes']);
        }
        if (array_key_exists('metadata', $data)) {
            $order->setMetadata($data['metadata']);
        }
    }

    private function addOrderItem(SupplierOrder $order, array $itemData): void
    {
        if (!isset($itemData['product_id']) || !isset($itemData['quantity'])) {
            throw new \InvalidArgumentException('Product ID and quantity are required for order items');
        }

        $product = $this->productRepository->find($itemData['product_id']);
        if (!$product) {
            throw new \InvalidArgumentException('Product not found');
        }

        $item = new SupplierOrderItem();
        $item->setOrder($order);
        $item->setProduct($product);
        $item->setQuantity($itemData['quantity']);
        $item->setUnitPrice($product->getPrice());

        if (isset($itemData['notes'])) {
            $item->setNotes($itemData['notes']);
        }

        $order->addItem($item);
    }
}
