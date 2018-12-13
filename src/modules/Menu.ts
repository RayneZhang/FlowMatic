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
        this.loadButtonThumbnail(2);
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
        modelGroup.setAttribute('obj-model', 'obj:#menu-obj');
        modelGroup.object3D.visible = false;
    }

    // Create sub-menu entities based on the modelGroup. 
    createSubMenuEl(): void {
        const modelGroup = document.querySelector('#modelGroup');
        for (const subMenuName of this.subMenuNames) {
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

    loadButtonThumbnail(buttonNum: number): void {
        const modelGroup = document.querySelector('#modelGroup');
        modelGroup.addEventListener('model-loaded', (event: any) => {
            for (let i=0; i<buttonNum; i++) {
                // Create sub-menu entity.
                const ButtonEl: any = document.createElement('a-entity');
                this.menuEl.appendChild(ButtonEl);
                ButtonEl.setAttribute('id', "brush"+i.toString());
                ButtonEl.setAttribute('class', 'ui');

                const model = event.detail.model;
                // Check the model format and whether it is empty.
                if (event.detail.format !== 'obj' || !model.getObjectByName('huecursor')) {return;}
                const subset = model.getObjectByName("brush"+i.toString());
                const subset_fg = model.getObjectByName("brush"+i.toString()+"fg");
                const subset_bg = model.getObjectByName("brush"+i.toString()+"bg");
                ButtonEl.setObject3D('mesh', subset.clone());
                ButtonEl.setObject3D('mesh_fg', subset_fg.clone());
                ButtonEl.setObject3D('mesh_bg', subset_bg.clone());

                // Add the same material component of the sub-menu entity.
                ButtonEl.setAttribute('material', {
                    color: '#000000',
                    flatShading: true,
                    shader: 'flat',
                    transparent: false,
                    fog: false
                    // src: '#brush'
                });
            }
        });
    }
}

export default Menu;