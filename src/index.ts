import * as AFRAME from 'aframe';
import * as PHYSICS from 'aframe-physics-system';
import * as ENVIRONMENT from 'aframe-environment-component';

console.log(AFRAME);
console.log(PHYSICS);
console.log(ENVIRONMENT);

declare const THREE:any;

AFRAME.registerComponent('gripdown-listener', {
    schema: {
        followingEl: {type: 'selector', default: null},
        gripping: {type: 'boolean', default: 'false'}
    },

    init: function(): void {

        const el = this.el;

        this.el.addEventListener('gripdown', (event) => {
            el.setAttribute('gripdown-listener', 'gripping', 'true');
            
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
            el.setAttribute('gripdown-listener', 'followingEl', followingEl);

            // console.log('When gripping, the first intersected object is: ' + followingEl.id);
        });

        this.el.addEventListener('gripup', (event) => {
            el.setAttribute('gripdown-listener', {followingEl: null, gripping: 'false'});
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