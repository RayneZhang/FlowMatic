import * as AFRAME from 'aframe'
import { scene, Node, ObjNode } from 'frp-backend'
import { objects, L_CONTROLLER, R_CONTROLLER, HEADSET } from '../../Objects';
import { Vector3 as THREEVector3} from 'three';
import { emitData } from '../../utils/EdgeVisualEffect';
import { run } from '../../utils/App';

export const avatarNodeUpdate = AFRAME.registerComponent('avatar-node-update', {
    schema: {
        name: {type: 'string', default: ''},
    },

    init: function(): void {
        if (this.data.name === R_CONTROLLER) { this.targetEntity = document.querySelector('#rightHand'); this.props = objects.Avatars[2].outputs; }
        else if (this.data.name === L_CONTROLLER) { this.targetEntity = document.querySelector('#leftHand'); this.props = objects.Avatars[1].outputs; }
        else if (this.data.name === HEADSET) { this.targetEntity = document.querySelector('#head'); this.props = objects.Avatars[0].outputs; }
        else { console.log(`AvatarNodeUpdate initiation cannot find target entity.`); return; }

        this.el.setAttribute('stored-edges', null);
        
        this.targetEntity.object3D.updateMatrix();
        this.targetEntity.object3D.updateWorldMatrix();
        const worldPos = this.targetEntity.object3D.localToWorld(new THREEVector3(0, 0, 0));
        
        const initOutputs = this.props.map((o) => {
            if (o.name === 'object')
                o['default'] = `node-${Node.getNodeCount()}`;
            if (o.name === 'position')
                o['default'] = worldPos;
            return o;
        });
        console.log(initOutputs);
        const objNode = this.node = scene.addObj(this.data.name, initOutputs);
        this.el.setAttribute('id', objNode.getID());

        // Read label and bind button events to updates.
        if (this.data.name === R_CONTROLLER || this.data.name === L_CONTROLLER) {
            this.targetEntity.addEventListener('triggerdown', (event) => {
                if (run) {
                    objNode.update('triggerdown', true);
                    objNode.update('triggerdown', false);
                    
                    // Edge Visual Effect
                    const edges = this.el.getAttribute('stored-edges').outgoingEdges;
                    edges.forEach((edgeID: string) => {
                        const edgeEl: any = document.querySelector('#'+edgeID);
                        if (edgeEl && edgeEl.getAttribute('line-component').sourceProp == 'triggerdown') {
                            emitData(edgeEl, edgeEl.getAttribute('line-component').startPoint, edgeEl.getAttribute('line-component').endPoint);
                        }
                    });
                }
            });

            this.targetEntity.addEventListener('triggerup', (event) => {
                if (run) {
                    objNode.update('triggerup', true);
                    objNode.update('triggerup', false);

                    // Edge Visual Effect
                    const edges = this.el.getAttribute('stored-edges').outgoingEdges;
                    edges.forEach((edgeID: string) => {
                        const edgeEl: any = document.querySelector('#'+edgeID);
                        if (edgeEl && edgeEl.getAttribute('line-component').sourceProp == 'triggerup') {
                            emitData(edgeEl, edgeEl.getAttribute('line-component').startPoint, edgeEl.getAttribute('line-component').endPoint);
                        }
                    });
                }
                
                
            });
        }
    },

    tick: function(time, timeDelta): void {
        this.targetEntity.object3D.updateMatrix();
        this.targetEntity.object3D.updateWorldMatrix();
        const worldPos = this.targetEntity.object3D.localToWorld(new THREEVector3(0, 0, 0));
        if (run) {
            this.node.update('position', worldPos.clone());
            switch (this.data.name) {
                case HEADSET: {
                    break;
                }
            }
            
        }
    },
});