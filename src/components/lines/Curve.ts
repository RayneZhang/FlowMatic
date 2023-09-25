import * as AFRAME from 'aframe';

export const curveComponent = AFRAME.registerComponent('curve', {
    schema: {
        
    },

    init: function(): void {
        // const path = new CustomSinCurve(4);
        const path = new THREE.CatmullRomCurve3( [
          new THREE.Vector3( -10, 0, 10 ),
          new THREE.Vector3( -5, 5, 5 ),
          new THREE.Vector3( 0, 0, 0 ),
          new THREE.Vector3( 5, -5, 5 ),
          new THREE.Vector3( 10, 0, 10 )
        ] );
        const tubularSegments = 20;
        const radius = 0.01;
        const radialSegments = 8;
        const closed = false;
        const geometry = new THREE.TubeBufferGeometry(path, tubularSegments, radius, radialSegments, closed);

        const mesh = new THREE.Mesh(geometry);
        this.el.setObject3D('mesh', mesh);
    },

    tick: function(): void {
        
    },

    update: function (oldDate): void {
       
    },

});

class CustomSinCurve extends THREE.Curve {
    constructor(scale) {
      super();
      this.scale = scale;
    }

    getPoint(t) {
      const tx = t * 3 - 1.5;
      const ty = Math.sin(2 * Math.PI * t);
      const tz = 0;
      return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
    }
  }
  