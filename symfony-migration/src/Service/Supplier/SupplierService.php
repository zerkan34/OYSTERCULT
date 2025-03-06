<?php

namespace App\Service\Supplier;

use App\Entity\Supplier\Supplier;
use App\Repository\Supplier\SupplierRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SupplierService
{
    private $supplierRepository;
    private $entityManager;
    private $validator;

    public function __construct(
        SupplierRepository $supplierRepository,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ) {
        $this->supplierRepository = $supplierRepository;
        $this->entityManager = $entityManager;
        $this->validator = $validator;
    }

    public function getAllSuppliers(): array
    {
        return $this->supplierRepository->findAllOrdered();
    }

    public function getFriendSuppliers(): array
    {
        return $this->supplierRepository->findFriendSuppliers();
    }

    public function getSupplierById(string $id): ?Supplier
    {
        return $this->supplierRepository->find($id);
    }

    public function getSupplierWithProducts(string $id): ?Supplier
    {
        return $this->supplierRepository->findOneWithProducts($id);
    }

    public function getSupplierWithOrders(string $id): ?Supplier
    {
        return $this->supplierRepository->findOneWithOrders($id);
    }

    public function createSupplier(array $data): Supplier
    {
        $supplier = new Supplier();
        $this->updateSupplierData($supplier, $data);

        $errors = $this->validator->validate($supplier);
        if (count($errors) > 0) {
            throw new \InvalidArgumentException((string) $errors);
        }

        $this->supplierRepository->save($supplier, true);
        return $supplier;
    }

    public function updateSupplier(Supplier $supplier, array $data): Supplier
    {
        $this->updateSupplierData($supplier, $data);

        $errors = $this->validator->validate($supplier);
        if (count($errors) > 0) {
            throw new \InvalidArgumentException((string) $errors);
        }

        $this->supplierRepository->save($supplier, true);
        return $supplier;
    }

    public function deleteSupplier(Supplier $supplier): void
    {
        $this->supplierRepository->remove($supplier, true);
    }

    private function updateSupplierData(Supplier $supplier, array $data): void
    {
        if (isset($data['name'])) {
            $supplier->setName($data['name']);
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
        if (array_key_exists('friend_code', $data)) {
            $supplier->setFriendCode($data['friend_code']);
        }
        if (isset($data['is_friend'])) {
            $supplier->setIsFriend((bool) $data['is_friend']);
        }
    }
}
