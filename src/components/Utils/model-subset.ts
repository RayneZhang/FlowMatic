declare const THREE:any;

const modelSubset = {
    schema: {
        target: {type: 'selector', default: null},
        name: {type: 'string', default: ''},
        raycasted: {type: 'boolean', default: false}
    },

    init: function() {
        const NotReactUI: Array<string> = ["hue", "currentcolor", "menu", "description"];

        this.data.target.addEventListener('model-loaded', (event) => {
            const model = event.detail.model;
            // Check the model format and whether it is empty.
            if (event.detail.format !== 'obj' || !model.getObjectByName('huecursor')) {return;}
            const subset = model.getObjectByName(this.data.name);
            this.el.setObject3D('mesh', subset.clone());

            if (this.data.name === 'hue') {this.initColorWheel();}
            if (this.data.name.indexOf("submenu") != -1) this.initSubmenu();
            if (this.data.name.indexOf('button') != -1) this.el.classList.add('button');
        });

        // Handle material when hover. Objects including submenus & buttons.
        this.el.addEventListener('raycaster-intersected', (event) => {
            event.stopPropagation();
            this.data.raycasted = true;
            if (NotReactUI.indexOf(this.data.name) === -1) 
                this.el.setAttribute('material', 'color', '#22a7f0'); 
        })

        // Handle material when hover cleared.
        this.el.addEventListener('raycaster-intersected-cleared', (event) => {
            event.stopPropagation();
            this.data.raycasted = false;
            const leftHandInfo: any = document.querySelector("#leftHandInfo");
            const selectedButtonId: number = leftHandInfo.getAttribute('global-menu').selectedButtonId;
            if (NotReactUI.indexOf(this.data.name) === -1 && this.el.getAttribute('id').indexOf(String(selectedButtonId+1)) === -1) 
                this.el.setAttribute('material', 'color', '#22313f'); 
        })
    },

    initSubmenu(): void {
        const imgEl: any = document.createElement('a-image');
        imgEl.setAttribute('height', 0.012);
        imgEl.setAttribute('width', 0.012);
        this.el.appendChild(imgEl);
        switch (this.data.name) {
            case "submenu1" : {
                imgEl.setAttribute('src', '#source_icon');
                imgEl.object3D.position.set(-0.155, 0.001, -0.055);
                break;
            }
            case "submenu2" : {
                imgEl.setAttribute('src', '#operator_icon');
                imgEl.object3D.position.set(-0.155, 0.001, -0.035);
                break;
            }
            case "submenu3" : {
                imgEl.setAttribute('src', '#cube_icon');
                imgEl.object3D.position.set(-0.155, 0.001, -0.015);
                break;
            }
        }
        imgEl.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
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