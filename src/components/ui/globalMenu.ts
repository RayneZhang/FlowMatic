import * as AFRAME from 'aframe';
import { Math as THREEMath } from 'three';
import { objects } from '../../Objects';
import { Item } from './Canvas';
import { resize } from '../../utils/SizeConstraints';

const globalMenu = AFRAME.registerComponent('global-menu', {
    schema: {
        selectedButtonId: {type: 'number', default: 0},
        pageNumber: {type: 'number', default: 0}
    },

    init: function(): void {
        this.containerRadius = 0.015;
        // The sub-menu elements' names in the 3D obj.
        this.subEntitiesNames = ['huecursor', 'hue', 'currentcolor', 'description', 'button1', 'button2', 'button3', 'button4', 'button5', 'button6', 'button7', 'button8', 'button9', 'run', 'stop', 'prev', 'next'];
        
        // Create a menu entity and append it to the controller.
        const menuEntity: any = this.menuEl = document.createElement('a-entity');
        menuEntity.setAttribute('id', 'global-menu'); 
        this.el.appendChild(menuEntity);
        menuEntity.setAttribute('position', '0 0 -0.15');
        // Set the visibility of the menu entity as false at the beginning.
        menuEntity.object3D.visible = false;
        
        this.loadModelGroup();
        this.createSubEntity();
        this.initTextLabel();
        this.initInstanceDescription();
        this.loadItems(0);

        // Event Listener to open and close menu.
        const listeningEl = document.querySelector('#leftHand');
        listeningEl.addEventListener('xbuttondown', this.onXButtonDown.bind(this));

        // this.el.addEventListener('model-loaded', (event) => {
        //     event.stopPropagation();
        // });
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

    // Load description of run & stop button.
    initTextLabel(): void {
        const runLabel: any = document.createElement('a-entity');
        const runEl: any = document.querySelector("#run");
        const stopLabel: any = document.createElement('a-entity');
        const stopEl: any = document.querySelector("#stop");
        runEl.appendChild(runLabel);
        stopEl.appendChild(stopLabel);

        // Initiate tht panel content.
        runLabel.setAttribute('text', {
            value: 'Undo',
            wrapCount: 200,
            align: 'center'
        });
        // Initiate tht panel content.
        stopLabel.setAttribute('text', {
            value: 'Redo',
            wrapCount: 200,
            align: 'center'
        });

        // Set the description rotation.
        runLabel.object3D.rotation.x += THREEMath.degToRad(-90);
        stopLabel.object3D.rotation.x += THREEMath.degToRad(-90);
        // Set the description position.
        runLabel.object3D.position.set(-0.145, 0, 0.06);
        stopLabel.object3D.position.set(-0.1, 0, 0.06);
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
        descripText.object3D.rotation.x += THREEMath.degToRad(-90);
        // Set the description position.
        descripText.object3D.position.set(-0.1, 0, -0.055);

        // Set the value of the description.
        this.setInstanceDescription(this.data.selectedButtonId);
    },

    // Load the thumbnails of the items to chose from.
    loadItems(pageNum: number): void {
        // Remove previous items.
        let listEl: any = document.querySelector('#items-list');
        if (listEl) {
            listEl.parentNode.removeChild(listEl);
            listEl.destroy();
        }

        // Put all items under one entity for the sake of deleting and regenerating.
        listEl = document.createElement('a-entity');
        this.menuEl.appendChild(listEl);
        listEl.setAttribute('id', "items-list");

        const xOffset: number = 0.03;
        const yOffset: number = 0;
        const zOffset: number = 0.03;
        for (let i=0; i<9; i++) {
            if (this.data.pageNumber == Math.floor(objects['Models'].length/9) && (pageNum*9 + i) >= objects['Models'].length%9) {
                break;
            }
            // Create the item.
            const itemEl: any = document.createElement('a-entity');
            listEl.appendChild(itemEl);
            itemEl.object3D.position.set(-0.13 + xOffset*(i%3), 0.015 + yOffset*(i%3), -0.03 + zOffset*Math.floor(i/3));
            this.loadModelInstance(itemEl, pageNum*9 + i);
        }

    },

    // Load the model thumbnail of the model i to be displayed in containers.
    loadModelInstance(_itemEl: any, _itemId: number): void {
        const instance: Item = objects['Models'][_itemId];

        if (instance.type === 'primitive') {
            _itemEl.setAttribute('geometry', 'primitive', instance.name);
            _itemEl.object3D.scale.set(0.01, 0.01, 0.01);
        }
        else {
            _itemEl.setAttribute('obj-model', 'obj', instance.itemUrl);
            // Resize the model into item size
            _itemEl.addEventListener('model-loaded', () => {
                resize(_itemEl, 0.01);
            });
        }
        
        _itemEl.object3D.rotation.set(THREEMath.degToRad(-90), 0, 0);
        _itemEl.setAttribute('material', {
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
        const instance: Item = objects['Models'][_buttonId + this.data.pageNumber];
        if (!instance) {
            return;
        }
        else
            thumbDescripEl.setAttribute('text', 'value', instance.name);
    },
    
    // Set the selected button id.
    setSelectedButtonId: function(_buttonId: number): void {
        // Check if selected button id is out of range.
        if (this.data.pageNumber == objects['Models'].length/9 && _buttonId >= objects['Models'].length%9) {
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
        const instance: Item = objects['Models'][this.data.pageNumber * 9 + _buttonId];
        const rightHand: any = document.querySelector('#rightHand');
        rightHand.setAttribute('right-abutton-listener', 'targetModel', instance.name);
    },

    // Set current color for reference (call by other component).
    setCurrentColor(_color: string): void {
        const currentColor: any = document.querySelector('#currentcolor');
        currentColor.setAttribute('material', 'color', _color);
    }
});

export default globalMenu;