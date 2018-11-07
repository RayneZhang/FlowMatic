declare const THREE:any;

class Menu {

    // Assigned in constructor as menu entity. Will be referred by many functions.
    menuEl: any = undefined;
    // The sub-menu elements' names in the 3D obj.
    subMenuNames: any = ['brushprev', 'brushnext', 'huecursor', 'hue', 'sizebg'];

    // The cursor is centered in 0,0 to allow scale it easily.
    // This is the offset to put it back in its original position on the slider.
    // cursorOffset = new THREE.Vector3(0.06409, 0.01419, -0.10242);

    constructor(AppendEl: any) {
        // Create a menu entity and append it to the controller.
        const menuEntity: any = this.menuEl = document.createElement('a-entity');
        AppendEl.appendChild(menuEntity);
        menuEntity.setAttribute('id', AppendEl.getAttribute('id') + 'menu'); 

        this.loadModelGroup();
        this.createSubMenuEl();
        // this.updateSizeSlider();

        menuEntity.setAttribute('rotation', '45 0 0');
        menuEntity.setAttribute('position', '0 0.13 -0.08');
        // Set the visibility of the menu entity as false at the beginning.
        menuEntity.object3D.visible = false;

        // Event Listener to open and close menu.
        AppendEl.addEventListener('xbuttondown', this.onXButtonDown.bind(this));
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
            subMenuEl.setAttribute('class', 'ui');
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
}

export default Menu;