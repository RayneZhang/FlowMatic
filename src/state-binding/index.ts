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
            const targetModelName: string = addedObj.targetModel;
            const position = addedObj.position;
            const color = addedObj.color;

             // Create an entity and append it to the scene.
             let newEntity: any = document.createElement('a-entity');
             this.el.appendChild(newEntity);
             switch (targetModelName) {
                 case 'Random Color': {
                     newEntity.setAttribute('id', 'bottle' + id);
                     newEntity.setAttribute('obj-model', 'obj', '#blue-obj');
                     newEntity.setAttribute('obj-model', 'mtl', '#blue-mtl');
                     
                     newEntity.setAttribute('data-source', 'targetEntities', []);
                     newEntity.setAttribute('bottle-description', 'freeze', false);
                     this.id++;
                     break;
                 }
                 case 'Box': default: {
                     // Add geometry component to the entity.
                     newEntity.setAttribute('geometry', {
                         primitive: 'box',
                         height: 0.1,
                         width: 0.1,
                         depth: 0.1
                     }); 
 
                     // Set the color of the primitive.
                     newEntity.setAttribute('material', 'color', color);
                     newEntity.setAttribute('id', 'box' + id);
                     newEntity.setAttribute('data-receiver', 'targetEntities', []);
                     newEntity.setAttribute('data-receiver', 'dataValue', color);
                     newEntity.setAttribute('obj-attributes-list', 'attrNames', ['Color', 'Position']);
                     this.id++;
                     break;
                 }
                 case 'Darkness': {
                     // Attach components to the filter.
                     newEntity.setAttribute('id', 'color-filter' + id);
                     newEntity.setAttribute('data-filter', 'filterName', "darkness");
                     newEntity.setAttribute('data-filter', 'dataValue', color);
                     newEntity.setAttribute('filter-description', 'filterName', 'darkness');
                     this.id++;
                     break;
                 }
                 case 'Sphere': {
                     // Add geometry component to the entity.
                     newEntity.setAttribute('geometry', {
                         primitive: 'sphere',
                         radius: 0.1
                     }); 
 
                     // Set the color of the primitive.
                     newEntity.setAttribute('material', 'color', color);
                     newEntity.setAttribute('id', 'sphere' + id);
                     newEntity.setAttribute('data-receiver', 'targetEntities', []);
                     newEntity.setAttribute('data-receiver', 'dataValue', color);
                     newEntity.setAttribute('obj-attributes-list', 'attrNames', ['Color', 'Position']);
                     this.id++;
                     break;
                 }
                 case 'Acceleration': { 
                     // Attach components to the filter.
                     newEntity.setAttribute('id', 'position-filter' + id);
                     newEntity.setAttribute('data-filter', 'filterName', "acceleration");
                     newEntity.setAttribute('data-filter', 'dataValue', color);
                     newEntity.setAttribute('filter-description', 'filterName', 'acceleration');
                     this.id++;
                     break;
                 }
                 case 'Velocity': {
                     // Attach components to the filter.
                     newEntity.setAttribute('id', 'position-filter' + id);
                     newEntity.setAttribute('data-filter', 'filterName', "velocity");
                     newEntity.setAttribute('data-filter', 'dataValue', color);
                     newEntity.setAttribute('filter-description', 'filterName', 'velocity');
                     this.id++;
                     break;
                 }
                 case 'Vector': {
                    // Set entity id.
                    newEntity.setAttribute('id', 'vector' + id);
                    newEntity.setAttribute('vector', 'seqId', id);
                    newEntity.setAttribute('vector-source', 'targetEntities', []);
                    this.id++;
                    break;
                 }
                 case 'Plus': {
                    // Attach components to the filter.
                    newEntity.setAttribute('id', 'plus-operator' + id);
                    newEntity.setAttribute('plus', 'targetEntities', []);
                    newEntity.setAttribute('filter-description', 'filterName', 'plus');
                    this.id++;
                    break;
                 }
                 case 'Subtract': {
                    // Attach components to the filter.
                    newEntity.setAttribute('id', 'subtract-operator' + id);
                    newEntity.setAttribute('subtract', 'targetEntities', []);
                    newEntity.setAttribute('filter-description', 'filterName', 'subtract');
                    this.id++;
                    break;
                 }
                 case 'Light': {
                    // Set up geometry and materials.
                    newEntity.setAttribute('obj-model', 'obj', '#light-01-obj');
                    newEntity.setAttribute('material', 'src', '#light-01-abledo');
                    newEntity.setAttribute('material', 'normalMap', '#light-01-normal');
                    
                    // Set up attributes.
                    newEntity.setAttribute('id', targetModelName + id);
                    newEntity.setAttribute('obj-attributes-list', 'attrNames', ['Light Direction', 'Light Color', 'Position']);
                    newEntity.setAttribute('spotlight', 'color', 'white');

                    // Set up dataflow.
                    this.id++;
                    break;
                 }
                 case 'Headset': {
                     // Set up geometry and materials.
                    newEntity.setAttribute('obj-model', 'obj', '#headset-obj');
                    newEntity.setAttribute('material', 'src', '#headset-mtl');

                    // Set up attributes.
                    newEntity.setAttribute('id', targetModelName + id);
                    newEntity.setAttribute('obj-attributes-list', 'attrNames', ['Position', 'Rotation']);
                    newEntity.setAttribute('headset', {});

                    this.id++;
                    break;
                 }
                 case 'Left Controller': {
                    // Set up geometry and materials.
                   newEntity.setAttribute('gltf-model', '#controller-left');

                   // Set up attributes.
                   newEntity.setAttribute('id', targetModelName + id);
                   newEntity.setAttribute('obj-attributes-list', 'attrNames', ['Position', 'Rotation']);

                   this.id++;
                   break;
                }
                case 'Right Controller': {
                    // Set up geometry and materials.
                   newEntity.setAttribute('gltf-model', '#controller-right');

                   // Set up attributes.
                   newEntity.setAttribute('id', targetModelName + id);
                   newEntity.setAttribute('obj-attributes-list', 'attrNames', ['Position', 'Rotation']);

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
            const targetModelName: string = deletedObj.targetModel;
            const createdId = deletedObj.id;
            let id = '';

            switch (targetModelName) {
                case 'Random Color': {
                    id = '#bottle' + createdId;
                    break;
                }
                case 'Box': default: {
                    id = '#box' + createdId;
                    break;
                }
                case 'Darkness': {
                    id = '#color-filter' + createdId;
                    break;
                }
                case 'Sphere': {   
                    id = '#sphere' + createdId;
                    break;
                }
                case 'Acceleration': {
                    id = '#position-filter' + createdId;
                    break;
                }
                case 'Velocity': {
                    id = '#position-filter' + createdId;
                    break;
                }
                case 'Vector': {
                    id = '#vector' + createdId;
                    break;
                }
                case 'Plus': {
                    id = '#plus-operator' + createdId;
                    break;
                }
                case 'Subtract': {
                    id = '#subtract-operator' + createdId;
                    break;
                }
                case 'Light': {
                    id = '#' + targetModelName + createdId;
                    break;
                }
                case 'Headset': {
                    id = '#' + targetModelName + createdId;
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