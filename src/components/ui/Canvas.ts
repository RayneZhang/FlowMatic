import * as AFRAME from 'aframe';
import * as $ from 'jquery';
import { objects, VECTOR } from '../../Objects';
import { Vector3, Math as THREEMath, Euler } from 'three';
import { resize, recenter } from '../../utils/SizeConstraints';
import { scene, Node, ObjNode } from 'frp-backend';
import { googlePoly } from '../../utils/GooglePoly';
import { containerID } from '../controllers/absorb-controller';
import { savedContainerId, instantiateContainer, ctnWidth, ctnDepth, savedInPorts, savedOutPorts } from '../frp/operators/container';
import { createOnePlug } from '../utils/operator-model';
import { getColorsByType } from '../../utils/TypeVis';

export let canvasSize = {
    width: 1.6, 
    height: 1,
    depth: 0.02
};

export const menuSize = {
    width: 0.7,
    height: 1,
    depth: 0.02
}

export const buttonSize = {
    width: 0.1,
    height: 0.1
}

export const itemSize = {
    width: 0.2,
    height: 0.2
}

export let canvasConstraint = {
    negx: -canvasSize.width/2,
    posx: canvasSize.width/2,
    negy: -canvasSize.height/2,
    posy: canvasSize.height/2,
    constz: itemSize.width/2
}

export const canvasColor = {
    background: '#ececec',
    unselected: '#ffffff',
    hovered: '#19b5fe',
    selected: '#0078d4'
}

export const itemColor = {
    unselected: '#3CBCFC',
    hovered: '#8C2C0D',
    selected: '#EC5C2D'
}

export const objColor = {
    unselected: '#3CBCFC',
    hovered: '#0078F8'
}

export interface Item {
    name: string,
    type: string,
    itemUrl: string,
    inputs?: {name: string, type: string, behavior: string}[],
    outputs?: {name: string, type: string, behavior: string}[]
}

export const itemLimit: number = 12;

export const itemOffset: Vector3 = new Vector3(-menuSize.width/2 + buttonSize.width + itemSize.width/2, menuSize.height/2 - buttonSize.height - itemSize.height/2, itemSize.width/2);

const toolBox = ['Operators', 'Data', 'Avatars', 'Canvas'];
let canvases = ['Canvas#1'];

let pageIdx: number = 0;

let currentCanvas: string = 'canvas-world';

export const canvasGenerator = AFRAME.registerComponent('canvas-generator', {
    init: function(): void {
        this.mainCam = document.querySelector('#head');

        const canvasEl: any = document.createElement('a-entity');
        const menuEl: any = document.createElement('a-entity');
        const desEl: any = document.createElement('a-entity');
        canvasEl.setAttribute('id', 'canvas-world');
        menuEl.setAttribute('id', 'menu-world');
        desEl.setAttribute('id', 'description-world');

        initCanvasBg(canvasEl, this.el);
        canvasEl.addEventListener('clicked', (event) => {
            const canvas2El: any = document.getElementById('canvas-world-2');
            canvas2El.object3D.position.set(canvas2El.object3D.position.x, canvas2El.object3D.position.y, canvasEl.object3D.position.z);
            canvasEl.object3D.position.set(canvasEl.object3D.position.x, canvasEl.object3D.position.y, canvasEl.object3D.position.z + 0.2);
            currentCanvas = 'canvas-world';
        });
        initMenu(menuEl, this.el);
        initDes(desEl, menuEl);
        loadItems(menuEl, 'button-0');

        // Event Listener to open and close menu.
        this.el.object3D.visible = false;
        this.el.addEventListener('showcanvas', (event) => {
            this.el.object3D.visible = !this.el.object3D.visible;
            const edges: any = document.querySelector('#edges');
            edges.object3D.visible = this.el.object3D.visible;
            if (this.el.object3D.visible) {
                this.mainCam.object3D.updateMatrix();
                this.mainCam.object3D.updateWorldMatrix();
                const position = this.mainCam.object3D.localToWorld(new Vector3(0.8, 0, -1.5));
                const camPosition = this.mainCam.object3D.localToWorld(new Vector3(0, 0, 0));
                const rotation = this.mainCam.object3D.rotation.y;
                
                this.el.object3D.position.copy(position);
                this.el.object3D.setRotationFromEuler(new Euler(0, rotation, 0));
                this.el.object3D.position.set(position.x, camPosition.y - 0.5, position.z);

                // Show all the attributes
                const els = document.querySelectorAll('.attribute');
                els.forEach((el: any) => {
                    el.object3D.visible = true;
                });

                const el2s = document.querySelectorAll('.assist-obj');
                el2s.forEach((el2: any) => {
                    el2.object3D.visible = true;
                });
            }
            else {
                // Hide all the attributes
                const els = document.querySelectorAll('.attribute');
                els.forEach((el: any) => {
                    el.object3D.visible = false;
                });

                const el2s = document.querySelectorAll('.assist-obj');
                el2s.forEach((el2: any) => {
                    el2.object3D.visible = false;
                });
            }
        });
    }
});

