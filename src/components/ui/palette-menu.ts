import * as AFRAME from 'aframe';
import * as $ from 'jquery';
import { Math as THREEMath, ShaderMaterial, Mesh, TextureLoader } from 'three';
import { objects } from '../../Objects';
import { Item } from './canvas';
import { resize, recenter } from '../../utils/SizeConstraints';
import { setAppStatus } from '../../utils/App';
import { sketchfab } from '../../utils/SketchFab';

// The menu elements' names in the gltf model.
const pieceNames: string[] = ['huecursor', 'hue', 'currentcolor', 'description', 'button1', 'button2', 'button3', 'button4', 'button5', 'button6', 'button7', 'button8', 'button9', 'run', 'stop', 'prev', 'next', 'primitive', 'sketchfab', 'diagram', 'text', 'search-panel', 'search-button'];

const toolNames: string[] = ['primitive', 'sketchfab', 'diagram', 'text'];

const nonReactPieces: string[] = ["hue", "huecursor", "currentcolor", "menu", "description", "run", "stop"];

export enum ItemType {
    Primitive,
    Sketchfab
}

export let itemType: ItemType = ItemType.Primitive; 
let cursor: number = 0;

let sketchfabNames: string[];
let sketchfabUids: string[];

const iconSize = {
    width: 0.033,
    height: 0.033
}

const buttonSize = {
    width: 0.05,
    height: 0.05
}

export const inactiveColor: string = '#22313f';
export const hoverColor: string = '#22a7f0';
export const activeColor: string = '#22a7f0';

export const runActiveColor: string = '#00B800';
export const stopActiveColor: string = '#F10310';

export const toolHoverColor: string = 'yellow';
export const toolActiveColor: string = 'yellow';

