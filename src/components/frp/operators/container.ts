import * as AFRAME from 'aframe';
import { createOnePlug } from '../../utils/operator-model';

export let savedContainerId: number = 0;
export let savedInPorts: Array<Port> = new Array<Port>();
export let savedOutPorts: Array<Port> = new Array<Port>();

export interface Port {
    name: string,
    type: string,
    behavior: string
}

export const ctnWidth: number = 0.5;
export const ctnDepth: number = 0.1;

let tmpInEdges: Array<string> = new Array<string>();
let tmpOutEdges: Array<string> = new Array<string>();

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
        this.el.addEventListener('opList-update', (event) => {
            console.log(this.data.opList);
            const newNode: any = event.detail.el;
            newNode.setAttribute('entity-follow', {
                targetEntity: this.el
            });
            updateInOut(newNode, this.el);
        });

        this.el.addEventListener('port-update', (event) => {
            updateShape(this.data.inPorts, this.data.outPorts, this.el);
        });
    }
});

/**
 * Update the input ports and output ports of the container.
 * @param el The newly added entity
 * @param container The container entity
 */
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
                edgeEl.object3D.scale.set(0.3, 0.3, 0.3);

                const srcProp: string = edgeEl.getAttribute('line-component').sourceProp;
                const tgtProp: string = edgeEl.getAttribute('line-component').targetProp;

                // 1. Omit the inPort of the target entity.
                const idx: number = ctnInNames.indexOf(tgtProp);
                ctnInNames.splice(idx, 1);
                inPorts.splice(idx, 1);

                // 2. Omit the outPort of the source entity (which might have been omitted).
                // const srcIdx: number = ctnOutNames.indexOf(srcProp);
                // if (srcIdx != -1) {
                //     ctnOutNames.splice(srcIdx, 1);
                //     outPorts.splice(srcIdx, 1);
                // }

                // 3. Reset the sourcePropEl so that the edge will start from inner operator.
                const srcPropEl: any = document.getElementById(srcId + '-' + srcProp + '-out');
                if (!srcPropEl) console.warn('Cannot find the property element when updateInOut in container.ts');
                edgeEl.setAttribute('line-component', {
                    sourcePropEl: srcPropEl
                });
            }
            // If the src entity id is not in the opList, then we should re-connect the edge
            else {
                tmpInEdges.push(edgeID);
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
                // const tgtIdx: number = ctnInNames.indexOf(tgtProp);
                // if (tgtIdx != -1) {
                //     ctnInNames.splice(tgtIdx, 1);
                //     inPorts.splice(tgtIdx, 1);
                // }

                // 3. Reset the targetPropEl so that the edge will end at inner operator.
                const tgtPropEl: any = document.getElementById(tgtId + '-' + tgtProp + '-in');
                if (!tgtPropEl) console.warn('Cannot find the property element when updateInOut in container.ts');
                edgeEl.setAttribute('line-component', {
                    targetPropEl: tgtPropEl
                });
            }
            else {
                tmpOutEdges.push(edgeID);
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

/**
 * Update the shape of the container.
 * @param inPorts An array of inputs
 * @param outPorts An Array of outputs
 * @param containerEl The container whose shape is operated on
 */
export function updateShape(inPorts: Array<any>, outPorts: Array<any>, containerEl: any): void {
    const lineHeight: number = 0.1;
    const ctnHeight: number = lineHeight * Math.max(inPorts.length, outPorts.length);
    const inPlugs: Array<any> = new Array<any>();
    const outPlugs: Array<any> = new Array<any>();
    const ctnInNames = containerEl.getAttribute('op-container') ? containerEl.getAttribute('op-container').inNames: [];
    const ctnOutNames = containerEl.getAttribute('op-container') ? containerEl.getAttribute('op-container').outNames: [];
    savedInPorts = [];
    savedOutPorts = [];

    // Set the overall geometry of the container
    containerEl.setAttribute('geometry', {
        primitive: 'box',
        width: ctnWidth,
        height: ctnHeight,
        depth: ctnDepth
    });

    // Delete all the old ports first.
    deleteAllPorts(containerEl);

    // Initiate inputs.
    let i: number = 0;
    for (const inPort of inPorts) {
        const name: string = inPort.name;
        const type: string = inPort.type;
        const behavior: string = inPort.behavior;
        // Create a plug and then save it into the array.
        const plug: any = createOnePlug(name, type, behavior, -ctnWidth/2, ctnHeight/2 - lineHeight*(i+0.5), true, containerEl);
        inPlugs.push(plug);
        savedInPorts.push(inPort);
        i++;
    }

    // Initiate output.
    let j: number = 0;
    for (const outPort of outPorts) {
        const name: string = outPort.name;
        const type: string = outPort.type;
        const behavior: string = outPort.behavior;
        // Create a plug and then save it tinto the array.
        const plug: any = createOnePlug(name, type, behavior, ctnWidth/2, ctnHeight/2 - lineHeight*(j+0.5), false, containerEl);
        outPlugs.push(plug);
        savedOutPorts.push(outPort);
        j++;
    }


    tmpInEdges.forEach((edgeID: string) => {
        const edgeEl: any = document.getElementById(edgeID);
        if (edgeEl) {
            const targetProp: string = edgeEl.getAttribute('line-component').targetProp;
            // inNames and inPlugs should have the same index.
            const idx: number = ctnInNames.indexOf(targetProp);
            edgeEl.setAttribute('line-component', {
                // targetEntity: containerEl,
                targetPropEl: inPlugs[idx], 
            });
        }
    });

    tmpOutEdges.forEach((edgeID: string) => {
        const edgeEl: any = document.getElementById(edgeID);
        if (edgeEl) {
            const sourceProp: string = edgeEl.getAttribute('line-component').sourceProp;
            // outNames and outPlugs should have the same index.
            const idx: number = ctnOutNames.indexOf(sourceProp);
            edgeEl.setAttribute('line-component', {
                // sourceEntity: containerEl,
                sourcePropEl: outPlugs[idx], 
            });
        }
    });
    // tmpInEdges = new Array<string>();
    // tmpOutEdges = new Array<string>()
    // Initiate operator name.
    // const textEntity: any = document.createElement('a-entity');
    // this.el.appendChild(textEntity);
    // this.createTextEntity(textEntity, this.data.functionName, new THREE.Vector3(0, this.boxHeight/2 + 0.05, 0));
}

export function deleteAllPorts(operatorEl: any): void {
    // console.log(operatorEl.children); // Returns an object
    // console.log(operatorEl.childNodes); // Returns an array
    const childNodes: Array<any> = operatorEl.childNodes;
    
    let i: number = 0;
    for (; i < childNodes.length; ) {
        const childNode = childNodes[i];
        if (childNode.classList.contains('connectable')) 
            operatorEl.removeChild(childNode);
        else 
            i++;
    }
}

export function saveContainer(): void {
    // 1. Save the container as an operator in the tool bar.

    // 2. Add event listener when the operator is clicked.

    // 3. Recreate the container.
    savedContainerId++;
}

export function instantiateContainer(): void {

}