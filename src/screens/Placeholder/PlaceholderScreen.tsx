import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';

const PlaceholderScreen: React.FC = () => {
  
  const handleGetStartedButtonPress = () => {
    Alert.alert('Test Alert');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Food Truck App</Text>
      <Text style={styles.subtitle}>Coming Soon!</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          This is a placeholder screen for the Food Truck App. The app is currently under development.
        </Text>
        
        <Text style={styles.featureTitle}>Planned Features:</Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>• Inventory Management</Text>
          <Text style={styles.featureItem}>• Sales Tracking</Text>
          <Text style={styles.featureItem}>• Customer Management</Text>
          <Text style={styles.featureItem}>• Reporting & Analytics</Text>
          <Text style={styles.featureItem}>• Offline Support</Text>
        </View>
      </View>
      
      <Button 
        mode="contained" 
        style={styles.button}
        onPress={handleGetStartedButtonPress}
      >
        Get Started
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    color: '#7f8c8d',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#34495e',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  featureList: {
    marginLeft: 10,
  },
  featureItem: {
    fontSize: 16,
    lineHeight: 28,
    color: '#34495e',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
});

export default PlaceholderScreen;