/**
 * Initiate a plane and specify parameters
 */
function initCanvasBg(canvasEl: any, parentEl: any): void {   
    canvasEl.setAttribute('geometry', {
        primitive: 'box',
        width: canvasSize.width,
        height: canvasSize.height,
        depth: canvasSize.depth
    });

    canvasEl.setAttribute('material', {
        color: canvasColor.background,
        transparent: true,
        opacity: 0.3
    });

    canvasEl.classList.add('ui');
    parentEl.appendChild(canvasEl);

    const expandEl: any = document.createElement('a-entity');
    expandEl.setAttribute('id', `canvas-expand`);
    expandEl.setAttribute('geometry', {
            primitive: 'plane',
            width: buttonSize.width * 0.9,
            height: buttonSize.height * 0.9
        });
        expandEl.setAttribute('material', {
            src: `#expand_icon`,
            color: canvasColor.unselected,
            side: 'double',
            transparent: true
        });

        // Place the button
        canvasEl.appendChild(expandEl);
        expandEl.object3D.position.set(canvasSize.width / 2 - buttonSize.width / 2, canvasSize.height / 2 - buttonSize.height / 2, canvasSize.depth / 2 + 0.001);

        // Add reactions to the button
        expandEl.classList.add('ui');
        expandEl.addEventListener('raycaster-intersected', (event) => {
            expandEl.setAttribute('material', 'color', canvasColor.hovered);
            setDescription('expand canvas');
        });

        expandEl.addEventListener('raycaster-intersected-cleared', (event) => {
            expandEl.setAttribute('material', 'color', canvasColor.unselected);
        });

        expandEl.addEventListener('clicked', (event) => {
            expandEl.setAttribute('material', 'color', canvasColor.selected);
            canvasEl.object3D.position.set(canvasEl.object3D.position.x + canvasSize.width / 2, 0, 0);
            canvasSize.width *= 2;
            canvasSize.height *= 2;
            canvasEl.setAttribute('geometry', {
                primitive: 'box',
                width: canvasSize.width,
                height: canvasSize.height,
                depth: canvasSize.depth
            });
            canvasConstraint = {
                negx: -canvasSize.width/2,
                posx: canvasSize.width/2,
                negy: -canvasSize.height/2,
                posy: canvasSize.height/2,
                constz: itemSize.width/2
            };
            expandEl.object3D.position.set(canvasSize.width / 2 - buttonSize.width / 2, canvasSize.height / 2 - buttonSize.height / 2, canvasSize.depth / 2 + 0.001);
        });

        expandEl.addEventListener('clicked-cleared', (event) => {
            expandEl.setAttribute('material', 'color', canvasColor.unselected);
        });    
}

/**
 * Initiate a menu panel for selecting items
 * @param parentEl The parent entity
 */
function initMenu(menuEl: any, parentEl: any): void {
    menuEl.setAttribute('geometry', {
        primitive: 'box',
        width: menuSize.width,
        height: menuSize.height,
        depth: menuSize.depth
    });
    menuEl.setAttribute('material', {
        color: canvasColor.background,
        transparent: true,
        opacity: 0.3
    });
    const offset: number = canvasSize.width/2 + menuSize.width/2 + 0.1;
    menuEl.object3D.position.set(-offset, 0, 0);
    parentEl.appendChild(menuEl);

    initButtons(menuEl);
}

/**
 * Initiate submenu buttons for switching objects
 * @param menuEl The menu entity
 */
