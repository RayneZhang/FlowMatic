import * as AFRAME from 'aframe'
declare const THREE:any;

const headset = AFRAME.registerComponent('headset', {
    schema: {

    },

    init: function(): void {
        // Set up position and rotation of the headset.
        this.initHeadset();
    },

    // ==========For internal call only.==========
    initHeadset: function(): void {
        const mainCamera: any = document.querySelector('#head');
        const camRot = mainCamera.getAttribute('rotation');
        this.el.object3D.rotation.copy(new THREE.Vector3(camRot.x, camRot.y, camRot.z));
    },

    // Even receivers can emit events.
    tick: function(time, timeDelta): void {
        const mainCamera: any = document.querySelector('#head');
        const camRot = mainCamera.getAttribute('rotation');
        this.el.setAttribute('rotation', {x: camRot.x, y: camRot.y, z: camRot.z});
    }
});

export default headset;