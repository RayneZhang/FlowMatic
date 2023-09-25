import * as AFRAME from 'aframe';

const mtlLighting = AFRAME.registerComponent('mtl-lighting', {
    init: function(): void {
        this.el.sceneEl.renderer.gammaInput = true;
        this.el.sceneEl.renderer.gammaOutput = true;
        // this.el.addEventListener('model-loaded', (event) => {
        //     this.el.object3D.traverse((o) => {
        //         if (o.isMesh) {
        //             o.material.emissiveIntensity = 100;
        //         }
        //     });
        // });        
    }
});

export default mtlLighting;