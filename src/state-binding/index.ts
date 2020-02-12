// This file provides bindings between states and components.
// This component subscribes to the store to update the scene on every change.

import * as AFRAME from 'aframe'
import store from '../store'
import { objects } from '../Objects'
import { scene, Node } from 'frp-backend'
import { Vector3 } from 'three';
const stateBinding = AFRAME.registerComponent('state-binding', {
    schema: {
        objects: {type: 'array', default: []}
    },

    init: function(): void { 
        console.log(store.getState());
        this.data.objects = store.getState().objects.present;
        this.id = 0;
        // Note that subscribe() returns a function for unregistering the listener.
        const unsubscribe = store.subscribe(() => {
            console.log(store.getState()); // For debugging
            this.updateObjects();
        });
    }, 

    // No mutating the parameters.
    updateObjects: function(): void {
        const presentObjects = store.getState().objects.present;

        // When add an object into the scene...
        if (presentObjects.length > this.data.objects.length) {
            const addedObj: any = presentObjects[presentObjects.length - 1];
            const targetObjName: string = addedObj.targetModel;
            const position: Vector3 = addedObj.position;
            const color: string = addedObj.color;

            // Create an entity and append it to AFRAME scene.
            let newEntity: any = document.createElement('a-entity');
            this.el.appendChild(newEntity);

            newEntity.object3D.position.set(position.x, position.y, position.z);
            newEntity.classList.add("movable");

            // Models that exist in the objects store.
            for (let i = 0; i < objects.Models.length; i++) {
                if (objects.Models[i].name === targetObjName) {
                    newEntity.setAttribute('obj-attributes-list', 'targetModelName', targetObjName);
                    newEntity.classList.add('data-receiver');

                    if (objects.Models[i].type === 'primitive') {
                        newEntity.setAttribute('geometry', 'primitive', targetObjName);
                        newEntity.object3D.scale.set(0.1, 0.1, 0.1);

                        // Create a node in frp-backend
                        const objNode = scene.addObj(targetObjName, [{name: 'object', default: `node-${Node.getNodeCount()}`}, {name: 'position', default: position}, {name: 'color', default: color}]);

                        newEntity.setAttribute('id', objNode.getID());
                        objNode.pluckOutput('color').subscribe((value) => {
                        console.log(`${objNode.getLabel()} color is now: ${value}`);
                        // Handle color change.
                        const objEntity: any = document.querySelector(`#${objNode.getID()}`);
                        objEntity.setAttribute('material', 'color', value);
                        });
                        break;
                    }
                    if (objects.Models[i].type === 'gltf') {
                        newEntity.setAttribute('gltf-model', objects.Models[i].url);

                        // Create a object node in frp-backend, attribute updates are front-end driven. Also extract all properties from object file
                        const props: any = [{ name: 'object', default: `node-${Node.getNodeCount()}` }, { name: 'position', default: position }];
                        objects.Models[i].outputs.forEach((o) => {
                            if (o.name != 'object' && o.name != 'position') {
                            o['default'] = ''; 
                            props.push(o);
                            }
                        });

                        // Using JSON does not seem efficient
                        const objNode = scene.addObj(targetObjName, props);
                        newEntity.setAttribute('id', objNode.getID()); // Set up node ID
                        newEntity.setAttribute('obj-node-update', 'name', targetObjName); // Set up node update for frp
                        newEntity.setAttribute('obj-init', 'name', targetObjName);

                    break;
                    }
                }
            }

            // Generate Text.
            if (targetObjName == 'text') {
                // newEntity(plane) -> textEntity
                newEntity.setAttribute('geometry', {
                    primitive: 'plane',
                    height: 'auto',
                    width: 'auto'
                });
                newEntity.setAttribute('material', {
                    transparent: true,
                    opacity: 0.2,
                    side: 'double'
                });
                newEntity.setAttribute('obj-attributes-list', 'targetModelName', targetObjName);
                newEntity.classList.add('data-receiver');

                newEntity.setAttribute('text', {
                    align: 'center',
                    width: 0.6,
                    wrapCount: 12,
                    value: 'Hello World!'
                });

                // Create a node in frp-backend
                const objNode = scene.addObj(targetObjName, [{name: 'object', default: `node-${Node.getNodeCount()}`}, {name: 'position', default: position}, {name: 'color', default: color}]);
                
                newEntity.setAttribute('id', objNode.getID());
                objNode.pluckOutput('color').subscribe((value) => {
                    console.log(`${objNode.getLabel()} color is now: ${value}`);
                    // Handle color change.
                    const objEntity: any = document.querySelector(`#${objNode.getID()}`);
                    objEntity.setAttribute('material', 'color', value);
                });

                newEntity.addEventListener('clicked', (event) => {
                    event.stopPropagation();
                    const kb: any = document.querySelector('#' + objNode.getID() + '_keyboard');
                    if (kb) {
                        kb.object3D.visible = !kb.object3D.visible;
                    }
                    else {
                        const kbEl: any = document.createElement('a-entity');
                        kbEl.setAttribute('id', objNode.getID() + '_keyboard');
                        newEntity.appendChild(kbEl);
                        const val: string = newEntity.getAttribute('text').value;
                        kbEl.setAttribute('super-keyboard', {
                            hand: '#rightHand',
                            imagePath: 'assets/images/',
                            value: val
                        });
                        kbEl.object3D.position.set(0, -0.35, 0);

                        // Avoid creating multiple keyboards.
                        kbEl.addEventListener('clicked', (event) => {
                            event.stopPropagation();
                        });
                        kbEl.addEventListener('superkeyboardchange', (event) => {
                            event.stopPropagation();
                            const changedVal: string = kbEl.getAttribute('super-keyboard').value;
                            newEntity.setAttribute('text', 'value', changedVal);
                        });
                    }
                    
                })
            }
        }

        // When deleting an object from the scene...
        else if (presentObjects.length < this.data.objects.length) {
            const deletedObj = this.data.objects[this.data.objects.length - 1];
            const targetModelName: string = deletedObj.targetModel;
            const createdId = deletedObj.id;
            let id = targetModelName + createdId;
            const deletedObjEntity = document.querySelector(id);
            deletedObjEntity.parentNode.removeChild(deletedObjEntity);
        }

        this.data.objects = store.getState().objects.present;
    }
});

export default stateBinding;