function initButtons(menuEl: any): void {
    const offset: Vector3 = new Vector3(-menuSize.width/2 + buttonSize.width/2, menuSize.height/2 - buttonSize.height/2, menuSize.depth + 0.001);
    toolBox.forEach((key: string, i: number) => {
        const bnEl: any = document.createElement('a-entity');
        bnEl.setAttribute('id', `button-${i}`);
        bnEl.setAttribute('geometry', {
            primitive: 'plane',
            width: buttonSize.width * 0.9,
            height: buttonSize.height * 0.9
        });
        bnEl.setAttribute('material', {
            src: `#${key}_icon`,
            color: canvasColor.unselected,
            side: 'double',
            transparent: true
        });
        console.log(`#${key}_icon`);
        // Place the button
        menuEl.appendChild(bnEl);
        bnEl.object3D.position.set(offset.x, offset.y - buttonSize.height * i, offset.z);

        // Add reactions to the button
        bnEl.classList.add('ui');
        bnEl.addEventListener('raycaster-intersected', (event) => {
            bnEl.setAttribute('material', 'color', canvasColor.hovered);
            setDescription(key);
        });

        bnEl.addEventListener('raycaster-intersected-cleared', (event) => {
            bnEl.setAttribute('material', 'color', canvasColor.unselected);
        });

        bnEl.addEventListener('clicked', (event) => {
            bnEl.setAttribute('material', 'color', canvasColor.selected);
            loadItems(menuEl, bnEl.getAttribute('id'));
        });

        bnEl.addEventListener('clicked-cleared', (event) => {
            bnEl.setAttribute('material', 'color', canvasColor.unselected);
        });
    });

    const prevEl: any = document.createElement('a-entity');
    prevEl.setAttribute('id', `canvas-prev`);
    prevEl.setAttribute('geometry', {
            primitive: 'plane',
            width: buttonSize.width * 0.9,
            height: buttonSize.height * 0.9
        });
        prevEl.setAttribute('material', {
            src: `#prev_icon`,
            color: canvasColor.unselected,
            side: 'double',
            transparent: true
        });

        // Place the button
        menuEl.appendChild(prevEl);
        prevEl.object3D.position.set(offset.x + buttonSize.width, offset.y, offset.z);

        // Add reactions to the button
        prevEl.classList.add('ui');
        prevEl.addEventListener('raycaster-intersected', (event) => {
            prevEl.setAttribute('material', 'color', canvasColor.hovered);
            setDescription('last page');
        });

        prevEl.addEventListener('raycaster-intersected-cleared', (event) => {
            prevEl.setAttribute('material', 'color', canvasColor.unselected);
        });

        prevEl.addEventListener('clicked', (event) => {
            prevEl.setAttribute('material', 'color', canvasColor.selected);
            if (pageIdx == 0)
                loadItems(menuEl, 'button-0', pageIdx);
            else
                loadItems(menuEl, 'button-0', (--pageIdx) * 12);

        });

        prevEl.addEventListener('clicked-cleared', (event) => {
            prevEl.setAttribute('material', 'color', canvasColor.unselected);
        });

        const nextEl: any = document.createElement('a-entity');
        nextEl.setAttribute('id', `canvas-next`);
        nextEl.setAttribute('geometry', {
            primitive: 'plane',
            width: buttonSize.width * 0.9,
            height: buttonSize.height * 0.9
        });
        nextEl.setAttribute('material', {
            src: `#next_icon`,
            color: canvasColor.unselected,
            side: 'double',
            transparent: true
        });

        // Place the button
        menuEl.appendChild(nextEl);
        nextEl.object3D.position.set(menuSize.width / 2 - buttonSize.width, offset.y, offset.z);

        // Add reactions to the button
        nextEl.classList.add('ui');
        nextEl.addEventListener('raycaster-intersected', (event) => {
            nextEl.setAttribute('material', 'color', canvasColor.hovered);
            setDescription('next page');
        });

        nextEl.addEventListener('raycaster-intersected-cleared', (event) => {
            nextEl.setAttribute('material', 'color', canvasColor.unselected);
        });

        nextEl.addEventListener('clicked', (event) => {
            nextEl.setAttribute('material', 'color', canvasColor.selected);
            loadItems(menuEl, 'button-0', (++pageIdx) * 12);

        });

        nextEl.addEventListener('clicked-cleared', (event) => {
            nextEl.setAttribute('material', 'color', canvasColor.unselected);
        });
}

/**
 * Initiate menu description
 * @param desEl Text entity
 * @param parentEl Parent entity to attach to
 */