const paletteMenu = AFRAME.registerComponent('palette-menu', {
    schema: {
        selectedButtonId: {type: 'number', default: 0},
        selectedToolList: {type: 'array', default: []},
        pageNumber: {type: 'number', default: 0}
    },

    init: function(): void {        
        // Create a menu entity and append it to the controller.
        const menuEntity: any = this.menuEl = document.createElement('a-entity');
        menuEntity.setAttribute('id', 'palette-menu');
        this.el.appendChild(menuEntity);
        
        // Set the visibility of the menu entity as false at the beginning.
        // menuEntity.object3D.visible = false;

        // Adjust the position offset of the palette menu.
        menuEntity.object3D.position.set(0, 0, -0.15);
        
        this.createPieces();
        this.initRunStopLabel();
        this.initItemDescription();
        this.initPreviewBox();
        this.onToolClicked('primitive');

        // Event Listener to open and close menu.
        const listeningEl = document.querySelector('#leftHand');
        listeningEl.addEventListener('xbuttondown', this.onXButtonDown.bind(this));
    },

    // The listener when x-button on the left controller is down.
    onXButtonDown(event): void {
        this.menuEl.object3D.visible = !this.menuEl.object3D.visible;
    },

    // Create pieces, setting their geometry and material. 
    createPieces(): void {
        for (const pieceName of pieceNames) {
            // Create sub-menu entity.
            const pieceEl: any = document.createElement('a-entity');
            this.menuEl.appendChild(pieceEl);
            pieceEl.setAttribute('id', pieceName);

            // Add class ui so that these subentities can be interacted.
            pieceEl.classList.add('ui');

            // Add one more tool class for button reactions.
            if (toolNames.indexOf(pieceName) != -1) pieceEl.classList.add('tool');

            // Set the gltf model to the entity.
            pieceEl.setAttribute('gltf-part', {
                src: '#palette-menu-gltf',
                part: pieceName
            });

            
            // Initiate material according to widget name.
            switch (pieceName) {
                case 'currentcolor': {
                    pieceEl.setAttribute('material', {
                        color: '#ffffff',
                        flatShading: true,
                        shader: 'flat',
                        transparent: true
                    });
                    break;
                }

                case 'huecursor': {
                    pieceEl.setAttribute('material', {
                        color: '#ffffff',
                        flatShading: true,
                        shader: 'flat',
                        transparent: true,
                        src: '#hue-cursor'
                    });                 
                    break;
                }

                case 'hue': {
                    pieceEl.addEventListener('object3dset', (event) => {
                        initColorWheel(pieceEl);
                    });
                    break;
                }

                case 'stop': {
                    pieceEl.setAttribute('material', 'color', inactiveColor);

                    pieceEl.addEventListener('clicked', () => {
                        // When run button is clicked
                        pieceEl.setAttribute('material', 'color', stopActiveColor);

                        // Set run button back to normal
                        const runEl: any = document.getElementById('run');
                        runEl.setAttribute('material', 'color', inactiveColor);

                        // Set App status
                        setAppStatus(false);
                    });
                    break;
                }

                case 'run': {
                    pieceEl.setAttribute('material', 'color', inactiveColor);

                    pieceEl.addEventListener('clicked', () => {
                        // When run button is clicked
                        pieceEl.setAttribute('material', 'color', runActiveColor);

                        // Set stop button back to normal
                        const stopEl: any = document.getElementById('stop');
                        stopEl.setAttribute('material', 'color', inactiveColor);

                        // Set App status
                        setAppStatus(true);
                    });
                    break;
                }

                // For pieces that come with an icons, set the icons here.
                case 'prev': case 'next': case 'primitive': case 'sketchfab': case 'diagram': case 'text': case 'search-button': {
                    const iconEl: any = document.createElement('a-image');
                    pieceEl.appendChild(iconEl);
                    iconEl.setAttribute('src', `#${pieceName}_icon`);
                    iconEl.setAttribute('geometry', {
                        width: 0.8 * iconSize.width,
                        height: 0.8 * iconSize.height
                    });

                    // Set positions of the icons since we have a centralized origin.
                    if (pieceName == 'prev')
                        iconEl.object3D.position.set(-0.225, 0.0031, -0.091);
                    else if (pieceName == 'next')
                        iconEl.object3D.position.set(-0.11,0.0031, -0.091);
                    else if (pieceName == 'primitive')
                        iconEl.object3D.position.set(-0.275, 0.0031, -0.091);
                    else if (pieceName == 'sketchfab')
                        iconEl.object3D.position.set(-0.275, 0.0031, -0.058);
                    else if (pieceName == 'diagram')
                        iconEl.object3D.position.set(-0.275, 0.0031, -0.025);
                    else if (pieceName == 'text')
                        iconEl.object3D.position.set(-0.275, 0.0031, 0.008);
                    else if (pieceName == 'search-button')
                        iconEl.object3D.position.set(0.06, 0.0031, -0.091);
                    
                    iconEl.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
                    pieceEl.setAttribute('material', 'color', inactiveColor);
                    break;
                }

                case 'search-panel': {
                    const searchTextEl: any = document.createElement('a-entity');
                    pieceEl.appendChild(searchTextEl);
                    searchTextEl.setAttribute('id', 'search-text');
                    searchTextEl.setAttribute('text', {
                        align: 'center',
                        width: 0.6,
                        wrapCount: 12,
                        value: 'Hello World!'
                    });
                    searchTextEl.object3D.position.set(-0.01, 0.001, -0.09);
                    searchTextEl.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
                    searchTextEl.object3D.scale.set(0.2, 0.2, 0.2);
                    searchTextEl.classList.add('ui');

                    pieceEl.addEventListener('clicked', this.onSearchClicked.bind(this));
                    searchTextEl.addEventListener('clicked', this.onSearchClicked.bind(this));
                }

                default: {
                    pieceEl.setAttribute('material', 'color', inactiveColor);
                    break;
                }
            };
            
            // Set up interactions for the pieces.
            pieceEl.addEventListener('raycaster-intersected', (event) => {
                event.stopPropagation();
                // If the piece is reactive...
                if (nonReactPieces.indexOf(pieceName) === -1) {
                    // If the user clicks on items.
                    if (pieceName.indexOf('button') != -1) {
                        // Set responsive color.
                        pieceEl.setAttribute('material', 'color', hoverColor); 
                        const buttonId: number = Number(pieceName.substr(-1, 1)) - 1;
                        this.setItemDescription(buttonId);
                    }
                    else if (pieceEl.classList.contains('tool')) {
                        pieceEl.setAttribute('material', 'color', toolHoverColor); 
                        this.setToolDescription(pieceName);
                    }
                    else {
                        pieceEl.setAttribute('material', 'color', hoverColor); 
                    }
                }
            });

            pieceEl.addEventListener('raycaster-intersected-cleared', (event) => {
                event.stopPropagation();
                // If the subentity is not in nonReactiveUI AND it is not the selectedButton AND it is not in selectedToolList, then recover its color.
                const selectedButtonId: number = this.data.selectedButtonId;
                const selectedToolList: any = this.data.selectedToolList;
                if (nonReactPieces.indexOf(pieceName) === -1 && pieceName != 'button' + String(selectedButtonId+1) && selectedToolList.indexOf(pieceName) ===  -1) {
                    pieceEl.setAttribute('material', 'color', inactiveColor);
                    this.setItemDescription(selectedButtonId);
                }
            });

            pieceEl.addEventListener('clicked', (event) => {
                // Define when a button is clicked
                if (pieceName.indexOf('button') != -1) {
                    const buttonId: number = Number(pieceName.substr(-1, 1)) - 1;
                    this.setSelectedButtonId(buttonId);
                }
                // Define when a tool is clicked
                else if (toolNames.indexOf(pieceName) != -1) {
                    this.onToolClicked(pieceName);
                }
                // Define when next is clicked
                else if (pieceName == 'next') {
                    this.onNextClicked();
                }
                // Define when previous is clicked
                else if (pieceName == 'prev') {
                    this.onPreviousClicked();
                }
            });
        }
    },

    // Load description of run & stop button.
    initRunStopLabel(): void {
        const runLabel: any = document.createElement('a-entity');
        const runEl: any = document.querySelector("#run");
        const stopLabel: any = document.createElement('a-entity');
        const stopEl: any = document.querySelector("#stop");
        runEl.appendChild(runLabel);
        stopEl.appendChild(stopLabel);

        // Initiate tht panel content.
        runLabel.setAttribute('text', {
            value: 'Run',
            wrapCount: 150,
            align: 'center'
        });
        // Initiate tht panel content.
        stopLabel.setAttribute('text', {
            value: 'Stop',
            wrapCount: 150,
            align: 'center'
        });

        // Set the description rotation.
        runLabel.object3D.rotation.x += THREEMath.degToRad(-90);
        stopLabel.object3D.rotation.x += THREEMath.degToRad(-90);
        // Set the description position.
        runLabel.object3D.position.set(-0.21, 0, 0.1);
        stopLabel.object3D.position.set(-0.125, 0, 0.1);
    },

    // Load description of thumbnails.
    initItemDescription(): void {
        // Create thumbnail description entity.
        const descripText: any = document.createElement('a-entity');
        const descripEl: any = document.querySelector("#description");
        descripEl.appendChild(descripText);
        descripText.setAttribute('id', "description-text");

        // Initiate tht panel content.
        descripText.setAttribute('text', {
            value: '',
            wrapCount: 120,
            align: 'center'
        });

        // Set the description rotation.
        descripText.object3D.rotation.x += THREEMath.degToRad(-90);
        // Set the description position.
        descripText.object3D.position.set(-0.167, 0, -0.1);

        // Set the value of the description.
        this.setItemDescription(this.data.selectedButtonId);
    },

    // Load the thumbnails of the items to chose from.
    loadPrimitives(pageNum: number): void {
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

        const xOffset: number = 0.05;
        const yOffset: number = 0;
        const zOffset: number = 0.05;
        for (let i=0; i<9; i++) {
            if (this.data.pageNumber == Math.floor(objects['Models'].length/9) && (pageNum*9 + i) >= objects['Models'].length%9) {
                break;
            }
            // Create the item.
            const itemEl: any = document.createElement('a-entity');
            listEl.appendChild(itemEl);
            itemEl.object3D.position.set(-0.217 + xOffset*(i%3), 0.025 + yOffset*(i%3), -0.05 + zOffset*Math.floor(i/3));
            itemEl.setAttribute('id', 'instance-'+i);
            this.loadModelInstance(itemEl, pageNum*9 + i);
        }

    },

    // Load the model thumbnail of the model i to be displayed in containers.
    loadModelInstance(_itemEl: any, _itemId: number): void {
        const instance: Item = objects['Models'][_itemId];

        if (instance.type === 'primitive') {
            _itemEl.setAttribute('geometry', 'primitive', instance.name);
            _itemEl.object3D.scale.set(0.02, 0.02, 0.02);
        }
        else {
            _itemEl.setAttribute('obj-model', 'obj', instance.itemUrl);
            // Resize the model into item size
            _itemEl.addEventListener('model-loaded', () => {
                resize(_itemEl, 0.05);
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

    // Set description of the panel.
    setToolDescription(toolName: string): void {
        const thumbDescripEl: any = document.querySelector('#description-text');
        thumbDescripEl.setAttribute('text', 'value', toolName);
    },

    // Set description of the panel.
    setItemDescription(_buttonId: number): void {
        let itemName: string = '';
        const thumbDescripEl: any = document.querySelector('#description-text');

        if (itemType == ItemType.Primitive) {
            const item: Item = objects['Models'][_buttonId + this.data.pageNumber];
            if (!item) {
                return;
            }
            else
                thumbDescripEl.setAttribute('text', 'value', item.name);
        }
        else if (itemType == ItemType.Sketchfab) {
            thumbDescripEl.setAttribute('text', 'value', sketchfabNames[_buttonId]);
        }
    },
    
    // Set the selected button id AND deal with logic about clicking the button.
    setSelectedButtonId: function(_buttonId: number): void {
        // Check if selected button id is out of range.
        if (itemType == ItemType.Primitive && this.data.pageNumber == objects['Models'].length/9 && _buttonId >= objects['Models'].length%9) {
            return;
        }

        // If there is previous selected button id...
        if (this.data.selectedButtonId >= 0) {
            // Manually raycaster intersected cleared.
            const lastSelectedButton: any = document.querySelector('#button' + String(this.data.selectedButtonId+1));
            lastSelectedButton.setAttribute('material', 'color', inactiveColor);
        }

        // Set new button id.
        this.data.selectedButtonId = _buttonId;
        
        // Set description.
        this.setItemDescription(_buttonId);
        
        // Add responsive color to the button.
        const currentSelectedButton: any = document.querySelector('#button' + String(this.data.selectedButtonId+1));
        currentSelectedButton.setAttribute('material', 'color', activeColor);

        if (itemType == ItemType.Primitive) {
            // Pass the id for right hand to create the corresponding object.
            const instance: Item = objects['Models'][this.data.pageNumber * 9 + _buttonId];
            const rightHand: any = document.querySelector('#rightHand');
            rightHand.setAttribute('right-abutton-listener', 'targetModel', instance.name);
        }
    },

    onToolClicked: function(toolName: string): void {
        const idx: number = this.data.selectedToolList.indexOf(toolName);
        // If it is unselecting the tool BUT the user cannot unselect primitive/sketchfab
        if (idx != -1 && toolName != 'primitive' && toolName != 'sketchfab') {
            this.data.selectedToolList.splice(idx, 1);
            const deselectedTool: any = document.querySelector(`#${toolName}`);
            deselectedTool.setAttribute('material', 'color', inactiveColor);
        }
        // If it is selecting the tool
        else {
            this.data.selectedToolList.push(toolName);
            const selectedTool: any = document.querySelector(`#${toolName}`);
            selectedTool.setAttribute('material', 'color', toolActiveColor); 
        }

        if (toolName == 'primitive') {
            // Set item type.
            itemType = ItemType.Primitive;

            // Kick sketchfab out of selectedTool
            const sfIdx: number = this.data.selectedToolList.indexOf('sketchfab');
            if (sfIdx != -1) {
                this.data.selectedToolList.splice(sfIdx, 1);
                const sfBtn: any = document.getElementById('sketchfab');
                sfBtn.setAttribute('material', 'color', inactiveColor);
            }

            // Set panel's visibility
            const searchButtonEl: any = document.getElementById('search-button');
            const searchPanelEl: any = document.getElementById('search-panel');
            const searchTextEl: any = document.getElementById('search-text');
            const preBoxEl: any = document.getElementById('preview-box');
            searchButtonEl.object3D.visible = false;
            searchPanelEl.object3D.visible = false;
            searchTextEl.object3D.visible = false;
            preBoxEl.object3D.visible = false;
            searchButtonEl.classList.remove('ui');
            searchPanelEl.classList.remove('ui');
            searchTextEl.classList.remove('ui');
            preBoxEl.classList.remove('ui');

            const hurCursorEl: any = document.getElementById('huecursor');
            const hueEl: any = document.getElementById('hue');
            const currentColorEl: any = document.getElementById('currentcolor');
            hurCursorEl.object3D.visible = true;
            hueEl.object3D.visible = true;
            currentColorEl.object3D.visible = true;
            hurCursorEl.classList.add('ui');
            hueEl.classList.add('ui');

            this.loadPrimitives(this.data.pageNumber);
        }
        else if (toolName == "sketchfab") {
            // Set item type.
            itemType = ItemType.Sketchfab;

            // Kick primitive out of selectedTool
            const pmIdx: number = this.data.selectedToolList.indexOf('primitive');
            if (pmIdx != -1) {
                this.data.selectedToolList.splice(pmIdx, 1);
                const pmBtn: any = document.getElementById('primitive');
                pmBtn.setAttribute('material', 'color', inactiveColor);
            }

            // Set panel's visibility
            const searchButtonEl: any = document.getElementById('search-button');
            const searchPanelEl: any = document.getElementById('search-panel');
            const searchTextEl: any = document.getElementById('search-text');
            const preBoxEl: any = document.getElementById('preview-box');
            searchButtonEl.object3D.visible = true;
            searchPanelEl.object3D.visible = true;
            searchTextEl.object3D.visible = true;
            preBoxEl.object3D.visible = true;
            searchButtonEl.classList.add('ui');
            searchPanelEl.classList.add('ui');
            searchTextEl.classList.add('ui');
            preBoxEl.classList.add('ui');

            const hurCursorEl: any = document.getElementById('huecursor');
            const hueEl: any = document.getElementById('hue');
            const currentColorEl: any = document.getElementById('currentcolor');
            hurCursorEl.object3D.visible = false;
            hueEl.object3D.visible = false;
            currentColorEl.object3D.visible = false;
            hurCursorEl.classList.remove('ui');
            hueEl.classList.remove('ui');
            currentColorEl.classList.remove('ui');

            this.loadSketchfab();
        }
        else if (toolName == 'diagram') {
            const canvasEl: any = document.querySelector('#canvas');
            canvasEl.emit('showcanvas');
        }
        else if (toolName == 'text') {
            const rightHand: any = document.querySelector('#rightHand');
            rightHand.setAttribute('right-abutton-listener', 'targetModel', toolName);
        }
    },

    loadSketchfab: function(cur: number = 0): void {
        // Remove previous items.
        let listEl: any = document.querySelector('#items-list');
        if (listEl) {
            listEl.parentNode.removeChild(listEl);
            listEl.destroy();
        }
    
        // Empty the array.
        sketchfabNames = [];
        sketchfabUids = [];
    
        // Put all items under one entity for the sake of deleting and regenerating.
        listEl = document.createElement('a-entity');
        this.menuEl.appendChild(listEl);
        listEl.setAttribute('id', "items-list");
    
        const itemOffset = {x: -0.217, y: 0.002, z: -0.05};
    
        const param: object = {
            type: 'models',
            q: '',
            file_format: 'gltf',
            downloadable: true,
            animated: true,
            count: 9,
            cursor: cur
        };

        const el = this.el;

        $.get(sketchfab.getUrl(), param, function (data, status, xhr) {
            if (status == 'success') {
                // cursors: {next, previous}, next: url, previous: url, results: []
                const results = data.results;
                console.log(data);
    
                results.forEach((asset, i: number)=>{
                    const itemEl: any = document.createElement('a-entity');
                    itemEl.setAttribute('id', 'sketchfab'+i);
                    listEl.appendChild(itemEl);
    
                    itemEl.setAttribute('geometry', {
                        primitive: 'plane',
                        width: buttonSize.width,
                        height: buttonSize.height
                    });
                    const len: number = asset.thumbnails.images.length;
                    itemEl.setAttribute('material', {
                        src: asset.thumbnails.images[len - 1].url
                    });
    
                    // Place the item
                    itemEl.object3D.position.set(itemOffset.x +  (i%3) * buttonSize.width, itemOffset.y, itemOffset.z - itemOffset.z * Math.floor(i/3));
                    itemEl.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
    
                    // Add reaction to the item.
                    itemEl.classList.add('ui');
                    itemEl.addEventListener('raycaster-intersected', (event) => {
                        itemEl.setAttribute('material', 'color', hoverColor);
                        // setDescription(asset.name);
                    });
    
                    itemEl.addEventListener('raycaster-intersected-cleared', (event) => {
                        itemEl.setAttribute('material', 'color', 'white');
                    });
    
                    itemEl.addEventListener('clicked', (event) => {
                        itemEl.setAttribute('material', 'color', activeColor);
                        el.components['palette-menu'].setSelectedButtonId(i);
                        sketchfab.getGLTFUrl(asset.uid);
                    });
    
                    sketchfabNames.push(asset.name);
                    sketchfabUids.push(asset.uid);
                });
            }
        });
    
        return;
    },

    initPreviewBox: function(): void {
        // Create entity of preview box.
        const preBoxEl: any = document.createElement('a-entity');
        this.menuEl.appendChild(preBoxEl);
        preBoxEl.setAttribute('id', "preview-box");

        // Create empty model entity first.
        const preModelEl: any = document.createElement('a-entity');
        preBoxEl.appendChild(preModelEl);
        preModelEl.setAttribute('id', 'preview-model');

        // Resize the model everytime it is loaded.
        preModelEl.addEventListener('model-loaded', () => {
            resize(preModelEl, 0.12);
            recenter(preModelEl);
        });

        // Set geometry
        preBoxEl.setAttribute('geometry', {
            primitive: 'box',
            width: 0.12,
            height: 0.12,
            depth: 0.12
        });

        // Set material
        preBoxEl.setAttribute('material', {
            transparent: true,
            opacity: 0.2
        });

        // Set position
        preBoxEl.object3D.position.set(0, 0, 0);
    },

    onNextClicked: function(): void {
        if (itemType == ItemType.Sketchfab) {
            cursor += 9;
            this.loadSketchfab(cursor);
        }
    },

    onPreviousClicked: function(): void {
        if (itemType == ItemType.Sketchfab) {
            cursor = (cursor == 0) ? 0 : cursor-9;
            this.loadSketchfab(cursor);
        }
    },

    onSearchClicked: function(event): void {
        const kbEl: any = document.getElementById('palette-keyboard');
        const searchTextEl: any = document.getElementById('search-text');
        kbEl.setAttribute('palette-keyboard', {
            targetEl: searchTextEl
        });
        // console.log('serach text/panel is clicked');
        kbEl.emit('palette-keyboard-visible', {}, false);
    }
});

// Initiate the color wheel.
function initColorWheel(hueEl: any): void {
    const vertexShader = '\
      varying vec2 vUv;\
      void main() {\
        vUv = uv;\
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\
        gl_Position = projectionMatrix * mvPosition;\
      }\
      ';

    const fragmentShader = '\
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

    const material = new THREE.ShaderMaterial({
      uniforms: { brightness: { type: 'f', value: 1.0 } },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    const mesh = hueEl.getObject3D('mesh');

    if (mesh) {
        mesh.material = material;
    }
}

export function onHueDown(position: any) {
    const hueWheel: any = document.querySelector('#hue');
    const hueCursor: any = document.querySelector('#huecursor');

    const radius: number = calRadius(hueWheel);

    hueWheel.object3D.updateMatrixWorld();
    hueWheel.object3D.worldToLocal(position);

    // console.log(LocalPos.x + ',' + LocalPos.y + ',' + LocalPos.z);       
    hueCursor.object3D.position.set(position.x, hueCursor.object3D.position.y, position.z);

    const polarPosition = {
        r: Math.sqrt(position.x * position.x + position.z * position.z),
        theta: Math.PI + Math.atan2(-position.z, position.x)
    };
    const angle: number = ((polarPosition.theta * (180 / Math.PI)) + 180) % 360;
    const hsv = {h: angle / 360, s: polarPosition.r / radius, v: 1.0};
    updateColor(hsv);
}

function calRadius(hueWheel) {
    const mesh = hueWheel.getObject3D('mesh');
    if (!mesh) {return;}

    const box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    box.getSize(size);
    const extent = Math.max(size.x, size.y, size.z) / 2;
    const radius = Math.sqrt(2) * extent;
    
    return radius;
}

function updateColor(hsv) {
    const rgb: any = hsv2rgb(hsv);
    const color = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    
    const rightHand: any = document.querySelector('#rightHand');
    rightHand.setAttribute('right-abutton-listener', 'color', color);

    setCurrentColor(color);
}

function hsv2rgb(hsv) {
    var r, g, b, i, f, p, q, t;
    var h = THREE.Math.clamp(hsv.h, 0, 1);
    var s = THREE.Math.clamp(hsv.s, 0, 1);
    var v = hsv.v;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
    }
    return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
    };
}

// Set current color for reference (call by other component).
function setCurrentColor(_color: string): void {
    const currentColor: any = document.querySelector('#currentcolor');
    currentColor.setAttribute('material', 'color', _color);
    for (let i: number = 0; i < 6; i++) {
        const ins: any = document.querySelector('#instance-'+i);
        if (ins)
            ins.setAttribute('material', 'color', _color);
    }
}

export default paletteMenu;