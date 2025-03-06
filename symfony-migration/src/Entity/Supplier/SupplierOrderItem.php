<?php

namespace App\Entity\Supplier;

use App\Repository\Supplier\SupplierOrderItemRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=SupplierOrderItemRepository::class)
 * @ORM\Table(name="supplier_order_items")
 */
class SupplierOrderItem
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="UUID")
     * @ORM\Column(type="string", length=36)
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=SupplierOrder::class, inversedBy="items")
     * @ORM\JoinColumn(nullable=false)
     */
    private $order;

    /**
     * @ORM\ManyToOne(targetEntity=SupplierProduct::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $product;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotBlank(message="La quantité est obligatoire")
     * @Assert\PositiveOrZero(message="La quantité doit être positive ou nulle")
     */
    private $quantity;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=2)
     * @Assert\NotBlank(message="Le prix unitaire est obligatoire")
     * @Assert\PositiveOrZero(message="Le prix unitaire doit être positif ou nul")
     */
    private $unitPrice;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $notes;

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getOrder(): ?SupplierOrder
    {
        return $this->order;
    }

    public function setOrder(?SupplierOrder $order): self
    {
        $this->order = $order;
        return $this;
    }

    public function getProduct(): ?SupplierProduct
    {
        return $this->product;
    }

    public function setProduct(?SupplierProduct $product): self
    {
        $this->product = $product;
        if ($product) {
            $this->unitPrice = $product->getPrice();
        }
        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;
        return $this;
    }

    public function getUnitPrice(): ?string
    {
        return $this->unitPrice;
    }

    public function setUnitPrice(string $unitPrice): self
    {
        $this->unitPrice = $unitPrice;
        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): self
    {
        $this->notes = $notes;
        return $this;
    }

    public function getTotal(): float
    {
        return $this->quantity * (float) $this->unitPrice;
    }
}
