<?php

namespace App\Entity;

use App\Repository\SupplierRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

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
     * @Groups({"supplier:read", "supplier:write"})
     */
    private $id;
    
    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Le nom est requis")
     * @Groups({"supplier:read", "supplier:write"})
     */
    private $name;
    
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"supplier:read", "supplier:write"})
     */
    private $contact;
    
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Assert\Email(message="L'adresse email n'est pas valide")
     * @Groups({"supplier:read", "supplier:write"})
     */
    private $email;
    
    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     * @Groups({"supplier:read", "supplier:write"})
     */
    private $phone;
    
    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"supplier:read", "supplier:write"})
     */
    private $address;
    
    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"supplier:read", "supplier:write"})
     */
    private $notes;
    
    /**
     * @ORM\OneToMany(targetEntity=SupplierProduct::class, mappedBy="supplier", orphanRemoval=true)
     * @Groups({"supplier:read"})
     */
    private $products;
    
    /**
     * @ORM\Column(type="datetime")
     * @Groups({"supplier:read"})
     */
    private $createdAt;
    
    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"supplier:read"})
     */
    private $updatedAt;
    
    public function __construct()
    {
        $this->products = new ArrayCollection();
        $this->createdAt = new \DateTime();
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
    
    public function getContact(): ?string
    {
        return $this->contact;
    }
    
    public function setContact(?string $contact): self
    {
        $this->contact = $contact;
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
        if ($this->products->contains($product)) {
            $this->products->removeElement($product);
            // set the owning side to null (unless already changed)
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
    
    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }
    
    /**
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->updatedAt = new \DateTime();
    }
}
