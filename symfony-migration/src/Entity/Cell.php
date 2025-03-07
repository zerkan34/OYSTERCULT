<?php

namespace App\Entity;

use App\Repository\CellRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CellRepository::class)]
#[ORM\Table(name: "cells")]
class Cell
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    #[Groups(["cell:read", "table:read"])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Table::class, inversedBy: "cells")]
    #[ORM\JoinColumn(nullable: false)]
    private ?Table $table = null;

    #[ORM\Column(type: "integer")]
    #[Assert\GreaterThanOrEqual(value: 0, message: "L'index de ligne doit être un entier positif ou zéro")]
    #[Groups(["cell:read", "table:read"])]
    private ?int $rowIndex = null;

    #[ORM\Column(type: "integer")]
    #[Assert\GreaterThanOrEqual(value: 0, message: "L'index de colonne doit être un entier positif ou zéro")]
    #[Groups(["cell:read", "table:read"])]
    private ?int $columnIndex = null;

    #[ORM\Column(type: "integer")]
    #[Assert\GreaterThan(value: 0, message: "Le numéro de cellule doit être un entier positif")]
    #[Groups(["cell:read", "table:read"])]
    private ?int $cellNumber = null;

    #[ORM\Column(type: "string", length: 50)]
    #[Assert\Choice(choices: ["empty", "filled", "harvested", "maintenance"], message: "Le statut doit être empty, filled, harvested ou maintenance")]
    #[Groups(["cell:read", "table:read"])]
    private ?string $status = 'empty';

    #[ORM\Column(type: "integer")]
    #[Assert\GreaterThanOrEqual(value: 0, message: "La quantité doit être un entier positif ou zéro")]
    #[Groups(["cell:read", "table:read"])]
    private ?int $quantity = 0;

    #[ORM\Column(type: "string", length: 50, nullable: true)]
    #[Groups(["cell:read", "table:read"])]
    private ?string $color = null;

    #[ORM\Column(type: "datetime")]
    private ?\DateTimeInterface $createdAt = null;

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

    public function getTable(): ?Table
    {
        return $this->table;
    }

    public function setTable(?Table $table): self
    {
        $this->table = $table;
        return $this;
    }

    public function getRowIndex(): ?int
    {
        return $this->rowIndex;
    }

    public function setRowIndex(int $rowIndex): self
    {
        $this->rowIndex = $rowIndex;
        return $this;
    }

    public function getColumnIndex(): ?int
    {
        return $this->columnIndex;
    }

    public function setColumnIndex(int $columnIndex): self
    {
        $this->columnIndex = $columnIndex;
        return $this;
    }

    public function getCellNumber(): ?int
    {
        return $this->cellNumber;
    }

    public function setCellNumber(int $cellNumber): self
    {
        $this->cellNumber = $cellNumber;
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

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;
        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(?string $color): self
    {
        $this->color = $color;
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
