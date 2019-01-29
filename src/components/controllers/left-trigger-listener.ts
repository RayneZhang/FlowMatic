declare const THREE:any;

const leftTriggerListener = {
    schema: {
        triggering: {type: 'boolean', default: false},
        targetModel: {type: 'string', defualt: ''},
        createdEl: {type: 'selector', default: null},
        color: {type: 'string', default: ''}
    },

    init: function(): void {
        this.id = 0;
        const el = this.el;
        const sceneEl = document.querySelector('a-scene');
        const listeningEl = document.querySelector('#leftHand');

        listeningEl.addEventListener('triggerdown', (event) => {  
            // Create an entity and append it to the scene.
            let newEntity: any = document.createElement('a-entity');
            sceneEl.appendChild(newEntity);

            switch (this.data.targetModel) {
                case 'button0': {
                    newEntity.setAttribute('id', 'bottle' + this.id);
                    newEntity.setAttribute('obj-model', 'obj', '#blue-obj');
                    newEntity.setAttribute('obj-model', 'mtl', '#blue-mtl');
                    
                    newEntity.setAttribute('data-source', 'targetEntities', []);
                    newEntity.setAttribute('bottle-description', 'freeze', false);
                    this.id++;
                    break;
                }
                case 'button1': default: {
                    // Add geometry component to the entity.
                    newEntity.setAttribute('geometry', {
                        primitive: 'box',
                        height: 0.1,
                        width: 0.1,
                        depth: 0.1
                    }); 

                    // Set the color of the primitive.
                    newEntity.setAttribute('material', 'color', this.data.color);
                    newEntity.setAttribute('id', 'box' + this.id);
                    newEntity.setAttribute('data-receiver', 'targetEntities', []);
                    newEntity.setAttribute('obj-attributes-list', 'freeze', false);
                    this.id++;
                    break;
                }
                case 'button2': {
                    // Add geometry component to the entity.
                    newEntity.setAttribute('geometry', {
                        primitive: 'cone',
                        height: 0.2,
                        radiusBottom: 0.1,
                        radiusTop: 0.05
                    }); 

                    // Set the color of the primitive.
                    newEntity.setAttribute('material', 'color', this.data.color);
                    newEntity.object3D.rotation.set(0, 0, THREE.Math.degToRad(270));

                    // Attach components to the filter.
                    newEntity.setAttribute('id', 'color-filter' + this.id);
                    newEntity.setAttribute('data-filter', 'filterName', "darkness");
                    newEntity.setAttribute('filter-description', 'freeze', false);
                    this.id++;
                    break;
                }
                case 'button3': {
                    // Add geometry component to the entity.
                    newEntity.setAttribute('geometry', {
                        primitive: 'sphere',
                        radius: 0.1
                    }); 

                    // Set the color of the primitive.
                    newEntity.setAttribute('material', 'color', this.data.color);
                    newEntity.setAttribute('id', 'sphere' + this.id);
                    newEntity.setAttribute('data-receiver', 'targetEntities', []);
                    newEntity.setAttribute('obj-attributes-list', 'freeze', false);
                    this.id++;
                    break;
                }
                case 'button4': {
                    // Add geometry component to the entity.
                    newEntity.setAttribute('geometry', {
                        primitive: 'cone',
                        height: 0.2,
                        radiusBottom: 0.1,
                        radiusTop: 0.05
                    }); 

                    // Set the color of the primitive.
                    newEntity.setAttribute('material', 'color', this.data.color);
                    newEntity.object3D.rotation.set(0, 0, THREE.Math.degToRad(270));

                    // Attach components to the filter.
                    newEntity.setAttribute('id', 'position-filter' + this.id);
                    newEntity.setAttribute('data-filter', 'filterName', "a");
                    newEntity.setAttribute('filter-description', 'freeze', false);
                    this.id++;
                    break;
                }
            }
            // Add class component to the entity.
            newEntity.setAttribute('class', 'movable');

            // Add position component to the entity.
            const controllerPos: any = el.object3D.position;
            newEntity.object3D.position.set(controllerPos.x, controllerPos.y, controllerPos.z);

            // Set the boolean 'triggering' and the createdEl.
            el.setAttribute('left-trigger-listener', {createdEl: newEntity, triggering: 'true'});
        });

        listeningEl.addEventListener('triggerup', (event) => {
            el.setAttribute('left-trigger-listener', {createdEl: null, triggering: 'false'});
        });
    },

    tick: function(time, timeDelta): void {

    }
}

export default leftTriggerListener;