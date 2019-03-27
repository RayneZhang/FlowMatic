declare const THREE:any;

const globalMenu = {
    schema: {
        selectedSubMenuId: {type: 'number', default: 0},
        selectedButtonId: {type: 'number', default: 0}
    },

    init: function(): void {
        this.containerRadius = 0.015;
        // The sub-menu elements' names in the 3D obj.
        this.subEntitiesNames = ['huecursor', 'hue', 'currentcolor', 'submenu1', 'submenu2', 'submenu3', 'submenu4', 'submenu5', 'description', 'button1', 'button2', 'button3', 'button4', 'button5', 'button6', 'button7', 'button8', 'button9', 'undo', 'redo'];
        // The corresponding submenus in the buttons.
        this.subMenu = {'Data': ['Random Color'], 'Operators': ['Darkness', 'Acceleration', 'Velocity', 'Plus', 'Subtract', 'Vector2Number', 'Number2Vector', 'Condition: Bool', 'Condition: A > B'], 'Assets': ['Box', 'Sphere', 'Vector', 'Switch', 'Slider'], 'Lights': ['Light'], 'Avatars': ['Headset', 'Left Controller', 'Right Controller']};

        
        // Create a menu entity and append it to the controller.
        const menuEntity: any = this.menuEl = document.createElement('a-entity');
        this.el.appendChild(menuEntity);
        menuEntity.setAttribute('id', 'global-menu'); 

        this.loadModelGroup();
        this.createSubEntity();
        this.initTextLabel();
        this.initInstanceDescription();
        this.setSelectedSubMenuId(0);

        menuEntity.setAttribute('position', '0 0 -0.15');
        // Set the visibility of the menu entity as false at the beginning.
        menuEntity.object3D.visible = false;

        // Event Listener to open and close menu.
        const listeningEl = document.querySelector('#leftHand');
        listeningEl.addEventListener('xbuttondown', this.onXButtonDown.bind(this));
    },

    tick: function(time, timeDelta): void {

    },

    // ==========For internal call only.==========

    // Load an entity just for importing 3D obj.
    loadModelGroup(): void {
        const sceneEl = document.querySelector('a-scene');
        const modelGroup: any = document.createElement('a-entity');
        sceneEl.appendChild(modelGroup);
        modelGroup.setAttribute('id', 'modelGroup');
        modelGroup.setAttribute('obj-model', 'obj:#menu-obj');
        modelGroup.object3D.visible = false;
    },

    dismissModelGroup(): void {
        const modelGroup: any = document.querySelector('#modelGroup');
        modelGroup.parentNode.removeChild(modelGroup);
    },

    // Create sub entities based on the modelGroup, setting geometry and material. 
    createSubEntity(): void {
        const modelGroup = document.querySelector('#modelGroup');
        for (const subEntityName of this.subEntitiesNames) {
            // Create sub-menu entity.
            const subMenuEl: any = document.createElement('a-entity');
            this.menuEl.appendChild(subMenuEl);
            subMenuEl.setAttribute('id', subEntityName);
            subMenuEl.setAttribute('class', 'ui');
            subMenuEl.setAttribute('model-subset', {
                target: modelGroup,
                name: subEntityName
            });
            // Set a different material component for currentcolor.
            if (subEntityName == "currentcolor") {
                subMenuEl.setAttribute('material', {
                    color: '#ffffff',
                    flatShading: true,
                    shader: 'flat',
                    transparent: false
                });
            }
            else if (subEntityName == 'hue' || subEntityName == 'huecursor') {
                subMenuEl.setAttribute('material', {
                    color: '#ffffff',
                    flatShading: true,
                    shader: 'flat',
                    transparent: true,
                    fog: false,
                    src: '#uinormal'
                });
            }
            else {
                subMenuEl.setAttribute('material', {
                    color: '#22313f',
                    flatShading: true,
                    shader: 'flat',
                    transparent: true
                });
            }
        }
    },

    // Load description of undo/redo button.
    initTextLabel(): void {
        const undoLabel: any = document.createElement('a-entity');
        const undoEl: any = document.querySelector("#undo");
        const redoLabel: any = document.createElement('a-entity');
        const redoEl: any = document.querySelector("#redo");
        undoEl.appendChild(undoLabel);
        redoEl.appendChild(redoLabel);

        // Initiate tht panel content.
        undoLabel.setAttribute('text', {
            value: 'Undo',
            wrapCount: 200,
            align: 'center'
        });
        // Initiate tht panel content.
        redoLabel.setAttribute('text', {
            value: 'Redo',
            wrapCount: 200,
            align: 'center'
        });

        // Set the description rotation.
        undoLabel.object3D.rotation.x += THREE.Math.degToRad(-90);
        redoLabel.object3D.rotation.x += THREE.Math.degToRad(-90);
        // Set the description position.
        undoLabel.object3D.position.set(-0.145, 0, 0.06);
        redoLabel.object3D.position.set(-0.1, 0, 0.06);
    },

    // Load description of thumbnails panel.
    initInstanceDescription(): void {
        // Create thumbnail description entity.
        const descripText: any = document.createElement('a-entity');
        const descripEl: any = document.querySelector("#description");
        descripEl.appendChild(descripText);
        descripText.setAttribute('id', "description_text");

        // Initiate tht panel content.
        descripText.setAttribute('text', {
            value: '',
            wrapCount: 200,
            align: 'center'
        });

        // Set the description rotation.
        descripText.object3D.rotation.x += THREE.Math.degToRad(-90);
        // Set the description position.
        descripText.object3D.position.set(-0.1, 0, -0.055);

        // Set the value of the description.
        this.setInstanceDescription(this.data.selectedButtonId);
    },

    // Load the thumbnails of the buttons to chose from.
    loadContainerAndInstance(_containerNum: number): void {
        // Put all containers and instances under one entity for the sake of deleting and regenerating.
        const containersEl: any = document.createElement('a-entity');
        this.menuEl.appendChild(containersEl);
        containersEl.setAttribute('id', "containers");

        const xOffset: number = 0.03;
        const yOffset: number = 0;
        const zOffset: number = 0.03;
        for (let i=0; i<_containerNum; i++) {
            // Create sub-menu entity.
            const childContainerEl: any = document.createElement('a-entity');
            containersEl.appendChild(childContainerEl);
            childContainerEl.setAttribute('id', "container"+i.toString());

            // Add geometry component to the entity.
            childContainerEl.setAttribute('geometry', {
                primitive: 'sphere',
                radius: this.containerRadius
            }); 

            // Add the s2ame material component of the sub-menu entity.
            childContainerEl.setAttribute('material', {
                color: '#FFFFFF',
                flatShading: true,
                shader: 'flat',
                transparent: true,
                opacity: 0.05,
                fog: false
            });

            childContainerEl.object3D.position.set(-0.13 + xOffset*(i%3), 0.015 + yOffset*(i%3), -0.03 + zOffset*Math.floor(i/3));
            this.loadModelInstance(childContainerEl, i);
        }

        this.setSelectedButtonId(0);
    },

    // Load the model thumbnail of the model i to be displayed in containers.
    loadModelInstance(_appendEl: any, _buttonId: number): void {
        const modelInstanceEntity: any = document.createElement('a-entity');
        _appendEl.appendChild(modelInstanceEntity);
        const subMenuName: string = Object.keys(this.subMenu)[this.data.selectedSubMenuId];
        const instanceName: string = this.subMenu[subMenuName][_buttonId];
        switch (instanceName) {
            case 'Random Color': {
                modelInstanceEntity.setAttribute('obj-model', 'obj', '#bottle-instance');
                
                modelInstanceEntity.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
                modelInstanceEntity.object3D.scale.set(0.05, 0.05, 0.05);
                break;
            }
            case 'Darkness': case 'Acceleration': case 'Velocity': case 'Plus': case 'Subtract': case 'Condition: Bool': case 'Condition: A > B': case 'Vector2Number': case 'Number2Vector':{
                modelInstanceEntity.setAttribute('geometry', {
                    primitive: 'cone',
                    height: 0.015,
                    radiusBottom: 0.01,
                    radiusTop: 0.005
                });
                modelInstanceEntity.object3D.rotation.set(0, 0, THREE.Math.degToRad(270));
                break;
            }
            case 'Box': {
                modelInstanceEntity.setAttribute('geometry', {
                    primitive: 'box',
                    width: 0.015,
                    height: 0.015,
                    depth: 0.015
                });
                break;
            }
            case 'Sphere': {
                modelInstanceEntity.setAttribute('geometry', {
                    primitive: 'sphere',
                    radius: 0.01
                });
                break;
            }
            case 'Switch': {
                modelInstanceEntity.setAttribute('obj-model', 'obj', '#switch-instance');
                modelInstanceEntity.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
                break;
            }
            case 'Slider': {
                modelInstanceEntity.setAttribute('obj-model', 'obj', '#slider-instance');
                modelInstanceEntity.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
                break;
            }
            case 'Light': {
                modelInstanceEntity.setAttribute('obj-model', 'obj', '#light-01-instance');
                modelInstanceEntity.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
                break;
            }
            case 'Headset': {
                modelInstanceEntity.setAttribute('obj-model', 'obj', '#headset-instance');
                modelInstanceEntity.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
                break;
            }
            case 'Left Controller': {
                modelInstanceEntity.setAttribute('obj-model', 'obj', '#controller-left-instance');
                modelInstanceEntity.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
                break;
            }
            case 'Right Controller': {
                modelInstanceEntity.setAttribute('obj-model', 'obj', '#controller-right-instance');
                modelInstanceEntity.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
                break;
            }
        }
        
        modelInstanceEntity.setAttribute('material', {
            color: '#87ceeb',
            transparent: true,
            fog: false,
            opacity: 0.8
        });
    },

    // The listener when x-button is down.
    onXButtonDown(event): void {
        this.menuEl.object3D.visible = !this.menuEl.object3D.visible;
    },

    // ==========Also for external call.==========
    // Set description of the panel.
    setInstanceDescription(_buttonId: number): void {
        const thumbDescripEl: any = document.querySelector('#description_text');
        const subMenuName: string = Object.keys(this.subMenu)[this.data.selectedSubMenuId];
        const instanceName: string = this.subMenu[subMenuName][_buttonId];
        if (!instanceName) {
            // console.log('The selected button is out of range. buttonId: ' + _buttonId);
            return;
        }
        else
            thumbDescripEl.setAttribute('text', 'value', instanceName);
    },

    setSubMenuDescription(_buttonId: number): void {
        const thumbDescripEl: any = document.querySelector('#description_text');
        const subMenuName: string = Object.keys(this.subMenu)[_buttonId];
        thumbDescripEl.setAttribute('text', 'value', subMenuName);
    },
    
    // Set the selected button id.
    setSelectedButtonId: function(_buttonId: number): void {
        // Check if selected button id is out of range.
        const subMenuName: string = Object.keys(this.subMenu)[this.data.selectedSubMenuId];
        if (_buttonId >= this.subMenu[subMenuName].length) {
            return;
        }

        if (this.data.selectedButtonId >= 0) {
            // Manually raycaster intersected cleared.
            const lastSelectedButton: any = document.querySelector('#button' + String(this.data.selectedButtonId+1));
            lastSelectedButton.setAttribute('material', 'color', '#22313f');
        }
        this.data.selectedButtonId = _buttonId;
        this.setInstanceDescription(_buttonId);
        
        // Add responsive color to the button.
        const currentSelectedButton: any = document.querySelector('#button' + String(this.data.selectedButtonId+1));
        currentSelectedButton.setAttribute('material', 'color', '#22a7f0');

        // Pass the id for left hand to create the corresponding object.
        const instanceName: string = this.subMenu[subMenuName][_buttonId];
        const leftHand: any = document.querySelector('#leftHandInfo');
        leftHand.setAttribute('left-trigger-listener', 'targetModel', instanceName);
    },

    // Set the selected subMenu id.
    setSelectedSubMenuId: function(_buttonId: number): void {
        if (this.data.selectedSubMenuId >= 0) {
            // Manually raycaster intersected cleared.
            const lastSelectedSubMenu: any = document.querySelector('#submenu' + String(this.data.selectedSubMenuId+1));
            lastSelectedSubMenu.setAttribute('material', 'color', '#22313f');
        }
        this.data.selectedSubMenuId = _buttonId;
        this.setInstanceDescription(_buttonId);

        // Add responsive color to the button.
        const currentSelectedSubMenu: any = document.querySelector('#submenu' + String(this.data.selectedSubMenuId+1));
        currentSelectedSubMenu.setAttribute('material', 'color', '#22a7f0');

        // Reload containers and instances.
        this.reloadContainerAndInstance();
    },

    // Set current color for reference.
    setCurrentColor(_color: string): void {
        const currentColor: any = document.querySelector('#currentcolor');
        currentColor.setAttribute('material', 'color', _color);
    },

    // Reload the buttons.
    reloadContainerAndInstance(): void {
        // Remove previous containers and instances.
        const containersEl: any = document.querySelector('#containers');
        if (containersEl)
            containersEl.parentNode.removeChild(containersEl);

        // Load the containers and instances again.
        const subMenuName: string = Object.keys(this.subMenu)[this.data.selectedSubMenuId];
        this.loadContainerAndInstance(this.subMenu[subMenuName].length);
    }
}

export default globalMenu;