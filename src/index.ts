import * as AFRAME from 'aframe';
import * as PHYSICS from 'aframe-physics-system';
import * as ENVIRONMENT from 'aframe-environment-component';

console.log(AFRAME);
console.log(PHYSICS);
console.log(ENVIRONMENT);

declare var THREE:any;

AFRAME.registerComponent('gripdown-listener', {
    schema: {
        followingEl: {type: 'selector', default: null},
        gripping: {type: 'boolean', default: 'false'}
    },

    init: function() {

        this.oldPosition = new THREE.Vector3();

        var self = this;
        var el = this.el;

        this.el.addEventListener('gripdown', function(event) {
            el.setAttribute('gripdown-listener', 'gripping', 'true');
            
            var intersectedEls = el.components.raycaster.intersectedEls;
    
            // Check if there is intersected object.
            if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
                console.log('Nothing is intersected when gripping');
                return;
            }
    
            self.oldPosition = el.object3D.position;

            // Set the intersected object as the following object.
            var followingEl = intersectedEls[0];
            el.setAttribute('gripdown-listener', 'followingEl', followingEl);
            console.log('When gripping, the first intersected object is: ' + followingEl.id);
        });

        this.el.addEventListener('gripup', function(event) {
            el.setAttribute('gripdown-listener', {followingEl: null, gripping: 'false'});
        });
    },

    tick: function(time, timeDelta) {
        var gripping = this.data.gripping;
        var followingEl = this.data.followingEl;
        if (gripping && followingEl) {
            var oldPosition = this.oldPosition;
            var currentPosition = this.el.object3D.position;
            this.oldPosition = currentPosition;

            var currentTargetPosition = this.data.followingEl.getAttribute('position');
            var updatedX = currentTargetPosition.x + currentPosition.x - oldPosition.x;
            var updatedY = currentTargetPosition.y + currentPosition.y - oldPosition.y;
            var updatedZ = currentTargetPosition.z + currentPosition.z - oldPosition.z;

            this.data.followingEl.setAttribute('position', {x: updatedX, y: updatedY, z: updatedZ});
            // console.log('followingEl is: ' + this.data.followingEl.id);
            console.log('Controller current position is: ' + currentPosition.x + ',' + currentPosition.y + ','+ currentPosition.z);
            console.log('followingEl updated position is: ' + updatedX + ',' + updatedY + ','+ updatedZ);
            //console.log('followingEl position is: ' + this.data.followingEl.object3D.position.x + ',' + this.data.followingEl.object3D.position.y + ','+ this.data.followingEl.object3D.position.z)
        }
    }

    // gripdownListener: function(event) {
    //     this.data.gripping = true;

    //     var intersectedEls = this.el.components.raycaster.intersectedEls;

    //     // Check if there is intersected object.
    //     if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
    //         console.log('Nothing is intersected when gripping');
    //         return;
    //     }

    //     // Set the intersected object as the following object.
    //     this.data.followingEl = intersectedEls[0];
    //     console.log('When gripping, the first intersected object is: ' + this.data.followingEl.id);
    // }
});

AFRAME.registerComponent('intersected-listener', {
    init: function() {
        var el = this.el;
        el.addEventListener('raycaster-intersected', function(event) {
            console.log('Raycasted Object is me: ' + el.id);
        })
    }
});

AFRAME.registerComponent('intersection-listener', {
    init: function() {
        var el = this.el;
        el.addEventListener('raycaster-intersection', function(event) {
            var els = event.detail.els;
            console.log('Raycast intersection detected: ' + els);
            console.log('The first element in the intersection is : ' + els[0].id);
        })
    }
});

// AFRAME.registerComponent('follow', {
//     schema: {
//         target: {type: 'selector'},
//         speed: {type: 'number'}
//     },

//     init: function() {
//         this.directionVec3 = new THREE.Vector3();
//     },
    
//     tick: function(time, timeDelta) {
//         var directionVec3 = this.directionVec3;

//         // Grab position vectors (THREE.Vector3) from the entities' three.js objects.
//         var targetPosition = this.data.target.object3D.position;
//         var currentPosition = this.el.object3D.position;

//         // Subtract the vectors to get the direction the entity should head in.
//         directionVec3.copy(targetPosition).sub(currentPosition);

//         // Calculate the distance.
//         var distance = directionVec3.length();

//         // Don't go any closer if a close proximity has been reached.
//         if (distance < 1) { return; }

//         // Scale the direction vector's magnitude down to match the speed.
//         var factor = this.data.speed / distance;
//         ['x', 'y', 'z'].forEach(function(axis) {
//             directionVec3[axis] *= factor * (timeDelta / 1000);
//         });

//         // Translate the entity in the direction towards the target.
//         this.el.setAttribute('position', {
//             x: currentPosition.x + directionVec3.x,
//             y: currentPosition.y + directionVec3.y,
//             z: currentPosition.z + directionVec3.z
//         });
//     }
// });