import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InAppPurchaseService from '../services/InAppPurchaseService';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isKidsMode, setIsKidsMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [storyLength, setStoryLength] = useState('medium'); // 'short', 'medium', 'long'
  const [isPremium, setIsPremium] = useState(false);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyContinueUsage, setDailyContinueUsage] = useState({ date: null, count: 0 });

  // Load settings from AsyncStorage on app start
  useEffect(() => {
    loadSettings();
    loadStories();
    checkSubscriptionStatus();
  }, []);

  // Vérifier le statut de l'abonnement
  const checkSubscriptionStatus = async () => {
    try {
      const isSubscriptionActive = await InAppPurchaseService.checkSubscriptionStatus();
      if (isSubscriptionActive !== isPremium) {
        setIsPremium(isSubscriptionActive);
        await saveSettings({ isPremium: isSubscriptionActive });
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setIsKidsMode(parsedSettings.isKidsMode || false);
        setIsDarkMode(parsedSettings.isDarkMode || false);
        setFontSize(parsedSettings.fontSize || 'medium');
        setStoryLength(parsedSettings.storyLength || 'medium');
        setIsPremium(parsedSettings.isPremium || false);
      }
      
      // Load daily continue usage
      const continueUsage = await AsyncStorage.getItem('dailyContinueUsage');
      if (continueUsage) {
        const parsedUsage = JSON.parse(continueUsage);
        const today = new Date().toDateString();
        if (parsedUsage.date === today) {
          setDailyContinueUsage(parsedUsage);
        } else {
          // Reset count for new day
          const newUsage = { date: today, count: 0 };
          setDailyContinueUsage(newUsage);
          await AsyncStorage.setItem('dailyContinueUsage', JSON.stringify(newUsage));
        }
      } else {
        const today = new Date().toDateString();
        const newUsage = { date: today, count: 0 };
        setDailyContinueUsage(newUsage);
        await AsyncStorage.setItem('dailyContinueUsage', JSON.stringify(newUsage));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      // Get current settings from AsyncStorage to avoid stale state
      const existingSettings = await AsyncStorage.getItem('appSettings');
      let currentSettings = {
        isKidsMode: false,
        isDarkMode: false,
        fontSize: 'medium',
        storyLength: 'medium',
        isPremium: false
      };
      
      if (existingSettings) {
        currentSettings = JSON.parse(existingSettings);
      }
      
      // Merge with new settings
      const settings = {
        ...currentSettings,
        ...newSettings
      };
      
      await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const loadStories = async () => {
    try {
      const savedStories = await AsyncStorage.getItem('stories');
      if (savedStories) {
        setStories(JSON.parse(savedStories));
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  const saveStory = async (story) => {
    try {
      const newStory = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        isFavorite: false,
        status: 'completed', // 'completed', 'to_continue', 'to_reread'
        ...story
      };
      
      const updatedStories = [newStory, ...stories];
      setStories(updatedStories);
      await AsyncStorage.setItem('stories', JSON.stringify(updatedStories));
      return newStory;
    } catch (error) {
      console.error('Error saving story:', error);
      throw error;
    }
  };

  const updateStory = async (storyId, updates) => {
    try {
      const updatedStories = stories.map(story => 
        story.id === storyId ? { ...story, ...updates } : story
      );
      setStories(updatedStories);
      await AsyncStorage.setItem('stories', JSON.stringify(updatedStories));
    } catch (error) {
      console.error('Error updating story:', error);
    }
  };

  const deleteStory = async (storyId) => {
    try {
      const updatedStories = stories.filter(story => story.id !== storyId);
      setStories(updatedStories);
      await AsyncStorage.setItem('stories', JSON.stringify(updatedStories));
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const toggleKidsMode = async () => {
    setIsKidsMode(prevValue => {
      const newValue = !prevValue;
      // Use setTimeout to ensure state update is processed first
      setTimeout(() => {
        saveSettings({ isKidsMode: newValue });
      }, 0);
      return newValue;
    });
  };

  const toggleDarkMode = async () => {
    setIsDarkMode(prevValue => {
      const newValue = !prevValue;
      // Use setTimeout to ensure state update is processed first
      setTimeout(() => {
        saveSettings({ isDarkMode: newValue });
      }, 0);
      return newValue;
    });
  };

  const changeFontSize = async (size) => {
    setFontSize(size);
    await saveSettings({ fontSize: size });
  };

  const changeStoryLength = async (length) => {
    setStoryLength(length);
    await saveSettings({ storyLength: length });
  };

  const togglePremium = async () => {
    setIsPremium(prevValue => {
      const newValue = !prevValue;
      // Use setTimeout to ensure state update is processed first
      setTimeout(() => {
        saveSettings({ isPremium: newValue });
      }, 0);
      return newValue;
    });
  };

  const canContinueStory = () => {
    if (isPremium) return true;
    return dailyContinueUsage.count < 1;
  };

  const useContinueStory = async () => {
    if (isPremium) return true;
    
    const today = new Date().toDateString();
    if (dailyContinueUsage.date !== today) {
      // New day, reset count
      const newUsage = { date: today, count: 1 };
      setDailyContinueUsage(newUsage);
      await AsyncStorage.setItem('dailyContinueUsage', JSON.stringify(newUsage));
      return true;
    } else if (dailyContinueUsage.count < 1) {
      // Same day, increment count
      const newUsage = { ...dailyContinueUsage, count: dailyContinueUsage.count + 1 };
      setDailyContinueUsage(newUsage);
      await AsyncStorage.setItem('dailyContinueUsage', JSON.stringify(newUsage));
      return true;
    }
    
    return false; // Limit reached
  };

  const clearAllData = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();
      
      // Reset all states to default values
      setIsKidsMode(false);
      setIsDarkMode(false);
      setFontSize('medium');
      setStoryLength('medium');
      setIsPremium(false);
      setStories([]);
      setDailyContinueUsage({ date: null, count: 0 });
      
      return true;
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  };

  const value = {
    // Settings
    isKidsMode,
    isDarkMode,
    fontSize,
    storyLength,
    isPremium,
    loading,
    
    // Stories
    stories,
    
    // Continue story limitations
    dailyContinueUsage,
    canContinueStory,
    useContinueStory,
    
    // Actions
    toggleKidsMode,
    toggleDarkMode,
    changeFontSize,
    changeStoryLength,
    togglePremium,
    saveStory,
    updateStory,
    deleteStory,
    loadStories,
    clearAllData,
    checkSubscriptionStatus
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};