function initDes(desEl: any, parentEl: any): void {
    parentEl.appendChild(desEl);
    desEl.setAttribute('text', {
        align: 'center',
        wrapCount: 25,
    });
    desEl.object3D.position.set(0, menuSize.height/2 - buttonSize.height/2, menuSize.depth);
}

/**
 * Load items based on selected submenu
 * @param menuEl The menu entity as parent entity to attach items
 * @param buttonID The ID of submenu button
 * @param itemIndex Starting intem index since each page can only display 9 items
 */
export function loadItems(menuEl: any, buttonID: string, itemIndex: number = 0, pageToken: string = ''): void {
    // Clear items on the current page if there are any.
    const oldItemList: any = document.querySelector('#item-list');
    if (oldItemList) oldItemList.parentNode.removeChild(oldItemList);

    // Extract submenu's name based on buttonID
    const submenuID: number = Number(buttonID.split('-')[1]);
    const submenuName: string = toolBox[submenuID];

    const itemList: any = document.createElement('a-entity');
    itemList.setAttribute('id', 'item-list');
    menuEl.appendChild(itemList);

    let i = 0;
    for (; i < itemLimit; i++) {
        if (itemIndex + i >= objects[submenuName].length) break;

        // Fetch the Item from objects
        const item: Item = objects[submenuName][itemIndex + i];
        const itemEl: any = document.createElement('a-entity');
        itemEl.setAttribute('id', item.name);

        if (item.type === 'primitive') {
            // Set up item geometry and material
            itemEl.setAttribute('geometry', 'primitive', item.name);
            itemEl.setAttribute('material', {
                color: itemColor.unselected,
                transparent: true,
                opacity: 0.8
            });

            // Resize the model into item size
            itemEl.addEventListener('loaded', () => {
                resize(itemEl, itemSize.width);
            });
        }
        else if (item.type === 'img') {
            // Set up item geometry and material
            itemEl.setAttribute('geometry', 'primitive', 'plane');
            itemEl.setAttribute('material', {
                src: `#Plus_icon`,
                color: canvasColor.unselected,
                side: 'double',
                transparent: true
            });

            // Resize the model into item size
            itemEl.addEventListener('loaded', () => {
                resize(itemEl, itemSize.width);
            });
        }
        else if (item.type === 'data') {
            itemEl.setAttribute('geometry', {
                primitive: 'cone',
                height: 0.06,
                radiusTop: 0.02,
                radiusBottom: 0.04
            });
            itemEl.setAttribute('material', {
                color: itemColor.unselected,
                transparent: true,
                opacity: 0.8
            });
            
            // Resize the model into item size
            itemEl.addEventListener('loaded', () => {
                resize(itemEl, itemSize.width);
            });
        }
        else {
            // Set up item geometry and material
            itemEl.setAttribute('obj-model', {
                obj: item.itemUrl
            });
            itemEl.setAttribute('material', {
                color: itemColor.unselected,
                transparent: true,
                opacity: 0.8
            });

            // Resize the model into item size
            itemEl.addEventListener('model-loaded', () => {
                resize(itemEl, itemSize.width);
            });
        }

        // Place the item
        itemList.appendChild(itemEl);
        itemEl.object3D.position.set(itemOffset.x +  (i%3) * itemSize.width, itemOffset.y - Math.floor(i/3) * itemSize.height, itemOffset.z);

        // Add reaction to the item.
        itemEl.classList.add('ui');
        itemEl.addEventListener('raycaster-intersected', (event) => {
            itemEl.setAttribute('material', 'color', itemColor.hovered);
            setDescription(item.name);
        });

        itemEl.addEventListener('raycaster-intersected-cleared', (event) => {
            itemEl.setAttribute('material', 'color', itemColor.unselected);
        });

        itemEl.addEventListener('clicked', (event) => {
            itemEl.setAttribute('material', 'color', itemColor.selected);
            // Use different methods of visualization when the item is an operator
            // 0: Operators; 1: Data; 2: Avatars;
            if (submenuID == 0) // 0: Operators
                instantiateOp(item);
            else if (submenuID == 1) // 1: Data
                instantiateData(item);
            else if (submenuID == 2) // 2: Avatars
                instantiateObj(item, submenuID);
            else if (submenuID == 3 && item.type === 'img') {
                const canvas2El: any = document.createElement('a-entity');
                canvas2El.setAttribute('id', 'canvas-world-2');
                const canvas1El: any = document.getElementById('canvas-world');
                const parent: any = document.getElementById('canvas');
                initCanvasBg(canvas2El, parent);
                canvas2El.object3D.position.set(canvas1El.object3D.position.x + canvasSize.width + 0.1, canvas1El.object3D.position.y, canvas1El.object3D.position.z);
                canvas2El.addEventListener('clicked', (event) => {
                    canvas1El.object3D.position.set(canvas1El.object3D.position.x, canvas1El.object3D.position.y, canvas2El.object3D.position.z);
                    canvas2El.object3D.position.set(canvas2El.object3D.position.x, canvas2El.object3D.position.y, canvas2El.object3D.position.z + 0.2);
                    currentCanvas = 'canvas-world-2';
                });
            }
        });

        itemEl.addEventListener('clicked-cleared', (event) => {
            itemEl.setAttribute('material', 'color', itemColor.unselected);
        });
    }

    if (submenuID == 3) {

    }

    if (submenuID == 4) {
        if (savedContainerId > 0) {
            const itemEl: any = document.createElement('a-entity');
            itemEl.setAttribute('id', 'op-container-0');
            // Place the item
            itemList.appendChild(itemEl);
    
            itemEl.setAttribute('obj-model', {
                obj: "#processor-obj"
            });
            itemEl.setAttribute('material', {
                color: itemColor.unselected,
                transparent: true,
                opacity: 0.8
            });
    
            // Resize the model into item size
            itemEl.addEventListener('model-loaded', () => {
                resize(itemEl, itemSize.width);
            });
            
            // Place the model.
            itemEl.object3D.position.set(itemOffset.x +  (i%3) * itemSize.width, itemOffset.y - Math.floor(i/3) * itemSize.height, itemOffset.z);

             // Add reaction to the item.
            itemEl.classList.add('ui');
            itemEl.addEventListener('raycaster-intersected', (event) => {
                itemEl.setAttribute('material', 'color', itemColor.hovered);
                setDescription('op-container-0');
            });

            itemEl.addEventListener('raycaster-intersected-cleared', (event) => {
                itemEl.setAttribute('material', 'color', itemColor.unselected);
            });

            itemEl.addEventListener('clicked', (event) => {
                itemEl.setAttribute('material', 'color', itemColor.selected);
                instantiateCtn();
            });

            itemEl.addEventListener('clicked-cleared', (event) => {
                itemEl.setAttribute('material', 'color', itemColor.unselected);
            });
        }
    }
}

