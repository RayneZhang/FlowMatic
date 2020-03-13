import * as AFRAME from 'aframe';

export interface Port {
    name: string,
    type: string,
    behavior: string
}

export const opContainer = AFRAME.registerComponent('op-container', {
    schema: {
        inNames: {type: 'array', default: []},
        inPorts: {type: 'array', default: []},
        outNames: {type: 'array', default: []},
        outPorts: {type: 'array', default: []},
        opList: {type: 'array', default: []}
    },

    init: function(): void {
        // Add to the entity's class list.
        console.log("op-container initiated.");
        this.el.addEventListener('opList-update', (event) => {
            console.log(this.data.opList);
            const currentNode: any = event.detail.el;
            updateInOut(currentNode, this.el);
        });

        this.el.addEventListener('port-update', (event) => {
            console.log(this.data.inNames);
            console.log(this.data.inPorts);
            console.log(this.data.outNames);
            console.log(this.data.outPorts);
        });
    }
});

export function updateInOut(el: any, container: any): void {
    const opInNames: Array<string> = el.getAttribute('operator-model') ? el.getAttribute('operator-model').functionInputs : [];
    const opOutNames = el.getAttribute('operator-model') ? el.getAttribute('operator-model').functionOutputs : [];
    const opInBvrs = el.getAttribute('operator-model') ? el.getAttribute('operator-model').behaviorInputs : [];
    const opOutBvrs = el.getAttribute('operator-model') ? el.getAttribute('operator-model').behaviorOutputs : [];
    const opInTypes = el.getAttribute('operator-model') ? el.getAttribute('operator-model').typeInputs : [];
    const opOutTypes = el.getAttribute('operator-model') ? el.getAttribute('operator-model').typeOutputs : [];

    const opList = container.getAttribute('op-container') ? container.getAttribute('op-container').opList: [];
    const inPorts = container.getAttribute('op-container') ? container.getAttribute('op-container').inPorts: [];
    const outPorts = container.getAttribute('op-container') ? container.getAttribute('op-container').outPorts: [];
    const ctnInNames = container.getAttribute('op-container') ? container.getAttribute('op-container').inNames: [];
    const ctnOutNames = container.getAttribute('op-container') ? container.getAttribute('op-container').outNames: [];

    // For each input port of the operator, add it to the container temporarily.
    opInNames.forEach((inName: string, i: number) => {
        const p: Port = {name: inName, type: opInTypes[i], behavior: opInBvrs[i]};
        inPorts.push(p);
        ctnInNames.push(inName);
    });

    // For each output port of the operator, add it to the container temporarily.
    opOutNames.forEach((outName: string, i: number) => {
        const p: Port = {name: outName, type: opOutTypes[i], behavior: opOutBvrs[i]};
        outPorts.push(p);
        ctnOutNames.push(outName);
    });

    const incomingEdges = el.getAttribute('stored-edges') ? el.getAttribute('stored-edges').incomingEdges : [];
    incomingEdges.forEach((edgeID: string) => {
        const edgeEl: any = document.getElementById(edgeID);
        if (edgeEl) {
            // For each edge we can retrieve the line-component from the edge.
            const srcEl: any = edgeEl.getAttribute('line-component').sourceEntity;
            const srcId: string = srcEl.getAttribute('id');

            // If the src entity id is in the opList of the container, then we should omit both ports
            if (opList.indexOf(srcId) != -1) {
                const srcProp: string = edgeEl.getAttribute('line-component').sourceProp;
                const tgtProp: string = edgeEl.getAttribute('line-component').targetProp;

                // 1. Omit the inPort of the target entity.
                const idx: number = ctnInNames.indexOf(tgtProp);
                ctnInNames.splice(idx, 1);
                inPorts.splice(idx, 1);

                // 2. Omit the outPort of the source entity (which might have been omitted).

            }
        }
    });

    const outgoingEdges = el.getAttribute('stored-edges') ? el.getAttribute('stored-edges').outgoingEdges : [];
    outgoingEdges.forEach((edgeID: string) => {
        const edgeEl: any = document.getElementById(edgeID);
        if (edgeEl) {
            // For each edge we can retrieve the line-component from the edge.
            const tgtEl: any = edgeEl.getAttribute('line-component').targetEntity;
            const tgtId: string = tgtEl.getAttribute('id');

            // If the tgt entity id is in the opList of the container, then we should omit both ports
            if (opList.indexOf(tgtId) != -1) {
                const srcProp: string = edgeEl.getAttribute('line-component').sourceProp;
                const tgtProp: string = edgeEl.getAttribute('line-component').targetProp;

                // 1. Omit the outPort of the source entity.
                const idx: number = ctnOutNames.indexOf(srcProp);
                ctnOutNames.splice(idx, 1);
                outPorts.splice(idx, 1);

                // 2. Omit the inPort of the target entity (which might have been omitted).

            }
        }
    });

    // After the four rounds, we can finally pass inPorts and outPorts back to op-container.
    container.setAttribute('op-container', 'inPorts', inPorts);
    container.setAttribute('op-container', 'outPorts', outPorts);
    container.setAttribute('op-container', 'inNames', ctnInNames);
    container.setAttribute('op-container', 'outNames', ctnOutNames);
    container.emit('port-update');
}