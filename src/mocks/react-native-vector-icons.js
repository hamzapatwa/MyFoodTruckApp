// Mock implementation for react-native-vector-icons
import React from 'react';
import { Text } from 'react-native';

// Create a simple mock for the icon component
const createIconSet = (glyphMap, fontFamily, fontFile) => {
  const Icon = ({ name, size, color, style, ...props }) => {
    return (
      <Text
        style={[
          {
            fontFamily,
            fontSize: size,
            color,
            // Use a fallback character for web
            textAlign: 'center',
          },
          style,
        ]}
        {...props}
      >
        ●
      </Text>
    );
  };

  // Add static methods that the original library has
  Icon.Button = ({ name, children, ...props }) => {
    return (
      <Text {...props}>
        ● {children}
      </Text>
    );
  };

  Icon.getImageSource = () => Promise.resolve({});
  Icon.loadFont = () => Promise.resolve();
  Icon.hasIcon = () => true;
  Icon.getRawGlyphMap = () => glyphMap;
  Icon.getFontFamily = () => fontFamily;

  return Icon;
};

// Export the mock functions
export {
  createIconSet,
};

// Export default as a function that returns the mock
export default createIconSet;