<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250307011156 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE cells (id INT AUTO_INCREMENT NOT NULL, table_id INT NOT NULL, row_index INT NOT NULL, column_index INT NOT NULL, cell_number INT NOT NULL, status VARCHAR(50) NOT NULL, quantity INT NOT NULL, color VARCHAR(50) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, INDEX IDX_55C1CBD8ECFF285C (table_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inventory_items (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type VARCHAR(20) NOT NULL, quantity INT NOT NULL, location VARCHAR(255) DEFAULT NULL, size VARCHAR(50) DEFAULT NULL, harvest_date DATE DEFAULT NULL, notes LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inventory_oyster_tables (id INT AUTO_INCREMENT NOT NULL, table_number VARCHAR(50) NOT NULL, cells JSON NOT NULL, status VARCHAR(50) NOT NULL, last_maintenance_date DATE DEFAULT NULL, capacity INT NOT NULL, metadata JSON DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inventory_products (id INT AUTO_INCREMENT NOT NULL, storage_location_id INT NOT NULL, name VARCHAR(255) NOT NULL, sku VARCHAR(50) NOT NULL, category VARCHAR(100) NOT NULL, quantity NUMERIC(10, 2) NOT NULL, unit VARCHAR(20) NOT NULL, arrival_date DATE NOT NULL, expiry_date DATE DEFAULT NULL, status VARCHAR(20) NOT NULL, minimum_stock NUMERIC(10, 2) NOT NULL, maximum_stock NUMERIC(10, 2) NOT NULL, INDEX IDX_7F0E0CBCDDD8AF (storage_location_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inventory_purification_pools (id INT AUTO_INCREMENT NOT NULL, pool_number VARCHAR(50) NOT NULL, status VARCHAR(50) NOT NULL, last_maintenance_date DATE DEFAULT NULL, uv_lamp_hours INT NOT NULL, water_parameters JSON NOT NULL, capacity INT NOT NULL, current_occupancy INT NOT NULL, maintenance_history JSON DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE inventory_storage_locations (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type VARCHAR(50) NOT NULL, capacity INT NOT NULL, description VARCHAR(255) DEFAULT NULL, temperature JSON DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE supplier_products (id INT AUTO_INCREMENT NOT NULL, supplier_id INT NOT NULL, name VARCHAR(255) NOT NULL, type VARCHAR(20) NOT NULL, size VARCHAR(50) DEFAULT NULL, price NUMERIC(10, 2) DEFAULT NULL, available TINYINT(1) NOT NULL, description LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, INDEX IDX_3E3332DB2ADD6D8C (supplier_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE suppliers (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, contact VARCHAR(255) DEFAULT NULL, email VARCHAR(255) DEFAULT NULL, phone VARCHAR(20) DEFAULT NULL, address LONGTEXT DEFAULT NULL, notes LONGTEXT DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE tables (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type VARCHAR(20) NOT NULL, position JSON NOT NULL, `rows` INT NOT NULL, columns INT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, name VARCHAR(255) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME DEFAULT NULL, last_login_at DATETIME DEFAULT NULL, UNIQUE INDEX UNIQ_1483A5E9E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE cells ADD CONSTRAINT FK_55C1CBD8ECFF285C FOREIGN KEY (table_id) REFERENCES tables (id)');
        $this->addSql('ALTER TABLE inventory_products ADD CONSTRAINT FK_7F0E0CBCDDD8AF FOREIGN KEY (storage_location_id) REFERENCES inventory_storage_locations (id)');
        $this->addSql('ALTER TABLE supplier_products ADD CONSTRAINT FK_3E3332DB2ADD6D8C FOREIGN KEY (supplier_id) REFERENCES suppliers (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cells DROP FOREIGN KEY FK_55C1CBD8ECFF285C');
        $this->addSql('ALTER TABLE inventory_products DROP FOREIGN KEY FK_7F0E0CBCDDD8AF');
        $this->addSql('ALTER TABLE supplier_products DROP FOREIGN KEY FK_3E3332DB2ADD6D8C');
        $this->addSql('DROP TABLE cells');
        $this->addSql('DROP TABLE inventory_items');
        $this->addSql('DROP TABLE inventory_oyster_tables');
        $this->addSql('DROP TABLE inventory_products');
        $this->addSql('DROP TABLE inventory_purification_pools');
        $this->addSql('DROP TABLE inventory_storage_locations');
        $this->addSql('DROP TABLE supplier_products');
        $this->addSql('DROP TABLE suppliers');
        $this->addSql('DROP TABLE tables');
        $this->addSql('DROP TABLE users');
    }
}
