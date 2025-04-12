import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Appbar, Button, TextInput, HelperText, Text, ActivityIndicator, useTheme, Menu, Divider } from 'react-native-paper';
import withObservables from '@nozbe/with-observables';
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
// type Props = NativeStackScreenProps<RootStackParamList, 'InventoryDetail'>;

// Placeholder type for navigation props
type RouteParams = { itemId: string };
type Props = {
  navigation: any; // Replace 'any' with proper navigation type later
  route: { params: RouteParams };
  item: InventoryItem; // Injected by withObservables
};

const InventoryDetailScreen = ({ navigation, route, item }: Props) => {
  const theme = useTheme();
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description || '');
      setQuantity(String(item.quantity));
      setUnit(item.unit);
      setLowStockThreshold(item.lowStockThreshold ? String(item.lowStockThreshold) : '');
      setIsEditMode(false); // Reset edit mode when item changes
      setErrors({});
    }
  }, [item]); // Re-populate fields if the item object changes

  const validate = (): boolean => {
    const newErrors: { [key: string]: string | null } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
      isValid = false;
    } else if (isNaN(Number(quantity)) || Number(quantity) < 0) {
      newErrors.quantity = 'Quantity must be a non-negative number';
      isValid = false;
    }
    if (!unit.trim()) {
      newErrors.unit = 'Unit is required (e.g., kg, pcs, liters)';
      isValid = false;
    }
     if (lowStockThreshold.trim() && (isNaN(Number(lowStockThreshold)) || Number(lowStockThreshold) < 0)) {
        newErrors.lowStockThreshold = 'Low stock threshold must be a non-negative number';
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdate = async () => {
    if (!validate() || !item) {
      return;
    }

    setLoading(true);
    try {
      await item.update(updatedItem => {
        updatedItem.name = name.trim();
        updatedItem.description = description.trim() || undefined;
        updatedItem.quantity = Number(quantity);
        updatedItem.unit = unit.trim();
        updatedItem.lowStockThreshold = lowStockThreshold.trim() ? Number(lowStockThreshold) : undefined;
      });
      Alert.alert('Success', 'Item updated successfully!');
      setIsEditMode(false); // Exit edit mode
    } catch (error) {
      console.error("Failed to update inventory item:", error);
      Alert.alert('Error', 'Failed to update item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!item) return;

    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await item.destroyPermanently(); // Or item.markAsDeleted() for soft delete
              Alert.alert('Success', 'Item deleted successfully!');
              navigation.goBack();
            } catch (error) {
              console.error("Failed to delete inventory item:", error);
              Alert.alert('Error', 'Failed to delete item. Please try again.');
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  if (!item && !loading) {
    // Handle case where item might not be found initially or after deletion
    // This might happen briefly before navigation occurs after delete
    return (
        <View style={styles.container}>
             <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Item Not Found" />
            </Appbar.Header>
            <View style={styles.loadingContainer}>
                <Text>Inventory item not found.</Text>
            </View>
        </View>
    );
  }

   if (!item && loading) {
    // Show loading indicator while fetching or processing delete/update
     return (
        <View style={styles.container}>
             <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Loading..." />
            </Appbar.Header>
            <View style={styles.loadingContainer}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        </View>
    );
  }


  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditMode ? 'Edit Item' : item.name} />
        {!isEditMode && (
           <Menu
             visible={menuVisible}
             onDismiss={closeMenu}
             anchor={<Appbar.Action icon="dots-vertical" onPress={openMenu} />}>
             <Menu.Item onPress={() => { setIsEditMode(true); closeMenu(); }} title="Edit" />
             <Menu.Item onPress={() => { handleDelete(); closeMenu(); }} title="Delete" titleStyle={{ color: theme.colors.error }}/>
           </Menu>
        )}
        {isEditMode && <Appbar.Action icon="close" onPress={() => setIsEditMode(false)} />}
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          label="Item Name *"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          error={!!errors.name}
          disabled={!isEditMode || loading}
        />
        <HelperText type="error" visible={!!errors.name}>
          {errors.name}
        </HelperText>

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={3}
          disabled={!isEditMode || loading}
        />

        <TextInput
          label="Quantity *"
          value={quantity}
          onChangeText={setQuantity}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          error={!!errors.quantity}
          disabled={!isEditMode || loading}
        />
        <HelperText type="error" visible={!!errors.quantity}>
          {errors.quantity}
        </HelperText>

        <TextInput
          label="Unit *"
          value={unit}
          onChangeText={setUnit}
          mode="outlined"
          style={styles.input}
          placeholder="e.g., kg, pcs, liters"
          error={!!errors.unit}
          disabled={!isEditMode || loading}
        />
         <HelperText type="error" visible={!!errors.unit}>
          {errors.unit}
        </HelperText>

        <TextInput
          label="Low Stock Threshold"
          value={lowStockThreshold}
          onChangeText={setLowStockThreshold}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          placeholder="Optional: Notify when quantity falls below this"
          error={!!errors.lowStockThreshold}
          disabled={!isEditMode || loading}
        />
        <HelperText type="error" visible={!!errors.lowStockThreshold}>
          {errors.lowStockThreshold}
        </HelperText>

        {isEditMode && (
          <Button
            mode="contained"
            onPress={handleUpdate}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Save Changes
          </Button>
        )}
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
  scrollContainer: {
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
});

// HOC to observe the specific inventory item based on route params
const enhance = withObservables(['route'], ({ route }: { route: { params: RouteParams } }) => ({
  item: database.get<InventoryItem>('inventory_items').findAndObserve(route.params.itemId),
}));

export default enhance(InventoryDetailScreen);