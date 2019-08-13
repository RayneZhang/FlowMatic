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
    url: string
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
        loadItems(menuEl, 'button-2');
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
    const itemLimit: number = 9;
    const offset: Vector3 = new Vector3(-menuSize.width/2 + buttonSize.width + itemSize.width/2, menuSize.height/2 - buttonSize.height - itemSize.height/2, itemSize.width/2);

    // Extract submenu's name based on buttonID
    const submenuID: number = Number(buttonID.split('-')[1]);
    const submenuName: string = Object.keys(objects)[submenuID];

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
                itemEl.object3D.rotation.set(THREEMath.degToRad(-90), 0, 0);
            }

            // Resize the model into item size
            itemEl.addEventListener('model-loaded', () => {
                resize(itemEl, itemSize.width);
            });
        }

        // Place the item
        menuEl.appendChild(itemEl);
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