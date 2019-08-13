import * as AFRAME from 'aframe';
import { objects } from '../../Objects';
import { Vector3 } from 'three';
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
    unselected: '#252423',
    hovered: '#979593',
    selected: '#0078d4',
    item: '#87ceeb'
};

export interface Item {
    name: string,
    type: string,
    url: string
}

export const canvasGenerator = AFRAME.registerComponent('canvas-generator', {
    schema: {
        
    },

    init: function(): void {
        initCanvasBg(this.el);
        initMenu(this.el);
    }
});

/**
 * Initiate a plane and specify parameters
 */
function initCanvasBg(parentEl: any): void {
    const canvasEl: any = document.createElement('a-entity');
    canvasEl.setAttribute('id', 'canvas-world');
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
function initMenu(parentEl: any): void {
    const menuEl: any = document.createElement('a-entity');
    menuEl.setAttribute('id', 'menu-world');
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
    loadItems(menuEl, 'button-0');
}

/**
 * Initate submenu buttons for switching objects
 * @param menuEl The menu entity
 */
function initButtons(menuEl: any): void {
    const offset: Vector3 = new Vector3(-menuSize.width/2 + buttonSize.width/2, menuSize.height/2 - buttonSize.height/2, 0.001);
    Object.keys(objects).forEach((key: string, i: number) => {
        const bnEl: any = document.createElement('a-entity');
        bnEl.setAttribute('id', `button-${i}`);
        bnEl.setAttribute('geometry', {
            primitive: 'plane',
            width: buttonSize.width,
            height: buttonSize.height
        });
        bnEl.setAttribute('material', {
            color: canvasColor.unselected,
            side: 'double'
        });
        menuEl.appendChild(bnEl);
        bnEl.object3D.position.set(offset.x, offset.y - buttonSize.height * i, offset.z);
    });
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

        const item: Item = objects[submenuName][itemIndex + i];
        const itemEl: any = document.createElement('a-entity');
        if (item.type === 'primitive') {
            itemEl.setAttribute('id', item.name);
            itemEl.setAttribute('geometry', 'primitive', item.name);
            itemEl.setAttribute('material', {
                color: canvasColor.item,
                transparent: true,
                opacity: 0.8
            });
        }

        // Resize the model into item size
        resize(itemEl, itemSize.width);

        // Place the item
        menuEl.appendChild(itemEl);
        itemEl.object3D.position.set(offset.x +  (i%3) * itemSize.width, offset.y - Math.floor(i/3) * itemSize.height, offset.z);
    }
}