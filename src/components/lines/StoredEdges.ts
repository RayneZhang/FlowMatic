import * as AFRAME from 'aframe'

export const storedEdges = AFRAME.registerComponent('stored-edges', {
    schema: {
        incomingEdges: {type: 'array', default: []},
        outgoingEdges: {type: 'array', default: []}
    },

    init: function(): void {
        
    }
});