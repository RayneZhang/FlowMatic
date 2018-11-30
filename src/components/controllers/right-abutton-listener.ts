declare const THREE:any;

const rightAButtonListener = {
    init: function(): void {
        // Handle a button down.
        this.el.addEventListener('abuttondown', (event) => {
            // Retrieve all intersected Elements through raycaster.
            const intersectedEls = this.el.components.raycaster.intersectedEls;

            // Check if there is intersected object.
            if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
                console.log('Nothing is intersected when pressing a button');
                return;
            }

            // Fetch the intersected object.
            const intersectedEl = intersectedEls[0];

            // Check if the intersected object is ui.
            if (!(intersectedEl.Attributes.Contains("obj-attributes-list") || intersectedEl.Attributes.Contains("data-source"))) {
                console.log('The intersected object has no description.');
                return;
            }
            
            console.log("The object should be freezed!");
            
        });
    },

    tick: function(time, timeDelta): void {

    }
}

export default rightAButtonListener;