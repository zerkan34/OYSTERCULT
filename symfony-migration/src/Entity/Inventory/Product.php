<?php

namespace App\Entity\Inventory;

use App\Repository\Inventory\ProductRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use App\Entity\Inventory\StorageLocation;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
#[ORM\Table(name: "inventory_products")]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Le nom du produit est requis")]
    private ?string $name = null;

    #[ORM\Column(type: "text", nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: "string")]
    #[Assert\GreaterThanOrEqual(value: 0, message: "Le prix doit être un nombre positif ou zéro")]
    private ?string $price = null;

    #[ORM\Column]
    private ?int $quantity = 0;

    #[ORM\Column]
    private ?int $minQuantity = 10;

    #[ORM\Column(length: 50)]
    private ?string $unit = 'pièce';

    #[ORM\Column(length: 50)]
    private ?string $status = 'available';

    #[ORM\ManyToOne(targetEntity: StorageLocation::class, inversedBy: "products")]
    private ?StorageLocation $storageLocation = null;

    #[ORM\Column(type: "datetime")]
    private ?\DateTimeInterface $createdAt;

    #[ORM\Column(type: "datetime", nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): self
    {
        $this->price = $price;
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

    public function getMinQuantity(): ?int
    {
        return $this->minQuantity;
    }

    public function setMinQuantity(int $minQuantity): self
    {
        $this->minQuantity = $minQuantity;
        return $this;
    }

    public function getUnit(): ?string
    {
        return $this->unit;
    }

    public function setUnit(string $unit): self
    {
        $this->unit = $unit;
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

    public function getStorageLocation(): ?StorageLocation
    {
        return $this->storageLocation;
    }

    public function setStorageLocation(?StorageLocation $storageLocation): self
    {
        $this->storageLocation = $storageLocation;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    #[ORM\PreUpdate]
    public function preUpdate(): void
    {
        $this->updatedAt = new \DateTime();
    }

    public function isLowStock(): bool
    {
        return $this->quantity <= $this->minQuantity;
    }
}
