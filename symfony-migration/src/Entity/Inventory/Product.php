<?php

namespace App\Entity\Inventory;

use App\Repository\Inventory\ProductRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=ProductRepository::class)
 * @ORM\Table(name="inventory_products")
 */
class Product
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="UUID")
     * @ORM\Column(type="string", length=36)
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Le nom est requis")
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $sku;

    /**
     * @ORM\Column(type="string", length=100)
     */
    private $category;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=2)
     * @Assert\PositiveOrZero(message="La quantité doit être positive ou nulle")
     */
    private $quantity;

    /**
     * @ORM\Column(type="string", length=20)
     */
    private $unit;

    /**
     * @ORM\Column(type="date")
     */
    private $arrivalDate;

    /**
     * @ORM\Column(type="date", nullable=true)
     */
    private $expiryDate;

    /**
     * @ORM\Column(type="string", length=20)
     */
    private $status = 'in_stock';

    /**
     * @ORM\Column(type="decimal", precision=10, scale=2)
     * @Assert\Positive(message="Le stock minimum doit être positif")
     */
    private $minimumStock;

    /**
     * @ORM\Column(type="decimal", precision=10, scale=2)
     * @Assert\Positive(message="Le stock maximum doit être positif")
     */
    private $maximumStock;

    /**
     * @ORM\ManyToOne(targetEntity=StorageLocation::class)
     * @ORM\JoinColumn(nullable=false)
     */
    private $storageLocation;

    public function getId(): ?string
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

    public function getSku(): ?string
    {
        return $this->sku;
    }

    public function setSku(string $sku): self
    {
        $this->sku = $sku;
        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(string $category): self
    {
        $this->category = $category;
        return $this;
    }

    public function getQuantity(): ?string
    {
        return $this->quantity;
    }

    public function setQuantity(string $quantity): self
    {
        $this->quantity = $quantity;
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

    public function getArrivalDate(): ?\DateTimeInterface
    {
        return $this->arrivalDate;
    }

    public function setArrivalDate(\DateTimeInterface $arrivalDate): self
    {
        $this->arrivalDate = $arrivalDate;
        return $this;
    }

    public function getExpiryDate(): ?\DateTimeInterface
    {
        return $this->expiryDate;
    }

    public function setExpiryDate(?\DateTimeInterface $expiryDate): self
    {
        $this->expiryDate = $expiryDate;
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

    public function getMinimumStock(): ?string
    {
        return $this->minimumStock;
    }

    public function setMinimumStock(string $minimumStock): self
    {
        $this->minimumStock = $minimumStock;
        return $this;
    }

    public function getMaximumStock(): ?string
    {
        return $this->maximumStock;
    }

    public function setMaximumStock(string $maximumStock): self
    {
        $this->maximumStock = $maximumStock;
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
}
