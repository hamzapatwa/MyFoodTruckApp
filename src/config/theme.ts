import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { MD3Theme } from 'react-native-paper/lib/typescript/types'; // Import MD3Theme type

// Define custom colors or overrides here if needed
// const customColors = {
//   primary: '#6200ee',
//   accent: '#03dac4',
//   // ... other colors
// };

const theme: MD3Theme = {
  ...DefaultTheme,
  // Override default theme properties here
  // colors: {
  //   ...DefaultTheme.colors,
  //   ...customColors,
  // },
  // You can also customize fonts, roundness, etc.
  // fonts: configureFonts({ config: baseFontConfig }), // Example if using custom fonts
  // roundness: 4,
};

export default theme;