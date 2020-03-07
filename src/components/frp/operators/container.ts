import * as AFRAME from 'aframe';

export const opContainer = AFRAME.registerComponent('op-container', {
    schema: {
        inName: {type: 'array', default: []},
        inType: {type: 'array', default: []},
        inBehavior: {type: 'array', default: []},
        outName: {type: 'array', default: []},
        outType: {type: 'array', default: []},
        outBehavior: {type: 'array', default: []},
        opList: {type: 'array', default: []}
    },

    init: function(): void {
        // Add to the entity's class list.
        console.log("op-container initiated.");
    },

    tick: function(time, timeDelta): void {
        
    },

    update: function (oldData): void {

    }
});