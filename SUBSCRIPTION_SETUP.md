# Configuration des Abonnements Premium pour TaleCrafting

## Vue d'ensemble

Ce guide explique comment configurer les abonnements Premium dans les stores iOS (App Store Connect) et Android (Google Play Console) pour l'application TaleCrafting.

## Produits d'abonnement configurés

### Identifiants des produits
- **Abonnement mensuel**: `com.talecrafting.app.premium.monthly`
- **Abonnement annuel**: `com.talecrafting.app.premium.yearly`

## Configuration App Store Connect (iOS)

### 1. Créer les produits d'abonnement

1. Connectez-vous à [App Store Connect](https://appstoreconnect.apple.com)
2. Sélectionnez votre application TaleCrafting
3. Allez dans **Fonctionnalités** > **Achats intégrés et abonnements**
4. Cliquez sur **Gérer** à côté de "Abonnements"
5. Créez un nouveau groupe d'abonnements :
   - **Nom de référence** : TaleCrafting Premium
   - **Nom d'affichage** : Premium

### 2. Ajouter les abonnements

#### Abonnement mensuel
- **ID de produit** : `com.talecrafting.app.premium.monthly`
- **Nom de référence** : Premium Mensuel
- **Durée** : 1 mois
- **Prix** : Définir selon votre stratégie (ex: 4,99€)
- **Nom d'affichage** : Abonnement Premium Mensuel
- **Description** : Accès complet à toutes les fonctionnalités premium de TaleCrafting

#### Abonnement annuel
- **ID de produit** : `com.talecrafting.app.premium.yearly`
- **Nom de référence** : Premium Annuel
- **Durée** : 1 an
- **Prix** : Définir selon votre stratégie (ex: 39,99€)
- **Nom d'affichage** : Abonnement Premium Annuel
- **Description** : Accès complet à toutes les fonctionnalités premium de TaleCrafting pendant 12 mois

### 3. Configuration des métadonnées

Pour chaque abonnement, ajoutez :
- **Capture d'écran** montrant les fonctionnalités premium
- **Texte promotionnel** expliquant les avantages
- **Conditions d'utilisation** et **Politique de confidentialité**

## Configuration Google Play Console (Android)

### 1. Créer les produits d'abonnement

1. Connectez-vous à [Google Play Console](https://play.google.com/console)
2. Sélectionnez votre application TaleCrafting
3. Allez dans **Monétisation** > **Produits** > **Abonnements**
4. Cliquez sur **Créer un abonnement**

### 2. Configuration des abonnements

#### Abonnement mensuel
- **ID de produit** : `com.talecrafting.app.premium.monthly`
- **Nom** : Premium Mensuel
- **Description** : Accès complet aux fonctionnalités premium
- **Période de facturation** : Mensuel
- **Prix** : Définir selon votre stratégie
- **Essai gratuit** : Optionnel (ex: 7 jours)

#### Abonnement annuel
- **ID de produit** : `com.talecrafting.app.premium.yearly`
- **Nom** : Premium Annuel
- **Description** : Accès complet aux fonctionnalités premium pendant 12 mois
- **Période de facturation** : Annuel
- **Prix** : Définir selon votre stratégie
- **Essai gratuit** : Optionnel (ex: 7 jours)

### 3. Configuration des offres

Pour chaque abonnement :
1. Créez une **offre de base**
2. Définissez les **phases de tarification**
3. Configurez les **pays et régions**
4. Activez l'abonnement

## Fonctionnalités Premium implémentées

### ✅ Fonctionnalités débloquées avec Premium

1. **Thèmes personnalisés** - Créez des histoires avec vos propres thèmes
2. **Styles narratifs** - Choisissez parmi différents styles d'écriture
3. **Lieux personnalisés** - Définissez le cadre de vos histoires
4. **Éléments spéciaux** - Ajoutez de la magie à vos récits
5. **Personnages illimités** - Créez autant de personnages que vous voulez
6. **Suites illimitées** - Continuez vos histoires sans limite
7. **Sans publicité** - Profitez d'une expérience sans interruption
8. **Sauvegarde cloud** - Synchronisez vos histoires (à implémenter)

### 🔒 Limitations pour les utilisateurs gratuits

1. **Thèmes prédéfinis uniquement**
2. **Style narratif standard**
3. **Lieux prédéfinis**
4. **Pas d'éléments spéciaux**
5. **Maximum 3 personnages secondaires**
6. **1 suite par jour maximum**
7. **Publicités avant chaque histoire**
8. **Sauvegarde locale uniquement**

## Test des achats in-app

### Mode développement

1. **iOS** : Utilisez un compte de test Sandbox dans App Store Connect
2. **Android** : Utilisez des comptes de test dans Google Play Console
3. **Expo Go** : Les achats in-app ne fonctionnent pas dans Expo Go, utilisez un build de développement

### Commandes de test

```bash
# Créer un build de développement
eas build --profile development --platform ios
eas build --profile development --platform android

# Installer sur l'appareil
eas install --id [BUILD_ID]
```

## Gestion des abonnements

### Restauration des achats

L'application inclut une fonction de restauration des achats accessible depuis :
- L'écran d'abonnement (bouton "Restaurer")
- Les paramètres de l'application

### Vérification du statut

Le service `InAppPurchaseService` vérifie automatiquement :
- Le statut de l'abonnement au démarrage
- L'expiration des abonnements
- La synchronisation avec les stores

## Déploiement en production

### Checklist avant publication

- [ ] Produits d'abonnement créés et activés dans les deux stores
- [ ] Prix configurés pour tous les marchés
- [ ] Métadonnées et descriptions ajoutées
- [ ] Tests effectués avec des comptes de test
- [ ] Politique de confidentialité mise à jour
- [ ] Conditions d'utilisation mises à jour
- [ ] Build de production créé avec EAS

### Commandes de déploiement

```bash
# Build de production
eas build --profile production --platform all

# Soumission aux stores
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

## Support et dépannage

### Problèmes courants

1. **Produits non trouvés** : Vérifiez les IDs de produits dans les stores
2. **Achats échoués** : Vérifiez la configuration des comptes de test
3. **Restauration impossible** : Vérifiez la connexion au store

### Logs de débogage

Le service d'achats in-app inclut des logs détaillés pour le débogage :

```javascript
// Activer les logs détaillés
console.log('In-App Purchase logs enabled');
```

## Ressources utiles

- [Documentation Expo In-App Purchases](https://docs.expo.dev/versions/latest/sdk/in-app-purchases/)
- [Guide App Store Connect](https://developer.apple.com/app-store-connect/)
- [Guide Google Play Console](https://support.google.com/googleplay/android-developer/)
- [Politiques des stores](https://developer.apple.com/app-store/review/guidelines/)