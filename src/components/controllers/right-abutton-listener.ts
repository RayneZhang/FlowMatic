declare const THREE:any;

const rightAButtonListener = {
    init: function(): void {
        // Handle a button down.
        const listeningEl = document.querySelector('#rightHand');
        listeningEl.addEventListener('abuttondown', (event) => {
            // Retrieve all intersected Elements through raycaster.
            const intersectedEls = this.el.components.raycaster.intersectedEls;

            // Check if there is intersected object.
            if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
                console.log('Nothing is intersected when pressing a button');
                return;
            }

            // Fetch the intersected object.
            const intersectedEl = intersectedEls[0];

            // Handle object attributes.
            if (intersectedEl.classList.contains("obj-attr-list")) {
                intersectedEl.setAttribute("obj-attributes-list", "freeze", !intersectedEl.getAttribute("obj-attributes-list").freeze);
                return;
            }
            // Handle bottle description.
            if (intersectedEl.classList.contains("data-source")) {
                intersectedEl.setAttribute("bottle-description", "freeze", !intersectedEl.getAttribute("bottle-description").freeze);
                return;
            }
            // Handle filter description.
            if (intersectedEl.classList.contains("data-filter")) {
                intersectedEl.setAttribute("filter-description", "freeze", !intersectedEl.getAttribute("filter-description").freeze);
                return;
            }

            console.log('The intersected object has no description.');
            return;

            
        });
    },

    tick: function(time, timeDelta): void {

    }
}

export default rightAButtonListener;