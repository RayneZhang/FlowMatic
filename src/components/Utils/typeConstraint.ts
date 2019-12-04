import * as AFRAME from 'aframe'
import { Vector3 } from 'three'
import { getTypeByColor, getBehaviorByShape } from './typeVis';

const interval: number = 0.1;

export const typeConstraint = AFRAME.registerComponent('type-constraint', {
    schema: {

    },

    init: function(): void {
        const initColor = this.el.getAttribute('material').color;

        this.el.setAttribute('static-body', {
            shape: 'sphere',
            sphereRadius: 1.0
        })

        // this.el.setAttribute('sleepy', 'allowSleep', true);
        this.el.setAttribute('physics-collider', 'ignoreSleep', true);
        this.el.setAttribute('collision-filter', 'collisionForces', false);

        this.el.addEventListener('collisions', (e) => {
            console.log("Plug Collisions Triggered!");
            console.log(e.detail.els);
            if (e.detail.els.length > 0) {
                if (e.detail.els[0].getAttribute('id') == 'rightHand')
                    this.el.setAttribute('material', 'color', 'grey');
            }
            if (e.detail.clearedEls.length > 0) {
                if (e.detail.clearedEls[0].getAttribute('id') == 'rightHand')
                    this.el.setAttribute('material', 'color', initColor);
            }
        });
    },

    tick: function(time, timeDelta): void {
        
    }
});

export const disableConnectors = (type: string, behavior: string) => {
    const els = document.querySelectorAll('.connectable');
    els.forEach((el: any) => {
        const curType = getTypeByColor(el.getAttribute('material').color);
        const curBehavior = getBehaviorByShape(el.getAttribute('geometry').primitive);
        if ((curType != type && (curType != 'any') && (type != 'any')) || curBehavior != behavior) {
            el.setAttribute('material', {
                transparent: true,
                opacity: 0.1
            })
            el.classList.remove('connectable');
            el.classList.add('unconnectable');
        }
    });
};

export const enableConnectors = () => {
    const els = document.querySelectorAll('.unconnectable');
    els.forEach((el: any) => {
        el.setAttribute('material', {
            transparent: false,
            opacity: 1
        })
        el.classList.remove('unconnectable');
        el.classList.add('connectable');
    });
};