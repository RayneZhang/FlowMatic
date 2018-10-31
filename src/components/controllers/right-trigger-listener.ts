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

            // Fetch the intersection point of the first intersected object.
            const {x, y, z} = intersections[0].point;
        
        });
    },

    tick: function(time, timeDelta): void {

    }
}

export default rightTriggerListener;