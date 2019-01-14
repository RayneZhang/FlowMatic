declare const THREE:any;

const globalMenu = {
    init: function(): void {
        // The sub-menu elements' names in the 3D obj.
        this.subMenuNames = ['brushprev', 'brushnext', 'huecursor', 'hue'];
        // The selected button id.
        this.selectedButtonId = 'button1';

        // The cursor is centered in 0,0 to allow scale it easily.
        // This is the offset to put it back in its original position on the slider.
        // cursorOffset = new THREE.Vector3(0.06409, 0.01419, -0.10242);

        // Create a menu entity and append it to the controller.
        const menuEntity: any = this.menuEl = document.createElement('a-entity');
        this.el.appendChild(menuEntity);
        menuEntity.setAttribute('id', this.el.getAttribute('id') + 'menu'); 

        this.loadModelGroup();
        this.createSubMenuEl();
        this.loadButtonThumbnail(3);
        // this.updateSizeSlider();

        // menuEntity.setAttribute('rotation', '45 0 0');
        menuEntity.setAttribute('position', '0 0 -0.15');
        // Set the visibility of the menu entity as false at the beginning.
        menuEntity.object3D.visible = false;

        // Event Listener to open and close menu.
        this.el.addEventListener('xbuttondown', this.onXButtonDown.bind(this));
    },

    tick: function(time, timeDelta): void {

    },

    // Load an entity just for importing 3D obj.
    loadModelGroup(): void {
        const sceneEl = document.querySelector('a-scene');
        const modelGroup: any = document.createElement('a-entity');
        sceneEl.appendChild(modelGroup);
        modelGroup.setAttribute('id', 'modelGroup');
        modelGroup.setAttribute('obj-model', 'obj:#menu-obj');
        modelGroup.object3D.visible = false;
    },

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
    },

    // The listener when x-button is down.
    onXButtonDown(event): void {
        this.menuEl.object3D.visible = !this.menuEl.object3D.visible;

        // if (this.menuEl.object3D.visible) // Add class for raycaster.
        //     this.menuEl.setAttribute('class', 'clickable');
        // else // Remove class for raycaster.
        //     this.menuEl.removeAttribute('class');
    },

    // Load the thumbnails of the buttons to chose from.
    loadButtonThumbnail(buttonNum: number): void {
        const xOffset: number = 0.05;
        const yOffset: number = -0.005;
        const zOffset: number = 0.05;
        for (let i=0; i<buttonNum; i++) {
            // Create sub-menu entity.
            const ButtonEl: any = document.createElement('a-entity');
            this.menuEl.appendChild(ButtonEl);
            ButtonEl.setAttribute('id', "button"+i.toString());
            ButtonEl.classList.add('ui', 'thumbnail');

            // Add geometry component to the entity.
            ButtonEl.setAttribute('geometry', {
                primitive: 'sphere',
                radius: 0.02
            }); 

            // Add the same material component of the sub-menu entity.
            ButtonEl.setAttribute('material', {
                color: '#B0B0B0',
                flatShading: true,
                shader: 'flat',
                transparent: true,
                opacity: 0.3,
                fog: false
            });

            // Handle material when hover.
            ButtonEl.addEventListener('raycaster-intersected', (event) => {
                event.stopPropagation();
                ButtonEl.setAttribute('material', 'color', '#FF69B4'); 
            })

            // Handle material when hover cleared.
            ButtonEl.addEventListener('raycaster-intersected-cleared', (event) => {
                event.stopPropagation();
                if (ButtonEl.getAttribute('id') != this.selectedButtonId)
                    ButtonEl.setAttribute('material', 'color', '#B0B0B0'); 
            })

            ButtonEl.object3D.position.set(-0.155 + xOffset*(i%2), 0.015 + yOffset*(i%2), -0.065 + zOffset*Math.floor(i/2));
            this.loadModelThumbnail(ButtonEl, i);
        }
    },

    // Load the thumbnails of the models to display in buttons.
    loadModelThumbnail(appendEl: any, iteration: number): void {
        if (iteration > 0) return;
        const modelThumbnailEntity: any = document.createElement('a-entity');
        appendEl.appendChild(modelThumbnailEntity);
        modelThumbnailEntity.setAttribute('obj-model', 'obj', '#bottle-thumbnail');
        modelThumbnailEntity.setAttribute('material', {
            color: '#87ceeb',
            flatShading: true,
            shader: 'flat',
            transparent: true,
            fog: false,
            opacity: 0.7
        });
        modelThumbnailEntity.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
        modelThumbnailEntity.object3D.scale.set(0.05, 0.05, 0.05);
    }
}

export default globalMenu;