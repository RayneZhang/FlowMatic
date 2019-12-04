import * as AFRAME from 'aframe';
import { Math } from 'three';

export const cameraRotation = AFRAME.registerComponent('camera-rotation', {
    
    init: function(): void {
        this.grabbing = false;
        const cameraRig: any = document.querySelector('#cameraRig');

        this.el.addEventListener('gripdown', (event) => {
            this.grabbing = true;
        });

        this.el.addEventListener('gripup', (event) => {
            this.grabbing = false;
        });

        this.el.addEventListener('thumbrightstart', (event) => {
            if (this.grabbing)
                cameraRig.object3D.rotateY(Math.degToRad(-45));
        });
        this.el.addEventListener('thumbleftstart', (event) => {
            if (this.grabbing)
                cameraRig.object3D.rotateY(Math.degToRad(45));
        });
    }

});