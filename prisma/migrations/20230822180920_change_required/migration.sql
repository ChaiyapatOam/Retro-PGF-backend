-- AlterTable
ALTER TABLE `Comment` MODIFY `title` VARCHAR(191) NULL,
    MODIFY `content` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Project` MODIFY `logo_url` VARCHAR(191) NULL,
    MODIFY `banner_url` VARCHAR(191) NULL,
    MODIFY `website_url` VARCHAR(191) NULL,
    MODIFY `description` VARCHAR(191) NULL,
    MODIFY `reason` VARCHAR(191) NULL,
    MODIFY `contact` VARCHAR(191) NULL;
