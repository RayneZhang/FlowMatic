import * as AFRAME from 'aframe'
import { scene, Node, ObjNode } from 'frp-backend'
import { Vector3, Vector } from 'three';
import { emitData } from '../../utils/EdgeVisualEffect';
import { run } from '../../utils/App';
import { GUN, LIGHT } from '../../Objects';

export const objNodeUpdate = AFRAME.registerComponent('obj-node-update', {
    schema: {
        incomingEdges: {type: 'array', default: []},
        outgoingEdges: {type: 'array', default: []},
        name: {type: 'string', default: ""}
    },

    init: function(): void {
        this.node = scene.getNode(this.el.getAttribute('id'));
        
        this.el.setAttribute('stored-edges', null);
        this.timeSpam = 500;
        this.timeInterval = 0;
        this.tipOffset = new Vector3(0.22, 0.05, 0);
        this.shootDirection = new Vector3(1, 0, 0);
        switch (this.data.name) {
            case LIGHT: {
                this.light_direction = new Vector3();
                this.node.pluckOutput('light_direction').subscribe((value: Vector3) => {
                    if (!value) return;
                    if (value.equals(this.light_direction)) return;
                    this.light_direction = value;
                    this.el.emit('attribute-update', {dataType: 'vector', dataValue: value, attribute: 'light_direction'});
                });

                this.node.pluckOutput('light_off').subscribe((value: boolean) => {
                    if (!value) return;
                    this.el.emit('attribute-update', {dataType: 'boolean', dataValue: !value, attribute: 'light_on_off'});
                });

                this.node.pluckOutput('light_on').subscribe((value: boolean) => {
                    if (!value) return;
                    this.el.emit('attribute-update', {dataType: 'boolean', dataValue: value, attribute: 'light_on_off'});
                });

                break;
            }
        }
    },

    tick: function(time, timeDelta): void {
        this.el.object3D.updateMatrix();
        this.el.object3D.updateMatrixWorld();
        if (run) {
            this.node.update('position', this.el.object3D.position.clone());
            switch (this.data.name) {
                case GUN: {
                    this.node.update('tip_position', this.el.object3D.localToWorld(this.tipOffset.clone()));
                    this.node.update('gun_direction', this.el.object3D.localToWorld(this.shootDirection.clone()).sub(this.el.object3D.position));
                    break;
                }
                case LIGHT: {
                    // this.node.update('light_direction', this.el.getAttribute('spotlight').direction);
                    this.node.update('light_color', this.el.getAttribute('spotlight').color);
                    break;
                }
            }
            
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