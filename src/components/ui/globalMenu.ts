declare const THREE:any;

const globalMenu = {
    schema: {
        selectedSubMenuId: {type: 'number', default: 1},
        selectedButtonId: {type: 'number', default: 0}
    },

    init: function(): void {
        // The sub-menu elements' names in the 3D obj.
        this.subEntitiesNames = ['huecursor', 'hue', 'currentcolor', 'submenu1', 'submenu2', 'submenu3', 'description', 'button1', 'button2', 'button3', 'button4', 'button5', 'button6', 'button7', 'button8', 'button9', 'undo', 'redo'];
        // The corresponding instances in the buttons.
        this.instanceNames = ['Random Color', 'Box', 'Color Operator', 'Sphere', 'Acceleration', 'Velocity', 'Vector', 'Plus', 'Subtract'];
        // The corresponding submenus in the buttons.
        this.subMenu = {'Data': ['Random Color'], 'Operators': ['Color Operator', 'Acceleration', 'Velocity', 'Plus', 'Subtract'], 'Assets': ['Box', 'Sphere', 'Vector']};
        

        // Create a menu entity and append it to the controller.
        const menuEntity: any = this.menuEl = document.createElement('a-entity');
        this.el.appendChild(menuEntity);
        menuEntity.setAttribute('id', 'global-menu'); 

        this.loadModelGroup();
        this.createSubEntity();
        this.initTextLabel();
        this.initInstanceDescription();
        // this.loadContainerAndInstance(this.instanceNames.length);

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
        this.setInstanceDescription(this.data.selectedSubMenuId, this.data.selectedButtonId);
    },

    // Load the thumbnails of the buttons to chose from.
    loadContainerAndInstance(buttonNum: number): void {
        const xOffset: number = 0.03;
        const yOffset: number = 0;
        const zOffset: number = 0.03;
        for (let i=0; i<buttonNum; i++) {
            // Create sub-menu entity.
            const ContainerEl: any = document.createElement('a-entity');
            this.menuEl.appendChild(ContainerEl);
            ContainerEl.setAttribute('id', "container"+i.toString());

            // Add geometry component to the entity.
            ContainerEl.setAttribute('geometry', {
                primitive: 'sphere',
                radius: 0.015
            }); 

            // Add the s2ame material component of the sub-menu entity.
            ContainerEl.setAttribute('material', {
                color: '#FFFFFF',
                flatShading: true,
                shader: 'flat',
                transparent: true,
                opacity: 0.05,
                fog: false
            });

            ContainerEl.object3D.position.set(-0.13 + xOffset*(i%3), 0.015 + yOffset*(i%3), -0.03 + zOffset*Math.floor(i/3));
            this.loadModelInstance(ContainerEl, i);
        }

        this.setSelectedButtonId(0);
    },

    // Load the model thumbnail of the model i to be displayed in containers.
    loadModelInstance(appendEl: any, buttonNum: number): void {
        const modelInstanceEntity: any = document.createElement('a-entity');
        appendEl.appendChild(modelInstanceEntity);

        switch (buttonNum) {
            case 0: {
                modelInstanceEntity.setAttribute('obj-model', 'obj', '#bottle-thumbnail');
                
                modelInstanceEntity.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
                modelInstanceEntity.object3D.scale.set(0.05, 0.05, 0.05);
                break;
            }
            case 1: {
                modelInstanceEntity.setAttribute('geometry', {
                    primitive: 'box',
                    width: 0.015,
                    height: 0.015,
                    depth: 0.015
                });
                break;
            }
            case 2: {
                modelInstanceEntity.setAttribute('geometry', {
                    primitive: 'cone',
                    height: 0.015,
                    radiusBottom: 0.01,
                    radiusTop: 0.005
                });
                modelInstanceEntity.object3D.rotation.set(0, 0, THREE.Math.degToRad(270));
                break;
            }
            case 3: {
                modelInstanceEntity.setAttribute('geometry', {
                    primitive: 'sphere',
                    radius: 0.01
                });
                break;
            }
            case 4: {
                modelInstanceEntity.setAttribute('geometry', {
                    primitive: 'cone',
                    height: 0.015,
                    radiusBottom: 0.01,
                    radiusTop: 0.005
                });
                modelInstanceEntity.object3D.rotation.set(0, 0, THREE.Math.degToRad(270));
                break;
            }
            case 5: {
                modelInstanceEntity.setAttribute('geometry', {
                    primitive: 'cone',
                    height: 0.015,
                    radiusBottom: 0.01,
                    radiusTop: 0.005
                });
                modelInstanceEntity.object3D.rotation.set(0, 0, THREE.Math.degToRad(270));
                break;
            }
            case 6: {
                // modelInstanceEntity.setAttribute('obj-model', 'obj', '#arrow-obj');
                // modelInstanceEntity.object3D.scale.set(0.0005, 0.0005, 0.0005);
                // break;
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
        thumbDescripEl.setAttribute('text', 'value', this.subMenuNames[_buttonId]);
    },
    
    // Set the selected button id.
    setSelectedButtonId: function(_id: number): void {
        if (this.data.selectedButtonId) {
            const lastSelectedButton: any = document.querySelector('#button' + String(this.data.selectedButtonId+1));
            this.data.selectedButtonId = _id;
            lastSelectedButton.emit('raycaster-intersected-cleared');
        }
        else
            this.data.selectedButtonId = _id;
        
        // Add responsive color to the button.
        const currentSelectedButton: any = document.querySelector('#button' + String(this.data.selectedButtonId+1));
        currentSelectedButton.setAttribute('material', 'color', '#22a7f0');

        // Pass the id for left hand to create the corresponding object.
        const leftHand: any = document.querySelector('#leftHandInfo');
        leftHand.setAttribute('left-trigger-listener', 'targetModel', _id);
    },

    // Set current color for reference.
    setCurrentColor(_color: string): void {
        const currentColor: any = document.querySelector('#currentcolor');
        currentColor.setAttribute('material', 'color', _color);
    }
}

export default globalMenu;