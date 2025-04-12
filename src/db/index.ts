import { Platform } from 'react-native';
import { Database } from '@nozbe/watermelondb';
// Import adapters conditionally to avoid bundling issues
// import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'; // Removed static import
// import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'; // Removed static import

import { myAppSchema } from './schema';
// Import models here once defined
import InventoryItem from './model/InventoryItem';
// import Post from './model/Post'; // Example

// Determine the adapter based on the platform
let adapter;

if (Platform.OS === 'ios' || Platform.OS === 'android') {
  // Native platform (iOS/Android)
  const SQLiteAdapter = require('@nozbe/watermelondb/adapters/sqlite').default;
  adapter = new SQLiteAdapter({
    schema: myAppSchema,
    // (You might want to comment out dbName in development environments to quickly reset database:
    // dbName: 'myFoodTruckAppDB', // optional database name or file system path
    // Pass migrations if/when defined:
    // migrations,
    // Optional: pass true to use JSI SQLite adapter (requires installing react-native-quick-sqlite)
    // jsi: true, /* Platform.OS === 'ios' */
    // Optional: pass encryption key
    // onSetUpError: error => {
    //   // Database failed to load -- offer the user to reload the app or log out
    // }
  });
} else {
  // Web platform or other environments (e.g., testing)
  const LokiJSAdapter = require('@nozbe/watermelondb/adapters/lokijs').default;
  adapter = new LokiJSAdapter({
    schema: myAppSchema,
    // These options are recommended for performance on the web:
    useWebWorker: false, // Set true to use Web Worker (recommended for browser environments)
    useIncrementalIndexedDB: true, // Recommended for performance
    // dbName: 'myFoodTruckAppWebDB', // Optional database name
    // Optional: Pass migrations if/when defined
    // migrations,
    // Optional: Configure persistence options or other LokiJS specific settings
    // extraLokiOptions: {},
    // onSetUpError: error => {
    //   // Database failed to load
    // }
  });
}

// Instantiate the database
export const database = new Database({
  adapter,
  modelClasses: [
    // Add your model classes here once defined
    InventoryItem,
    // Post, // Example
  ],
});