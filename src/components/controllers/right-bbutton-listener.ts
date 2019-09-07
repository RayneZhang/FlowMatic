import * as AFRAME from 'aframe';
import { scene, Node } from 'frp-backend';

export const rightBButtonListener = AFRAME.registerComponent('right-bbutton-listener', {
    init: function(): void {
        this.el.addEventListener('bbuttondown', (event) => {  
            const rightHand: any = document.querySelector("#rightHand");
            const targetEntity: any = rightHand.components['right-grip-listener'].data.grabbedEl;
            if (targetEntity) {
                // Remove nodes from the backend (The backend will handle edges too)
                const targetNode: Node = scene.getNode(targetEntity.getAttribute('id'));
                scene.removeNode(targetNode);

                // Remove the edges associated with the object
                const incomingEdges = targetEntity.getAttribute('stored-edges') ? targetEntity.getAttribute('stored-edges').incomingEdges : [];
                incomingEdges.forEach((edgeID: string) => {
                    const edge: any = document.querySelector('#' + edgeID);
                    edge.parentNode.removeChild(edge);
                    edge.destroy();
                });

                const outgoingEdges = targetEntity.getAttribute('stored-edges') ? targetEntity.getAttribute('stored-edges').outgoingEdges : [];
                outgoingEdges.forEach((edgeID: string) => {
                    const edge: any = document.querySelector('#' + edgeID);
                    edge.parentNode.removeChild(edge);
                    edge.destroy();
                });

                // If grabbed entity exists, then delete the object from the scene
                targetEntity.parentNode.removeChild(targetEntity);
                targetEntity.destroy();
                rightHand.setAttribute('right-grip-listener', 'grabbedEl', null);
            }
        });
    }
});