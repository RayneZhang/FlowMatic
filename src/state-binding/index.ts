// This file provides bindings between states and components.
// This component subscribes to the store to update the scene on every change.

import * as AFRAME from 'aframe'
import store from '../store'
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
            const targetModelName: string = addedObj.targetModel;
            const position: any = addedObj.position;
            const color: any = addedObj.color;

            // Create a node in frp-backend
            const objNode = scene.addObj(targetModelName, [{name: 'color', default: color}, {name: 'position', default: position}]);
            objNode.pluckOutput('color').subscribe(function (value) {
                console.log(`${targetModelName} color is: ${color}`);
            });

             // Create an entity and append it to AFRAME scene.
             let newEntity: any = document.createElement('a-entity');
             this.el.appendChild(newEntity);
             newEntity.classList.add("movable");
             newEntity.object3D.position.set(position.x, position.y, position.z);
             switch (targetModelName) {
                 case 'Random Color': {
                     newEntity.setAttribute('id', 'bottle' + this.id);
                     newEntity.setAttribute('obj-model', 'obj', '#blue-obj');
                     newEntity.setAttribute('obj-model', 'mtl', '#blue-mtl');
                     
                     newEntity.setAttribute('data-source', 'targetEntities', []);
                     newEntity.setAttribute('bottle-description', 'freeze', true);
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
                     newEntity.setAttribute('id', 'box' + this.id);
                     newEntity.setAttribute('data-receiver', 'targetEntities', []);
                     newEntity.setAttribute('data-receiver', 'dataValue', color);
                     newEntity.setAttribute('obj-attributes-list', 'attrNames', ['Color', 'Position']);

                     newEntity.setAttribute('collision-listener', 'null');
                     newEntity.setAttribute('static-body', {
                        'shape': 'auto'
                     });
                     // Sleepy is only necessary for dynamic-body
                    //  newEntity.setAttribute('sleepy', {
                    //     'allowSleep': true
                    //  });
                     this.id++;
                     break;
                 }
                 case 'Darkness': {
                     // Attach components to the filter.
                     newEntity.setAttribute('id', 'color-filter' + this.id);
                     newEntity.setAttribute('data-filter', 'filterName', "darkness");
                     newEntity.setAttribute('data-filter', 'dataValue', color);
                     newEntity.setAttribute('operator-model', 'functionInputs', ['Color\n(Hex)', 'Darkness\n(Number)']);
                     newEntity.setAttribute('operator-model', 'functionName', targetModelName);

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
                     newEntity.setAttribute('id', 'sphere' + this.id);
                     newEntity.setAttribute('data-receiver', 'targetEntities', []);
                     newEntity.setAttribute('data-receiver', 'dataValue', color);
                     newEntity.setAttribute('obj-attributes-list', 'attrNames', ['Color', 'Position']);
                     this.id++;
                     break;
                 }
                 case 'Acceleration': { 
                     // Attach components to the filter.
                     newEntity.setAttribute('id', 'position-filter' + this.id);
                     newEntity.setAttribute('data-filter', 'filterName', "acceleration");
                     newEntity.setAttribute('data-filter', 'dataValue', color);
                     newEntity.setAttribute('operator-model', 'functionInputs', ['Position\n(Vector3)', 'Direction\n(Vector3)', 'Acceleration\n(Number)']);
                     newEntity.setAttribute('operator-model', 'functionName', targetModelName);

                     this.id++;
                     break;
                 }
                 case 'Velocity': {
                     // Attach components to the filter.
                     newEntity.setAttribute('id', 'position-filter' + this.id);
                     newEntity.setAttribute('data-filter', 'filterName', "velocity");
                     newEntity.setAttribute('data-filter', 'dataValue', color);
                     newEntity.setAttribute('operator-model', 'functionInputs', ['Position\n(Vector3)', 'Direction\n(Vector3)', 'Velocity\n(Number)']);
                     newEntity.setAttribute('operator-model', 'functionName', targetModelName);

                     this.id++;
                     break;
                 }
                 case 'Vector': {
                    // Set entity id.
                    newEntity.setAttribute('id', 'vector' + this.id);
                    newEntity.setAttribute('vector', 'seqId', this.id);
                    newEntity.setAttribute('vector-source', 'targetEntities', []);
                    this.id++;
                    break;
                 }
                 case 'Switch': {
                    // Set entity id.
                    newEntity.setAttribute('id', targetModelName + this.id);
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
                 case 'Slider': {
                    // Set entity id.
                    newEntity.setAttribute('id', targetModelName + this.id);
                    const sliderEntity: any = document.createElement('a-entity');
                    sliderEntity.setAttribute('id', targetModelName + this.id + '_subSlider');
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
                 case 'Plus': {
                    // Attach components to the filter.
                    newEntity.setAttribute('id', 'plus-operator' + this.id);
                    newEntity.setAttribute('plus', 'targetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['+', '-']);
                    newEntity.setAttribute('operator-model', 'functionName', targetModelName);

                    this.id++;
                    break;
                 }
                 case 'Subtract': {
                    // Attach components to the filter.
                    newEntity.setAttribute('id', 'subtract-operator' + this.id);
                    newEntity.setAttribute('subtract', 'targetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['+', '-']);
                    newEntity.setAttribute('operator-model', 'functionName', targetModelName);

                    this.id++;
                    break;
                 }
                 case 'Conditional Event': {
                    // Attach components to the filter.
                    newEntity.setAttribute('id', targetModelName + this.id);
                    newEntity.setAttribute('conditional-event', 'trueTargetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['Boolean']);
                    newEntity.setAttribute('operator-model', 'functionOutputs', ['True (Event A)', 'False (Event B)']);
                    newEntity.setAttribute('operator-model', 'functionName', "Conditional Event");

                    this.id++;
                    break;
                 }
                 case 'Collision Detector': {
                    // Attach components to the filter.
                    newEntity.setAttribute('id', targetModelName + this.id);
                    newEntity.setAttribute('collision-detector', 'targetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['Entity A', 'Entity B']);
                    newEntity.setAttribute('operator-model', 'functionOutputs', ['Boolean']);
                    newEntity.setAttribute('operator-model', 'functionName', "Collision Detector");

                    this.id++;
                    break;
                 }
                 case 'Vector2Number': {
                    // Attach components to the filter.
                    newEntity.setAttribute('id', targetModelName + this.id);
                    newEntity.setAttribute('vec2num', 'targetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['Vector']);
                    newEntity.setAttribute('operator-model', 'functionOutputs', ['X', 'Y', 'Z']);
                    newEntity.setAttribute('operator-model', 'functionName', "Vector2Number");

                    this.id++;
                    break;
                 }
                 case 'Number2Vector': {
                    // Attach components to the filter.
                    newEntity.setAttribute('id', targetModelName + this.id);
                    newEntity.setAttribute('num2vec', 'targetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['X', 'Y', 'Z']);
                    newEntity.setAttribute('operator-model', 'functionOutputs', ['Vector']);
                    newEntity.setAttribute('operator-model', 'functionName', "Number2Vector");

                    this.id++;
                    break;
                 }
                 case 'Condition: Bool': {
                    // Attach components to the filter.
                    newEntity.setAttribute('id', 'condition-bool-operator' + this.id);
                    newEntity.setAttribute('condition-bool', 'targetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['Condition', 'when Condition\n is True', 'when Condition\n is False']);
                    newEntity.setAttribute('operator-model', 'functionName', targetModelName);

                    this.id++;
                    break;
                 }
                 case 'Condition: A >= B': {
                    // Attach components to the filter.
                    newEntity.setAttribute('id', 'condition-larger-operator' + this.id);
                    newEntity.setAttribute('condition-larger', 'targetEntities', []);
                    newEntity.setAttribute('operator-model', 'functionInputs', ['A', 'B', 'when\n A >= B', 'when\n A < B']);
                    newEntity.setAttribute('operator-model', 'functionName', targetModelName);

                    this.id++;
                    break;
                 }
                 case 'Light': {
                    // Set up geometry and materials.
                    newEntity.setAttribute('obj-model', 'obj', '#light-01-obj');
                    newEntity.setAttribute('material', 'src', '#light-01-abledo');
                    newEntity.setAttribute('material', 'normalMap', '#light-01-normal');
                    
                    // Set up attributes.
                    newEntity.setAttribute('id', targetModelName + this.id);
                    newEntity.setAttribute('obj-attributes-list', 'attrNames', ['Light Direction', 'Light Color', 'Position', 'Light On/Off']);
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
                    newEntity.setAttribute('id', targetModelName + this.id);
                    newEntity.setAttribute('obj-attributes-list', 'attrNames', ['Position', 'Rotation']);
                    newEntity.setAttribute('headset', {});

                    this.id++;
                    break;
                 }
                 case 'Left Controller': {
                    // Set up geometry and materials.
                   newEntity.setAttribute('gltf-model', '#controller-left');

                   // Set up attributes.
                   newEntity.setAttribute('id', 'leftController' + this.id);
                   newEntity.setAttribute('obj-attributes-list', 'attrNames', ['Position']);
                   newEntity.setAttribute('left-controller', {});

                   this.id++;
                   break;
                }
                case 'Right Controller': {
                    // Set up geometry and materials.
                   newEntity.setAttribute('gltf-model', '#controller-right');

                   // Set up attributes.
                   newEntity.setAttribute('id', 'rightController' + this.id);
                   newEntity.setAttribute('obj-attributes-list', 'attrNames', ['Position']);
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
                case 'Switch': {
                    id = '#' + targetModelName + createdId;
                    break;
                }
                case 'Slider': {
                    id = '#' + targetModelName + createdId;
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
                case 'Left Controller': {
                    id = '#' + 'leftController' + createdId;
                    break;
                }
                case 'Right Controller': {
                    id = '#' + 'rightController' + createdId;
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