/**
 * Set the text of description panel on the menu
 * @param des Text value
 */
function setDescription(des: string): void {
    const desEl: any = document.querySelector('#description-world');
    desEl.setAttribute('text', 'value', des);
}

function instantiateCtn(): void {
    const opEl: any = document.createElement('a-entity');
    const canvas: any = document.querySelector('#canvas-world');
    canvas.appendChild(opEl);

    // Add a new node into the scene and assign the id to the entity
    // opEl.setAttribute('op-node-update', {
    //     name: item.name,
    //     inputs: item.inputs,
    //     outputs: item.outputs
    // });

    // Initiate `operator-model` component
    opEl.setAttribute('geometry', {
        primitive: 'box',
        width: ctnWidth,
        height: 0.3,
        depth: ctnDepth
    });
    opEl.setAttribute('material', {
        color: '#FCA044',
        transparent: true,
        opacity: 0.5
    });

    // Place the model
    opEl.object3D.position.set(canvasConstraint.negx + itemSize.width/2, canvasConstraint.posy - itemSize.height/2, itemSize.width/2);

    // Initiate inputs.
    const lineHeight: number = 0.1;
    const ctnHeight: number = lineHeight * Math.max(savedInPorts.length, savedOutPorts.length);
    let i: number = 0;
    for (const inPort of savedInPorts) {
        const name: string = inPort.name;
        const type: string = inPort.type;
        const behavior: string = inPort.behavior;
        // Create a plug and then save it into the array.
        const plug: any = createOnePlug(name, type, behavior, -ctnWidth/2, ctnHeight/2 - lineHeight*(i+0.5), true, opEl);
        i++;
    }

    // Initiate output.
    let j: number = 0;
    for (const outPort of savedOutPorts) {
        const name: string = outPort.name;
        const type: string = outPort.type;
        const behavior: string = outPort.behavior;
        // Create a plug and then save it tinto the array.
        const plug: any = createOnePlug(name, type, behavior, ctnWidth/2, ctnHeight/2 - lineHeight*(j+0.5), false, opEl);
        j++;
    }

    // Add reactions when gripping
    opEl.classList.add('canvasObj');
    opEl.classList.add('movable');
    // Add class for identifying operators
    opEl.classList.add('operator');
}

