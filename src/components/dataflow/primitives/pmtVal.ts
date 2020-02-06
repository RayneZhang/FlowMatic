import * as AFRAME from 'aframe';
import { itemColor } from '../../ui/Canvas';
import { STR, NUM, VECTOR, BOOL } from '../../../Objects';

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
        expandEl.object3D.position.set(-0.16, 0, 0);
        expandEl.classList.add('ui');
        expandEl.addEventListener('clicked', (event) => {
            expandOnClick(this.data.name, this.el);
        });
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