// This file provides bindings between states and components.
// This component subscribes to the store to update the scene on every change.

import * as AFRAME from 'aframe'
import store from '../store'
import * as OBJLABELS from '../Objects'
import { objects } from '../Objects'
import { scene } from '../index'
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
            const position: any = addedObj.position;
            const color: any = addedObj.color;

            // Create a node in frp-backend
            const objNode = scene.addObj(targetObjName, [{name: 'color', default: color}, {name: 'position', default: position}]);

             // Create an entity and append it to AFRAME scene.
             let newEntity: any = document.createElement('a-entity');
             newEntity.setAttribute('id', objNode.getID());
             this.el.appendChild(newEntity);
             newEntity.object3D.position.set(position.x, position.y, position.z);
             newEntity.classList.add("movable");
             for (let i = 0; i < objects.Models.length; i++) {
               if (objects.Models[i].name === targetObjName) {
                  if (objects.Models[i].type === 'primitive') {
                     newEntity.setAttribute('geometry', 'primitive', targetObjName);
                     newEntity.object3D.scale.set(0.1, 0.1, 0.1);
                     break;
                  }
               }
            }
            
             objNode.pluckOutput('color').subscribe((value) => {
                console.log(`${objNode.getLabel()} color is now: ${value}`);
                // Handle color change.
                const objEntity: any = document.querySelector(`#${objNode.getID()}`);
                objEntity.setAttribute('material', 'color', value);
            });

            

             switch (targetObjName) {
                 case OBJLABELS.RANDOM_COLOR: {
                     newEntity.setAttribute('obj-model', 'obj', '#blue-obj');
                     newEntity.setAttribute('obj-model', 'mtl', '#blue-mtl');
                     
                     newEntity.setAttribute('data-source', 'targetEntities', []);
                     newEntity.setAttribute('bottle-description', 'freeze', true);
                     this.id++;
                     break;
                 }
                 case OBJLABELS.BOX: default: {
                     newEntity.setAttribute('data-receiver', 'targetEntities', []);
                     newEntity.setAttribute('data-receiver', 'dataValue', color);
                     newEntity.setAttribute('obj-attributes-list', 'attrNames', ['color', 'position']);

                     newEntity.setAttribute('collision-listener', 'null');
                     newEntity.setAttribute('static-body', {
                        'shape': 'auto'
                     });
                     this.id++;
                     break;
                 }
                 case OBJLABELS.SPHERE: {
                     newEntity.setAttribute('data-receiver', 'targetEntities', []);
                     newEntity.setAttribute('data-receiver', 'dataValue', color);
                     newEntity.setAttribute('obj-attributes-list', 'attrNames', ['color', 'position']);
                     this.id++;
                     break;
                 }
                 case OBJLABELS.VELOCITY: {
                     // Attach components to the filter.
                     newEntity.setAttribute('data-filter', 'filterName', "velocity");
                     newEntity.setAttribute('data-filter', 'dataValue', color);
                     newEntity.setAttribute('operator-model', 'functionInputs', ['Position\n(Vector3)', 'Direction\n(Vector3)', 'Velocity\n(Number)']);
                     newEntity.setAttribute('operator-model', 'functionName', targetObjName);

                     this.id++;
                     break;
                 }
                 case OBJLABELS.VECTOR: {
                    newEntity.setAttribute('vector', 'seqId', this.id);
                    newEntity.setAttribute('vector-source', 'targetEntities', []);
                    this.id++;
                    break;
                 }
                 case OBJLABELS.SWITCH: {
                    const switchEntity: any = document.createElement('a-entity');
                    newEntity.appendChild(switchEntity);

                    // Set up geometry and materials.
                    newEntity.setAttribute('obj-model', 'obj', '#switch-base-obj');
                    switchEntity.setAttribute('obj-model', 'obj', '#switch-obj');

                    // Set up attributes.
                    newEntity.setAttribute('obj-attributes-list', 'attrNames', ['On/Off']);
                    switchEntity.setAttribute('swtch', 'switchOn', false);
                    newEntity.setAttribute('switch-source', 'targetEntities', []);
                    this.id++;
                    break;
                 }
                 case OBJLABELS.SLIDER: {
                    const sliderEntity: any = document.createElement('a-entity');
                    sliderEntity.setAttribute('id', targetObjName + this.id + '_subSlider');
                    newEntity.appendChild(sliderEntity);

                    // Set up geometry and materials.
                    newEntity.setAttribute('obj-model', 'obj', '#rail-obj');
                    sliderEntity.setAttribute('obj-model', 'obj', '#slider-obj');

                    // Set up attributes.
                    sliderEntity.setAttribute('slider', 'value', 5);
                    newEntity.setAttribute('slider-source', 'targetSlider', sliderEntity);

                    this.id++;
                    break;
                 }
                 case OBJLABELS.PLUS: {
                    newEntity.setAttribute('plus', 'targetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['+', '-']);
                    newEntity.setAttribute('operator-model', 'functionName', targetObjName);

                    this.id++;
                    break;
                 }
                 case OBJLABELS.SUB: {
                    // Attach components to the filter.
                    newEntity.setAttribute('subtract', 'targetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['+', '-']);
                    newEntity.setAttribute('operator-model', 'functionName', targetObjName);

                    this.id++;
                    break;
                 }
                 case OBJLABELS.CONDITIONAL_EVENT: {
                    // Attach components to the filter.
                    newEntity.setAttribute('conditional-event', 'trueTargetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['Boolean']);
                    newEntity.setAttribute('operator-model', 'functionOutputs', ['True (Event A)', 'False (Event B)']);
                    newEntity.setAttribute('operator-model', 'functionName', "Conditional Event");

                    this.id++;
                    break;
                 }
                 case OBJLABELS.COLLISION_DETECTOR: {
                    // Attach components to the filter.
                    newEntity.setAttribute('collision-detector', 'targetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['Entity A', 'Entity B']);
                    newEntity.setAttribute('operator-model', 'functionOutputs', ['Boolean']);
                    newEntity.setAttribute('operator-model', 'functionName', "Collision Detector");

                    this.id++;
                    break;
                 }
                 case OBJLABELS.VEC2NUM: {
                    // Attach components to the filter.
                    newEntity.setAttribute('vec2num', 'targetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['Vector']);
                    newEntity.setAttribute('operator-model', 'functionOutputs', ['X', 'Y', 'Z']);
                    newEntity.setAttribute('operator-model', 'functionName', "Vector2Number");

                    this.id++;
                    break;
                 }
                 case OBJLABELS.NUM2VEC: {
                    // Attach components to the filter.
                    newEntity.setAttribute('num2vec', 'targetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['X', 'Y', 'Z']);
                    newEntity.setAttribute('operator-model', 'functionOutputs', ['Vector']);
                    newEntity.setAttribute('operator-model', 'functionName', "Number2Vector");

                    this.id++;
                    break;
                 }
                 case OBJLABELS.COND_BOOL: {
                    // Attach components to the filter.
                    newEntity.setAttribute('condition-bool', 'targetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['Condition', 'when Condition\n is True', 'when Condition\n is False']);
                    newEntity.setAttribute('operator-model', 'functionName', targetObjName);

                    this.id++;
                    break;
                 }
                 case OBJLABELS.COND_LARGER: {
                    // Attach components to the filter.
                    newEntity.setAttribute('condition-larger', 'targetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['A', 'B', 'when\n A >= B', 'when\n A < B']);
                    newEntity.setAttribute('operator-model', 'functionName', targetObjName);

                    this.id++;
                    break;
                 }
                 case OBJLABELS.LIGHT: {
                    // Set up geometry and materials.
                    newEntity.setAttribute('obj-model', 'obj', '#light-01-obj');
                    newEntity.setAttribute('material', 'src', '#light-01-abledo');
                    newEntity.setAttribute('material', 'normalMap', '#light-01-normal');
                    
                    // Set up attributes.
                    newEntity.setAttribute('obj-attributes-list', 'attrNames', ['Light Direction', 'Light Color', 'position', 'Light On/Off']);
                    newEntity.setAttribute('spotlight', 'color', 'white');

                    // Set up dataflow.
                    this.id++;
                    break;
                 }
                 case OBJLABELS.HEADSET: {
                     // Set up geometry and materials.
                    newEntity.setAttribute('obj-model', 'obj', '#headset-obj');
                    newEntity.setAttribute('material', 'src', '#headset-mtl');

                    // Set up attributes.
                    newEntity.setAttribute('obj-attributes-list', 'attrNames', ['position', 'Rotation']);
                    newEntity.setAttribute('headset', {});

                    this.id++;
                    break;
                 }
                 case OBJLABELS.L_CONTROLLER: {
                    // Set up geometry and materials.
                   newEntity.setAttribute('gltf-model', '#controller-left');

                   // Set up attributes.
                   newEntity.setAttribute('obj-attributes-list', 'attrNames', ['position']);
                   newEntity.setAttribute('left-controller', {});

                   this.id++;
                   break;
                }
                case OBJLABELS.R_CONTROLLER: {
                    // Set up geometry and materials.
                   newEntity.setAttribute('gltf-model', '#controller-right');

                   // Set up attributes.
                   newEntity.setAttribute('obj-attributes-list', 'attrNames', ['position']);
                   newEntity.setAttribute('right-controller', {});

                   this.id++;
                   break;
                }
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