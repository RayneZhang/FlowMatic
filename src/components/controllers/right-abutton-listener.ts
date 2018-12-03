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
            if (!(intersectedEl.classList.contains("obj-attr-list") || intersectedEl.classList.contains("data-source"))) {
                console.log('The intersected object has no description.');
                return;
            }

            // Handle object attributes.
            if (intersectedEl.classList.contains("obj-attr-list")) {
                intersectedEl.setAttribute("obj-attributes-list", "freeze", !intersectedEl.getAttribute("obj-attributes-list").freeze);
            }
            // Handle bottle description.
            if (intersectedEl.classList.contains("data-source")) {
                intersectedEl.setAttribute("bottle-description", "freeze", !intersectedEl.getAttribute("bottle-description").freeze);
            }

        });
    },

    tick: function(time, timeDelta): void {

    }
}

export default rightAButtonListener;