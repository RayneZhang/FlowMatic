import * as AFRAME from 'aframe';
import { scene, Node } from 'frp-backend';

export const rightBButtonListener = AFRAME.registerComponent('right-bbutton-listener', {
    init: function(): void {
        this.el.addEventListener('bbuttondown', (event) => {  
            const rightHand: any = document.querySelector("#rightHand");
            const targetEntity: any = rightHand.components['right-grip-listener'].data.grabbedEl;
            destroyObj(targetEntity);
            rightHand.setAttribute('right-grip-listener', 'grabbedEl', null);
        });
    }
});

export function destroyObj(targetEntity: any) {
    if (targetEntity) {
        // Remove nodes from the backend (The backend will handle edges too)
        const targetNode: Node = scene.getNode(targetEntity.getAttribute('id'));
        scene.removeNode(targetNode);

        // Remove the edges associated with the object
        const incomingEdges = targetEntity.getAttribute('stored-edges') ? targetEntity.getAttribute('stored-edges').incomingEdges : [];
        incomingEdges.forEach((edgeID: string) => {
            const edge: any = document.querySelector('#' + edgeID);
            if (edge) {
                edge.parentNode.removeChild(edge);
                setTimeout(() => {edge.destroy();}, 500);
                
            }
        });

        const outgoingEdges = targetEntity.getAttribute('stored-edges') ? targetEntity.getAttribute('stored-edges').outgoingEdges : [];
        outgoingEdges.forEach((edgeID: string) => {
            const edge: any = document.querySelector('#' + edgeID);
            if (edge) {
                edge.parentNode.removeChild(edge);
                setTimeout(() => {edge.destroy();}, 500);
            }
        });

        // If grabbed entity exists, then delete the object from the scene
        targetEntity.parentNode.removeChild(targetEntity);
        targetEntity.destroy();
        
    }
};