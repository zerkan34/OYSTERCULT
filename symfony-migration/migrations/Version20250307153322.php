<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250307153322 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cells CHANGE color color VARCHAR(50) DEFAULT NULL, CHANGE updated_at updated_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE inventory_oyster_tables CHANGE cells cells JSON NOT NULL, CHANGE last_maintenance_date last_maintenance_date DATE DEFAULT NULL, CHANGE metadata metadata JSON DEFAULT NULL');
        $this->addSql('ALTER TABLE inventory_products ADD status VARCHAR(50) NOT NULL, CHANGE updated_at updated_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE inventory_storage_locations CHANGE description description VARCHAR(255) DEFAULT NULL, CHANGE temperature temperature JSON DEFAULT NULL');
        $this->addSql('ALTER TABLE supplier_products CHANGE size size VARCHAR(50) DEFAULT NULL, CHANGE price price VARCHAR(255) DEFAULT NULL, CHANGE updated_at updated_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE suppliers CHANGE address address VARCHAR(255) DEFAULT NULL, CHANGE phone phone VARCHAR(20) DEFAULT NULL, CHANGE email email VARCHAR(255) DEFAULT NULL, CHANGE updated_at updated_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE tables CHANGE position position JSON NOT NULL, CHANGE updated_at updated_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE user CHANGE roles roles JSON NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cells CHANGE color color VARCHAR(50) DEFAULT \'NULL\', CHANGE updated_at updated_at DATETIME DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE inventory_oyster_tables CHANGE cells cells LONGTEXT NOT NULL COLLATE `utf8mb4_bin`, CHANGE last_maintenance_date last_maintenance_date DATE DEFAULT \'NULL\', CHANGE metadata metadata LONGTEXT DEFAULT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE inventory_products DROP status, CHANGE updated_at updated_at DATETIME DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE inventory_storage_locations CHANGE description description VARCHAR(255) DEFAULT \'NULL\', CHANGE temperature temperature LONGTEXT DEFAULT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE suppliers CHANGE address address VARCHAR(255) DEFAULT \'NULL\', CHANGE phone phone VARCHAR(20) DEFAULT \'NULL\', CHANGE email email VARCHAR(255) DEFAULT \'NULL\', CHANGE updated_at updated_at DATETIME DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE supplier_products CHANGE size size VARCHAR(50) DEFAULT \'NULL\', CHANGE price price VARCHAR(255) DEFAULT \'NULL\', CHANGE updated_at updated_at DATETIME DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE tables CHANGE position position LONGTEXT NOT NULL COLLATE `utf8mb4_bin`, CHANGE updated_at updated_at DATETIME DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE `user` CHANGE roles roles LONGTEXT NOT NULL COLLATE `utf8mb4_bin`');
    }
}
