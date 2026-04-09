<div align="center">
  <h1>🧀 Raclettator</h1>
  <p><strong>L'outil ultime pour organiser vos soirées raclette sans prise de tête.</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  <br />
  <br />
  <a href="https://raclettator.kghome.ddns.net/">
    <img src="https://img.shields.io/badge/🚀_TESTER_LA_LIVE_DEMO-Cliquer_ici-FF4500?style=for-the-badge" alt="Live Demo" height="40" />
  </a>
</div>

<br />

## 📖 À propos du projet

**Raclettator** est une application web moderne (PWA) conçue pour simplifier l'organisation d'événements collaboratifs, et plus spécifiquement : les soirées raclette. Finis les tableurs compliqués ou les groupes de discussion où l'on perd le fil des courses. 

Le but de cette application est de répondre à une question simple mais cruciale : *"Qui amène quoi, et en quelle quantité ?"*

Grâce à un algorithme intelligent, Raclettator calcule automatiquement les quantités d'ingrédients nécessaires (fromage, charcuterie, pommes de terre, etc.) en fonction du profil des invités (gros mangeurs, végétariens, sans porc, sans alcool).

---

## 🎯 Objectif

Ce projet a été développé avec une approche "production-ready" pour démontrer mes compétences en tant que développeur **Full-Stack**. Voici ce qu'il met en valeur :

- **Architecture Moderne** : Utilisation avancée de **Next.js (App Router)** et des **React Server Actions** pour une gestion des données fluide et sécurisée sans API REST intermédiaire.
- **Modélisation de Données** : Conception robuste d'un schéma relationnel avec **Prisma** et **PostgreSQL**, gérant l'intégrité référentielle entre les événements, les participants et les contributions.
- **Expérience Utilisateur (UX)** : Interface soignée, intuitive et responsive (Mobile First), utilisant **Tailwind CSS v4** et les composants accessibles de **shadcn/ui** / **Radix UI**.
- **Progressive Web App (PWA)** : L'application répond aux standards PWA et est installable sur smartphone/desktop pour offrir une expérience quasi-native.
- **Fiabilité & Sécurité** : Validation stricte des données côté client et serveur via **Zod**, paramétrage strict des headers de sécurité (Nginx) et implémentation d'un système de *Rate Limiting* pour protéger l'application contre les abus.
- **SEO & Internationalisation (i18n)** : Optimisation des métadonnées pour le référencement et architecture prête pour le multilingue avec **next-intl**.
- **Vibecoding & IA** : Ce projet est également une expérimentation de développement "Vibecoding" (pair-programming avec l'agent IA avancé Deepmind Antigravity), démontrant la capacité à concevoir, itérer et déployer rapidement une application de production en collaboration avec l'intelligence artificielle.

---

## ✨ Fonctionnalités Clés

- 🔗 **Zéro Friction** : Création d'événements sans création de compte. L'accès se fait via des tokens cryptographiques uniques générés de manière sécurisée (liens publics et administrateurs).
- 🧠 **Calculs Intelligents** : Adaptation automatique des listes de courses en fonction des restrictions alimentaires (Végé, Sans Porc, Sans Alcool) et de l'appétit de chacun (Small, Medium, XL).
- 🛍️ **Répartition des Courses collaborative** : Interface en temps réel (ou quasi-réel) pour que chaque membre puisse s'attribuer facilement ce qu'il doit s'engager à amener.
- 📱 **Mobile First** : Navigation pensée spécifiquement pour les écrans tactiles via une interface de type "sidebar" intuitive.
- 🎨 **Thème Sombre / Clair** : Support complet du Dark Mode basculable à la volée.

---

## 🛠️ Stack Technique

### Frontend
- **Framework** : React 19 + Next.js 16 (App Router)
- **Styling** : Tailwind CSS v4 + Tailwind Merge + clsx
- **UI Components** : shadcn/ui, Radix UI, Base UI
- **Icônes** : Lucide React
- **Internationalisation** : next-intl

### Backend & Données
- **Langage** : TypeScript
- **Base de données** : PostgreSQL
- **ORM** : Prisma Client (`@prisma/adapter-pg`)
- **Validation** : Zod
- **Sécurité / Env** : dotenvx

---

## 🚀 Installation & Lancement Local

Vous souhaitez explorer le code ou faire tourner le projet en local ? Suivez ces quelques étapes :

### 1. Prérequis
- Node.js (v20+)
- Une base de données PostgreSQL en cours d'exécution.

### 2. Cloner le repository
```bash
git clone https://github.com/votre-pseudo/nextjs-raclettator.git
cd nextjs-raclettator
```

### 3. Installer les dépendances
```bash
npm install
```

### 4. Configuration de l'environnement
Créez un fichier `.env` à la racine du projet et ajoutez votre chaîne de connexion à la base de données :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/raclettator"
```

### 5. Initialiser la base de données
Exécutez la commande Prisma pour mettre à jour la base de données avec le schéma du projet :
```bash
npx prisma db push
```

### 6. Lancer le serveur de développement
```bash
npm run dev
```
L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

---

<div align="center">
  <i>Développé avec 🧀 et ❤️. Mangez de la raclette.</i>
</div>