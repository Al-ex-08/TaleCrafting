import * as InAppPurchases from 'expo-in-app-purchases';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration des produits d'abonnement
const SUBSCRIPTION_PRODUCTS = {
  ios: [
    'com.talecrafting.app.premium.monthly',
    'com.talecrafting.app.premium.yearly'
  ],
  android: [
    'com.talecrafting.app.premium.monthly',
    'com.talecrafting.app.premium.yearly'
  ]
};

class InAppPurchaseService {
  constructor() {
    this.isInitialized = false;
    this.products = [];
    this.purchaseListener = null;
  }

  // Initialiser le service d'achats in-app
  async initialize() {
    try {
      console.log('Initializing In-App Purchases...');
      
      // Vérifier si les achats in-app sont disponibles
      const isAvailable = await InAppPurchases.isAvailableAsync();
      if (!isAvailable) {
        console.warn('In-App Purchases not available on this device');
        return false;
      }

      // Se connecter au store
      await InAppPurchases.connectAsync();
      
      // Charger les produits
      await this.loadProducts();
      
      // Configurer le listener pour les achats
      this.setupPurchaseListener();
      
      // Restaurer les achats existants
      await this.restorePurchases();
      
      this.isInitialized = true;
      console.log('In-App Purchases initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing In-App Purchases:', error);
      return false;
    }
  }

  // Charger les produits disponibles
  async loadProducts() {
    try {
      const productIds = Platform.OS === 'ios' 
        ? SUBSCRIPTION_PRODUCTS.ios 
        : SUBSCRIPTION_PRODUCTS.android;
      
      const { results, responseCode } = await InAppPurchases.getProductsAsync(productIds);
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        this.products = results;
        console.log('Products loaded:', this.products.length);
        return this.products;
      } else {
        console.error('Failed to load products, response code:', responseCode);
        return [];
      }
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  }

  // Obtenir les produits disponibles
  getProducts() {
    return this.products.map(product => ({
      id: product.productId,
      title: product.title,
      description: product.description,
      price: product.price,
      priceString: product.priceString,
      currency: product.currencyCode,
      type: product.type
    }));
  }

  // Configurer le listener pour les achats
  setupPurchaseListener() {
    this.purchaseListener = InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        results.forEach((purchase) => {
          if (!purchase.acknowledged) {
            this.handlePurchaseSuccess(purchase);
          }
        });
      } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
        console.log('User canceled the purchase');
      } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
        console.log('Purchase deferred');
      } else {
        console.error('Purchase failed:', errorCode);
        Alert.alert(
          'Erreur d\'achat',
          'Une erreur est survenue lors de l\'achat. Veuillez réessayer.'
        );
      }
    });
  }

  // Gérer un achat réussi
  async handlePurchaseSuccess(purchase) {
    try {
      console.log('Purchase successful:', purchase.productId);
      
      // Sauvegarder l'information d'abonnement
      await this.savePurchaseInfo(purchase);
      
      // Finaliser l'achat
      await InAppPurchases.finishTransactionAsync(purchase, true);
      
      Alert.alert(
        'Achat réussi !',
        'Votre abonnement Premium a été activé. Profitez de toutes les fonctionnalités !'
      );
      
      return true;
    } catch (error) {
      console.error('Error handling purchase success:', error);
      return false;
    }
  }

  // Sauvegarder les informations d'achat
  async savePurchaseInfo(purchase) {
    try {
      const purchaseInfo = {
        productId: purchase.productId,
        transactionId: purchase.transactionId,
        purchaseTime: purchase.purchaseTime,
        expirationTime: purchase.expirationTime,
        isActive: true
      };
      
      await AsyncStorage.setItem('premiumPurchase', JSON.stringify(purchaseInfo));
      
      // Mettre à jour le statut premium dans les paramètres
      const settings = await AsyncStorage.getItem('appSettings');
      const currentSettings = settings ? JSON.parse(settings) : {};
      const updatedSettings = { ...currentSettings, isPremium: true };
      await AsyncStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      
    } catch (error) {
      console.error('Error saving purchase info:', error);
    }
  }

  // Acheter un produit
  async purchaseProduct(productId) {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Failed to initialize In-App Purchases');
        }
      }

      console.log('Attempting to purchase:', productId);
      await InAppPurchases.purchaseItemAsync(productId);
      
    } catch (error) {
      console.error('Error purchasing product:', error);
      Alert.alert(
        'Erreur d\'achat',
        'Impossible de traiter l\'achat. Vérifiez votre connexion et réessayez.'
      );
    }
  }

  // Restaurer les achats
  async restorePurchases() {
    try {
      console.log('Restoring purchases...');
      const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        const activePurchases = results.filter(purchase => {
          // Vérifier si l'abonnement est encore actif
          if (purchase.expirationTime) {
            return new Date(purchase.expirationTime) > new Date();
          }
          return true; // Pour les achats permanents
        });
        
        if (activePurchases.length > 0) {
          // Restaurer le statut premium
          await this.savePurchaseInfo(activePurchases[0]);
          console.log('Premium status restored');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error restoring purchases:', error);
      return false;
    }
  }

  // Vérifier le statut de l'abonnement
  async checkSubscriptionStatus() {
    try {
      const purchaseInfo = await AsyncStorage.getItem('premiumPurchase');
      if (!purchaseInfo) return false;
      
      const purchase = JSON.parse(purchaseInfo);
      
      // Vérifier si l'abonnement est encore valide
      if (purchase.expirationTime) {
        const isActive = new Date(purchase.expirationTime) > new Date();
        if (!isActive) {
          // Abonnement expiré, mettre à jour le statut
          await this.updatePremiumStatus(false);
          return false;
        }
      }
      
      return purchase.isActive;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  // Mettre à jour le statut premium
  async updatePremiumStatus(isPremium) {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      const currentSettings = settings ? JSON.parse(settings) : {};
      const updatedSettings = { ...currentSettings, isPremium };
      await AsyncStorage.setItem('appSettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error updating premium status:', error);
    }
  }

  // Nettoyer les ressources
  async cleanup() {
    try {
      if (this.purchaseListener) {
        this.purchaseListener.remove();
        this.purchaseListener = null;
      }
      
      if (this.isInitialized) {
        await InAppPurchases.disconnectAsync();
        this.isInitialized = false;
      }
    } catch (error) {
      console.error('Error cleaning up In-App Purchases:', error);
    }
  }
}

// Exporter une instance singleton
export default new InAppPurchaseService();