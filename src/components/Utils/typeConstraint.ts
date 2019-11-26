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
        this.el.setAttribute('physics-collider', 'ignoreSleep', true);
        this.el.setAttribute('collision-filter', 'collisionForces', false);

        this.el.addEventListener('collisions', (e) => {
            console.log("Plug Collisions Triggered!");
            console.log(e.detail.els);
            if (e.detail.els.length > 0) {
                this.el.setAttribute('material', 'color', 'grey');
            }
        });
    },

    tick: function(time, timeDelta): void {
        
    }
});