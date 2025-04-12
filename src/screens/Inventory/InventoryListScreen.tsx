import React from 'react'; // Removed useEffect as it's not used directly here
import { View, FlatList, StyleSheet, Alert } from 'react-native'; // Added Alert
import { Appbar, Card, Text, ActivityIndicator, useTheme } from 'react-native-paper'; // Removed Button as it's not used directly
import withObservables from '@nozbe/with-observables';
import { Q } from '@nozbe/watermelondb';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

import { database } from '../../db'; // Adjust path as needed
import InventoryItem from '../../db/model/InventoryItem'; // Adjust path as needed
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// Define your Stack param list if you haven't already
// type RootStackParamList = {
//   InventoryList: undefined;
//   InventoryDetail: { itemId: string };
//   InventoryAdd: undefined;
//   // other screens...
// };
// type Props = NativeStackScreenProps<RootStackParamList, 'InventoryList'>;

// Placeholder type for navigation props if RootStackParamList is not defined yet
type Props = {
  navigation: any; // Replace 'any' with proper navigation type later
  inventoryItems: InventoryItem[]; // Injected by withObservables
};

const InventoryListScreen = ({ navigation, inventoryItems }: Props) => {
  const theme = useTheme();
  const { signOut } = useAuth(); // Get signOut function

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation back to Auth screen is handled by the navigator based on context change
    } catch (error) {
        console.error("Sign out error:", error);
        Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('InventoryDetail', { itemId: item.id })}>
      <Card.Title title={item.name} subtitle={`Quantity: ${item.quantity} ${item.unit}`} />
      <Card.Content>
        {item.description ? <Text variant="bodyMedium">{item.description}</Text> : null}
        {item.lowStockThreshold && item.quantity <= item.lowStockThreshold && (
          <Text style={{ color: theme.colors.error }}>Low Stock!</Text>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Inventory" />
        <Appbar.Action icon="plus" onPress={() => navigation.navigate('InventoryAdd')} />
        <Appbar.Action icon="logout" onPress={handleSignOut} />
      </Appbar.Header>
      {inventoryItems ? (
        <FlatList
          data={inventoryItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>No inventory items yet. Add one!</Text>}
        />
      ) : (
        <ActivityIndicator animating={true} size="large" style={styles.loading} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  listContent: {
    paddingBottom: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
  }
});

// HOC to observe changes in the inventory_items table
const enhance = withObservables([], () => ({
  inventoryItems: database.get<InventoryItem>('inventory_items').query(
    // You can add sorting or filtering here, e.g., Q.sortBy('name', Q.asc)
    Q.sortBy('name', Q.asc)
  ).observe(),
}));

export default enhance(InventoryListScreen);