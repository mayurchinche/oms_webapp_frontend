// src/store.js
import { createStore } from 'redux';
import rootReducer from './reducers';
import { rehydrateAuth } from '../redux/Actions/authActions';

// Create the Redux store
const store = createStore(rootReducer);

// Rehydrate the authentication state
store.dispatch(rehydrateAuth());

export default store;