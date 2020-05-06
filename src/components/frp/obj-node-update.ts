import * as AFRAME from 'aframe'
import { scene, Node, ObjNode } from 'frp-backend'
import { Vector3, Vector } from 'three';
import { emitData } from '../../utils/EdgeVisualEffect';
import { run } from '../../utils/App';
import { GUN, LIGHT, BOX } from '../../Objects';

export const objNodeUpdate = AFRAME.registerComponent('obj-node-update', {
    schema: {
        incomingEdges: {type: 'array', default: []},
        outgoingEdges: {type: 'array', default: []},
        name: {type: 'string', default: ""},
        animeList: {type: 'array', default: []} // For Sketchfab objects only
    },

    init: function(): void {
        this.node = scene.getNode(this.el.getAttribute('id'));
        
        this.el.setAttribute('stored-edges', null);
        this.timeSpam = 500;
        this.timeInterval = 0;
        this.tipOffset = new Vector3(0.22, 0.05, 0);
        this.shootDirection = new Vector3(1, 0, 0);
        // Update the behaviors when there is an input.
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
            case 'text': {
                this.latest_text = 'Hello World!';
                this.node.pluckOutput('text').subscribe((value: string) => {
                    if (!value) return;
                    if (value == this.latest_text) return;
                    this.latest_text = value;
                    this.setAttribute('text', 'value', value);
                });

                break;
            }
            // All Sketchfab objects are named anime.
            // case 'anime': {
            //     const animeList: Array<string> = this.data.animeList;

            //     animeList.forEach((animeName: string) => {
            //         this.node.pluckOutput(animeName).subscribe((value: boolean) => {
            //             if (!value) return;
            //             if (this.el.hasAttribute('animation-mixer'))
            //                 this.el.removeAttribute('animation-mixer');
            //             this.el.setAttribute('animation-mixer', {
            //                 clip: animeName,
            //                 loop: 'once',
            //                 timeScale: 0.5
            //             });
            //         });
            //     });

            //     break;
            // }
        }
    },

    tick: function(time, timeDelta): void {
        this.el.object3D.updateMatrix();
        this.el.object3D.updateMatrixWorld();
        // Update the attributes that have default values in every frame.
        if (run) {
            this.node.update('position', this.el.object3D.position.clone());
            this.node.update('rotation', this.el.object3D.rotation.clone());
            this.node.update('scale', this.el.object3D.scale.clone());
            switch (this.data.name) {
                case BOX: {
                    this.node.update('width', this.el.getAttribute('geometry').width * this.el.object3D.scale.x);
                    this.node.update('height', this.el.getAttribute('geometry').height * this.el.object3D.scale.y);
                    this.node.update('depth', this.el.getAttribute('geometry').depth * this.el.object3D.scale.z);
                    break;
                }
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
                case 'text': {
                    // this.node.update('text', this.el.getAttribute('text').value);
                    break;
                }
                case 'source': {
                    this.node.update('text', this.el.getAttribute('text').value);
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
                   // emitData(edgeEl, edgeEl.getAttribute('line-component').startPoint, edgeEl.getAttribute('line-component').endPoint);
                }
            });
        }
    },

    remove: function(): void {
        
    }
});