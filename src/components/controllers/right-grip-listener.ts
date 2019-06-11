declare const THREE:any;

const rightGripListener = {
    schema: {
        followingEl: {type: 'selector', default: null},
        gripping: {type: 'boolean', default: false}
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

            this.el.object3D.updateMatrix();
            this.el.object3D.updateMatrixWorld();
            this.localPosition = this.el.object3D.worldToLocal(intersectedEl.object3D.position.clone());

            // Set the intersected object as the following object.
            this.data.followingEl = intersectedEl;
        });

        this.el.addEventListener('gripup', (event) => {
            this.el.setAttribute('right-grip-listener', {followingEl: null, gripping: 'false'});
        });
    },

    tick(time, timeDelta): void {
        const { gripping, followingEl } = this.data;

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