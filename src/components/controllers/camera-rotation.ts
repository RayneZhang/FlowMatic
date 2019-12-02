import * as AFRAME from 'aframe';
import { Math } from 'three';

export const cameraRotation = AFRAME.registerComponent('camera-rotation', {
    
    init: function(): void {
        const cameraRig: any = document.querySelector('#cameraRig');
        this.el.addEventListener('thumbrightstart', (event) => {
            cameraRig.object3D.rotateY(Math.degToRad(-45));
        });
        this.el.addEventListener('thumbleftstart', (event) => {
            cameraRig.object3D.rotateY(Math.degToRad(45));
        });
    }

});