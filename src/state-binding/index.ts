// This file provides bindings between states and components.
// This component subscribes to the store to update the scene on every change.

import * as AFRAME from 'aframe'
import store from '../store'

const stateBinding = AFRAME.registerComponent('state-binding', {
    schema: {
        objects: {type: 'array', default: []}
    },

    init: function(): void {
        // Log the initial state
        console.log('Initial State:');
        console.log(store.getState());
        this.data.objects = store.getState().objects.present;
        console.log(this.data.objects);
        // Note that subscribe() returns a function for unregistering the listener.
        const unsubscribe = store.subscribe(() => {
            this.updateObjects();
        });
    }, 

    // No mutating the parameters.
    updateObjects: function(): void {
        console.log(store.getState())
    }
});

export default stateBinding;