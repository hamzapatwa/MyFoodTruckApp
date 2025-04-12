module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // WatermelonDB requires this plugin, and it must come before class-properties
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    // Rely on @react-native/babel-preset for class properties, keep decorators
  ],
};
