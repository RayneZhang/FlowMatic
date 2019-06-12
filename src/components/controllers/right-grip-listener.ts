declare const THREE:any;

const rightGripListener = {
    schema: {
        followingEl: {type: 'selector', default: null},
        gripping: {type: 'boolean', default: false},
        weaponEl: {type: 'selector', default: null}
    },

    init(): void {

        this.el.addEventListener('gripdown', (event) => {
            this.data.gripping = true;
            
            // Retrieve all intersected Elements through raycaster.
            const intersectedEls = this.el.components.raycaster.intersectedEls;
            // Check if there is intersected object.
            if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
                console.log('Nothing is intersected when gripping');
                return;
            }
            // Fetch the intersected object.
            const intersectedEl = intersectedEls[0];

            // Check if the intersected object is movable.
            if (!intersectedEl.classList.contains('movable')) {
                console.log(intersectedEl);
                console.log('The intersected object is not movable.');
                return;
            }

            if (intersectedEl.classList.contains('weapon')) {
                if (intersectedEl.classList.contains('sword')) {
                    this.el.appendChild(intersectedEl);
                    intersectedEl.object3D.position.set(0, 0, 0);
                    this.data.weaponEl = intersectedEl;
                    return;
                }
            }

            this.el.object3D.updateMatrix();
            this.el.object3D.updateMatrixWorld();
            this.localPosition = this.el.object3D.worldToLocal(intersectedEl.object3D.position.clone());

            // Set the intersected object as the following object.
            this.data.followingEl = intersectedEl;
        });

        this.el.addEventListener('gripup', (event) => {
            // If the user is holding a weapon...
            if (this.data.weaponEl) {
                console.log(this.data.weaponEl.getAttribute('position'));
                const redux = document.querySelector('#redux');
                redux.appendChild(this.data.weaponEl);
            }
            this.el.setAttribute('right-grip-listener', {followingEl: null, gripping: 'false', weaponEl: null});
        });
    },

    tick(time, timeDelta): void {
        const gripping = this.data.gripping;
        const followingEl = this.data.followingEl;
        if (this.data.weaponEl)
            this.data.weaponEl.object3D.position.set(0, 0, 0);

        if (gripping && followingEl) {
            this.el.object3D.updateMatrix();
            this.el.object3D.updateMatrixWorld();
            const updatedTargetPosition: any = this.el.object3D.localToWorld(this.localPosition.clone());

            // Modify position at three.js level for better performance. (Better than setAttribute)
            followingEl.object3D.position.set(updatedTargetPosition.x, updatedTargetPosition.y, updatedTargetPosition.z);
        }

    }
}

export default rightGripListener;