/**
 * Create an instance operator on the canvas after clicking on the item
 * @param item The item
 */
function instantiateOp(item: Item): void {
    const opEl: any = document.createElement('a-entity');
    const canvas: any = document.querySelector('#'+currentCanvas);
    canvas.appendChild(opEl);

    // Add a new node into the scene and assign the id to the entity
    opEl.setAttribute('op-node-update', {
        name: item.name,
        inputs: item.inputs,
        outputs: item.outputs
    });

    // Initiate `operator-model` component
    const functionInputs: Array<string> = new Array<string>();
    const behaviorInputs: Array<string> = new Array<string>();
    const typeInputs: Array<string> = new Array<string>();
    const functionOutputs: Array<string> = new Array<string>();
    const behaviorOutputs: Array<string> = new Array<string>();
    const typeOutputs: Array<string> = new Array<string>();

    item.inputs.forEach((input: {name: string, type: string, behavior: string}) => {
        functionInputs.push(input.name);
        behaviorInputs.push(input.behavior);
        typeInputs.push(input.type);
    });
    item.outputs.forEach((output: {name: string, type: string, behavior: string}) => {
        functionOutputs.push(output.name);
        behaviorOutputs.push(output.behavior);
        typeOutputs.push(output.type);
    });
    opEl.setAttribute('operator-model', {
        functionName: item.name,
        functionInputs: functionInputs,
        functionOutputs: functionOutputs,
        behaviorInputs: behaviorInputs,
        behaviorOutputs: behaviorOutputs,
        typeInputs: typeInputs,
        typeOutputs: typeOutputs
    });

    // Resize the model into item size
    opEl.addEventListener('model-loaded', () => {
        resize(opEl, itemSize.width);
    });

    // Place the model
    opEl.object3D.position.set(canvasConstraint.negx + itemSize.width/2, canvasConstraint.posy - itemSize.height/2, itemSize.width/2);

    // Add reactions when gripping
    opEl.classList.add('canvasObj');
    opEl.classList.add('movable');
    // Add class for identifying operators
    opEl.classList.add('operator');
}

/**
 * Instantiate primitive data types on the panel
 * @param item The itme to initiate
 */
function instantiateData(item: Item): void {
    const instanceEl: any = document.createElement('a-entity');
    const canvas: any = document.querySelector('#canvas-world');
    canvas.appendChild(instanceEl);

    // Set up item geometry and material
    instanceEl.setAttribute('geometry', {
        primitive: 'plane',
        width: 0.2,
        height: 0.08
    });
    instanceEl.setAttribute('material', {
        color: 'white',
        transparent: true,
        roughness: 1,
        opacity: 0.8
    });
    instanceEl.setAttribute('text', {
        align: 'center',
        width: 0.6,
        wrapCount: 12,
        value: '0'
    });

    instanceEl.setAttribute('pmt-val', 'name', item.name);
    
    // Place the model
    instanceEl.object3D.position.set(canvasConstraint.negx + itemSize.width/2, canvasConstraint.posy - itemSize.height/2, itemSize.width/2);

    // Add reactions when gripping
    instanceEl.classList.add('canvasObj');
    instanceEl.classList.add('movable');
    // Add class for identifying objects
    instanceEl.classList.add('data-receiver');

    instanceEl.addEventListener('raycaster-intersected', (event) => {
        // instanceEl.setAttribute('material', 'color', objColor.hovered);
        // setDescription(item.name);
    });

    instanceEl.addEventListener('raycaster-intersected-cleared', (event) => {
        // instanceEl.setAttribute('material', 'color', objColor.unselected);
    });
}

/**
 * Create an instance object on the canvas after clicking on the item
 * @param item The item
 * @param submenuID Current submenuID
 */
