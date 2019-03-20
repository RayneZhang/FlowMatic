import * as AFRAME from 'aframe'
declare const THREE:any;

const controllerMaterial = AFRAME.registerComponent('controller-material-controller', {
    init: function(): void {
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
    }
});

export default controllerMaterial;