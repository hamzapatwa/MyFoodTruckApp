/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App.web';
import {name as appName} from './app.json';

// Register the app
console.log('index.web.js loaded');
AppRegistry.registerComponent(appName, () => App);

// Set up the web-specific rendering
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root') || document.createElement('div'),
});