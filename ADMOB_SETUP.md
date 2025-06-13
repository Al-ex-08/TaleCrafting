# Configuration AdMob pour TaleCrafting

## ID d'application AdMob configuré
- **ID d'application**: `ca-app-pub-8249851704591038~2429423419`

## Bibliothèque utilisée
- **react-native-google-mobile-ads** (remplace expo-ads-admob qui est obsolète)

## Configuration des unités publicitaires

### Étapes pour configurer les vraies unités publicitaires:

1. **Connectez-vous à votre console AdMob** (https://admob.google.com)

2. **Créez une unité publicitaire interstitielle**:
   - Type: Interstitiel
   - Format: Interstitiel
   - Nom: "TaleCrafting - Publicité avant histoire"

3. **Remplacez l'ID de test dans le code**:
   - Fichier: `src/screens/CreateStoryScreen.js`
   - Ligne: `const ADMOB_INTERSTITIAL_ID = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-8249851704591038/9593597567';`
   - L'ID de bannière `9593597567` est maintenant configuré pour la production

## ID de bannière configuré
- **Interstitiel**: `ca-app-pub-8249851704591038/9593597567` (configuré pour la production)

## Fonctionnalités implémentées

✅ **Publicité interstitielle obligatoire** pour les utilisateurs gratuits
✅ **Fallback vers publicité simulée** en cas d'erreur
✅ **Navigation automatique** vers l'histoire après la publicité
✅ **Configuration de test** pour le développement
✅ **Gestion d'erreurs** robuste

## Notes importantes

- Les utilisateurs Premium ne voient aucune publicité
- La publicité s'affiche avant chaque histoire générée (utilisateurs gratuits)
- En cas d'échec du chargement AdMob, une publicité simulée de 5 secondes s'affiche
- L'ID de test `EMULATOR` est configuré pour le développement

## Test de la fonctionnalité

1. Assurez-vous d'être en mode gratuit (non Premium)
2. Générez une histoire
3. La publicité AdMob devrait s'afficher
4. Après la publicité, vous êtes redirigé vers l'histoire

## Prochaines étapes

1. Créer l'unité publicitaire interstitielle dans AdMob
2. Remplacer l'ID de test par le vrai ID
3. Tester sur un appareil réel
4. Optionnel: Ajouter des bannières publicitaires sur d'autres écrans