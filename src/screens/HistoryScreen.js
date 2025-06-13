import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const HistoryScreen = ({ navigation }) => {
  const { stories, isDarkMode, isKidsMode, isPremium, updateStory, deleteStory, loadStories, canContinueStory, useContinueStory } = useApp();
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'name', 'favorites'
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'favorites', 'to_continue', 'to_reread'

  const theme = {
    background: isDarkMode ? '#1a1a1a' : '#f8fafc',
    cardBackground: isDarkMode ? '#2d2d2d' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1f2937',
    textSecondary: isDarkMode ? '#d1d5db' : '#6b7280',
    primary: isKidsMode ? '#f59e0b' : '#6366f1',
    primaryLight: isKidsMode ? '#fbbf24' : '#818cf8',
    inputBackground: isDarkMode ? '#374151' : '#f9fafb',
    inputBorder: isDarkMode ? '#4b5563' : '#d1d5db'
  };

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    filterAndSortStories();
  }, [stories, searchQuery, sortBy, filterBy]);

  const filterAndSortStories = () => {
    let filtered = [...stories];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(story => 
        story.heroName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.theme.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    switch (filterBy) {
      case 'favorites':
        filtered = filtered.filter(story => story.isFavorite);
        break;
      case 'to_continue':
        filtered = filtered.filter(story => story.status === 'to_continue');
        break;
      case 'to_reread':
        filtered = filtered.filter(story => story.status === 'to_reread');
        break;
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.heroName.localeCompare(b.heroName));
        break;
      case 'favorites':
        filtered.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
        break;
      default: // 'date'
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredStories(filtered);
  };

  const handleStoryPress = (story) => {
    navigation.navigate('StoryDisplay', { story });
  };

  const handleToggleFavorite = async (story) => {
    await updateStory(story.id, { isFavorite: !story.isFavorite });
  };

  const handleUpdateStatus = async (story, newStatus) => {
    await updateStory(story.id, { status: newStatus });
  };

  const handleDeleteStory = (story) => {
    Alert.alert(
      'Supprimer l\'histoire',
      `Êtes-vous sûr de vouloir supprimer l\'histoire de ${story.heroName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteStory(story.id)
        }
      ]
    );
  };

  const handleContinueStory = async (story) => {
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
      navigation.navigate('CreateStory', { continueStory: story });
    } else {
      Alert.alert(
        'Erreur',
        'Impossible de continuer l\'histoire pour le moment.'
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'to_continue': return 'play-forward';
      case 'to_reread': return 'refresh';
      default: return 'checkmark-circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'to_continue': return '#f59e0b';
      case 'to_reread': return '#3b82f6';
      default: return '#10b981';
    }
  };

  const renderStoryItem = ({ item: story }) => (
    <TouchableOpacity
      style={[styles.storyCard, { backgroundColor: theme.cardBackground }]}
      onPress={() => handleStoryPress(story)}
      activeOpacity={0.7}
    >
      <View style={styles.storyHeader}>
        <View style={styles.storyInfo}>
          <Text style={[styles.heroName, { color: theme.text }]}>
            {story.heroName}
            {story.age && ` (${story.age} ans)`}
          </Text>
          <Text style={[styles.theme, { color: theme.textSecondary }]} numberOfLines={1}>
            {story.theme}
          </Text>
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {formatDate(story.createdAt)}
          </Text>
        </View>
        
        <View style={styles.storyActions}>
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => handleToggleFavorite(story)}
          >
            <Ionicons 
              name={story.isFavorite ? 'heart' : 'heart-outline'} 
              size={20} 
              color={story.isFavorite ? '#ef4444' : theme.textSecondary} 
            />
          </TouchableOpacity>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(story.status) }]}>
            <Ionicons 
              name={getStatusIcon(story.status)} 
              size={12} 
              color="white" 
            />
          </View>
        </View>
      </View>
      
      <Text style={[styles.preview, { color: theme.textSecondary }]} numberOfLines={2}>
        {story.content}
      </Text>
      
      <View style={styles.storyFooter}>
        <View style={styles.tags}>
          <Text style={[styles.tag, { backgroundColor: theme.primaryLight, color: 'white' }]}>
            {story.narrativeStyle}
          </Text>
          {story.isKidsMode && (
            <Text style={[styles.tag, { backgroundColor: '#f59e0b', color: 'white' }]}>
              👶 Kids
            </Text>
          )}
        </View>
        
        <View style={styles.quickActions}>
          {isPremium && (
            <TouchableOpacity
              style={[styles.quickAction, { backgroundColor: theme.primary }]}
              onPress={() => handleContinueStory(story)}
            >
              <Ionicons name="add" size={16} color="white" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: '#ef4444' }]}
            onPress={() => handleDeleteStory(story)}
          >
            <Ionicons name="trash" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="library-outline" size={64} color={theme.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        Aucune histoire trouvée
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        {searchQuery || filterBy !== 'all' 
          ? 'Essayez de modifier vos filtres de recherche'
          : 'Commencez par créer votre première histoire !'
        }
      </Text>
      {!searchQuery && filterBy === 'all' && (
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('CreateStory')}
        >
          <Text style={styles.createButtonText}>Créer une histoire</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Mes histoires</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {stories.length} histoire{stories.length !== 1 ? 's' : ''} créée{stories.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: theme.inputBackground,
            borderColor: theme.inputBorder,
            color: theme.text
          }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Rechercher par nom ou thème..."
          placeholderTextColor={theme.textSecondary}
        />
        
        <View style={styles.filterButtons}>
          {['all', 'favorites', 'to_continue', 'to_reread'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, {
                backgroundColor: filterBy === filter ? theme.primary : theme.cardBackground,
                borderColor: theme.inputBorder
              }]}
              onPress={() => setFilterBy(filter)}
            >
              <Text style={[styles.filterButtonText, {
                color: filterBy === filter ? 'white' : theme.text
              }]}>
                {filter === 'all' ? 'Toutes' :
                 filter === 'favorites' ? 'Favoris' :
                 filter === 'to_continue' ? 'À continuer' : 'À relire'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stories List */}
      <FlatList
        data={filteredStories}
        renderItem={renderStoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  filtersContainer: {
    padding: 20,
    paddingTop: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  storyCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  storyInfo: {
    flex: 1,
  },
  heroName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  theme: {
    fontSize: 14,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
  storyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    padding: 4,
  },
  statusBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
    flex: 1,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  createButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HistoryScreen;