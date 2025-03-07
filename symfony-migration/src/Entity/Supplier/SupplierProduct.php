<?php

namespace App\Entity\Supplier;

use App\Repository\Supplier\SupplierProductRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SupplierProductRepository::class)]
#[ORM\Table(name: "supplier_products")]
class SupplierProduct
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "AUTO")]
    #[ORM\Column(type: "integer")]
    #[Groups(["supplier_product:read", "supplier_product:write", "supplier:read"])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Supplier::class, inversedBy: "products")]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["supplier_product:read"])]
    private ?Supplier $supplier = null;

    #[ORM\Column(type: "string", length: 255)]
    #[Assert\NotBlank(message: "Le nom du produit est requis")]
    #[Groups(["supplier_product:read", "supplier_product:write", "supplier:read"])]
    private ?string $name = null;

    #[ORM\Column(type: "string", length: 20)]
    #[Assert\Choice(choices: ["triploid", "diploid"], message: "Le type doit être triploid ou diploid")]
    #[Groups(["supplier_product:read", "supplier_product:write", "supplier:read"])]
    private ?string $type = null;

    #[ORM\Column(type: "string", length: 50, nullable: true)]
    #[Groups(["supplier_product:read", "supplier_product:write", "supplier:read"])]
    private ?string $size = null;

    #[ORM\Column(type: "string", nullable: true)]
    #[Assert\GreaterThanOrEqual(value: 0, message: "Le prix doit être un nombre positif ou zéro")]
    #[Groups(["supplier_product:read", "supplier_product:write", "supplier:read"])]
    private ?string $price = null;

    #[ORM\Column(type: "boolean")]
    #[Groups(["supplier_product:read", "supplier_product:write", "supplier:read"])]
    private bool $available = true;

    #[ORM\Column(type: "text", nullable: true)]
    #[Groups(["supplier_product:read", "supplier_product:write", "supplier:read"])]
    private ?string $description = null;

    #[ORM\Column(type: "datetime")]
    #[Groups(["supplier_product:read", "supplier:read"])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: "datetime", nullable: true)]
    #[Groups(["supplier_product:read", "supplier:read"])]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getSize(): ?string
    {
        return $this->size;
    }

    public function setSize(?string $size): self
    {
        $this->size = $size;
        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(?string $price): self
    {
        $this->price = $price;
        return $this;
    }

    public function getAvailable(): bool
    {
        return $this->available;
    }

    public function setAvailable(bool $available): self
    {
        $this->available = $available;
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

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function getColor(): string
    {
        return $this->type === 'triploid' ? 'bg-brand-burgundy' : 'bg-blue-600';
    }

    #[ORM\PreUpdate]
    public function preUpdate(): void
    {
        $this->updatedAt = new \DateTime();
    }
}
