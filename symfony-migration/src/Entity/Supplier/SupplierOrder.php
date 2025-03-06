<?php

namespace App\Entity\Supplier;

use App\Repository\Supplier\SupplierOrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=SupplierOrderRepository::class)
 * @ORM\Table(name="supplier_orders")
 */
class SupplierOrder
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="UUID")
     * @ORM\Column(type="string", length=36)
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Supplier::class, inversedBy="orders")
     * @ORM\JoinColumn(nullable=false)
     */
    private $supplier;

    /**
     * @ORM\Column(type="datetime")
     */
    private $orderDate;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $deliveryDate;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $status = 'pending';

    /**
     * @ORM\Column(type="decimal", precision=10, scale=2)
     */
    private $totalAmount = 0;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $notes;

    /**
     * @ORM\OneToMany(targetEntity=SupplierOrderItem::class, mappedBy="order", orphanRemoval=true, cascade={"persist"})
     */
    private $items;

    /**
     * @ORM\Column(type="json", nullable=true)
     */
    private $metadata = [];

    public function __construct()
    {
        $this->items = new ArrayCollection();
        $this->orderDate = new \DateTime();
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getSupplier(): ?Supplier
    {
        return $this->supplier;
    }

    public function setSupplier(?Supplier $supplier): self
    {
        $this->supplier = $supplier;
        return $this;
    }

    public function getOrderDate(): ?\DateTimeInterface
    {
        return $this->orderDate;
    }

    public function setOrderDate(\DateTimeInterface $orderDate): self
    {
        $this->orderDate = $orderDate;
        return $this;
    }

    public function getDeliveryDate(): ?\DateTimeInterface
    {
        return $this->deliveryDate;
    }

    public function setDeliveryDate(?\DateTimeInterface $deliveryDate): self
    {
        $this->deliveryDate = $deliveryDate;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getTotalAmount(): ?string
    {
        return $this->totalAmount;
    }

    public function setTotalAmount(string $totalAmount): self
    {
        $this->totalAmount = $totalAmount;
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

    /**
     * @return Collection|SupplierOrderItem[]
     */
    public function getItems(): Collection
    {
        return $this->items;
    }

    public function addItem(SupplierOrderItem $item): self
    {
        if (!$this->items->contains($item)) {
            $this->items[] = $item;
            $item->setOrder($this);
            $this->updateTotalAmount();
        }
        return $this;
    }

    public function removeItem(SupplierOrderItem $item): self
    {
        if ($this->items->removeElement($item)) {
            if ($item->getOrder() === $this) {
                $item->setOrder(null);
            }
            $this->updateTotalAmount();
        }
        return $this;
    }

    public function getMetadata(): ?array
    {
        return $this->metadata;
    }

    public function setMetadata(?array $metadata): self
    {
        $this->metadata = $metadata;
        return $this;
    }

    private function updateTotalAmount(): void
    {
        $total = 0;
        foreach ($this->items as $item) {
            $total += $item->getQuantity() * $item->getUnitPrice();
        }
        $this->totalAmount = (string) $total;
    }
}
