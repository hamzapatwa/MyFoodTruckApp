import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Appbar, Button, TextInput, HelperText, useTheme } from 'react-native-paper';
import { database } from '../../db'; // Adjust path as needed
import InventoryItem from '../../db/model/InventoryItem'; // Adjust path as needed
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Placeholder type for navigation props
// type RootStackParamList = { /* ... */ InventoryAdd: undefined; /* ... */ };
// type Props = NativeStackScreenProps<RootStackParamList, 'InventoryAdd'>;
type Props = {
  navigation: any; // Replace 'any' with proper navigation type later
};

const InventoryAddScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

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

  const handleAddItem = async () => {
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await database.write(async () => {
        await database.get<InventoryItem>('inventory_items').create(item => {
          item.name = name.trim();
          item.description = description.trim() || undefined; // Store undefined if empty
          item.quantity = Number(quantity);
          item.unit = unit.trim();
          item.lowStockThreshold = lowStockThreshold.trim() ? Number(lowStockThreshold) : undefined; // Store undefined if empty
        });
      });
      Alert.alert('Success', 'Inventory item added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error("Failed to add inventory item:", error);
      Alert.alert('Error', 'Failed to add inventory item. Please try again.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Add Inventory Item" />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          label="Item Name *"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          error={!!errors.name}
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
        />

        <TextInput
          label="Quantity *"
          value={quantity}
          onChangeText={setQuantity}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          error={!!errors.quantity}
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
        />
        <HelperText type="error" visible={!!errors.lowStockThreshold}>
          {errors.lowStockThreshold}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleAddItem}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Add Item
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default InventoryAddScreen;