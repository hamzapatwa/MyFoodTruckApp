// Mock implementation for MaterialCommunityIcons
import createIconSet from './react-native-vector-icons';

// Create a mock glyph map with some common icons
const glyphMap = {
  'menu': 'menu',
  'home': 'home',
  'settings': 'settings',
  'account': 'account',
  'plus': 'plus',
  'minus': 'minus',
  'check': 'check',
  'close': 'close',
  'arrow-left': 'arrow-left',
  'arrow-right': 'arrow-right',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  'chevron-up': 'chevron-up',
  'chevron-down': 'chevron-down',
};

// Create the icon set with the mock glyph map
const MaterialCommunityIcons = createIconSet(
  glyphMap,
  'MaterialCommunityIcons',
  'MaterialCommunityIcons.ttf'
);

export default MaterialCommunityIcons;