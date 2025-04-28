CREATE DATABASE IF NOT EXISTS `todo_users`;
USE `todo_users`;

-- Table `users`
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `mot_de_passe` VARCHAR(255) NOT NULL,
  `nom` VARCHAR(50) NOT NULL,
  `prenom` VARCHAR(50) NOT NULL,
  `role` ENUM('admin', 'user') DEFAULT 'user',
  `date_creation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table `priorite`
DROP TABLE IF EXISTS `priorite`;
CREATE TABLE `priorite` (
  `id_priorite` INT NOT NULL AUTO_INCREMENT,
  `niveau` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id_priorite`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Table `tache`
DROP TABLE IF EXISTS `tache`;
CREATE TABLE `tache` (
  `id_tache` INT NOT NULL AUTO_INCREMENT,
  `titre` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `date_creation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `est_complete` TINYINT(1) DEFAULT '0',
  `id_user` INT DEFAULT NULL,
  `priorite_id` INT DEFAULT NULL,
  PRIMARY KEY (`id_tache`),
  KEY `id_user` (`id_user`),
  KEY `fk_priorite` (`priorite_id`),
  CONSTRAINT `fk_priorite` FOREIGN KEY (`priorite_id`) REFERENCES `priorite` (`id_priorite`) ON DELETE SET NULL,
  CONSTRAINT `tache_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;