-- DropForeignKey
ALTER TABLE `Consumo` DROP FOREIGN KEY `Consumo_unidadeId_fkey`;

-- DropForeignKey
ALTER TABLE `Unidade` DROP FOREIGN KEY `Unidade_leadId_fkey`;

-- DropIndex
DROP INDEX `Consumo_unidadeId_fkey` ON `Consumo`;

-- DropIndex
DROP INDEX `Unidade_leadId_fkey` ON `Unidade`;

-- AddForeignKey
ALTER TABLE `Unidade` ADD CONSTRAINT `Unidade_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consumo` ADD CONSTRAINT `Consumo_unidadeId_fkey` FOREIGN KEY (`unidadeId`) REFERENCES `Unidade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
