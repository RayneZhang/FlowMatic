import * as AFRAME from 'aframe';
import * as PHYSICS from 'aframe-physics-system';
import * as ENVIRONMENT from 'aframe-environment-component';

console.log(AFRAME);
console.log(PHYSICS);
console.log(ENVIRONMENT);

declare const THREE:any;

AFRAME.registerComponent('grip-listener', {
    schema: {
        followingEl: {type: 'selector', default: null},
        gripping: {type: 'boolean', default: 'false'}
    },

    init: function(): void {

        const el = this.el;

        this.el.addEventListener('gripdown', (event) => {
            el.setAttribute('grip-listener', 'gripping', 'true');
            
            // Retrieve all intersected Elements through raycaster.
            const intersectedEls = el.components.raycaster.intersectedEls;
    
            // Check if there is intersected object.
            if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
                console.log('Nothing is intersected when gripping');
                return;
            }
    
            // Set current position as lastPosition.
            this.lastPosition = new THREE.Vector3();
            this.lastPosition = el.object3D.position.clone();

            // Set the intersected object as the following object.
            const followingEl = intersectedEls[0];
            el.setAttribute('grip-listener', 'followingEl', followingEl);

            // console.log('When gripping, the first intersected object is: ' + followingEl.id);
        });

        this.el.addEventListener('gripup', (event) => {
            el.setAttribute('grip-listener', {followingEl: null, gripping: 'false'});
        });
    },

    tick: function(time, timeDelta): void {
        const { gripping, followingEl } = this.data;

        if (gripping && followingEl) {
            const lastPosition: any = this.lastPosition;
            const currentPosition: any = this.el.object3D.position;

            // Store this frame's position in oldPosition.
            this.lastPosition = currentPosition.clone();

            // Calculate target object's position.
            const currentTargetPosition = followingEl.getAttribute('position');
            const updatedTargetPosition: any = currentTargetPosition.add(currentPosition.sub(lastPosition));

            // Modify position at three.js level for better performance. (Better than setAttribute)
            followingEl.object3D.position.set(updatedTargetPosition.x, updatedTargetPosition.y, updatedTargetPosition.z);

            // console.log('followingEl updated position is: ' + updatedTargetPosition.x + ',' + updatedTargetPosition.y + ','+ updatedTargetPosition.z);
        }
    }
});

AFRAME.registerComponent('trigger-listener', {
    schema: {
        triggering: {type: 'boolean', default: 'false'},
        createdEl: {type: 'selector', default: null}
    },

    init: function(): void {

        const el = this.el;
        const sceneEl = document.querySelector('a-scene');

        this.el.addEventListener('triggerdown', (event) => {
            
            // Create an entity and append it to the scene.
            let newEntity: any = document.createElement('a-entity');
            sceneEl.appendChild(newEntity);

            // Add geometry component to the entity.
            newEntity.setAttribute('geometry', {
                primitive: 'box',
                height: 0.1,
                width: 0.1,
                depth: 0.1
            }); 

            // Add class component to the entity.
            newEntity.setAttribute('class', 'movable');

            // Add position component to the entity.
            const controllerPos: any = el.object3D.position;
            newEntity.object3D.position.set(controllerPos.x, controllerPos.y, controllerPos.z);

            // Set the boolean 'triggering' and the createdEl.
            el.setAttribute('trigger-listener', {createdEl: newEntity, triggering: 'true'});
        });

        this.el.addEventListener('triggerup', (event) => {
            el.setAttribute('trigger-listener', {createdEl: null, triggering: 'false'});
        });
    },

    tick: function(time, timeDelta): void {

    }
});

AFRAME.registerComponent('intersected-listener', {
    init: function() {
        const el = this.el;
        el.addEventListener('raycaster-intersected', function(event) {
            console.log('Raycasted Object is me: ' + el.id);
        })
    }
});

AFRAME.registerComponent('intersection-listener', {
    init: function() {
        const el = this.el;
        el.addEventListener('raycaster-intersection', function(event) {
            const els = event.detail.els;
            console.log('Raycast intersection detected: ' + els);
            console.log('The first element in the intersection is : ' + els[0].id);
        })
    }
});