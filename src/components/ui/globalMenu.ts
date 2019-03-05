declare const THREE:any;

const globalMenu = {
    schema: {
        selectedContainerId: {type: 'string', default: "container1"}
    },

    init: function(): void {
        // The sub-menu elements' names in the 3D obj.
        this.subMenuNames = ['huecursor', 'hue', 'currentcolor', 'menu', 'submenu1', 'submenu2', 'submenu3', 'description', 'button1', 'button2', 'button3', 'button4', 'button5', 'button6', 'button7', 'button8', 'button9', 'undo', 'redo'];
        // The corresponding model thumbnails in the buttons.
        this.modelThumbnails = ['random color', 'box', 'color filter', 'sphere', 'acceleration filter', 'velocity filter', 'vector', 'plus operator', 'subtract operator'];

        // Create a menu entity and append it to the controller.
        const menuEntity: any = this.menuEl = document.createElement('a-entity');
        this.el.appendChild(menuEntity);
        menuEntity.setAttribute('id', 'global-menu'); 

        this.loadModelGroup();
        this.createSubEntity();
        this.initThumbnailDescription();
        this.initTextLabel();
        this.loadContainerAndThumbnail(this.modelThumbnails.length);

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
            // Set a different material component for currentcolor.
            if (subMenuName == "currentcolor") {
                subMenuEl.setAttribute('material', {
                    color: '#ffffff',
                    flatShading: true,
                    shader: 'flat',
                    transparent: false
                });
            }
            else if (subMenuName == 'hue' || subMenuName == 'huecursor') {
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

    // Load description of thumbnails panel.
    initThumbnailDescription(): void {
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
        this.setThumbnailDescription(this.data.selectedContainerId);
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

    // Load the thumbnails of the buttons to chose from.
    loadContainerAndThumbnail(buttonNum: number): void {
        const xOffset: number = 0.03;
        const yOffset: number = 0;
        const zOffset: number = 0.03;
        for (let i=0; i<buttonNum; i++) {
            // Create sub-menu entity.
            const ContainerEl: any = document.createElement('a-entity');
            this.menuEl.appendChild(ContainerEl);
            ContainerEl.setAttribute('id', "container"+i.toString());
            ContainerEl.classList.add('ui', 'container');

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

            // Handle material&description when hover.
            ContainerEl.addEventListener('raycaster-intersected', (event) => {
                event.stopPropagation();
                ContainerEl.setAttribute('material', 'color', '#FF69B4'); 
                this.setThumbnailDescription(ContainerEl.getAttribute('id'));
            })

            // Handle material&description when hover cleared.
            ContainerEl.addEventListener('raycaster-intersected-cleared', (event) => {
                event.stopPropagation();
                if (ContainerEl.getAttribute('id') != this.data.selectedContainerId) {
                    ContainerEl.setAttribute('material', 'color', '#FFFFFF'); 
                    this.setThumbnailDescription(this.data.selectedContainerId);
                }
            })

            ContainerEl.object3D.position.set(-0.13 + xOffset*(i%3), 0.015 + yOffset*(i%3), -0.03 + zOffset*Math.floor(i/3));
            this.loadModelThumbnail(ContainerEl, i);
        }

        this.setSelectedButtonId('container1');
    },

    // Load the model thumbnail of the model i to be displayed in containers.
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
            case 3: {
                modelThumbnailEntity.setAttribute('geometry', {
                    primitive: 'sphere',
                    radius: 0.01
                });
                break;
            }
            case 4: {
                modelThumbnailEntity.setAttribute('geometry', {
                    primitive: 'cone',
                    height: 0.015,
                    radiusBottom: 0.01,
                    radiusTop: 0.005
                });
                modelThumbnailEntity.object3D.rotation.set(0, 0, THREE.Math.degToRad(270));
                break;
            }
            case 5: {
                modelThumbnailEntity.setAttribute('geometry', {
                    primitive: 'cone',
                    height: 0.015,
                    radiusBottom: 0.01,
                    radiusTop: 0.005
                });
                modelThumbnailEntity.object3D.rotation.set(0, 0, THREE.Math.degToRad(270));
                break;
            }
            case 6: {
                // modelThumbnailEntity.setAttribute('obj-model', 'obj', '#arrow-obj');
                // modelThumbnailEntity.object3D.scale.set(0.0005, 0.0005, 0.0005);
                // break;
            }
        }
        
        modelThumbnailEntity.setAttribute('material', {
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

    // Set description of the panel.
    setThumbnailDescription(_buttonId: string): void {
        const id: string = _buttonId.substr(-1, 1);
        const idNum: number = Number(id);

        const thumbDescripEl: any = document.querySelector('#description_text');
        thumbDescripEl.setAttribute('text', 'value', this.modelThumbnails[idNum]);
    },

    // ==========Also for external call.==========
    // Set the selected button id.
    setSelectedButtonId: function(_id: string): void {
        if (this.data.selectedContainerId) {
            const lastSelectedContainer: any = document.querySelector('#' + this.data.selectedContainerId);
            lastSelectedContainer.setAttribute('material', 'color', '#FFFFFF');

            const id: string = this.data.selectedContainerId.substr(-1, 1);
            const idNum: number = Number(id);
            const lastSelectedButton: any = document.querySelector('#Button' + String(idNum+1));

            this.data.selectedContainerId = _id;
            
            lastSelectedButton.emit('raycaster-intersected-cleared');
        }

        this.data.selectedContainerId = _id;
        const currentSelectedButton: any = document.querySelector('#' + this.data.selectedContainerId);
        currentSelectedButton.setAttribute('material', 'color', '#FF69B4');

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