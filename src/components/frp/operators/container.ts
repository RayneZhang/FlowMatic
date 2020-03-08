import * as AFRAME from 'aframe';

export interface Port {
    name: string,
    type: string,
    behavior: string
}

export const opContainer = AFRAME.registerComponent('op-container', {
    schema: {
        inPorts: {type: 'array', default: []},
        outPorts: {type: 'array', default: []},
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