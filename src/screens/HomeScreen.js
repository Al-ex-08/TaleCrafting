import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const HomeScreen = ({ navigation }) => {
  const { isKidsMode, toggleKidsMode, isDarkMode, isPremium } = useApp();

  const theme = {
    background: isDarkMode ? '#1a1a1a' : '#f8fafc',
    cardBackground: isDarkMode ? '#2d2d2d' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1f2937',
    textSecondary: isDarkMode ? '#d1d5db' : '#6b7280',
    primary: isKidsMode ? '#f59e0b' : '#6366f1',
    primaryLight: isKidsMode ? '#fbbf24' : '#818cf8'
  };

  const handleCreateStory = () => {
    navigation.navigate('CreateStory');
  };

  const handleMyStories = () => {
    navigation.navigate('History');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            {isKidsMode ? '🌟 TaleCrafting Kids' : '📚 TaleCrafting'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {isKidsMode 
              ? 'Créons de merveilleuses histoires ensemble !'
              : 'Créez des histoires personnalisées'
            }
          </Text>
        </View>

        {/* Mode Toggle */}
        <View style={[styles.modeCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.modeHeader}>
            <Text style={[styles.modeTitle, { color: theme.text }]}>
              {isKidsMode ? '👶 Mode Enfants' : '👤 Mode Standard'}
            </Text>
            <Switch
              value={isKidsMode}
              onValueChange={toggleKidsMode}
              trackColor={{ false: '#d1d5db', true: theme.primary }}
              thumbColor={isKidsMode ? '#ffffff' : '#f4f3f4'}
            />
          </View>
          <Text style={[styles.modeDescription, { color: theme.textSecondary }]}>
            {isKidsMode 
              ? 'Histoires adaptées aux enfants avec un langage simple et des thèmes amusants'
              : 'Histoires pour tous publics avec plus de complexité narrative'
            }
          </Text>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={handleCreateStory}
            activeOpacity={0.8}
          >
            <Ionicons name="create" size={32} color="white" />
            <Text style={styles.primaryButtonText}>Créer une histoire</Text>
            <Text style={styles.primaryButtonSubtext}>
              {isKidsMode ? 'Nouvelle aventure magique' : 'Nouvelle création'}
            </Text>
          </TouchableOpacity>

          <View style={styles.secondaryButtons}>
            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: theme.cardBackground }]}
              onPress={handleMyStories}
              activeOpacity={0.7}
            >
              <Ionicons name="library" size={24} color={theme.primary} />
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
                Mes histoires
              </Text>
              <Text style={[styles.secondaryButtonSubtext, { color: theme.textSecondary }]}>
                Retrouvez vos créations
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: theme.cardBackground }]}
              onPress={handleSettings}
              activeOpacity={0.7}
            >
              <Ionicons name="settings" size={24} color={theme.primary} />
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
                Paramètres
              </Text>
              <Text style={[styles.secondaryButtonSubtext, { color: theme.textSecondary }]}>
                Personnalisez l'app
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mode d'emploi */}
        <View style={[styles.guideCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.guideHeader}>
            <Ionicons name="help-circle" size={24} color={theme.primary} />
            <Text style={[styles.guideTitle, { color: theme.text }]}>Mode d'emploi</Text>
          </View>
          <Text style={[styles.guideDescription, { color: theme.textSecondary }]}>
            Comment créer votre histoire parfaite :
          </Text>
          <View style={styles.guideSteps}>
            <View style={styles.guideStep}>
              <View style={[styles.stepNumber, { backgroundColor: theme.primaryLight }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.textSecondary }]}>
                <Text style={{ fontWeight: '600', color: theme.text }}>Choisissez un thème</Text> : {isPremium ? 'Décrivez librement votre thème personnalisé ou choisissez parmi les catégories' : 'Sélectionnez parmi les thèmes proposés'}
              </Text>
            </View>
            <View style={styles.guideStep}>
              <View style={[styles.stepNumber, { backgroundColor: theme.primaryLight }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.textSecondary }]}>
                <Text style={{ fontWeight: '600', color: theme.text }}>Personnalisez</Text> : {isPremium ? 'Décrivez vos propres lieux, personnages et éléments magiques' : 'Ajoutez des personnages et choisissez parmi les options disponibles'}
              </Text>
            </View>
            <View style={styles.guideStep}>
              <View style={[styles.stepNumber, { backgroundColor: theme.primaryLight }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.textSecondary }]}>
                <Text style={{ fontWeight: '600', color: theme.text }}>{isPremium ? 'Style narratif' : 'Générez'}</Text> : {isPremium ? 'Choisissez et personnalisez le style de narration de votre histoire' : 'Laissez la magie opérer et découvrez votre histoire unique'}
              </Text>
            </View>
            <View style={styles.guideStep}>
              <View style={[styles.stepNumber, { backgroundColor: theme.primaryLight }]}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={[styles.stepText, { color: theme.textSecondary }]}>
                 <Text style={{ fontWeight: '600', color: theme.text }}>{isPremium ? 'Générez et exportez' : 'Continuez l\'aventure'}</Text> : {isPremium ? 'Créez votre histoire et exportez-la en PDF sans publicité' : 'Une fois votre histoire générée, créez de nouveaux épisodes (1 par jour)'}
                </Text>
            </View>
            {isPremium && (
              <View style={styles.guideStep}>
                <View style={[styles.stepNumber, { backgroundColor: theme.primaryLight }]}>
                  <Text style={styles.stepNumberText}>5</Text>
                </View>
                <Text style={[styles.stepText, { color: theme.textSecondary }]}>
                   <Text style={{ fontWeight: '600', color: theme.text }}>Continuez l'aventure</Text> : Étendez vos histoires existantes avec de nouveaux chapitres (illimité)
                 </Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={[styles.statsCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.statsTitle, { color: theme.text }]}>Vos créations</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>0</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Histoires</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>0</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Favoris</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.primary }]}>0</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>À continuer</Text>
            </View>
          </View>
        </View>
        
        {/* Bannière publicitaire pour les utilisateurs freemium */}
        {!isPremium && (
          <View style={styles.adContainer}>
            <View style={styles.adPlaceholder}>
              <Text style={styles.adPlaceholderText}>📢 Publicité</Text>
              <Text style={styles.adPlaceholderSubtext}>Version gratuite</Text>
            </View>
          </View>
        )}
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
  adContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  adPlaceholder: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    width: 320,
    height: 50,
    justifyContent: 'center',
  },
  adPlaceholderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  adPlaceholderSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  modeCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: 30,
  },
  primaryButton: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  primaryButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  secondaryButtonSubtext: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  statsCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
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
  },
  guideCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  guideTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  guideDescription: {
    fontSize: 14,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  guideSteps: {
    gap: 16,
  },
  guideStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

export default HomeScreen;