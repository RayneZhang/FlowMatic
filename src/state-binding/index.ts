// This file provides bindings between states and components.
// This component subscribes to the store to update the scene on every change.

import * as AFRAME from 'aframe'
import store from '../store'
declare const THREE:any;

const stateBinding = AFRAME.registerComponent('state-binding', {
    schema: {
        objects: {type: 'array', default: []}
    },

    init: function(): void {
        // Log the initial state
        console.log('Initial State:');
        console.log(store.getState());
        this.data.objects = store.getState().objects.present;
        this.id = 0;
        // Note that subscribe() returns a function for unregistering the listener.
        const unsubscribe = store.subscribe(() => {
            this.updateObjects();
        });
    }, 

    // No mutating the parameters.
    updateObjects: function(): void {
        console.log(store.getState()); // For debugging
        const presentObjects = store.getState().objects.present;

        // When add an object into the scene...
        if (presentObjects.length > this.data.objects.length) {
            const addedObj = presentObjects[presentObjects.length - 1];
            const id = addedObj.id;
            const objectNum = addedObj.targetModel;
            const position = addedObj.position;
            const color = addedObj.color;

             // Create an entity and append it to the scene.
             let newEntity: any = document.createElement('a-entity');
             this.el.appendChild(newEntity);
             
             switch (objectNum) {
                 case 'container0': {
                     newEntity.setAttribute('id', 'bottle' + this.id);
                     newEntity.setAttribute('obj-model', 'obj', '#blue-obj');
                     newEntity.setAttribute('obj-model', 'mtl', '#blue-mtl');
                     
                     newEntity.setAttribute('data-source', 'targetEntities', []);
                     newEntity.setAttribute('bottle-description', 'freeze', false);
                     this.id++;
                     break;
                 }
                 case 'container1': default: {
                     // Add geometry component to the entity.
                     newEntity.setAttribute('geometry', {
                         primitive: 'box',
                         height: 0.1,
                         width: 0.1,
                         depth: 0.1
                     }); 
 
                     // Set the color of the primitive.
                     newEntity.setAttribute('material', 'color', color);
                     newEntity.setAttribute('id', 'box' + this.id);
                     newEntity.setAttribute('data-receiver', 'targetEntities', []);
                     newEntity.setAttribute('data-receiver', 'sourceValue', color);
                     newEntity.setAttribute('obj-attributes-list', 'freeze', false);
                     this.id++;
                     break;
                 }
                 case 'container2': {
                     // Add geometry component to the entity.
                     newEntity.setAttribute('geometry', {
                         primitive: 'cone',
                         height: 0.2,
                         radiusBottom: 0.1,
                         radiusTop: 0.05
                     }); 
 
                     // Set the color of the primitive.
                     newEntity.setAttribute('material', 'color', color);
                     newEntity.object3D.rotation.set(0, 0, THREE.Math.degToRad(270));
 
                     // Attach components to the filter.
                     newEntity.setAttribute('id', 'color-filter' + this.id);
                     newEntity.setAttribute('data-filter', 'filterName', "darkness");
                     newEntity.setAttribute('data-filter', 'sourceValue', color);
                     newEntity.setAttribute('filter-description', 'freeze', false);
                     this.id++;
                     break;
                 }
                 case 'container3': {
                     // Add geometry component to the entity.
                     newEntity.setAttribute('geometry', {
                         primitive: 'sphere',
                         radius: 0.1
                     }); 
 
                     // Set the color of the primitive.
                     newEntity.setAttribute('material', 'color', color);
                     newEntity.setAttribute('id', 'sphere' + this.id);
                     newEntity.setAttribute('data-receiver', 'targetEntities', []);
                     newEntity.setAttribute('data-receiver', 'sourceValue', color);
                     newEntity.setAttribute('obj-attributes-list', 'freeze', false);
                     this.id++;
                     break;
                 }
                 case 'container4': {
                     // Add geometry component to the entity.
                     newEntity.setAttribute('geometry', {
                         primitive: 'cone',
                         height: 0.2,
                         radiusBottom: 0.1,
                         radiusTop: 0.05
                     }); 
 
                     // Set the color of the primitive.
                     newEntity.setAttribute('material', 'color', color);
                     newEntity.object3D.rotation.set(0, 0, THREE.Math.degToRad(270));
 
                     // Attach components to the filter.
                     newEntity.setAttribute('id', 'position-filter' + this.id);
                     newEntity.setAttribute('data-filter', 'filterName', "acceleration");
                     newEntity.setAttribute('data-filter', 'sourceValue', color);
                     newEntity.setAttribute('filter-description', 'freeze', false);
                     this.id++;
                     break;
                 }
                 case 'container5': {
                     // Add geometry component to the entity.
                     newEntity.setAttribute('geometry', {
                         primitive: 'cone',
                         height: 0.2,
                         radiusBottom: 0.1,
                         radiusTop: 0.05
                     }); 
 
                     // Set the color of the primitive.
                     newEntity.setAttribute('material', 'color', color);
                     newEntity.object3D.rotation.set(0, 0, THREE.Math.degToRad(270));
 
                     // Attach components to the filter.
                     newEntity.setAttribute('id', 'position-filter' + this.id);
                     newEntity.setAttribute('data-filter', 'filterName', "velocity");
                     newEntity.setAttribute('data-filter', 'sourceValue', color);
                     newEntity.setAttribute('filter-description', 'freeze', false);
                     this.id++;
                     break;
                 }
             }

             // Add class component to the entity.
             newEntity.setAttribute('class', 'movable');
             newEntity.object3D.position.set(position.x, position.y, position.z);
        }

        // When deleting an object from the scene...
        else if (presentObjects.length < this.data.objects.length) {
            const deletedObj = this.data.objects[this.data.objects.length - 1];
            const objectNum = deletedObj.targetModel;
            const createdId = deletedObj.id;
            let id = '';

            switch (objectNum) {
                case 'container0': {
                    id = '#bottle' + createdId;
                    break;
                }
                case 'container1': default: {
                    id = '#box' + createdId;
                    break;
                }
                case 'container2': {
                    id = '#color-filter' + createdId;
                    break;
                }
                case 'container3': {   
                    id = '#sphere' + createdId;
                    break;
                }
                case 'container4': {
                    id = '#position-filter' + createdId;
                    break;
                }
                case 'container5': {
                    id = '#position-filter' + createdId;
                    break;
                }
            }

            const deletedObjEntity = document.querySelector(id);
            deletedObjEntity.parentNode.removeChild(deletedObjEntity);
        }

        this.data.objects = store.getState().objects.present;
    }
});

export default stateBinding;