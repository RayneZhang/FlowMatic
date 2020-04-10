import * as AFRAME from 'aframe';
import { LIGHT, GIFT } from '../../Objects';

/**
 * This component is used for initializing .obj and .gltf/.glb objects in the scene, such as adding components.
 */
export const objInit = AFRAME.registerComponent('obj-init', {
    schema: {
        name: {type: 'string', default: ""}
    },

    init: function(): void {
        // Most of the objects do not need attaching components
        if (!this.data.name) return;
        switch (this.data.name) {
            case LIGHT: {
                this.el.setAttribute('spotlight', 'color', 'white');
                break;
            }
            case GIFT: {
                // Set up bounding boxes for the object
                this.el.setAttribute('body', {
                    type: 'static',
                    shape: 'none'
                })
                this.el.setAttribute('shape__main', {
                    shape: 'cylinder',
                    height: 0.8,
                    radiusTop: 0.2,
                    radiusBottom: 0.2
                })
                this.el.setAttribute('physics-collider', 'ignoreSleep', true);
                this.el.setAttribute('collision-filter', 'collisionForces', false);

                this.el.addEventListener('collisions', (e) => {
                    console.log("Collisions triggered! " + this.el.getAttribute('id'));
                    console.log(e.detail.els);
                    if (e.detail.els.length > 0) {
                        this.el.setAttribute('animation-mixer', {
                            clip: 'Open',
                            loop: 'once',
                            timeScale: 0.5
                        });
                    }
                    console.log(e.detail.clearedEls);
                });

                break;
            }
        }
    }
});