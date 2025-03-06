<?php

namespace App\Entity;

use App\Repository\InventoryItemRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=InventoryItemRepository::class)
 * @ORM\Table(name="inventory_items")
 */
class InventoryItem
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="UUID")
     * @ORM\Column(type="string", length=36)
     * @Groups({"inventory:read", "inventory:write"})
     */
    private $id;
    
    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="Le nom est requis")
     * @Groups({"inventory:read", "inventory:write"})
     */
    private $name;
    
    /**
     * @ORM\Column(type="string", length=20)
     * @Assert\Choice(choices={"triploid", "diploid"}, message="Le type doit être triploid ou diploid")
     * @Groups({"inventory:read", "inventory:write"})
     */
    private $type;
    
    /**
     * @ORM\Column(type="integer")
     * @Assert\GreaterThanOrEqual(value=0, message="La quantité doit être un entier positif ou zéro")
     * @Groups({"inventory:read", "inventory:write"})
     */
    private $quantity = 0;
    
    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"inventory:read", "inventory:write"})
     */
    private $location;
    
    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     * @Groups({"inventory:read", "inventory:write"})
     */
    private $size;
    
    /**
     * @ORM\Column(type="date", nullable=true)
     * @Groups({"inventory:read", "inventory:write"})
     */
    private $harvestDate;
    
    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"inventory:read", "inventory:write"})
     */
    private $notes;
    
    /**
     * @ORM\Column(type="datetime")
     * @Groups({"inventory:read"})
     */
    private $createdAt;
    
    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"inventory:read"})
     */
    private $updatedAt;
    
    public function __construct()
    {
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
    
    public function getType(): ?string
    {
        return $this->type;
    }
    
    public function setType(string $type): self
    {
        $this->type = $type;
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
    
    public function getLocation(): ?string
    {
        return $this->location;
    }
    
    public function setLocation(?string $location): self
    {
        $this->location = $location;
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
    
    public function getHarvestDate(): ?\DateTimeInterface
    {
        return $this->harvestDate;
    }
    
    public function setHarvestDate(?\DateTimeInterface $harvestDate): self
    {
        $this->harvestDate = $harvestDate;
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
     * Retourne la couleur en fonction du type selon les standards définis
     * Triploïdes (Plates): bg-brand-burgundy
     * Diploïdes (Creuses): bg-blue-600
     */
    public function getColor(): string
    {
        return $this->type === 'triploid' ? 'bg-brand-burgundy' : 'bg-blue-600';
    }
    
    /**
     * @ORM\PreUpdate
     */
    public function preUpdate()
    {
        $this->updatedAt = new \DateTime();
    }
}