function instantiateObj(item: Item, submenuID: number): void {
    const instanceEl: any = document.createElement('a-entity');
    const canvas: any = document.querySelector('#canvas-world');
    canvas.appendChild(instanceEl);

    // Set up item geometry and material
    if (item.type != 'primitive') {
        instanceEl.setAttribute('obj-model', {
            obj: item.itemUrl
        });
        instanceEl.setAttribute('material', {
            color: itemColor.unselected,
            transparent: true,
            opacity: 0.8
        });

        // Resize the model into item size
        instanceEl.addEventListener('model-loaded', () => {
            resize(instanceEl, itemSize.width);
        });
    } else {
        instanceEl.setAttribute('geometry', 'primitive', item.name);
        instanceEl.setAttribute('material', {
            color: objColor.unselected,
            transparent: true,
            opacity: 0.8
        });

        instanceEl.addEventListener('loaded', () => {
            resize(instanceEl, itemSize.width);
        });
    }
    
    // 0: Operators; 1: Data; 2: Avatars
    if ( submenuID === 2 )  {
        instanceEl.setAttribute('avatar-node-update', 'name', item.name);
        // Visualize attributes for objects as well as connectors
        const attrHeight: number = itemSize.height / item.outputs.length;
        const attrWidth: number = 0.08;
        item.outputs.forEach((output: {name: string, type: string, behavior: string}, i: number) => {
            createAttr(instanceEl, output.name, output.behavior, output.type, attrHeight, attrWidth, itemSize.height/2 - attrHeight/2 - (i*attrHeight));
        });
    }

    // Place the model
    instanceEl.object3D.position.set(canvasConstraint.negx + itemSize.width/2, canvasConstraint.posy - itemSize.height/2, itemSize.width/2);

    // Add reactions when gripping
    instanceEl.classList.add('canvasObj');
    instanceEl.classList.add('movable');
    // Add class for identifying objects
    instanceEl.classList.add('data-receiver');
    instanceEl.addEventListener('raycaster-intersected', (event) => {
        instanceEl.setAttribute('material', 'color', objColor.hovered);
        setDescription(item.name);
    });

    instanceEl.addEventListener('raycaster-intersected-cleared', (event) => {
        instanceEl.setAttribute('material', 'color', objColor.unselected);
    });
}

/**
 * Create an attribute for the selected node (Generic Models/Data/Avatars)
 * @param instanceEl The instance entity
 * @param name The label of the attribute
 * @param behavior Whether it's a signal or an event
 * @param attrHeight The geometry height
 * @param attrWidth The geometry width
 * @param posY The position Y of the attribute
 */
function createAttr(instanceEl: any, name: string, behavior: string, type: string, attrHeight: number, attrWidth: number, posY: number = 0): void {
    const attrEl: any = document.createElement('a-entity');
    instanceEl.appendChild(attrEl);
    
    // Set up geometry and material of the attribute
    attrEl.setAttribute('geometry', {
        primitive: 'plane', 
        width: attrWidth,
        height: attrHeight * 0.95
    });
    attrEl.setAttribute('material', {
        color: 'grey',
        side: 'double',
        transparent: true,
        opacity: 0.5
    });
    attrEl.setAttribute('text', {
        value: name,
        side: 'double',
        wrapCount: 9,
        align: 'center'
    });

    // Place the attribute
    attrEl.object3D.position.set(itemSize.width - attrWidth/2, posY, 0);

    // Create only one connector along with their geometries and materials
    const outCon: any = document.createElement('a-entity');

    outCon.setAttribute('geometry', {
        primitive: 'sphere', 
        radius: 0.085 * itemSize.width
    });
    
    // Set connectors' positions and add reactions.
    attrEl.appendChild(outCon);
    outCon.object3D.position.set(0.8 * attrWidth, 0, 0);
    outCon.object3D.rotation.set(0, 0, THREEMath.degToRad(-90));

    outCon.classList.add('connectable');

    if (behavior === 'signal') {
        outCon.setAttribute('geometry', {
            primitive: 'cone',
            height: 0.04,
            radiusTop: 0.01,
            radiusBottom: 0.02
        });
        outCon.object3D.rotation.set(0, 0, THREEMath.degToRad(-90));
    }
        
    if (behavior === 'event') {
        outCon.setAttribute('geometry', {
            primitive: 'sphere', 
            radius: 0.085 * itemSize.width
        });
    }

    let unselectedColor: string = getColorsByType(type)[0];
    let hoveredColor: string = getColorsByType(type)[1];
    outCon.setAttribute('material', 'color', unselectedColor);

    outCon.addEventListener('raycaster-intersected', (event) => {
        event.stopPropagation();
        outCon.setAttribute('material', 'color', hoveredColor);
    });

    outCon.addEventListener('raycaster-intersected-cleared', (event) => {
        event.stopPropagation();
        outCon.setAttribute('material', 'color', unselectedColor);
    });
}

