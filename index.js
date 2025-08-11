// ./index.js
import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that you render the app container fully off-screen before rendering it on screen.
registerRootComponent(App);