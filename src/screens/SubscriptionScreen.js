import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import InAppPurchaseService from '../services/InAppPurchaseService';

const { width } = Dimensions.get('window');

const SubscriptionScreen = ({ navigation }) => {
  const { isDarkMode, isKidsMode, togglePremium } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    initializePurchases();
  }, []);

  const initializePurchases = async () => {
    try {
      setLoading(true);
      const initialized = await InAppPurchaseService.initialize();
      
      if (initialized) {
        const availableProducts = InAppPurchaseService.getProducts();
        setProducts(availableProducts);
        
        // Sélectionner le produit mensuel par défaut
        const monthlyProduct = availableProducts.find(p => p.id.includes('monthly'));
        if (monthlyProduct) {
          setSelectedProduct(monthlyProduct.id);
        }
      } else {
        Alert.alert(
          'Service indisponible',
          'Les achats in-app ne sont pas disponibles sur cet appareil.'
        );
      }
    } catch (error) {
      console.error('Error initializing purchases:', error);
      Alert.alert('Erreur', 'Impossible de charger les options d\'abonnement.');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedProduct) {
      Alert.alert('Erreur', 'Veuillez sélectionner un abonnement.');
      return;
    }

    try {
      setPurchasing(true);
      await InAppPurchaseService.purchaseProduct(selectedProduct);
      
      // Mettre à jour le statut premium dans le contexte
      togglePremium();
      
      // Retourner à l'écran précédent
      navigation.goBack();
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setLoading(true);
      const restored = await InAppPurchaseService.restorePurchases();
      
      if (restored) {
        togglePremium();
        Alert.alert(
          'Restauration réussie',
          'Votre abonnement Premium a été restauré !'
        );
        navigation.goBack();
      } else {
        Alert.alert(
          'Aucun achat trouvé',
          'Aucun abonnement actif n\'a été trouvé sur ce compte.'
        );
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de restaurer les achats.');
    } finally {
      setLoading(false);
    }
  };

  const premiumFeatures = [
    {
      icon: 'color-palette',
      title: 'Thèmes personnalisés',
      description: 'Créez des histoires avec vos propres thèmes'
    },
    {
      icon: 'brush',
      title: 'Styles narratifs',
      description: 'Choisissez parmi différents styles d\'écriture'
    },
    {
      icon: 'location',
      title: 'Lieux personnalisés',
      description: 'Définissez le cadre de vos histoires'
    },
    {
      icon: 'sparkles',
      title: 'Éléments spéciaux',
      description: 'Ajoutez de la magie à vos récits'
    },
    {
      icon: 'people',
      title: 'Personnages illimités',
      description: 'Créez autant de personnages que vous voulez'
    },
    {
      icon: 'infinite',
      title: 'Suites illimitées',
      description: 'Continuez vos histoires sans limite'
    },
    {
      icon: 'ban',
      title: 'Sans publicité',
      description: 'Profitez d\'une expérience sans interruption'
    },
    {
      icon: 'cloud-download',
      title: 'Sauvegarde cloud',
      description: 'Synchronisez vos histoires sur tous vos appareils'
    }
  ];

  const theme = {
    background: isDarkMode ? '#1a1a1a' : '#f8fafc',
    cardBackground: isDarkMode ? '#2d2d2d' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1f2937',
    textSecondary: isDarkMode ? '#9ca3af' : '#6b7280',
    primary: isKidsMode ? '#f59e0b' : '#6366f1',
    primaryLight: isKidsMode ? '#fef3c7' : '#e0e7ff',
    border: isDarkMode ? '#374151' : '#e5e7eb',
    success: '#10b981',
    gradient: isKidsMode 
      ? ['#f59e0b', '#f97316'] 
      : ['#6366f1', '#8b5cf6']
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Chargement des options d'abonnement...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Premium</Text>
        <TouchableOpacity onPress={handleRestore}>
          <Text style={[styles.restoreText, { color: theme.primary }]}>Restaurer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: theme.primaryLight }]}>
          <Ionicons name="star" size={48} color={theme.primary} />
          <Text style={[styles.heroTitle, { color: theme.primary }]}>
            Débloquez tout le potentiel de TaleCrafting
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Créez des histoires illimitées avec toutes les fonctionnalités premium
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Fonctionnalités Premium
          </Text>
          
          <View style={styles.featuresGrid}>
            {premiumFeatures.map((feature, index) => (
              <View key={index} style={[styles.featureCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                <Ionicons name={feature.icon} size={24} color={theme.primary} />
                <Text style={[styles.featureTitle, { color: theme.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Subscription Plans */}
        <View style={styles.plansSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Choisissez votre abonnement
          </Text>
          
          {products.map((product) => {
            const isSelected = selectedProduct === product.id;
            const isYearly = product.id.includes('yearly');
            
            return (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: theme.cardBackground,
                    borderColor: isSelected ? theme.primary : theme.border,
                    borderWidth: isSelected ? 2 : 1
                  }
                ]}
                onPress={() => setSelectedProduct(product.id)}
              >
                {isYearly && (
                  <View style={[styles.popularBadge, { backgroundColor: theme.success }]}>
                    <Text style={styles.popularText}>Populaire</Text>
                  </View>
                )}
                
                <View style={styles.planHeader}>
                  <Text style={[styles.planTitle, { color: theme.text }]}>
                    {isYearly ? 'Abonnement Annuel' : 'Abonnement Mensuel'}
                  </Text>
                  {isYearly && (
                    <Text style={[styles.savingText, { color: theme.success }]}>
                      Économisez 30%
                    </Text>
                  )}
                </View>
                
                <Text style={[styles.planPrice, { color: theme.primary }]}>
                  {product.priceString}
                  <Text style={[styles.planPeriod, { color: theme.textSecondary }]}>
                    {isYearly ? '/an' : '/mois'}
                  </Text>
                </Text>
                
                <Text style={[styles.planDescription, { color: theme.textSecondary }]}>
                  {isYearly 
                    ? 'Accès complet pendant 12 mois'
                    : 'Accès complet, renouvelé chaque mois'
                  }
                </Text>
                
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Purchase Button */}
        <TouchableOpacity
          style={[
            styles.purchaseButton,
            { backgroundColor: theme.primary },
            purchasing && styles.purchaseButtonDisabled
          ]}
          onPress={handlePurchase}
          disabled={purchasing || !selectedProduct}
        >
          {purchasing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.purchaseButtonText}>
              Commencer l'abonnement Premium
            </Text>
          )}
        </TouchableOpacity>

        {/* Terms */}
        <Text style={[styles.termsText, { color: theme.textSecondary }]}>
          L'abonnement sera automatiquement renouvelé sauf annulation au moins 24h avant la fin de la période en cours. 
          Vous pouvez gérer vos abonnements dans les paramètres de votre compte App Store ou Google Play.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  restoreText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    padding: 32,
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  plansSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  planCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  savingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  purchaseButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 20,
    paddingBottom: 40,
    textAlign: 'center',
  },
});

export default SubscriptionScreen;