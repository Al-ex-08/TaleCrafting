# TaleCrafting 📚✨

TaleCrafting est une application mobile innovante qui utilise l'intelligence artificielle pour créer des histoires personnalisées et captivantes. Développée avec React Native et Expo, l'application offre une expérience immersive de création d'histoires pour tous les âges.

## 🌟 Fonctionnalités

### Mode d'utilisation
- **Mode Standard** : Histoires pour tous publics avec complexité narrative
- **Mode Kids** : Histoires adaptées aux enfants avec langage simple et thèmes amusants

### Création d'histoires
- Personnalisation avec prénom du héros et âge
- Choix de thème ou génération automatique par l'IA
- Sélection du style narratif (aventure, poétique, magique, etc.)
- Possibilité de créer des suites d'histoires existantes

### Lecture et interaction
- Lecture à voix haute avec Expo Speech
- Export PDF avec mise en page thématique
- Partage des histoires
- Sauvegarde automatique

### Gestion des histoires
- Historique complet des créations
- Système de favoris
- Statuts : "complété", "à continuer", "à relire"
- Recherche et filtres

### Personnalisation
- Mode sombre/clair
- Taille de police ajustable
- Interface adaptée selon le mode choisi

## 🚀 Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn
- Expo CLI
- Application Expo Go sur votre téléphone (pour les tests)

### Étapes d'installation

1. **Cloner le projet** (si applicable)
   ```bash
   git clone <repository-url>
   cd TaleCrafting
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm start
   # ou
   npx expo start
   ```

4. **Tester l'application**
   - Scannez le QR code avec l'app Expo Go
   - Ou utilisez un émulateur Android/iOS
   - Ou testez dans le navigateur web

## 📱 Utilisation

### Premier lancement
1. Choisissez votre mode (Standard ou Kids)
2. Explorez l'interface d'accueil
3. Créez votre première histoire

### Créer une histoire
1. Appuyez sur "Créer une histoire"
2. Remplissez le prénom du héros
3. Ajoutez l'âge (optionnel)
4. Choisissez un thème ou laissez l'IA décider
5. Sélectionnez le style narratif
6. Appuyez sur "Générer l'histoire"

### Gérer vos histoires
- Accédez à "Mes histoires" pour voir toutes vos créations
- Utilisez les filtres pour trouver rapidement une histoire
- Marquez vos favoris avec le cœur
- Créez des suites en appuyant sur le bouton "+"

## 🛠️ Technologies utilisées

- **React Native** avec Expo
- **React Navigation** pour la navigation
- **Expo Speech** pour la lecture vocale
- **Expo Print** pour l'export PDF
- **AsyncStorage** pour la persistance des données
- **Expo Vector Icons** pour les icônes

## 📁 Structure du projet

```
TaleCrafting/
├── src/
│   ├── screens/          # Écrans de l'application
│   │   ├── HomeScreen.js
│   │   ├── CreateStoryScreen.js
│   │   ├── StoryDisplayScreen.js
│   │   ├── HistoryScreen.js
│   │   └── SettingsScreen.js
│   ├── context/          # Contexte React pour l'état global
│   │   └── AppContext.js
│   ├── components/       # Composants réutilisables
│   ├── utils/           # Utilitaires et helpers
│   └── styles/          # Styles globaux
├── App.js               # Point d'entrée principal
├── package.json
└── README.md
```

## 🔮 Fonctionnalités futures

### Intégration IA
- [ ] Connexion à l'API OpenAI pour la génération de texte
- [ ] Personnalisation avancée des prompts selon le mode
- [ ] Génération d'images pour illustrer les histoires

### Améliorations UX
- [ ] Animations et transitions fluides
- [ ] Mode hors ligne avec cache
- [ ] Synchronisation cloud (Supabase)
- [ ] Partage social intégré

### Fonctionnalités avancées
- [ ] Création de personnages récurrents
- [ ] Univers partagés entre histoires
- [ ] Mode collaboratif pour créer des histoires à plusieurs
- [ ] Statistiques détaillées de lecture

## 🐛 Problèmes connus

- La génération d'histoires utilise actuellement un texte simulé
- L'export PDF nécessite des améliorations de mise en page
- Certaines fonctionnalités nécessitent une connexion internet

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Optimiser le code existant

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation Expo
- Vérifiez les logs de développement

---

**Créé avec ❤️ et React Native + Expo**

*TaleCrafting - Où chaque histoire devient une aventure unique !* ✨