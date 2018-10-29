class Menu {

    menuEl: any = undefined;

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
            transparent: false,
            fog: false,
            src: '#uinormal'
        }); 

        menuEntity.setAttribute('id', 'menu');
        menuEntity.setAttribute('obj-model', 'obj:#uiobj');
        menuEntity.setAttribute('position', '0 0.13 -0.08');
        menuEntity.setAttribute('rotation', '45 0 0');
        // Set the visibility of the menu entity as false at the beginning.
        menuEntity.object3D.visible = false;

        // Add text component to the entity.
        // menuEntity.setAttribute('text', {
        //     value: 'Menu',
        //     align: 'center',
        //     wrapCount: 24
        // }); 

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
        // const menuEntity: any = document.querySelector('#menu');
        // menuEntity.object3D.visible = !menuEntity.object3D.visible;

        // if (menuEntity.object3D.visible) // Add class for raycaster.
        //     menuEntity.setAttribute('class', 'clickable');
        // else // Remove class for raycaster.
        //     menuEntity.removeAttribute('class');

        this.menuEl.object3D.visible = !this.menuEl.object3D.visible;

        if (this.menuEl.object3D.visible) // Add class for raycaster.
            this.menuEl.setAttribute('class', 'clickable');
        else // Remove class for raycaster.
            this.menuEl.removeAttribute('class');
    }

    // The listener when the UI obj is loaded.
    onModelLoaded(event): void{
        const menuEntity: any = document.querySelector('#menu');
        let model = menuEntity.getObject3D('mesh');
        model = event.detail.model;

        // Check the model format and whether it is empty.
        if (event.detail.format !== 'obj' || !model.getObjectByName('brightnesscursor')) {return;}

        const objects: any = {};
        objects.brightnessCursor = model.getObjectByName('brightnesscursor');
        objects.brightnessSlider = model.getObjectByName('brightness');
        objects.brightnessSlider.geometry.computeBoundingBox();
        

    }
}

export default Menu;