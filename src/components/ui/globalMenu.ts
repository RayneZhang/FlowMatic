declare const THREE:any;

const globalMenu = {
    init: function(): void {
        // The sub-menu elements' names in the 3D obj.
        this.subMenuNames = ['brushprev', 'brushnext', 'huecursor', 'hue'];
        // The corresponding model thumbnails in the buttons.
        this.modelThumbnails = ['bottle', 'box', 'cone'];
        // The selected button id.
        this.selectedButtonId = 'button1';

        // The cursor is centered in 0,0 to allow scale it easily.
        // This is the offset to put it back in its original position on the slider.
        // cursorOffset = new THREE.Vector3(0.06409, 0.01419, -0.10242);

        // Create a menu entity and append it to the controller.
        const menuEntity: any = this.menuEl = document.createElement('a-entity');
        this.el.appendChild(menuEntity);
        menuEntity.setAttribute('id', 'global_menu'); 

        this.loadModelGroup();
        this.createSubMenuEl();
        this.loadButtonThumbnail(this.modelThumbnails.length);
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

            // Add the s2ame material component of the sub-menu entity.
            ButtonEl.setAttribute('material', {
                color: '#FFFFFF',
                flatShading: true,
                shader: 'flat',
                transparent: true,
                opacity: 0.4,
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
                    ButtonEl.setAttribute('material', 'color', '#FFFFFF'); 
            })

            ButtonEl.object3D.position.set(-0.155 + xOffset*(i%2), 0.015 + yOffset*(i%2), -0.065 + zOffset*Math.floor(i/2));
            this.loadModelThumbnail(ButtonEl, i);
        }

        this.setSelectedButtonId('button1');
    },

    // Load the thumbnails of the models to display in buttons.
    loadModelThumbnail(appendEl: any, buttonNum: number): void {
        const modelThumbnailEntity: any = document.createElement('a-entity');
        appendEl.appendChild(modelThumbnailEntity);

        switch (buttonNum) {
            case 0: {
                modelThumbnailEntity.setAttribute('obj-model', 'obj', '#bottle-thumbnail');
                
                modelThumbnailEntity.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
                modelThumbnailEntity.object3D.scale.set(0.05, 0.05, 0.05);
                break;
            }
            case 1: {
                modelThumbnailEntity.setAttribute('geometry', {
                    primitive: 'box',
                    width: 0.015,
                    height: 0.015,
                    depth: 0.015
                });
                break;
            }
            case 2: {
                modelThumbnailEntity.setAttribute('geometry', {
                    primitive: 'cone',
                    height: 0.015,
                    radiusBottom: 0.01,
                    radiusTop: 0.005
                });
                modelThumbnailEntity.object3D.rotation.set(0, 0, THREE.Math.degToRad(270));
                break;
            }
        }
        
        modelThumbnailEntity.setAttribute('material', {
            color: '#87ceeb',
            transparent: true,
            fog: false,
            opacity: 0.8
        });
    },

    // Calculate the radius of the object.
    calRadius(obj): number {
        const mesh = obj.getObject3D('mesh');
        if (!mesh) {
            return 0;
        }

        const box = new THREE.Box3().setFromObject(mesh);
        const size = box.getSize();
        const extent = Math.max(size.x, size.y, size.z) / 2;
        const radius = Math.sqrt(2) * extent;
        
        return radius;
    },

    // Set the selected button id.
    setSelectedButtonId: function(_id: string): void {
        if (this.selectedButtonId) {
            const lastSelectedButton: any = document.querySelector('#' + this.selectedButtonId);
            lastSelectedButton.setAttribute('material', 'color', '#FFFFFF');
        }

        this.selectedButtonId = _id;
        const currentSelectedButton: any = document.querySelector('#' + this.selectedButtonId);
        currentSelectedButton.setAttribute('material', 'color', '#FF69B4');

        const leftHand: any = document.querySelector('#leftHand');
        leftHand.setAttribute('left-trigger-listener', 'targetModel', 'bottle');
    }
}

export default globalMenu;