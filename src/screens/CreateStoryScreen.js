import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Import conditionnel pour éviter les erreurs en mode développement Expo Go
let InterstitialAd, AdEventType, TestIds;
try {
  const adModule = require('react-native-google-mobile-ads');
  InterstitialAd = adModule.InterstitialAd;
  AdEventType = adModule.AdEventType;
  TestIds = adModule.TestIds;
} catch (error) {
  console.log('AdMob module not available in Expo Go, using simulation mode');
}
import { useApp } from '../context/AppContext';
import { generateStory } from '../services/OpenAIService';

const CreateStoryScreen = ({ navigation, route }) => {
  const { isKidsMode, isDarkMode, storyLength, isPremium, saveStory } = useApp();
  const [loading, setLoading] = useState(false);
  
  // Configuration AdMob
  const ADMOB_APP_ID = 'ca-app-pub-8249851704591038~2429423419';
  const ADMOB_INTERSTITIAL_ID = TestIds ? TestIds.INTERSTITIAL : 'ca-app-pub-8249851704591038/9593597567';
  
  // Création de l'instance de publicité interstitielle (seulement si AdMob est disponible)
  const interstitial = InterstitialAd ? InterstitialAd.createForAdRequest(ADMOB_INTERSTITIAL_ID, {
    requestNonPersonalizedAdsOnly: false,
  }) : null;
  
  // Form state
  const [heroName, setHeroName] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [specialElements, setSpecialElements] = useState('');
  const [theme, setTheme] = useState('');
  const [narrativeStyle, setNarrativeStyle] = useState('');
  const [selectedLength, setSelectedLength] = useState(storyLength);
  const [isNewEpisode, setIsNewEpisode] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [secondaryCharacters, setSecondaryCharacters] = useState([]);
  const [newCharacterName, setNewCharacterName] = useState('');
  const [newCharacterRole, setNewCharacterRole] = useState('');
  const [newCharacterDescription, setNewCharacterDescription] = useState('');
  const [enableSecondaryCharacters, setEnableSecondaryCharacters] = useState(false);
  const [showingAd, setShowingAd] = useState(false);
  const [pendingStory, setPendingStory] = useState(null);
  const [adTimer, setAdTimer] = useState(0);
  const [adWatched, setAdWatched] = useState(false);

  const theme_colors = {
    background: isDarkMode ? '#1a1a1a' : '#f8fafc',
    cardBackground: isDarkMode ? '#2d2d2d' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1f2937',
    textSecondary: isDarkMode ? '#d1d5db' : '#6b7280',
    secondaryText: isDarkMode ? '#9ca3af' : '#6b7280',
    primary: isKidsMode ? '#f59e0b' : '#6366f1',
    primaryLight: isKidsMode ? '#fbbf24' : '#818cf8',
    secondary: isKidsMode ? '#10b981' : '#8b5cf6',
    inputBackground: isDarkMode ? '#374151' : '#f9fafb',
    inputBorder: isDarkMode ? '#4b5563' : '#d1d5db',
    error: '#ef4444'
  };

  const kidsThemes = [
    '🦄 Licornes et magie',
    '🏰 Château de princesse',
    '🐉 Dragon gentil',
    '🌟 Voyage dans l\'espace',
    '🦸 Super-héros',
    '🐾 Animaux de la forêt',
    '🧚 Fées et elfes',
    '🚂 Train magique'
  ];

  const adultThemes = [
    '🗡️ Aventure épique',
    '💫 Science-fiction',
    '🕵️ Mystère et enquête',
    '💕 Romance',
    '🏔️ Survie en nature',
    '🏛️ Histoire antique',
    '🌊 Voyage maritime',
    '🎭 Drame psychologique'
  ];

  const kidsStyles = [
    '😄 Amusant et rigolo',
    '✨ Magique et merveilleux',
    '🎵 Avec des rimes',
    '🤗 Doux et réconfortant',
    '🎪 Plein d\'aventures'
  ];

  const adultStyles = [
    '⚔️ Aventure',
    '🎭 Poétique',
    '✨ Magique',
    '😂 Humoristique',
    '💕 Romantique',
    '🔍 Mystérieux',
    '📚 Philosophique'
  ];

  const kidsRoles = [
    '👫 Meilleur ami',
    '🐕 Animal de compagnie',
    '🧙‍♂️ Sage mentor',
    '👑 Roi/Reine',
    '🧚‍♀️ Fée protectrice',
    '🤖 Robot assistant',
    '👨‍👩‍👧‍👦 Famille',
    '🎪 Compagnon d\'aventure'
  ];

  const adultRoles = [
    '👥 Allié fidèle',
    '⚔️ Rival',
    '💕 Intérêt romantique',
    '🧙‍♂️ Mentor',
    '👑 Antagoniste',
    '🕵️ Complice',
    '👨‍💼 Collègue',
    '👨‍👩‍👧‍👦 Membre de la famille',
    '🤝 Guide spirituel',
    '⚡ Ennemi juré'
  ];

  const storyLengths = [
    { key: 'short', label: '📖 Histoire courte', description: '2-3 paragraphes' },
    { key: 'medium', label: '📚 Histoire moyenne', description: '4-6 paragraphes' },
    { key: 'long', label: '📜 Histoire longue', description: '7-10 paragraphes' }
  ];

  const themes = isKidsMode ? kidsThemes : adultThemes;
  const styles_list = isKidsMode ? kidsStyles : adultStyles;
  const characterRoles = isKidsMode ? kidsRoles : adultRoles;

  // Fonctions pour gérer les personnages secondaires
  const addSecondaryCharacter = () => {
    if (!newCharacterName.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir le nom du personnage');
      return;
    }
    
    const newCharacter = {
      id: Date.now().toString(),
      name: newCharacterName.trim(),
      role: newCharacterRole.trim() || 'Personnage libre',
      description: newCharacterDescription.trim()
    };
    
    setSecondaryCharacters([...secondaryCharacters, newCharacter]);
    setNewCharacterName('');
    setNewCharacterRole('');
    setNewCharacterDescription('');
  };

  const removeSecondaryCharacter = (characterId) => {
    setSecondaryCharacters(secondaryCharacters.filter(char => char.id !== characterId));
  };

  // Initialiser l'état de la publicité au montage du composant
  useEffect(() => {
    // S'assurer que la publicité n'est pas affichée au lancement
    setShowingAd(false);
    setPendingStory(null);
    setAdTimer(0);
    setAdWatched(false);

    // Nettoyage lors du démontage du composant
    return () => {
      setShowingAd(false);
      setPendingStory(null);
      setAdTimer(0);
      setAdWatched(false);
    };
  }, []);

  // Gérer la continuation d'histoire
  useEffect(() => {
    if (route.params?.continueStory) {
      const story = route.params.continueStory;
      setHeroName(story.heroName || '');
      setAge(story.age || '');
      setLocation(story.location || '');
      setSpecialElements(story.specialElements || '');
      setTheme(story.theme || '');
      setNarrativeStyle(story.narrativeStyle || '');
      setSelectedLength(story.length || storyLength);
      setSelectedStory(story);
      
      // Restaurer les personnages secondaires s'ils existent
      if (story.secondaryCharacters && story.secondaryCharacters.length > 0) {
        setSecondaryCharacters(story.secondaryCharacters);
        setEnableSecondaryCharacters(true);
      }
      
      // Déterminer si c'est une suite ou un nouvel épisode
      // Si l'histoire contient des mots de fin, c'est un nouvel épisode
      const endWords = ['fin', 'finalement', 'pour toujours', 'jamais', 'conclusion', 'épilogue'];
      const hasEnding = endWords.some(word => 
        story.content?.toLowerCase().includes(word.toLowerCase())
      );
      setIsNewEpisode(hasEnding);
    }
  }, [route.params]);

  const generateRandomTheme = () => {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    setTheme(randomTheme);
  };

  const showPremiumAlert = (feature) => {
    Alert.alert(
      'Fonction réservée aux abonnés Premium',
      `Cette fonctionnalité (${feature}) est disponible uniquement avec l'abonnement Premium.`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Passer Premium', onPress: () => {
          navigation.navigate('Subscription');
        }}
      ]
    );
  };

  const generateStoryHandler = async () => {
    if (!heroName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer le prénom du héros');
      return;
    }

    // Vérifications freemium
    if (!isPremium) {
      // Vérifier si un thème personnalisé est utilisé (pas dans la liste prédéfinie)
      const predefinedThemes = isKidsMode ? kidsThemes : adultThemes;
      if (theme && !predefinedThemes.includes(theme)) {
        showPremiumAlert('thème personnalisé');
        return;
      }
      
      // Vérifier si un style narratif personnalisé est utilisé
      const predefinedStyles = isKidsMode ? kidsStyles : adultStyles;
      if (narrativeStyle && !predefinedStyles.includes(narrativeStyle)) {
        showPremiumAlert('style narratif personnalisé');
        return;
      }
      
      // Vérifier si un lieu personnalisé est utilisé
      if (location.trim()) {
        showPremiumAlert('lieu personnalisé');
        return;
      }
      
      // Vérifier si des éléments spéciaux sont utilisés
      if (specialElements.trim()) {
        showPremiumAlert('éléments spéciaux');
        return;
      }
      
      // Vérifier si des personnages secondaires sont utilisés
      if (enableSecondaryCharacters && secondaryCharacters.length > 0) {
        showPremiumAlert('personnages secondaires');
        return;
      }
    }

    setLoading(true);
    
    try {
      // Générer l'histoire avec OpenAI
      const generatedContent = await generateStory({
        character: heroName.trim(),
        age: age.trim() || (isKidsMode ? '8' : 'adulte'),
        location: isPremium ? (location.trim() || '') : '', // Lieu vide si pas premium
        specialElements: isPremium ? (specialElements.trim() || '') : '', // Éléments spéciaux vides si pas premium
        theme: theme || 'Thème libre',
        narrativeStyle: narrativeStyle || (isKidsMode ? 'Amusant et rigolo' : 'Aventure'),
        length: selectedLength,
        isKidsMode,
        model: isPremium ? 'gpt-4' : 'gpt-3.5-turbo', // GPT-3.5 pour freemium
        secondaryCharacters: (isPremium && enableSecondaryCharacters) ? secondaryCharacters : [], // Pas de personnages secondaires en freemium
        continueStory: selectedStory ? {
          content: selectedStory.content,
          isNewEpisode: isNewEpisode
        } : null
      });
      
      const storyData = {
        title: selectedStory ? 
          (isNewEpisode ? `Nouvel épisode de ${heroName}` : `Suite de l'histoire de ${heroName}`) :
          `L'histoire de ${heroName}`,
        heroName: heroName.trim(),
        age: age.trim(),
        location: isPremium ? location.trim() : '',
        specialElements: isPremium ? specialElements.trim() : '',
        theme: theme || 'Thème libre',
        narrativeStyle: narrativeStyle || (isKidsMode ? 'Amusant et rigolo' : 'Aventure'),
        length: selectedLength,
        isKidsMode,
        isNewEpisode,
        parentStory: selectedStory,
        secondaryCharacters: (isPremium && enableSecondaryCharacters) ? secondaryCharacters : [],
        content: generatedContent
      };

      const savedStory = await saveStory(storyData);
      
      // Pour les utilisateurs gratuits, afficher une publicité obligatoire
      if (!isPremium) {
        showAdBeforeStory(savedStory);
      } else {
        navigation.navigate('StoryDisplay', { story: savedStory });
      }
    } catch (error) {
      console.error('Erreur génération histoire:', error);
      Alert.alert('Erreur', 'Impossible de générer l\'histoire. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const showAdBeforeStory = async (story) => {
    setPendingStory(story);
    
    // Si AdMob n'est pas disponible (Expo Go), utiliser directement la simulation
    if (!interstitial || !AdEventType) {
      console.log('AdMob non disponible, utilisation de la publicité simulée');
      setShowingAd(true);
      setAdTimer(5);
      setAdWatched(false);
      
      const timer = setInterval(() => {
        setAdTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setAdWatched(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return;
    }
    
    try {
      // Chargement de la publicité
      const loaded = await new Promise((resolve) => {
        const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
          unsubscribeLoaded();
          resolve(true);
        });
        
        const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
          unsubscribeError();
          console.log('Erreur de chargement de la publicité:', error);
          resolve(false);
        });
        
        interstitial.load();
        
        // Timeout après 10 secondes
        setTimeout(() => {
          unsubscribeLoaded();
          unsubscribeError();
          resolve(false);
        }, 10000);
      });
      
      if (loaded) {
        // Écouter la fermeture de la publicité
        const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
          unsubscribeClosed();
          navigation.navigate('StoryDisplay', { story });
        });
        
        // Affichage de la publicité
        interstitial.show();
      } else {
        throw new Error('Impossible de charger la publicité');
      }
      
    } catch (error) {
      console.log('Erreur lors de l\'affichage de la publicité:', error);
      // En cas d'erreur, afficher la publicité simulée comme fallback
      setShowingAd(true);
      setAdTimer(5);
      setAdWatched(false);
      
      const timer = setInterval(() => {
        setAdTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setAdWatched(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleAdComplete = () => {
    if (adWatched && pendingStory) {
      setShowingAd(false);
      setPendingStory(null);
      setAdTimer(0);
      setAdWatched(false);
      navigation.navigate('StoryDisplay', { story: pendingStory });
    }
  };

  const handleSkipAd = () => {
    Alert.alert(
      '⚠️ Publicité obligatoire',
      'Pour accéder à votre histoire gratuite, vous devez visionner la publicité complète.\n\nPassez à Premium pour supprimer les publicités !',
      [
        { text: 'Continuer la pub', style: 'default' },
        {
          text: 'Passer à Premium',
          style: 'default',
          onPress: () => {
            setShowingAd(false);
            setPendingStory(null);
            navigation.navigate('Settings');
          }
        }
      ]
    );
  };

  const simulateStoryGeneration = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const storyTemplate = isKidsMode 
      ? `Il était une fois ${heroName}, un petit héros de ${age || '7'} ans qui vivait dans un monde merveilleux. Un jour, ${heroName} découvrit quelque chose d'extraordinaire qui allait changer sa vie à jamais...\n\nCette aventure magique ne faisait que commencer, et ${heroName} était prêt à affronter tous les défis avec courage et détermination !`
      : `${heroName} se trouvait à un tournant de sa vie. À ${age || '25'} ans, ${heroName} n'avait jamais imaginé que cette journée ordinaire se transformerait en une aventure extraordinaire.\n\nLe destin venait de frapper à sa porte, et ${heroName} devait maintenant faire un choix qui déterminerait le cours de son existence.`;
    
    return storyTemplate;
  };

  // Interface de publicité pour les utilisateurs gratuits
  if (showingAd) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: '#000000' }]}>
        <View style={styles.adContainer}>
          <View style={styles.adHeader}>
            <Text style={styles.adTitle}>📺 Publicité</Text>
            <TouchableOpacity onPress={handleSkipAd} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.adContent}>
            <View style={styles.adVideoPlaceholder}>
              <Ionicons name="star" size={60} color="#FFD700" />
              <Text style={styles.adBrand}>✨ TaleCrafting Premium ✨</Text>
              <Text style={styles.adDescription}>
                🚀 Histoires illimitées sans publicité
                🎨 Lieux et éléments magiques personnalisés
                👥 Personnages secondaires illimités
                📖 Styles narratifs avancés
                📄 Export PDF professionnel
              </Text>
              <View style={styles.premiumOffer}>
                <Text style={styles.offerText}>Seulement 1,99€/mois</Text>
                <Text style={styles.offerSubtext}>Annulable à tout moment</Text>
              </View>
              <TouchableOpacity 
                style={styles.premiumButton}
                onPress={() => {
                  setShowingAd(false);
                  setPendingStory(null);
                  navigation.navigate('Settings');
                }}
              >
                <Text style={styles.premiumButtonText}>Passer à Premium maintenant</Text>
                <Ionicons name="arrow-forward" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.adFooter}>
            {adTimer > 0 ? (
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>Publicité se termine dans {adTimer}s</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${((5 - adTimer) / 5) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.continueButton} 
                onPress={handleAdComplete}
              >
                <Text style={styles.continueButtonText}>Continuer vers l'histoire</Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme_colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Name */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme_colors.text }]}>Prénom du héros *</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme_colors.inputBackground,
              borderColor: theme_colors.inputBorder,
              color: theme_colors.text
            }]}
            value={heroName}
            onChangeText={setHeroName}
            placeholder={isKidsMode ? "Ex: Emma, Lucas..." : "Prénom de votre héros"}
            placeholderTextColor={theme_colors.textSecondary}
          />
        </View>

        {/* Age */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme_colors.text }]}>Âge (optionnel)</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme_colors.inputBackground,
              borderColor: theme_colors.inputBorder,
              color: theme_colors.text
            }]}
            value={age}
            onChangeText={setAge}
            placeholder={isKidsMode ? "Ex: 7 ans" : "Ex: 25 ans"}
            placeholderTextColor={theme_colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        {/* Location - Masqué en version freemium */}
        {isPremium && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme_colors.text }]}>Lieu (optionnel)</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme_colors.inputBackground,
                borderColor: theme_colors.inputBorder,
                color: theme_colors.text
              }]}
              value={location}
              onChangeText={setLocation}
              placeholder={isKidsMode ? "Ex: Forêt enchantée, château magique..." : "Ex: Paris, forêt mystérieuse, vaisseau spatial..."}
              placeholderTextColor={theme_colors.textSecondary}
              multiline
            />
          </View>
        )}

        {/* Special Elements - Masqué en version freemium */}
        {isPremium && (
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme_colors.text }]}>Éléments spéciaux (optionnel)</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme_colors.inputBackground,
                borderColor: theme_colors.inputBorder,
                color: theme_colors.text
              }]}
              value={specialElements}
              onChangeText={setSpecialElements}
              placeholder={isKidsMode ? "Ex: Baguette magique, dragon amical, potion de courage..." : "Ex: Artefact ancien, pouvoir mystérieux, objet maudit..."}
              placeholderTextColor={theme_colors.textSecondary}
              multiline
            />
          </View>
        )}

        {/* Theme */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={[styles.label, { color: theme_colors.text }]}>Thème</Text>
            <TouchableOpacity
              style={[styles.randomButton, { backgroundColor: theme_colors.primaryLight }]}
              onPress={generateRandomTheme}
            >
              <Ionicons name="shuffle" size={16} color="white" />
              <Text style={styles.randomButtonText}>Choix aléatoire</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.themeGrid}>
            {themes.map((themeOption, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.themeChip, { 
                  backgroundColor: theme === themeOption ? theme_colors.primary : theme_colors.cardBackground,
                  borderColor: theme_colors.inputBorder
                }]}
                onPress={() => setTheme(themeOption)}
              >
                <Text style={[styles.themeChipText, { 
                  color: theme === themeOption ? 'white' : theme_colors.text 
                }]}>
                  {themeOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Narrative Style */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme_colors.text }]}>Style narratif</Text>
          
          <View style={styles.styleGrid}>
            {styles_list.map((style, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.styleChip, { 
                  backgroundColor: narrativeStyle === style ? theme_colors.primary : theme_colors.cardBackground,
                  borderColor: theme_colors.inputBorder
                }]}
                onPress={() => setNarrativeStyle(style)}
              >
                <Text style={[styles.styleChipText, { 
                  color: narrativeStyle === style ? 'white' : theme_colors.text 
                }]}>
                  {style}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Secondary Characters - Masqué en version freemium */}
        {isPremium && (
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: theme_colors.text }]}>Personnages secondaires (optionnel)</Text>
              <TouchableOpacity
                style={[styles.checkbox, {
                  backgroundColor: enableSecondaryCharacters ? theme_colors.primary : 'transparent',
                  borderColor: theme_colors.primary
                }]}
                onPress={() => {
                  const newValue = !enableSecondaryCharacters;
                  setEnableSecondaryCharacters(newValue);
                  if (!newValue) {
                    setSecondaryCharacters([]);
                    setNewCharacterName('');
                    setNewCharacterRole('');
                    setNewCharacterDescription('');
                  }
                }}
              >
                {enableSecondaryCharacters && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </TouchableOpacity>
            </View>
            
            {enableSecondaryCharacters && (
              <>
                {/* Liste des personnages ajoutés */}
                {secondaryCharacters.length > 0 && (
                  <View style={styles.charactersList}>
                    {secondaryCharacters.map((character) => (
                      <View key={character.id} style={[styles.characterItem, { 
                        backgroundColor: theme_colors.cardBackground,
                        borderColor: theme_colors.inputBorder 
                      }]}>
                        <View style={styles.characterInfo}>
                          <Text style={[styles.characterName, { color: theme_colors.text }]}>
                            {character.name}
                          </Text>
                          <Text style={[styles.characterRole, { color: theme_colors.textSecondary }]}>
                            {character.role}
                          </Text>
                          {character.description && (
                            <Text style={[styles.characterDescription, { color: theme_colors.textSecondary }]}>
                              {character.description}
                            </Text>
                          )}
                        </View>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeSecondaryCharacter(character.id)}
                        >
                          <Ionicons name="close-circle" size={24} color={theme_colors.error} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                
                {/* Formulaire d'ajout */}
                <View style={styles.addCharacterForm}>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: theme_colors.inputBackground,
                      borderColor: theme_colors.inputBorder,
                      color: theme_colors.text 
                    }]}
                    value={newCharacterName}
                    onChangeText={setNewCharacterName}
                    placeholder="Nom du personnage"
                    placeholderTextColor={theme_colors.textSecondary}
                  />
                  
                  <TextInput
                    style={[styles.input, styles.descriptionInput, { 
                      backgroundColor: theme_colors.inputBackground,
                      borderColor: theme_colors.inputBorder,
                      color: theme_colors.text 
                    }]}
                    value={newCharacterDescription}
                    onChangeText={setNewCharacterDescription}
                    placeholder="Description libre du personnage (optionnel)"
                    placeholderTextColor={theme_colors.textSecondary}
                    multiline
                    numberOfLines={3}
                  />
                  
                  <View style={styles.roleGrid}>
                    {characterRoles.map((role, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.roleChip, { 
                          backgroundColor: newCharacterRole === role ? theme_colors.primary : theme_colors.cardBackground,
                          borderColor: theme_colors.inputBorder
                        }]}
                        onPress={() => setNewCharacterRole(role)}
                      >
                        <Text style={[styles.roleChipText, { 
                          color: newCharacterRole === role ? 'white' : theme_colors.text 
                        }]}>
                          {role}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.addCharacterButton, { 
                      backgroundColor: theme_colors.secondary,
                      opacity: !newCharacterName.trim() ? 0.5 : 1
                    }]}
                    onPress={addSecondaryCharacter}
                    disabled={!newCharacterName.trim()}
                  >
                    <Ionicons name="add-circle" size={20} color="white" />
                    <Text style={styles.addCharacterButtonText}>Ajouter personnage</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}

        {/* Story Length */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme_colors.text }]}>Longueur de l'histoire</Text>
          <View style={styles.lengthGrid}>
            {storyLengths.map((length, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.lengthCard, { 
                  backgroundColor: selectedLength === length.key ? theme_colors.primary : theme_colors.cardBackground,
                  borderColor: theme_colors.inputBorder
                }]}
                onPress={() => setSelectedLength(length.key)}
              >
                <Text style={[styles.lengthCardTitle, { 
                  color: selectedLength === length.key ? 'white' : theme_colors.text 
                }]}>
                  {length.label}
                </Text>
                <Text style={[styles.lengthCardDescription, { 
                  color: selectedLength === length.key ? 'rgba(255,255,255,0.8)' : theme_colors.secondaryText 
                }]}>
                  {length.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, { 
            backgroundColor: theme_colors.primary,
            opacity: loading ? 0.7 : 1
          }]}
          onPress={generateStoryHandler}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Ionicons name="create" size={24} color="white" />
          )}
          <Text style={styles.generateButtonText}>
            {loading ? 'Génération en cours...' : 
              selectedStory ? 
                (isNewEpisode ? 'Créer un nouvel épisode' : 'Continuer l\'histoire') :
                'Générer l\'histoire'
            }
          </Text>
        </TouchableOpacity>
        
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
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 50,
  },
  descriptionInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  randomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  randomButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  themeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  themeChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  styleChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    marginBottom: 8,
  },
  styleChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  lengthGrid: {
    gap: 12,
  },
  lengthCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  lengthCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lengthCardDescription: {
    fontSize: 14,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    marginTop: 20,
    gap: 8,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Styles pour les personnages secondaires
  charactersList: {
    marginBottom: 16,
  },
  characterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  characterRole: {
    fontSize: 14,
  },
  characterDescription: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 4,
  },
  removeButton: {
    padding: 4,
  },
  addCharacterForm: {
    gap: 12,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  roleChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  addCharacterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  addCharacterButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    position: 'relative',
  },
  premiumOverlay: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  // Styles pour la publicité
  adContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  adTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  adContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  adVideoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 40,
    width: '100%',
    maxWidth: 300,
  },
  adVideoText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  adBrand: {
    color: '#fbbf24',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  adDescription: {
    color: '#d1d5db',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  premiumOffer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  offerText: {
    color: '#fbbf24',
    fontSize: 18,
    fontWeight: 'bold',
  },
  offerSubtext: {
    color: '#d1d5db',
    fontSize: 12,
    marginTop: 4,
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbbf24',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  premiumButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  adFooter: {
    padding: 20,
    paddingBottom: 40,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateStoryScreen;