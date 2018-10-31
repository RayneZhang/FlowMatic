declare const THREE:any;

const modelSubset = {
    schema: {
        target: {type: 'selector', default: null},
        name: {type: 'string', default: ''}
    },

    init: function() {
        this.data.target.addEventListener('model-loaded', (event) => {
            const model = event.detail.model;
            // Check the model format and whether it is empty.
            if (event.detail.format !== 'obj' || !model.getObjectByName('huecursor')) {return;}
            const subset = model.getObjectByName(this.data.name);
            this.el.setObject3D('mesh', subset.clone());

            if (this.data.name === 'hue') {this.initColorWheel();}
        })
    },

    initColorWheel(): void {
        const vertexShader = '\
          varying vec2 vUv;\
          void main() {\
            vUv = uv;\
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\
            gl_Position = projectionMatrix * mvPosition;\
          }\
          ';
    
        const fragmentShader = '\
          #define M_PI2 6.28318530718\n \
          uniform float brightness;\
          varying vec2 vUv;\
          vec3 hsb2rgb(in vec3 c){\
              vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, \
                               0.0, \
                               1.0 );\
              rgb = rgb * rgb * (3.0 - 2.0 * rgb);\
              return c.z * mix( vec3(1.0), rgb, c.y);\
          }\
          \
          void main() {\
            vec2 toCenter = vec2(0.5) - vUv;\
            float angle = atan(toCenter.y, toCenter.x);\
            float radius = length(toCenter) * 2.0;\
            vec3 color = hsb2rgb(vec3((angle / M_PI2) + 0.5, radius, brightness));\
            gl_FragColor = vec4(color, 1.0);\
          }\
          ';
    
        const material = new THREE.ShaderMaterial({
          uniforms: { brightness: { type: 'f', value: 1.0 } },
          vertexShader: vertexShader,
          fragmentShader: fragmentShader
        });

        const mesh = this.el.getObject3D('mesh');
        if (mesh) {
            mesh.material = material;
        }
    }
}

export default modelSubset;