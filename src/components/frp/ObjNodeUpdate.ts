import * as AFRAME from 'aframe'
import { scene, Node, ObjNode } from 'frp-backend'
import { Vector3 } from 'three';
import { emitData } from '../../utils/EdgeVisualEffect';
import { run } from '../../utils/App';

export const objNodeUpdate = AFRAME.registerComponent('obj-node-update', {
    schema: {
        incomingEdges: {type: 'array', default: []},
        outgoingEdges: {type: 'array', default: []}
    },

    init: function(): void {
        this.node = scene.getNode(this.el.getAttribute('id'));
        
        this.el.setAttribute('stored-edges', null);
        this.timeSpam = 500;
        this.timeInterval = 0;
        this.tipOffset = new Vector3(0.133, 0.033, 0.005);
        this.shootDirection = new Vector3(1, 0, 0);
    },

    tick: function(time, timeDelta): void {
        this.el.object3D.updateMatrix();
        this.el.object3D.updateMatrixWorld();
        if (run) {
            this.node.update('position', this.el.object3D.position.clone());
            this.node.update('tip_position', this.el.object3D.localToWorld(this.tipOffset.clone()));
            this.node.update('gun_direction', this.el.object3D.localToWorld(this.shootDirection.clone()).sub(this.el.object3D.position));
        }
        
        // Edge Visual Effect
        this.timeInterval += timeDelta;
        if (this.timeInterval >= this.timeSpam) {
            this.timeInterval = 0;
            // Search for the edge...
            const edges = this.el.getAttribute('stored-edges').outgoingEdges;
            edges.forEach((edgeID: string) => {
                const edgeEl: any = document.querySelector('#'+edgeID);
                if (edgeEl) {
                    emitData(edgeEl, edgeEl.getAttribute('line-component').startPoint, edgeEl.getAttribute('line-component').endPoint);
                }
            });
        }
    },

    remove: function(): void {
        
    }
});