<?php

namespace App\Entity\Supplier;

use App\Repository\Supplier\SupplierRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SupplierRepository::class)]
#[ORM\Table(name: "suppliers")]
class Supplier
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    #[Groups(["supplier:read", "supplier:write"])]
    private ?int $id = null;

    #[ORM\Column(type: "string", length: 255)]
    #[Assert\NotBlank(message: "Le nom du fournisseur est requis")]
    #[Groups(["supplier:read", "supplier:write"])]
    private ?string $name = null;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    #[Groups(["supplier:read", "supplier:write"])]
    private ?string $address = null;

    #[ORM\Column(type: "string", length: 20, nullable: true)]
    #[Groups(["supplier:read", "supplier:write"])]
    private ?string $phone = null;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    #[Assert\Email(message: "L'email '{{ value }}' n'est pas un email valide.")]
    #[Groups(["supplier:read", "supplier:write"])]
    private ?string $email = null;

    #[ORM\OneToMany(mappedBy: "supplier", targetEntity: SupplierProduct::class, orphanRemoval: true)]
    #[Groups(["supplier:read"])]
    private Collection $products;

    #[ORM\Column(type: "datetime")]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: "datetime", nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->products = new ArrayCollection();
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

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): self
    {
        $this->address = $address;
        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;
        return $this;
    }

    /**
     * @return Collection<int, SupplierProduct>
     */
    public function getProducts(): Collection
    {
        return $this->products;
    }

    public function addProduct(SupplierProduct $product): self
    {
        if (!$this->products->contains($product)) {
            $this->products[] = $product;
            $product->setSupplier($this);
        }
        return $this;
    }

    public function removeProduct(SupplierProduct $product): self
    {
        if ($this->products->removeElement($product)) {
            if ($product->getSupplier() === $this) {
                $product->setSupplier(null);
            }
        }
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

    #[ORM\PreUpdate]
    public function preUpdate(): void
    {
        $this->updatedAt = new \DateTime();
    }
}
