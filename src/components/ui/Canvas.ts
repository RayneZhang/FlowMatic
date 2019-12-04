import * as AFRAME from 'aframe';
import { objects } from '../../Objects';
import { Vector3, Math as THREEMath, Euler } from 'three';
import { resize } from '../../utils/SizeConstraints';
import { scene, Node, ObjNode } from 'frp-backend';
import * as $ from 'jquery';
import { googlePoly } from '../../utils/GooglePoly';

export const canvasSize = {
    width: 1.6, 
    height: 1
};

export const menuSize = {
    width: 0.7,
    height: 1
}

export const buttonSize = {
    width: 0.1,
    height: 0.1
}

export const itemSize = {
    width: 0.2,
    height: 0.2
}

export const canvasConstraint = {
    negx: -canvasSize.width/2,
    posx: canvasSize.width/2,
    negy: -canvasSize.height/2,
    posy: canvasSize.height/2,
    constz: itemSize.width/2
}

export const canvasColor = {
    background: '#292827',
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

export const canvasGenerator = AFRAME.registerComponent('canvas-generator', {
    schema: {
        
    },

    init: function(): void {
        this.mainCam = document.querySelector('#head');

        const canvasEl: any = document.createElement('a-entity');
        const menuEl: any = document.createElement('a-entity');
        const desEl: any = document.createElement('a-entity');
        canvasEl.setAttribute('id', 'canvas-world');
        menuEl.setAttribute('id', 'menu-world');
        desEl.setAttribute('id', 'description-world');

        initCanvasBg(canvasEl, this.el);
        initMenu(menuEl, this.el);
        initDes(desEl, menuEl);
        loadItems(menuEl, 'button-4');

        // Event Listener to open and close menu.
        // this.el.object3D.visible = false;
        const listeningEl = document.querySelector('#leftHand');
        listeningEl.addEventListener('xbuttondown', (event) => {
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
                const els = document.querySelectorAll('.obj-attr-list');
                els.forEach((el: any) => {
                    el.object3D.visible = true;
                });
            }
            else {
                // Hide all the attributes
                const els = document.querySelectorAll('.obj-attr-list');
                els.forEach((el: any) => {
                    el.object3D.visible = false;
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
        primitive: 'plane',
        width: canvasSize.width,
        height: canvasSize.height
    });
    canvasEl.setAttribute('material', {
        color: canvasColor.background,
        side: 'double'
    });
    parentEl.appendChild(canvasEl);
}

/**
 * Initiate a menu panel for selecting items
 * @param parentEl The parent entity
 */
function initMenu(menuEl: any, parentEl: any): void {
    menuEl.setAttribute('geometry', {
        primitive: 'plane',
        width: menuSize.width,
        height: menuSize.height
    });
    menuEl.setAttribute('material', {
        color: canvasColor.background,
        side: 'double'
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
    const offset: Vector3 = new Vector3(-menuSize.width/2 + buttonSize.width/2, menuSize.height/2 - buttonSize.height/2, 0.001);
    Object.keys(objects).forEach((key: string, i: number) => {
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
    desEl.object3D.position.set(0, menuSize.height/2 - buttonSize.height/2, 0);
}

/**
 * Load items based on selected submenu
 * @param menuEl The menu entity as parent entity to attach items
 * @param buttonID The ID of submenu button
 * @param itemIndex Starting intem index since each page can only display 9 items
 */
function loadItems(menuEl: any, buttonID: string, itemIndex: number = 0): void {
    // Clear items on the current page if there are any.
    const oldItemList: any = document.querySelector('#item-list');
    if (oldItemList) oldItemList.parentNode.removeChild(oldItemList);

    const itemLimit: number = 9;
    const offset: Vector3 = new Vector3(-menuSize.width/2 + buttonSize.width + itemSize.width/2, menuSize.height/2 - buttonSize.height - itemSize.height/2, itemSize.width/2);

    // Extract submenu's name based on buttonID
    const submenuID: number = Number(buttonID.split('-')[1]);
    const submenuName: string = Object.keys(objects)[submenuID];

    const itemList: any = document.createElement('a-entity');
    itemList.setAttribute('id', 'item-list');
    menuEl.appendChild(itemList);

    if (submenuID == 4) {
        const param: object = {
            keywords: '',
            format: 'GLTF',
            pageSize: 9
        }
        $.get(googlePoly.getUrl(), param, function (data,status,xhr) {
            if (status == 'success') {
                const assets = data.assets;
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
                    itemEl.object3D.position.set(offset.x +  (i%3) * itemSize.width, offset.y - Math.floor(i/3) * itemSize.height, 0.001);

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

                                const rightHand: any = document.querySelector('#rightHand');
                                rightHand.object3D.updateMatrix();
                                rightHand.object3D.updateMatrixWorld();
                                const position = rightHand.object3D.localToWorld(new Vector3(0, -0.4, -0.5));
                                polyEl.object3D.position.copy(position.clone());
                                polyEl.classList.add('movable');

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

    for (let i = 0; i < itemLimit; i++) {
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
        itemEl.object3D.position.set(offset.x +  (i%3) * itemSize.width, offset.y - Math.floor(i/3) * itemSize.height, offset.z);

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
            // 0: Models; 1: Data; 2: Operators; 3: Avatars
            if (submenuID == 2)
                instantiateOp(item);
            else
                instantiateObj(item, submenuID);
        });

        itemEl.addEventListener('clicked-cleared', (event) => {
            itemEl.setAttribute('material', 'color', itemColor.unselected);
        });
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
    
    // 0: Models; 1: Data; 2: Operators; 3: Avatars
    if ( submenuID === 3 )  {
        instanceEl.setAttribute('avatar-node-update', 'name', item.name);
        // Visualize attributes for objects as well as connectors
        const attrHeight: number = itemSize.height / item.outputs.length;
        const attrWidth: number = 0.08;
        item.outputs.forEach((output: {name: string, type: string, behavior: string}, i: number) => {
            createAttr(instanceEl, output.name, output.behavior, attrHeight, attrWidth, itemSize.height/2 - attrHeight/2 - (i*attrHeight));
        });
    }
    // When the node is Generic Models/Data/Avatars
    else {
        // Create a generic object node in frp-backend.
        const genericNode = scene.addObj(item.name, [{name: 'object', type: 'object', default: item.name}]);
        instanceEl.setAttribute('id', genericNode.getID());

        const attrHeight: number = itemSize.height / item.outputs.length;
        const attrWidth: number = 0.08;
        createAttr(instanceEl, "object", "event", attrHeight, attrWidth);
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
function createAttr(instanceEl: any, name: string, behavior: string, attrHeight: number, attrWidth: number, posY: number = 0): void {
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

    let unselectedColor: string = itemColor.unselected;
    let hoveredColor: string = itemColor.hovered;

    if (behavior === 'signal') {
        unselectedColor = '#78C13B';
        hoveredColor = '#3A940E';
    }
        
    if (behavior === 'event') {
        unselectedColor = '#FC7391';
        hoveredColor = '#FB3862';
    }

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
 * Create an instance operator on the canvas after clicking on the item
 * @param item The item
 */
function instantiateOp(item: Item): void {
    const opEl: any = document.createElement('a-entity');
    const canvas: any = document.querySelector('#canvas-world');
    canvas.appendChild(opEl);

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
    opEl.setAttribute('operator-model', 'functionName', item.name);
    opEl.setAttribute('operator-model', 'functionInputs', functionInputs);
    opEl.setAttribute('operator-model', 'functionOutputs', functionOutputs);
    opEl.setAttribute('operator-model', 'behaviorInputs', behaviorInputs);
    opEl.setAttribute('operator-model', 'behaviorOutputs', behaviorOutputs);
    opEl.setAttribute('operator-model', 'typeInputs', typeInputs);
    opEl.setAttribute('operator-model', 'typeOutputs', typeOutputs);

    // Resize the model into item size
    opEl.addEventListener('model-loaded', () => {
        resize(opEl, itemSize.width);
    });

    // TODO: Add a new node into the scene and assign the id to the entity
    opEl.setAttribute('op-node-update', 'name', item.name);

    // Place the model
    opEl.object3D.position.set(canvasConstraint.negx + itemSize.width/2, canvasConstraint.posy - itemSize.height/2, itemSize.width/2);

    // Add reactions when gripping
    opEl.classList.add('canvasObj');
    opEl.classList.add('movable');
    // Add class for identifying operators
    opEl.classList.add('operator');
}