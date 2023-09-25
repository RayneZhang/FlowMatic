import * as AFRAME from 'aframe';
import { itemColor } from '../../ui/canvas';
import { STR, NUM, VECTOR, BOOL } from '../../../Objects';
import { getColorsByType } from '../../../utils/TypeVis';
import { scene, Node } from 'frp-backend';

export const primitiveVal = AFRAME.registerComponent('pmt-val', {
    schema: {
        name: {type: 'string', default: ''}
    },

    init: function(): void {
        const expandEl: any = document.createElement('a-entity');
        expandEl.setAttribute('id', this.data.name + '_expand');
        this.el.appendChild(expandEl);

        // Set up item geometry and material
        expandEl.setAttribute('geometry', {
            primitive: 'plane',
            width: 0.08,
            height: 0.08
        });
        expandEl.setAttribute('material', {
            src: "#Arrow_Down_icon",
            color: itemColor.unselected,
            transparent: true,
            opacity: 0.8
        });

        // Place the model
        expandEl.object3D.position.set(-0.15, 0, 0);
        expandEl.classList.add('ui');
        expandEl.addEventListener('clicked', (event) => {
            expandOnClick(this.data.name, this.el);
        });

        // Create dot entity and append it to the prompt of the bottle.
        const curDot: any = document.createElement('a-entity');
        this.el.appendChild(curDot);
        curDot.setAttribute('id', this.el.getAttribute('id') + '-' + 'right' + '-dot');
        curDot.classList.add('connectable');

        curDot.object3D.position.x += 0.17;

        // Set color of the sphere to white.
        curDot.setAttribute('geometry', {
            primitive: 'cone',
            height: 0.06,
            radiusTop: 0.02,
            radiusBottom: 0.04
        });
        curDot.object3D.rotation.set(0, 0, THREE.Math.degToRad(-90));

        let unselectedColor: string = getColorsByType('number')[0];
        let hoveredColor: string = getColorsByType('number')[1];
        curDot.setAttribute('material', 'color', unselectedColor);
        curDot.addEventListener('raycaster-intersected', (event) => {
            curDot.setAttribute('material', 'color', hoveredColor);
        });

        curDot.addEventListener('raycaster-intersected-cleared', (event) => {
            curDot.setAttribute('material', 'color', unselectedColor);
        });

        const props: any = [{ name: 'object', default: `node-${Node.getNodeCount()}` }, { name: 'text', default: this.el.getAttribute('text').value }];
        const objNode = scene.addObj('source', props);
        this.el.setAttribute('id', objNode.getID());
        this.el.setAttribute('obj-node-update', 'name', 'source'); // Set up node update for frp
    },
});

/**
 * Function that handles clicking on expand icon
 * @param name primitive name (e.g. string, number, vector)
 */
function expandOnClick(name: string, el: any): void {
    if (name == STR || name == NUM) {
        const kb: any = document.querySelector(`#${name}_keyboard`);
        if (kb) {
            kb.object3D.visible = !kb.object3D.visible;
        }
        else {
            const kbEl: any = document.createElement('a-entity');
            kbEl.setAttribute('id', name + '_keyboard');
            el.appendChild(kbEl);
            kbEl.setAttribute('super-keyboard', {
                hand: '#rightHand',
                imagePath: 'assets/images/'
            });
            kbEl.object3D.position.set(0, -0.25, 0);

            // Avoid creating multiple keyboards.
            kbEl.addEventListener('clicked', (event) => {
                event.stopPropagation();
            });
            kbEl.addEventListener('superkeyboardchange', (event) => {
                event.stopPropagation();
                const changedVal: string = kbEl.getAttribute('super-keyboard').value;
                el.setAttribute('text', 'value', changedVal);
            });
            kbEl.addEventListener('superkeyboarddismiss', (event) => {
                kbEl.parentNode.removeChild(kbEl);
            });
            kbEl.addEventListener('superkeyboardinput', (event) => {
                kbEl.parentNode.removeChild(kbEl);
            });
        }
    }
    else if (name == VECTOR) {
        // TODO
        console.log("Vector expanded");
    }
    else if (name == BOOL) {
        // TODO
        console.log("Bool expanded");
    }
}