/**
 * Load Google Poly Items based on selected submenu
 * @param itemList The item list entity
 * @param pageToken pageToken defines the which page to load
 */
export function loadPoly(itemList: any, pageToken: string): void {
    const param: object = {
        keywords: '',
        format: 'GLTF',
        pageSize: 9,
        pageToken: pageToken
    }
    $.get(googlePoly.getUrl(), param, function (data,status,xhr) {
        if (status == 'success') {
            const assets = data.assets;
            googlePoly.lastPageToken = googlePoly.nextPageToken;
            googlePoly.nextPageToken = data.nextPageToken;
            console.log(assets);

            assets.forEach((asset, i: number)=>{
                const itemEl: any = document.createElement('a-entity');
                itemEl.setAttribute('id', 'poly'+i);
                itemList.appendChild(itemEl);

                itemEl.setAttribute('geometry', {
                    primitive: 'plane',
                    width: itemSize.width,
                    height: itemSize.height
                });
                itemEl.setAttribute('material', {
                    src: asset.thumbnail.url
                });

                // Place the item
                itemEl.object3D.position.set(itemOffset.x +  (i%3) * itemSize.width, itemOffset.y - Math.floor(i/3) * itemSize.height, 0.001);

                // Add reaction to the item.
                itemEl.classList.add('ui');
                itemEl.addEventListener('raycaster-intersected', (event) => {
                    itemEl.setAttribute('material', 'color', itemColor.hovered);
                    setDescription(asset.displayName);
                });

                itemEl.addEventListener('raycaster-intersected-cleared', (event) => {
                    itemEl.setAttribute('material', 'color', itemColor.unselected);
                });

                itemEl.addEventListener('clicked', (event) => {
                    itemEl.setAttribute('material', 'color', itemColor.selected);
                    // Use different methods of visualization when the item is an operator
                    // 0: Models; 1: Data; 2: Operators; 3: Avatars; 4: Poly
                    
                    const formats = asset.formats;
                    for (let i = 0; i < formats.length; i++) {
                        if (formats[i].formatType == 'GLTF2' ) {

                            const polyEl: any = document.createElement('a-entity');
                            polyEl.setAttribute('id', asset.displayName);
                            const redux: any = document.querySelector('#redux');
                            redux.appendChild(polyEl);
                            polyEl.setAttribute('gltf-model', 'url(' + formats[i].root.url + ')');

                            polyEl.addEventListener('model-loaded', () => {
                                resize(polyEl, 1.0);
                                recenter(polyEl);
                                // resize(polyEl, 1.0);
                            });

                            const rightHand: any = document.querySelector('#rightHand');
                            rightHand.object3D.updateMatrix();
                            rightHand.object3D.updateMatrixWorld();
                            const position = rightHand.object3D.localToWorld(new Vector3(0, -0.4, -0.5));
                            polyEl.object3D.position.copy(position.clone());
                            polyEl.classList.add('movable');

                            polyEl.setAttribute('attribute-list', {
                                attrList: ['position', 'rotation'],
                                behaviorList: ['signal', 'signal'],
                                typeList: ['vector3', 'vector3']
                            });

                            // Create a object node in frp-backend, attribute updates are front-end driven. Also extract all properties from object file
                            const props: any = [{ name: 'object', default: `node-${Node.getNodeCount()}` }, { name: 'position', default: position }];

                            // Using JSON does not seem efficient
                            const objNode = scene.addObj(asset.displayName, props);
                            polyEl.setAttribute('id', objNode.getID()); // Set up node ID
                            polyEl.setAttribute('obj-node-update', 'name', asset.displayName); // Set up node update for frp
                            polyEl.classList.add('data-receiver');
                            break;
                        }
                    }
                });

                itemEl.addEventListener('clicked-cleared', (event) => {
                    itemEl.setAttribute('material', 'color', itemColor.unselected);
                });
            });
        }
    });

    return;
}