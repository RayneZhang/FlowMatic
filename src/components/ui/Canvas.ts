import * as AFRAME from 'aframe';
import { objects } from '../../Objects';
import { Vector3, Math as THREEMath } from 'three';
import { resize } from '../../utils/SizeConstraints';

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
    unselected: '#0D6D8C',
    hovered: '#8C2C0D',
    selected: '#EC5C2D',
}

export interface Item {
    name: string,
    type: string,
    url: string,
    inputs?: {name: string, type: string}[],
    outputs?: {name: string, type: string}[]
}

export const canvasGenerator = AFRAME.registerComponent('canvas-generator', {
    schema: {
        
    },

    init: function(): void {
        const canvasEl: any = document.createElement('a-entity');
        const menuEl: any = document.createElement('a-entity');
        const desEl: any = document.createElement('a-entity');
        canvasEl.setAttribute('id', 'canvas-world');
        menuEl.setAttribute('id', 'menu-world');
        desEl.setAttribute('id', 'description-world');

        initCanvasBg(canvasEl, this.el);
        initMenu(menuEl, this.el);
        initDes(desEl, menuEl);
        loadItems(menuEl, 'button-3');
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
            if (item.type === 'obj') {
                itemEl.setAttribute('obj-model', {
                    obj: item.url
                });
                itemEl.setAttribute('material', {
                    color: itemColor.unselected,
                    transparent: true,
                    opacity: 0.8
                });
                itemEl.object3D.rotation.set(THREEMath.degToRad(90), 0, 0);
            }

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
            if (submenuID != 2)
                instantiateObj(item);
            else
                instantiateOp(item);
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
 */
function instantiateObj(item: Item): void {
    const instanceEl: any = document.createElement('a-entity');
    const canvas: any = document.querySelector('#canvas-world');
    canvas.appendChild(instanceEl);

    // Set up item geometry and material
    if (item.type === 'obj') {
        instanceEl.setAttribute('obj-model', {
            obj: item.url
        });
        instanceEl.setAttribute('material', {
            color: itemColor.unselected,
            transparent: true,
            opacity: 0.8
        });
        instanceEl.object3D.rotation.set(THREEMath.degToRad(90), 0, 0);
    }

    // Resize the model into item size
    instanceEl.addEventListener('model-loaded', () => {
        resize(instanceEl, itemSize.width);
    });

    // Visualize attributes for objects
    const attrHeight: number = itemSize.height / item.outputs.length;
    const attrWidth: number = 0.08;
    item.outputs.forEach((output: {name: string, type: string}, i: number) => {
        const attrEl: any = document.createElement('a-entity');
        instanceEl.appendChild(attrEl);
        
        // Set up geometry and material of the attribute
        attrEl.setAttribute('geometry', {
            primitive: 'plane', 
            width: attrWidth,
            height: attrHeight
        });
        attrEl.setAttribute('material', {
            color: 'black',
            side: 'double'
        });
        attrEl.setAttribute('text', {
            value: `${output.name}`,
            side: 'double',
            wrapCount: 10,
            align: 'center'
        });

        // Place the attribute
        attrEl.object3D.position.set(itemSize.width - attrWidth/2, 0, itemSize.height/2 - attrHeight/2 - (i*attrHeight));
        attrEl.object3D.rotation.set(THREEMath.degToRad(-90), 0, 0);
    });
    

    // TODO: Add a new node into the scene

    // TODO: Place the model
    instanceEl.object3D.position.set(canvasConstraint.negx + itemSize.width/2, canvasConstraint.posy - itemSize.height/2, itemSize.width/2);

    // TODO: Add reactions when gripping
    instanceEl.classList.add('canvasObj');
    instanceEl.classList.add('movable');
    instanceEl.addEventListener('raycaster-intersected', (event) => {
        instanceEl.setAttribute('material', 'color', itemColor.hovered);
        setDescription(item.name);
    });

    instanceEl.addEventListener('raycaster-intersected-cleared', (event) => {
        instanceEl.setAttribute('material', 'color', itemColor.unselected);
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

    // Set up item geometry and material
    const functionInputs: Array<string> = new Array<string>();
    const functionOutputs: Array<string> = new Array<string>();
    item.inputs.forEach((input: {name: string, type: string}) => {
        functionInputs.push(input.name);
    });
    item.outputs.forEach((output: {name: string, type: string}) => {
        functionOutputs.push(output.name);
    });
    opEl.setAttribute('operator-model', 'functionName', item.name);
    opEl.setAttribute('operator-model', 'functionInputs', functionInputs);
    opEl.setAttribute('operator-model', 'functionOutputs', functionOutputs);

    // Resize the model into item size
    opEl.addEventListener('model-loaded', () => {
        resize(opEl, itemSize.width);
    });

    // TODO: Add a new node into the scene

    // TODO: Place the model
    opEl.object3D.position.set(canvasConstraint.negx + itemSize.width/2, canvasConstraint.posy - itemSize.height/2, itemSize.width/2);

    // TODO: Add reactions when gripping
    opEl.classList.add('canvasObj');
    opEl.classList.add('movable');
    opEl.addEventListener('raycaster-intersected', (event) => {
        opEl.setAttribute('material', 'color', itemColor.hovered);
        setDescription(item.name);
    });

    opEl.addEventListener('raycaster-intersected-cleared', (event) => {
        opEl.setAttribute('material', 'color', itemColor.unselected);
    });
}