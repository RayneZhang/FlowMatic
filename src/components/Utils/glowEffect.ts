import * as AFRAME from 'aframe'
declare const THREEx:any;

const glowEffect = AFRAME.registerComponent('glow-effect', {
    init: function(): void {
        this.el.addEventListener('loaded', (event) => {
            const mesh: any = this.el.getObject3D('mesh');
            if (!mesh) {
                console.log("The mesh of the glowing object is null!");
                return;
            }
            console.log( mesh.geometry );
            var glowMesh = new THREEx.GeometricGlowMesh(mesh);
            mesh.add(glowMesh.object3d);
        });
    }, 
});

export default glowEffect;