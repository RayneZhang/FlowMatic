import * as AFRAME from 'aframe'
declare const THREE:any;

const swtch = AFRAME.registerComponent('swtch', {
    schema: {
        switchOn: {type: 'boolean', default: false}
    },

    init: function(): void {
        this.el.classList.add('Switch');
        this.el.setAttribute('material', 'color', '#ffffff');

        this.el.addEventListener('raycaster-intersected', (event) => {
            this.el.setAttribute('material', 'color', 'yellow');
        });

        this.el.addEventListener('raycaster-intersected-cleared', (event) => {
            this.el.setAttribute('material', 'color', '#ffffff');
        });

        // Initiate rotation of the swtich.
        this.el.object3D.rotation.set(THREE.Math.degToRad(45), 0, 0);
    },

    // =====For external call.=====

    getSwitchStatus(): boolean {
        return this.data.switchOn;
    },

    switchClicked(): void {
        this.data.switchOn = !this.data.switchOn;
        if (this.data.switchOn) {
            this.el.object3D.rotation.set(THREE.Math.degToRad(-45), 0, 0);
        }
        else
            this.el.object3D.rotation.set(THREE.Math.degToRad(45), 0, 0);
    }
});

export default swtch;