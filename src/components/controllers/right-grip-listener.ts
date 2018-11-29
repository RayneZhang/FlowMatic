declare const THREE:any;

const rightGripListener = {
    schema: {
        followingEl: {type: 'selector', default: null},
        gripping: {type: 'boolean', default: 'false'}
    },

    init(): void {

        const el = this.el;

        this.el.addEventListener('gripdown', (event) => {
            el.setAttribute('right-grip-listener', 'gripping', 'true');
            
            // Retrieve all intersected Elements through raycaster.
            const intersectedEls = el.components.raycaster.intersectedEls;
    
            // Check if there is intersected object.
            if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
                console.log('Nothing is intersected when gripping');
                return;
            }
    
            // Fetch the intersected object.
            const intersectedEl = intersectedEls[0];

            // Check if the intersected object is movable.
            if (!intersectedEl.classList.contains('movable')) {
                console.log('The intersected object is not movable.');
                return;
            }

            // Set current position as lastPosition.
            this.lastPosition = new THREE.Vector3();
            this.lastPosition = el.object3D.position.clone();

            // Set the intersected object as the following object.
            el.setAttribute('right-grip-listener', 'followingEl', intersectedEl);

            // console.log('When gripping, the first intersected object is: ' + followingEl.id);
        });

        this.el.addEventListener('gripup', (event) => {
            el.setAttribute('right-grip-listener', {followingEl: null, gripping: 'false'});
        });
    },

    tick(time, timeDelta): void {
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

        if (gripping) {
            const lineEntity: any = document.querySelector('#line');
            const CP = {x: this.el.object3D.position.x, y: this.el.object3D.position.y, z: this.el.object3D.position.z};
            lineEntity.setAttribute('draw-line', 'endPoint', CP);
        }
    }
}

export default rightGripListener;