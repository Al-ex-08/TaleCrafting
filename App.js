import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import CreateStoryScreen from './src/screens/CreateStoryScreen';
import StoryDisplayScreen from './src/screens/StoryDisplayScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';

// Context for app settings
import { AppProvider, useApp } from './src/context/AppContext';
import InAppPurchaseService from './src/services/InAppPurchaseService';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateStory" 
        component={CreateStoryScreen}
        options={{ 
          title: 'Créer une histoire',
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="StoryDisplay" 
        component={StoryDisplayScreen}
        options={{ 
          title: 'Votre histoire',
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="Subscription" 
        component={SubscriptionScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

function HistoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HistoryMain" 
        component={HistoryScreen}
        options={{ 
          title: 'Mes histoires',
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="StoryDisplay" 
        component={StoryDisplayScreen}
        options={{ 
          title: 'Votre histoire',
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="CreateStory" 
        component={CreateStoryScreen}
        options={{ 
          title: 'Créer une histoire',
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#fff'
        }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { isDarkMode, isKidsMode } = useApp();
  
  const theme = {
    tabBarBackground: isDarkMode ? '#1a1a1a' : '#ffffff',
    tabBarBorder: isDarkMode ? '#2d2d2d' : '#e5e7eb',
    primary: isKidsMode ? '#f59e0b' : '#6366f1',
    inactiveColor: isDarkMode ? '#9ca3af' : '#6b7280'
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.inactiveColor,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          borderTopColor: theme.tabBarBorder,
          borderTopWidth: 1,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack}
        options={{ title: 'Accueil' }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryStack}
        options={{ title: 'Mes histoires' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Paramètres' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    // Initialiser le service d'achats in-app au démarrage
    const initializeInAppPurchases = async () => {
      try {
        await InAppPurchaseService.initialize();
      } catch (error) {
        console.error('Failed to initialize In-App Purchases:', error);
      }
    };
    
    initializeInAppPurchases();
    
    // Nettoyer les ressources à la fermeture de l'app
    return () => {
      InAppPurchaseService.cleanup();
    };
  }, []);

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <MainTabs />
      </NavigationContainer>
    </AppProvider>
  );
}
