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

                // If grabbed entity exists, then delete the object from the scene
                targetEntity.parentNode.removeChild(targetEntity);
                targetEntity.destroy();
                rightHand.setAttribute('right-grip-listener', 'grabbedEl', null);

                // TODO: Manage the edges associated with the object
            }
        });
    }
});