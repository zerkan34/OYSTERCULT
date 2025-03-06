<?php

namespace App\Entity\Supplier;

use App\Repository\Supplier\SupplierRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=SupplierRepository::class)
 * @ORM\Table(name="suppliers")
 */
class Supplier
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="UUID")
     * @ORM\Column(type="string", length=36)
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Le nom est obligatoire")
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Email(message="L'adresse email n'est pas valide")
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     */
    private $phone;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=50, nullable=true, name="friend_code")
     */
    private $friendCode;

    /**
     * @ORM\Column(type="boolean", name="is_friend")
     */
    private $isFriend = false;

    /**
     * @ORM\OneToMany(targetEntity=SupplierProduct::class, mappedBy="supplier", orphanRemoval=true)
     */
    private $products;

    /**
     * @ORM\OneToMany(targetEntity=SupplierOrder::class, mappedBy="supplier")
     */
    private $orders;

    public function __construct()
    {
        $this->products = new ArrayCollection();
        $this->orders = new ArrayCollection();
    }

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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;
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

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): self
    {
        $this->address = $address;
        return $this;
    }

    public function getFriendCode(): ?string
    {
        return $this->friendCode;
    }

    public function setFriendCode(?string $friendCode): self
    {
        $this->friendCode = $friendCode;
        return $this;
    }

    public function getIsFriend(): bool
    {
        return $this->isFriend;
    }

    public function setIsFriend(bool $isFriend): self
    {
        $this->isFriend = $isFriend;
        return $this;
    }

    /**
     * @return Collection|SupplierProduct[]
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

    /**
     * @return Collection|SupplierOrder[]
     */
    public function getOrders(): Collection
    {
        return $this->orders;
    }

    public function addOrder(SupplierOrder $order): self
    {
        if (!$this->orders->contains($order)) {
            $this->orders[] = $order;
            $order->setSupplier($this);
        }
        return $this;
    }

    public function removeOrder(SupplierOrder $order): self
    {
        if ($this->orders->removeElement($order)) {
            if ($order->getSupplier() === $this) {
                $order->setSupplier(null);
            }
        }
        return $this;
    }
}
