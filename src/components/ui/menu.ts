declare const THREE:any;

class Menu {

    // Assigned in constructor as menu entity. Will be referred by many functions.
    menuEl: any = undefined;
    // The sub-menu elements' names in the 3D obj.
    subMenuNames: any = ['brushprev', 'brushnext', 'huecursor', 'hue', 'sizebg'];

    // The cursor is centered in 0,0 to allow scale it easily.
    // This is the offset to put it back in its original position on the slider.
    cursorOffset = new THREE.Vector3(0.06409, 0.01419, -0.10242);

    constructor(ControllerEl: any) {
        // Create a menu entity and append it to the controller.
        const menuEntity: any = this.menuEl = document.createElement('a-entity');
        ControllerEl.appendChild(menuEntity);
        menuEntity.setAttribute('id', 'menu');

        this.loadModelGroup();
        this.createSubMenuEl();
        this.initColorWheel();
        // this.updateSizeSlider();

        menuEntity.setAttribute('rotation', '45 0 0');
        menuEntity.setAttribute('position', '0 0.13 -0.08');
        // Set the visibility of the menu entity as false at the beginning.
        menuEntity.object3D.visible = false;

        // Event Listener to open and close menu.
        ControllerEl.addEventListener('xbuttondown', this.onXButtonDown.bind(this));

        // Event Listener on hovering over the menu.
        // menuEntity.addEventListener('raycaster-intersected', (event) => {
        //     menuEntity.setAttribute('material', 'color', 'yellow'); 
        // })

        // Event Listener on Leaving from hovering over the menu.
        // menuEntity.addEventListener('raycaster-intersected-cleared', (event) => {
        //     menuEntity.setAttribute('material', 'color', 'grey'); 
        // })
    }

    // Load an entity just for importing 3D obj.
    loadModelGroup(): void {
        const sceneEl = document.querySelector('a-scene');
        const modelGroup: any = document.createElement('a-entity');
        sceneEl.appendChild(modelGroup);
        modelGroup.setAttribute('id', 'modelGroup');
        modelGroup.setAttribute('obj-model', 'obj:#uiobj');
        modelGroup.object3D.visible = false;
    }

    // Create sub-menu entities based on the modelGroup. 
    createSubMenuEl(): void {
        const modelGroup = document.querySelector('#modelGroup');
        for(const subMenuName of this.subMenuNames) {
            // Create sub-menu entity.
            const subMenuEl: any = document.createElement('a-entity');
            this.menuEl.appendChild(subMenuEl);
            subMenuEl.setAttribute('id', subMenuName);
            subMenuEl.setAttribute('model-subset', {
                target: modelGroup,
                name: subMenuName
            });
            // Add the same material component of the sub-menu entity.
            subMenuEl.setAttribute('material', {
                color: '#ffffff',
                flatShading: true,
                shader: 'flat',
                transparent: true,
                fog: false,
                src: '#uinormal'
            }); 
        }
    }

    // The listener when x-button is down.
    onXButtonDown(event): void {
        this.menuEl.object3D.visible = !this.menuEl.object3D.visible;

        if (this.menuEl.object3D.visible) // Add class for raycaster.
            this.menuEl.setAttribute('class', 'clickable');
        else // Remove class for raycaster.
            this.menuEl.removeAttribute('class');
    }

    

    // updateSizeSlider(): void {
    //     var slider = this.objects.sizeSlider;
    //     var sliderBoundingBox = slider.geometry.boundingBox;

    //     // Fetch cursor and set its X and scale.
    //     const cursor = this.objects.sizeCursor;
    //     const sliderWidth = sliderBoundingBox.max.x - sliderBoundingBox.min.x;
    //     const positionX = 0.5 * sliderWidth;
    //     cursor.position.setX(positionX - this.cursorOffset.x);
    //     var scale = 0.5 + 0.3;
    //     cursor.scale.set(scale, 1, scale);
    // }

    initColorWheel(): void {
        const colorWheel: any = document.querySelector('#hue');
    
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

        colorWheel.addEventListener('raycaster-intersected', (event) =>{
            const mesh = colorWheel.getObject3D('mesh');
            console.log(mesh);
            if (mesh) {
                console.log(mesh.material);
                mesh.material = material;
            }
        });
    }
}

export default Menu;