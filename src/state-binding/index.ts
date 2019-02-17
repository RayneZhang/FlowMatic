// This file provides bindings between states and components.
// This component subscribes to the store to update the scene on every change.

import * as AFRAME from 'aframe'
import store from '../store'

const stateBinding = AFRAME.registerComponent('state-binding', {
    schema: {
        
    },

    init: function(): void {
        // Log the initial state
        console.log('Initial State: ' + store.getState());
        // Note that subscribe() returns a function for unregistering the listener.
        const unsubscribe = store.subscribe(() => console.log(store.getState()));
    }
});

export default stateBinding;