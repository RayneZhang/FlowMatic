import * as AFRAME from 'aframe'
import { scene, Node, ObjNode } from 'frp-backend'
import { Vector3 } from 'three';

export const objNodeUpdate = AFRAME.registerComponent('obj-node-update', {
    schema: {
        
    },

    init: function(): void {
        this.node = scene.getNode(this.el.getAttribute('id'));
        // this.tipOffset = new Vector3(1.50 / 3.548, 2.25 / 3.548, -0.25 / 3.548);
        this.tipOffset = new Vector3(0.07, 0.101, -0.012);
        this.shootDirection = new Vector3(0.149, 0.044, 0).normalize();
    },

    tick: function(time, timeDelta): void {
        this.node.update('position', this.el.object3D.position.clone());
        this.node.update('tip_position', this.el.object3D.position.clone().add(this.tipOffset.clone().multiplyScalar(this.el.object3D.scale.x)));
        this.node.update('gun_direction', this.shootDirection);
    }
});