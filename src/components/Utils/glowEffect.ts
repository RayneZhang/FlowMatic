import * as AFRAME from 'aframe'
declare const THREE: any;
declare const THREEx: any;

const glowEffect = AFRAME.registerComponent('glow-effect', {
    init: function(): void {
        this.el.addEventListener('loaded', (event) => {
            const mesh: any = this.el.getObject3D('mesh');
            if (!mesh) {
                console.log("The mesh of the glowing object is null!");
                return;
            }
            var glowMesh = new THREEx.GeometricGlowMesh(mesh);
            mesh.add(glowMesh.object3d);
        });

        const textEntity: any = document.createElement('a-entity');
        this.el.appendChild(textEntity);
        var loader = new THREE.FontLoader();
        loader.load( '../vendor/fonts/helvetiker_regular.typeface.json', function ( font ) {

            var geometry = new THREE.TextGeometry( 'Hello three.js!', {
                font: font,
                size: 0.06,
                height: 0.01,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 0.5,
                bevelSegments: 3
            } );
            geometry.computeBoundingBox();
            geometry.computeVertexNormals();
            const b_geometry = new THREE.BufferGeometry().fromGeometry( geometry );
            const material = new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.5, transparent: true});
            var mesh = new THREE.Mesh( b_geometry, material );
            textEntity.setObject3D('mesh', mesh);
        } );
        
    }, 
});

export default glowEffect;