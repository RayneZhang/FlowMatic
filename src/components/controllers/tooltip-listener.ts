declare const THREE:any;

const tooltipListener = {
    init: function(): void {
        this.visible = true;
        const leftTooltips: any = document.querySelector("#leftTooltips");
        const rightTooltips: any = document.querySelector("#rightTooltips");
        this.el.addEventListener('bbuttondown', (event) => {
            leftTooltips.setAttribute('visible', !this.visible);
            rightTooltips.setAttribute('visible', !this.visible);
            this.visible = !this.visible;
        });

        this.el.addEventListener('model-loaded', (event) => {
            const controllerObject3D: any = event.detail.model;
            var buttonMeshes: any = this.buttonMeshes = {};
            if (!controllerObject3D) { 
                console.log("The Hand Model is null.");
                return; 
            }

            buttonMeshes.body = controllerObject3D.getObjectByName('body');
            this.material  = new THREE.MeshStandardMaterial({
                color : 0xeeeeee
            });
            buttonMeshes['body'].material = this.material;
        });        
    },

    tick: function(time, timeDelta): void {

    }
}

export default tooltipListener;