# todolist# PROJET Programmation Web

## README - Get Started

Ce guide vous aidera à configurer et à lancer votre projet de programmation web.

### Prérequis

Avant de commencer, assurez-vous d'avoir installé les logiciels suivants :

1. **Node.js et npm** :
    - Téléchargez et installez Node.js et npm depuis le site officiel : [Node.js](https://nodejs.org/)

2. **Express.js** :
    - Express.js est un framework pour Node.js. Vous l'installerez via npm dans les étapes suivantes.

3. **MySQL** :
    - Téléchargez et installez MySQL depuis le site officiel : [MySQL](https://dev.mysql.com/downloads/mysql/)

4. **MySQL Workbench** :
    - Téléchargez et installez MySQL Workbench pour gérer visuellement vos bases de données : [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

5. **Visual Studio Code (VSCode)** :
    - Téléchargez et installez VSCode depuis le site officiel : [VSCode](https://code.visualstudio.com/)

### Configuration du projet

1. **Initialisez votre projet npm** :
    ```sh
    npm init
    ```

2. **Installez les dépendances nécessaires** :
    ```sh
    npm install express mysql bcrypt jsonwebtoken cors
    ```

3. **Installez bcryptjs** (si non inclus dans les dépendances précédentes) :
    ```sh
    npm install bcryptjs
    ```

### Configuration de la base de données

1. **Créez la base de données et les tables** :

    Ouvrez MySQL Workbench, connectez-vous à votre serveur MySQL et exécutez les commandes SQL suivantes pour créer votre base de données et vos tables :

    ```sql
    -- Créez la base de données
    CREATE DATABASE task_manager;
    USE task_manager;

    -- Créez la table pour les utilisateurs
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user'
    );

    -- Créez la table pour les tâches
    CREATE TABLE tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    ```

2. **Ajouter un rôle d'administrateur** (si ce n'est pas déjà fait) :

    ```sql
    ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user';
    ```
### Création d'un administrateur

1. **Hachez le mot de passe de l'administrateur** :

    Ajoutez le code suivant dans un fichier JavaScript pour hacher le mot de passe de l'administrateur :

    ```js
    const bcrypt = require('bcryptjs');

    async function hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(hashedPassword);
    }

    hashPassword('admin123');
    ```

    Exécutez ce fichier pour obtenir le mot de passe haché, puis insérez l'utilisateur administrateur dans la base de données.

2. **Insérez l'utilisateur administrateur dans la base de données** :

    Utilisez le mot de passe haché obtenu à l'étape précédente pour créer l'utilisateur administrateur dans la base de données.
    par exemple :

    ```sql
    INSERT INTO users (username, email, password, role) VALUES ('admin', 'admin@email.com', '$2a$10$WUVkewZNAyUbzUFZjWWXVeu.2cJLMp7B6/ThzRAlY66Ff7HHypqmq', 'admin');
    ```
### Lancement du projet

1. **Lancez votre application Node.js** :

    Assurez-vous que votre serveur MySQL est en cours d'exécution, dirigez-vous à l'emplacement de votre projet, puis lancez votre application Node.js :

    ```sh
    node src/api/index.js
    ```



Et voilà ! Vous avez configuré et lancé avec succès votre projet de programmation web.
