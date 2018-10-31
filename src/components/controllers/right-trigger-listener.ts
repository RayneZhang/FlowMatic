declare const THREE:any;

const rightTriggerListener = {
    init: function(): void {
        // Handle trigger down.
        this.el.addEventListener('triggerdown', (event) => {
            // Retrieve all intersected Elements through raycaster.
            const intersectedEls = this.el.components.raycaster.intersectedEls;

            // Check if there is intersected object.
            if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
                console.log('Nothing is intersected when triggering');
                return;
            }

            // Fetch the intersected object.
            const intersectedEl = intersectedEls[0];

            // Check if the intersected object is ui.
            if (!intersectedEl.classList.contains('ui')) {
                console.log('The intersected object is not ui.');
                return;
            }
            
            // Retrieve all intersections through raycaster.
            const intersections = this.el.components.raycaster.intersections;
            if (!Array.isArray(intersections) || !intersections.length) {
                console.log('There is NO intersections when triggering');
                return;
            }

            const id = intersectedEl.getAttribute('id');
            switch(id) {
                case 'hue': case 'huecursor': {
                    // Fetch the intersection point of the first intersected object.
                    const {x, y, z} = intersections[0].point;
                    const WorldPos = new THREE.Vector3(x, y, z);
                    this.onHueDown(WorldPos.clone());
                }
            }
        
        });
    },

    tick: function(time, timeDelta): void {

    },

    onHueDown: function(position: any) {
        const hueWheel: any = document.querySelector('#hue');
        const hueCursor: any = document.querySelector('#huecursor');

        hueWheel.object3D.updateMatrixWorld();
        const LocalPos = hueWheel.object3D.worldToLocal(position);

        // console.log(LocalPos.x + ',' + LocalPos.y + ',' + LocalPos.z);       
        hueCursor.object3D.position.copy(position);
    }
}

export default rightTriggerListener;