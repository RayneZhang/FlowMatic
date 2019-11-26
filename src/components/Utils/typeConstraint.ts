import * as AFRAME from 'aframe'
import { Vector3 } from 'three'

const interval: number = 0.1;

export const typeConstraint = AFRAME.registerComponent('type-constraint', {
    schema: {

    },

    init: function(): void {
        const initColor = this.el.getAttribute('material').color;

        this.el.setAttribute('body', {
            type: 'static',
            shape: 'none'
        })
        this.el.setAttribute('shape__main', {
            shape: 'sphere',
            radius: 1.0
        })

        // this.el.setAttribute('sleepy', 'allowSleep', true);
        this.el.setAttribute('physics-collider', 'ignoreSleep', true);
        this.el.setAttribute('collision-filter', 'collisionForces', false);

        this.el.addEventListener('collisions', (e) => {
            console.log("Plug Collisions Triggered!");
            console.log(e.detail.els);
            if (e.detail.els.length > 0) {
                if (e.detail.els[0].getAttribute('id') == 'leftHand')
                    this.el.setAttribute('material', 'color', 'grey');
            }
            if (e.detail.clearedEls.length > 0) {
                if (e.detail.clearedEls[0].getAttribute('id') == 'leftHand')
                    this.el.setAttribute('material', 'color', initColor);
            }
        });
    },

    tick: function(time, timeDelta): void {
        
    }
});