import * as AFRAME from 'aframe'
import { scene, Node, ObjNode } from 'frp-backend'
import { Vector3 } from 'three';

export const objNodeUpdate = AFRAME.registerComponent('obj-node-update', {
    schema: {
        incomingEdges: {type: 'array', default: []},
        outgoingEdges: {type: 'array', default: []}
    },

    init: function(): void {
        this.node = scene.getNode(this.el.getAttribute('id'));
        
        this.el.setAttribute('stored-edges', null);

        this.tipOffset = new Vector3(0.07, 0.101, -0.012);
        this.shootDirection = new Vector3(0.149, 0.044, 0).normalize();
    },

    tick: function(time, timeDelta): void {
        this.el.object3D.updateMatrix();
        this.el.object3D.updateMatrixWorld();
        this.node.update('position', this.el.object3D.position.clone());
        this.node.update('tip_position', this.el.object3D.localToWorld(this.tipOffset.clone()));
        this.node.update('gun_direction', this.el.object3D.localToWorld(this.shootDirection.clone()).sub(this.el.object3D.position));
    }
});