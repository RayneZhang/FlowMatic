declare const THREE:any;

class Menu {

    // Assigned in constructor as menu entity. Will be referred by many functions.
    menuEl: any = undefined;
    // The UI objects/panels.
    objects: any = {};

    // The cursor is centered in 0,0 to allow scale it easily.
    // This is the offset to put it back in its original position on the slider.
    cursorOffset = new THREE.Vector3(0.06409, 0.01419, -0.10242);

    constructor(ControllerEl: any) {
        const sceneEl = document.querySelector('a-scene');
        // Create a menu entity and append it to the controller.
        const menuEntity: any = this.menuEl = document.createElement('a-entity');
        ControllerEl.appendChild(menuEntity);

        // Create Menu Img by calling this function.
        //this.createMenuImg(menuEntity);

        // Add geometry component to the entity.
        // menuEntity.setAttribute('geometry', {
        //     primitive: 'ring',
        //     radiusInner: 0.1,
        //     radiusOuter: 0.2
        // }); 

        // Add the material component of the menu entity.
        menuEntity.setAttribute('material', {
            color: '#ffffff',
            flatShading: true,
            shader: 'flat',
            transparent: true,
            fog: false,
            src: '#uinormal'
        }); 

        menuEntity.setAttribute('id', 'menu');
        menuEntity.setAttribute('obj-model', 'obj:#uiobj');
        menuEntity.setAttribute('rotation', '45 0 0');
        menuEntity.setAttribute('position', '0 0.13 -0.08');
        // Set the visibility of the menu entity as false at the beginning.
        menuEntity.object3D.visible = false;

        // Event Listener to open and close menu.
        ControllerEl.addEventListener('xbuttondown', this.onXButtonDown.bind(this));
        ControllerEl.addEventListener('model-loaded', this.onModelLoaded.bind(this));

        // Event Listener on hovering over the menu.
        // menuEntity.addEventListener('raycaster-intersected', (event) => {
        //     menuEntity.setAttribute('material', 'color', 'yellow'); 
        // })

        // Event Listener on Leaving from hovering over the menu.
        // menuEntity.addEventListener('raycaster-intersected-cleared', (event) => {
        //     menuEntity.setAttribute('material', 'color', 'grey'); 
        // })
    }

    createMenuImg(menuEntity: any): void {
        // Create image primitive entity in the menu.
        const menuImg: any = document.createElement('a-image');
        menuEntity.appendChild(menuImg);

        menuImg.setAttribute('src', '#uinormal');
        menuImg.setAttribute('height', '0.1');
        menuImg.setAttribute('width', '0.1');
        menuImg.setAttribute('position', '0.2 0 0');
    }

    // The listener when x-button is down.
    onXButtonDown(event): void {
        this.menuEl.object3D.visible = !this.menuEl.object3D.visible;

        if (this.menuEl.object3D.visible) // Add class for raycaster.
            this.menuEl.setAttribute('class', 'clickable');
        else // Remove class for raycaster.
            this.menuEl.removeAttribute('class');
    }

    // The listener when the UI obj is loaded.
    onModelLoaded(event): void {
        let model = this.menuEl.getObject3D('mesh');
        model = event.detail.model;

        // Check the model format and whether it is empty.
        if (event.detail.format !== 'obj' || !model.getObjectByName('brightnesscursor')) {return;}

        // this.objects.brightnessCursor = model.getObjectByName('brightnesscursor');
        // this.objects.brightnessSlider = model.getObjectByName('brightness');
        // this.objects.brightnessSlider.geometry.computeBoundingBox();
        this.objects.previousPage = model.getObjectByName('brushprev');
        this.objects.nextPage = model.getObjectByName('brushnext');

        this.objects.hueCursor = model.getObjectByName('huecursor');
        this.objects.hueWheel = model.getObjectByName('hue');
        this.objects.hueWheel.geometry.computeBoundingSphere();
        const colorWheelSize = this.objects.hueWheel.geometry.boundingSphere.radius;

        this.objects.sizeCursor = model.getObjectByName('size');
        this.objects.sizeCursor.position.copy(this.cursorOffset);

        // this.objects.colorHistory = [];
        // for (let i = 0; i < 7; i++) {
        //     this.objects.colorHistory[i] = model.getObjectByName('colorhistory' + i);
        // }
        // this.objects.currentColor = model.getObjectByName('currentcolor');

        this.objects.sizeSlider = model.getObjectByName('sizebg');
        this.objects.sizeSlider.geometry.computeBoundingBox();
        
        this.initColorWheel();
        this.updateSizeSlider();
    }

    updateSizeSlider(): void {
        var slider = this.objects.sizeSlider;
        var sliderBoundingBox = slider.geometry.boundingBox;

        // Fetch cursor and set its X and scale.
        const cursor = this.objects.sizeCursor;
        const sliderWidth = sliderBoundingBox.max.x - sliderBoundingBox.min.x;
        const positionX = 0.5 * sliderWidth;
        cursor.position.setX(positionX - this.cursorOffset.x);
        var scale = 0.5 + 0.3;
        cursor.scale.set(scale, 1, scale);
    }

    initColorWheel(): void {
        var colorWheel = this.objects.hueWheel;
    
        var vertexShader = '\
          varying vec2 vUv;\
          void main() {\
            vUv = uv;\
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\
            gl_Position = projectionMatrix * mvPosition;\
          }\
          ';
    
        var fragmentShader = '\
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
    
        let material = new THREE.ShaderMaterial({
          uniforms: { brightness: { type: 'f', value: 1.0 } },
          vertexShader: vertexShader,
          fragmentShader: fragmentShader
        });
        colorWheel.material = material;
    }
}

export default Menu;