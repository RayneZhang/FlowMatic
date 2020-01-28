import * as AFRAME from 'aframe';
import { itemColor } from '../../ui/Canvas';

export const primitiveVal = AFRAME.registerComponent('pmt-val', {
    schema: {
        
    },

    init: function(): void {
        this.expand = false;
        const expandEl: any = document.createElement('a-entity');
        this.el.appendChild(expandEl);

        // Set up item geometry and material
        expandEl.setAttribute('geometry', {
            primitive: 'plane',
            width: 0.08,
            height: 0.08
        });
        expandEl.setAttribute('material', {
            color: itemColor.unselected,
            transparent: true,
            opacity: 0.8
        });

        // Place the model
        expandEl.object3D.position.set(-0.16, 0, 0);

        expandEl.classList.add('ui');

        expandEl.addEventListener('clicked', (event) => {
            console.log("Clicked!!!");
            this.expand = !this.expand;
            if (this.expand) {
                const kbEl: any = document.createElement('a-entity');
                this.el.appendChild(kbEl);
                kbEl.setAttribute('super-keyboard', {
                    hand: '#rightHand',
                    imagePath: 'assets/images/'
                });
                kbEl.object3D.position.set(0, -0.25, 0);
            }
        });
    },
});