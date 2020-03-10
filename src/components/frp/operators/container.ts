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
        this.el.addEventListener('opList-update', (event) => {
            console.log(this.data.opList);
        });
    }
});

export function updateInOut(el: any, container: any): void {
    // To traverse the ports of the entity, we can fetch the operator model from the op.
    const inNames = el.getAttribute('operator-model') ? el.getAttribute('operator-model').functionInputs : [];
    const outNames = el.getAttribute('operator-model') ? el.getAttribute('operator-model').functionOutputs : [];
    const inBvrs = el.getAttribute('operator-model') ? el.getAttribute('operator-model').behaviorInputs : [];
    const outBvrs = el.getAttribute('operator-model') ? el.getAttribute('operator-model').behaviorOutputs : [];
    const inTypes = el.getAttribute('operator-model') ? el.getAttribute('operator-model').typeInputs : [];
    const outTypes = el.getAttribute('operator-model') ? el.getAttribute('operator-model').typeOutputs : [];

    const opList = container.getAttribute('op-container') ? container.getAttribute('op-container').opList: [];
    const inPorts = container.getAttribute('op-container') ? container.getAttribute('op-container').inPorts: [];
    const outPorts = container.getAttribute('op-container') ? container.getAttribute('op-container').outPorts: [];

    const incomingEdges = el.getAttribute('stored-edges') ? el.getAttribute('stored-edges').incomingEdges : [];

    incomingEdges.forEach((edgeID: string) => {
        const edge: any = document.querySelector('#' + edgeID);
        if (edge) {
            // If all the edges are coming from within the container, then omit this port.
            // For each edge we can retrieve the line-component from the edge, but we also need to tranverse the ports of the entity

            // Next we retrieve the ops that exsit in the container already.
            

        }
    });

    const outgoingEdges = el.getAttribute('stored-edges') ? el.getAttribute('stored-edges').outgoingEdges : [];
    outgoingEdges.forEach((edgeID: string) => {
        const edge: any = document.querySelector('#' + edgeID);
        if (edge) {
            // If all the edges are going to within the container, then omit this port.
            console.log(edge);
        }
    });

}