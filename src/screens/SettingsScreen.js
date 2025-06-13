import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const SettingsScreen = () => {
  const { 
    isKidsMode, 
    isDarkMode, 
    fontSize, 
    storyLength,
    isPremium,
    toggleKidsMode, 
    toggleDarkMode, 
    changeFontSize,
    changeStoryLength,
    togglePremium,
    stories,
    clearAllData
  } = useApp();

  const storyLengths = [
    { key: 'short', label: 'Histoire courte', description: '2-3 paragraphes', icon: 'document-text' },
    { key: 'medium', label: 'Histoire moyenne', description: '4-6 paragraphes', icon: 'document' },
    { key: 'long', label: 'Histoire longue', description: '7-10 paragraphes', icon: 'documents' }
  ];

  const theme = {
    background: isDarkMode ? '#1a1a1a' : '#f8fafc',
    cardBackground: isDarkMode ? '#2d2d2d' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1f2937',
    textSecondary: isDarkMode ? '#d1d5db' : '#6b7280',
    primary: '#6366f1',
    primaryLight: '#818cf8',
    kidsMode: '#f59e0b',
    kidsModeLight: '#fbbf24',
    danger: '#ef4444'
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Effacer toutes les données',
      'Cette action supprimera définitivement toutes vos histoires et paramètres. Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Succès', 'Toutes les données ont été effacées.');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'effacer les données.');
            }
          }
        }
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const allData = {
        stories,
        settings: {
          isKidsMode,
          isDarkMode,
          fontSize
        },
        exportDate: new Date().toISOString()
      };
      
      // In a real app, you would use a file sharing library
      Alert.alert(
        'Export des données',
        `Données prêtes à être exportées:\n\n${stories.length} histoires\nParamètres sauvegardés\n\nFonctionnalité d'export complète à implémenter avec expo-sharing.`
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exporter les données.');
    }
  };

  const handleShowPremiumInfo = () => {
    Alert.alert(
      'Pourquoi une version Premium ?',
      'TaleCrafting utilise l\'intelligence artificielle pour créer des histoires personnalisées, ce qui génère des coûts importants.\n\n📱 Version gratuite : Accès limité avec publicités pour couvrir les frais de base\n\n⭐ Version Premium : Accès illimité sans publicité pour une expérience optimale\n\nVotre abonnement nous permet de maintenir et d\'améliorer continuellement l\'application tout en gardant une version gratuite accessible à tous.',
      [
        { text: 'Compris', style: 'default' }
      ]
    );
  };

  const handleManageSubscription = () => {
    Alert.alert(
      '💳 Gérer l\'abonnement',
      'Votre abonnement Premium est actif.\n\n📅 Prochaine facturation : 15 janvier 2024\n💰 Montant : 1,99€/mois\n\nVous pouvez annuler votre abonnement à tout moment. Il restera actif jusqu\'à la fin de la période déjà payée.',
      [
        { text: 'Fermer', style: 'cancel' },
        {
          text: 'Annuler l\'abonnement',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '⚠️ Confirmer l\'annulation',
              'Êtes-vous sûr de vouloir annuler votre abonnement Premium ?\n\n• Votre abonnement restera actif jusqu\'au 15 janvier 2024\n• Après cette date, vous perdrez l\'accès aux fonctionnalités Premium\n• Vous pourrez vous réabonner à tout moment\n\nCette action est réversible.',
              [
                { text: 'Garder Premium', style: 'cancel' },
                {
                  text: 'Confirmer l\'annulation',
                  style: 'destructive',
                  onPress: () => {
                    Alert.alert(
                      '✅ Annulation programmée',
                      'Votre abonnement Premium a été annulé.\n\n• Vous gardez l\'accès Premium jusqu\'au 15 janvier 2024\n• Aucune facturation future ne sera effectuée\n• Vous recevrez un email de confirmation\n\nMerci d\'avoir utilisé TaleCrafting Premium !',
                      [{ text: 'Compris', style: 'default' }]
                    );
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleUpgradeToPremium = () => {
    if (isPremium) {
      Alert.alert(
        'Déjà Premium ! 🎉',
        'Vous profitez déjà de tous les avantages de la version Premium !\n\n✅ Histoires illimitées\n✅ Aucune publicité\n✅ Export PDF\n\n✅ Personnalisation avancée\n\nMerci de votre soutien !',
        [{ text: 'Parfait !', style: 'default' }]
      );
    } else {
      Alert.alert(
         '⭐ Passer à Premium',
         'Comparez les versions de TaleCrafting :\n\n🆓 VERSION GRATUITE :\n• Thèmes prédéfinis uniquement\n• Lieux et éléments prédéfinis uniquement\n• Style narratif prédéfinis uniquement\n• 1 continuation d\'histoire par jour\n• Publicités entre les histoires\n• Sauvegarde limitée\n\n⭐ VERSION PREMIUM (1,99€/mois) :\n• Thèmes 100% personnalisables\n• Lieux et éléments spéciaux sur mesure\n• Choix du style narratif sur mesure\n• Personnages secondaires\n• Continuations d\'histoires\n• Aucune publicité\n• Export PDF\n• Sauvegarde illimitée\n• Accès aux modèles de génération d\'histoires avancés\n\nDans cette version de démonstration, le premium sera activé gratuitement.'
        [
          { text: 'Plus tard', style: 'cancel' },
          {
            text: 'Activer Premium',
            style: 'default',
            onPress: () => {
              togglePremium();
              Alert.alert(
                '🎉 Bienvenue Premium !',
                'Félicitations ! Vous avez maintenant accès à toutes les fonctionnalités Premium de TaleCrafting.\n\nProfitez de votre expérience sans limites !',
                [{ text: 'Merci !', style: 'default' }]
              );
            }
          }
        ]
      );
    }
  };

  const SettingSection = ({ title, children }) => (
    <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      {children}
    </View>
  );

  const SettingItem = ({ icon, title, subtitle, rightComponent, onPress, danger = false }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: danger ? theme.danger : theme.primaryLight }]}>
          <Ionicons name={icon} size={20} color="white" />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: danger ? theme.danger : theme.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  const FontSizeSelector = () => (
    <View style={styles.fontSizeContainer}>
      {['small', 'medium', 'large'].map((size) => (
        <TouchableOpacity
          key={size}
          style={[styles.fontSizeButton, {
            backgroundColor: fontSize === size ? theme.primary : theme.background,
            borderColor: theme.primary
          }]}
          onPress={() => changeFontSize(size)}
        >
          <Text style={[styles.fontSizeText, {
            color: fontSize === size ? 'white' : theme.text,
            fontSize: size === 'small' ? 12 : size === 'large' ? 18 : 14
          }]}>
            {size === 'small' ? 'Petit' : size === 'large' ? 'Grand' : 'Moyen'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const StoryLengthSelector = () => (
    <View style={styles.storyLengthContainer}>
      {storyLengths.map((length) => (
        <TouchableOpacity
          key={length.key}
          style={[styles.storyLengthButton, {
            backgroundColor: storyLength === length.key ? theme.primary : theme.cardBackground,
            borderColor: theme.primary
          }]}
          onPress={() => changeStoryLength(length.key)}
        >
          <View style={styles.storyLengthContent}>
            <Text style={[styles.storyLengthTitle, {
              color: storyLength === length.key ? 'white' : theme.text
            }]}>
              {length.label}
            </Text>
            <Text style={[styles.storyLengthDescription, {
              color: storyLength === length.key ? 'rgba(255,255,255,0.8)' : theme.textSecondary
            }]}>
              {length.description}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Paramètres</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Personnalisez votre expérience TaleCrafting
          </Text>
        </View>

        {/* Appearance Settings */}
        <SettingSection title="Apparence">
          <SettingItem
            icon="moon"
            title="Mode sombre"
            subtitle={isDarkMode ? 'Interface sombre activée' : 'Interface claire activée'}
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: '#d1d5db', true: theme.primary }}
                thumbColor={'#ffffff'}
                ios_backgroundColor="#d1d5db"
              />
            }
          />
        </SettingSection>

        {/* Story Settings */}
        <SettingSection title="Paramètres d'histoire">
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="document" size={20} color="white" />
              </View>
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>
                  Longueur par défaut
                </Text>
                <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                  Choisissez la longueur d'histoire préférée
                </Text>
              </View>
            </View>
          </View>
          <StoryLengthSelector />
        </SettingSection>

        {/* Statistics */}
        <SettingSection title="Statistiques">
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {stories.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Histoire{stories.length !== 1 ? 's' : ''} créée{stories.length !== 1 ? 's' : ''}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {stories.filter(s => s.isFavorite).length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Favori{stories.filter(s => s.isFavorite).length !== 1 ? 's' : ''}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>
                {stories.filter(s => s.status === 'to_continue').length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                À continuer
              </Text>
            </View>
          </View>
        </SettingSection>

        {/* Data Management */}
        <SettingSection title="Gestion des données">
          <SettingItem
            icon="download"
            title="Exporter mes données"
            subtitle="Sauvegardez vos histoires et paramètres"
            onPress={handleExportData}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            }
          />
          
          <SettingItem
            icon="trash"
            title="Effacer toutes les données"
            subtitle="Supprime définitivement toutes vos histoires"
            onPress={handleClearAllData}
            danger
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={theme.danger} />
            }
          />
        </SettingSection>

        {/* Premium Section */}
        <SettingSection title={isPremium ? "Premium Actif" : "Passer à Premium"}>
          {!isPremium ? (
            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}
              onPress={() => navigation.navigate('Subscription')}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="star" size={24} color={theme.primary} />
                <Text style={[styles.settingLabel, { color: theme.text }]}>Passer Premium</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={[styles.premiumBadge, { color: theme.primary }]}>Débloquer</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
              <View style={styles.settingLeft}>
                <Ionicons name="star" size={24} color={theme.primary} />
                <Text style={[styles.settingLabel, { color: theme.text }]}>Mode Premium</Text>
              </View>
              <View style={[styles.premiumActiveBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.premiumActiveText}>Actif</Text>
              </View>
            </View>
          )}
          {isPremium && (
            <>
              <SettingItem
                icon="checkmark-circle"
                title="Statut Premium Actif"
                subtitle="Vous profitez de tous les avantages Premium !"
                rightComponent={
                  <View style={[styles.premiumBadge, { backgroundColor: theme.primary }]}>
                    <Text style={styles.premiumBadgeText}>PREMIUM</Text>
                  </View>
                }
              />
              
              <SettingItem
                 icon="star"
                 title="Avantages Premium"
                 subtitle="Personnalisation complète • Continuations illimitées • Export PDF • Sans pub"
               />
               
               <SettingItem
                 icon="card"
                 title="Gérer l'abonnement"
                 subtitle="Annuler ou modifier votre abonnement Premium"
                 onPress={handleManageSubscription}
                 rightComponent={
                   <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                 }
               />
            </>
          )}
          {!isPremium && (
            <>
              <TouchableOpacity
                style={[styles.premiumUpgradeButton, { backgroundColor: theme.primary }]}
                onPress={handleUpgradeToPremium}
                activeOpacity={0.8}
              >
                <View style={styles.premiumUpgradeContent}>
                  <View style={styles.premiumUpgradeLeft}>
                    <Ionicons name="star" size={24} color="white" />
                    <View style={styles.premiumUpgradeText}>
                      <Text style={styles.premiumUpgradeTitle}>Passer à Premium</Text>
                      <Text style={styles.premiumUpgradeSubtitle}>Débloquez toutes les fonctionnalités</Text>
                    </View>
                  </View>
                  <View style={styles.premiumUpgradeRight}>
                    <Text style={styles.premiumUpgradePrice}>1,99€</Text>
                    <Text style={styles.premiumUpgradePeriod}>par mois</Text>
                  </View>
                </View>
              </TouchableOpacity>
              
              <View style={styles.premiumFeatures}>
                 <Text style={[styles.premiumSectionTitle, { color: theme.text }]}>🎨 Création d'histoires</Text>
                 <View style={styles.premiumFeature}>
                   <Ionicons name="location" size={16} color={theme.primary} />
                   <Text style={[styles.premiumFeatureText, { color: theme.text }]}>Lieux personnalisés : Décrivez vos environnements</Text>
                 </View>
                 <View style={styles.premiumFeature}>
                   <Ionicons name="sparkles" size={16} color={theme.primary} />
                   <Text style={[styles.premiumFeatureText, { color: theme.text }]}>Éléments magiques : Objets personnalisés</Text>
                 </View>
                 <View style={styles.premiumFeature}>
                   <Ionicons name="color-palette" size={16} color={theme.primary} />
                   <Text style={[styles.premiumFeatureText, { color: theme.text }]}>Thème et style narratif personnalisables</Text>
                 </View>
                 <View style={styles.premiumFeature}>
                   <Ionicons name="people" size={16} color={theme.primary} />
                   <Text style={[styles.premiumFeatureText, { color: theme.text }]}>Personnages secondaires illimités</Text>
                 </View>
                 <View style={styles.premiumFeature}>
                   <Ionicons name="play-forward" size={16} color={theme.primary} />
                   <Text style={[styles.premiumFeatureText, { color: theme.text }]}>Continuations illimitées d'histoires</Text>
                 </View>
                 
                 <Text style={[styles.premiumSectionTitle, { color: theme.text, marginTop: 16 }]}>⭐ Expérience premium</Text>
                 <View style={styles.premiumFeature}>
                   <Ionicons name="ban" size={16} color={theme.primary} />
                   <Text style={[styles.premiumFeatureText, { color: theme.text }]}>Aucune publicité</Text>
                 </View>
                 <View style={styles.premiumFeature}>
                   <Ionicons name="document-text" size={16} color={theme.primary} />
                   <Text style={[styles.premiumFeatureText, { color: theme.text }]}>Export PDF professionnel</Text>
                 </View>
                 <View style={styles.premiumFeature}>
                   <Ionicons name="infinite" size={16} color={theme.primary} />
                   <Text style={[styles.premiumFeatureText, { color: theme.text }]}>Sauvegarde illimitée</Text>
                 </View>
               </View>
            </>)}
          )}
          
          <SettingItem
            icon="help-circle"
            title="Pourquoi une version Premium ?"
            subtitle="Découvrez pourquoi nous proposons un abonnement"
            onPress={handleShowPremiumInfo}
            rightComponent={
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            }
          />
        </SettingSection>

        {/* About */}
        <SettingSection title="À propos">
          <SettingItem
            icon="information-circle"
            title="TaleCrafting"
            subtitle={`Version 1.0.0 • ${isPremium ? 'Premium' : 'Gratuite'}`}
          />
          
          <SettingItem
            icon="heart"
            title="Développé avec ❤️"
            subtitle="Application de génération d'histoires personnalisées"
          />
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 20,
    paddingBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  fontSizeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  fontSizeText: {
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  storyLengthContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  storyLengthButton: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  storyLengthContent: {
    alignItems: 'center',
  },
  storyLengthTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  storyLengthDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  premiumUpgradeButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  premiumUpgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  premiumUpgradeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumUpgradeText: {
    marginLeft: 16,
    flex: 1,
  },
  premiumUpgradeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  premiumUpgradeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  premiumUpgradeRight: {
    alignItems: 'flex-end',
  },
  premiumUpgradePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  premiumUpgradePeriod: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  premiumFeatures: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  premiumFeatureText: {
     fontSize: 14,
     fontWeight: '500',
   },
   premiumSectionTitle: {
     fontSize: 14,
     fontWeight: '600',
     marginBottom: 8,
     marginTop: 4,
   },
  premiumBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  premiumActiveBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumActiveText: {
     fontSize: 12,
     fontWeight: 'bold',
     color: 'white',
   },
   premiumBadge: {
     fontSize: 14,
     fontWeight: '600',
   },
});

export default SettingsScreen;