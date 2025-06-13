import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useApp } from '../context/AppContext';

const StoryDisplayScreen = ({ navigation, route }) => {
  const { story } = route.params;
  const { isKidsMode, isDarkMode, fontSize, isPremium, updateStory, canContinueStory, useContinueStory } = useApp();
  const [isFavorite, setIsFavorite] = useState(story.isFavorite || false);

  const theme = {
    background: isDarkMode ? '#1a1a1a' : '#f8fafc',
    cardBackground: isDarkMode ? '#2d2d2d' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1f2937',
    textSecondary: isDarkMode ? '#d1d5db' : '#6b7280',
    primary: isKidsMode ? '#f59e0b' : '#6366f1',
    primaryLight: isKidsMode ? '#fbbf24' : '#818cf8'
  };

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return 16;
      case 'large': return 22;
      default: return 18;
    }
  };



  const handleRestart = () => {
    Alert.alert(
      'Recommencer',
      'Voulez-vous créer une nouvelle histoire avec les mêmes paramètres ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Recommencer',
          onPress: () => {
            navigation.navigate('CreateStory', {
              preset: {
                heroName: story.heroName,
                age: story.age,
                theme: story.theme,
                narrativeStyle: story.narrativeStyle
              }
            });
          }
        }
      ]
    );
  };

  const handleContinue = async () => {
    if (!canContinueStory()) {
      Alert.alert(
        'Limite quotidienne atteinte',
        'Vous avez déjà utilisé votre continuation d\'histoire gratuite aujourd\'hui. Passez à Premium pour des continuations illimitées !',
        [
          { text: 'OK', style: 'cancel' },
          { 
            text: 'Passer Premium', 
            onPress: () => navigation.navigate('Settings')
          }
        ]
      );
      return;
    }

    const success = await useContinueStory();
    if (success) {
      navigation.navigate('CreateStory', {
        continueStory: story
      });
    } else {
      Alert.alert(
        'Erreur',
        'Impossible de continuer l\'histoire pour le moment.'
      );
    }
  };

  const handleToggleFavorite = async () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    await updateStory(story.id, { isFavorite: newFavoriteStatus });
  };

  const handleExportPDF = async () => {
    if (!isPremium) {
      Alert.alert(
        'Fonction réservée aux abonnés Premium',
        'L\'export PDF est disponible uniquement avec l\'abonnement Premium.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Passer Premium', onPress: () => {
            // Navigation vers l'écran d'abonnement (à implémenter)
            Alert.alert('Premium', 'Fonctionnalité d\'abonnement à implémenter');
          }}
        ]
      );
      return;
    }
    
    try {
      const htmlContent = generateHTMLContent();
      
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Partager "${story.heroName} - ${story.theme}"`
        });
      } else {
        Alert.alert('Succès', 'PDF créé avec succès !');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le PDF.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvrez cette histoire créée avec TaleCrafting :\n\n"${story.heroName} - ${story.theme}"\n\n${story.content}`,
        title: `Histoire de ${story.heroName}`
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager l\'histoire.');
    }
  };

  const generateHTMLContent = () => {
    const themeStyles = getThemeStyles();
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${story.heroName} - ${story.theme}</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              line-height: 1.6;
              margin: 0;
              padding: 40px;
              background: ${themeStyles.background};
              color: ${themeStyles.textColor};
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding: 20px;
              border-bottom: 2px solid ${themeStyles.accent};
            }
            .title {
              font-size: 28px;
              font-weight: bold;
              color: ${themeStyles.accent};
              margin-bottom: 10px;
            }
            .subtitle {
              font-size: 16px;
              color: #666;
              font-style: italic;
            }
            .content {
              font-size: 18px;
              line-height: 1.8;
              text-align: justify;
              margin: 30px 0;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              font-size: 14px;
              color: #888;
            }
            ${themeStyles.decorations}
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">L'histoire de ${story.heroName}</div>
            <div class="subtitle">${story.theme} • ${story.narrativeStyle}</div>
          </div>
          
          <div class="content">
            ${story.content.replace(/\n/g, '<br><br>')}
          </div>
          
          <div class="footer">
            Créé avec TaleCrafting • {new Date(story.createdAt).toLocaleDateString('fr-FR')}
          </div>
        </body>
      </html>
    `;
  };

  const getThemeStyles = () => {
    if (story.theme.includes('🦄') || story.theme.includes('✨')) {
      return {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: '#2d3748',
        accent: '#9f7aea',
        decorations: `
          body::before {
            content: '✨';
            position: fixed;
            top: 20px;
            right: 20px;
            font-size: 30px;
            opacity: 0.3;
          }
        `
      };
    } else if (story.theme.includes('🏰') || story.theme.includes('👑')) {
      return {
        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        textColor: '#2d3748',
        accent: '#d69e2e',
        decorations: ''
      };
    } else if (story.theme.includes('🌟') || story.theme.includes('🚀')) {
      return {
        background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)',
        textColor: '#e2e8f0',
        accent: '#4299e1',
        decorations: ''
      };
    }
    
    return {
      background: '#ffffff',
      textColor: '#2d3748',
      accent: '#4299e1',
      decorations: ''
    };
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Story Header */}
        <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.headerTop}>
            <View style={styles.storyInfo}>
              <Text style={[styles.heroName, { color: theme.primary }]}>
                {story.heroName}
                {story.age && ` (${story.age} ans)`}
              </Text>
              <Text style={[styles.themeText, { color: theme.textSecondary }]}>
                {story.theme} • {story.narrativeStyle}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? 'heart' : 'heart-outline'} 
                size={24} 
                color={isFavorite ? '#ef4444' : theme.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Story Content */}
        <View style={[styles.contentContainer, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.storyContent, { 
            color: theme.text,
            fontSize: getFontSize(),
            lineHeight: getFontSize() * 1.6
          }]}>
            {story.content}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Primary Actions */}
          {isPremium && (
            <View style={styles.primaryActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.primary }]}
                onPress={handleContinue}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.actionButtonText}>Suite</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Secondary Actions */}
          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: theme.cardBackground }]}
              onPress={handleRestart}
            >
              <Ionicons name="refresh" size={18} color={theme.primary} />
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Recommencer</Text>
            </TouchableOpacity>

            {isPremium && (
              <TouchableOpacity
                style={[styles.secondaryButton, { backgroundColor: theme.cardBackground }]}
                onPress={handleExportPDF}
              >
                <Ionicons name="document" size={18} color={theme.primary} />
                <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Export PDF</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: theme.cardBackground }]}
              onPress={handleShare}
            >
              <Ionicons name="share" size={18} color={theme.primary} />
              <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Partager</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  storyInfo: {
    flex: 1,
  },
  heroName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  themeText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  favoriteButton: {
    padding: 8,
  },
  contentContainer: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  storyContent: {
    textAlign: 'justify',
  },
  actionsContainer: {
    gap: 16,
  },
  primaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default StoryDisplayScreen;