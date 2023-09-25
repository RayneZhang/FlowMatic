import * as AFRAME from 'aframe';

export const colliderController = AFRAME.registerComponent('collider-controller', {
    
    init: function(): void {
        const selectorEl: any = document.createElement('a-entity');
        this.el.appendChild(selectorEl);

        selectorEl.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 0.02
        });
        selectorEl.setAttribute('material', {
            color: 'blue',
            transparent: true,
            opacity: 0.5
        })
        selectorEl.object3D.position.set(0, -0.035, -0.05);

        // physics-collider can report collisions with static bodies when ignoreSleep is true.
        selectorEl.setAttribute('physics-collider', 'ignoreSleep', true);
        selectorEl.setAttribute('static-body', {
            shape: 'sphere', 
            sphereRadius: 0.02
        })
        selectorEl.setAttribute('line', 'color', 'red');
    }

});