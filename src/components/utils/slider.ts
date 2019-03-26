import * as AFRAME from 'aframe'
declare const THREE:any;

const slider = AFRAME.registerComponent('slider', {
    schema: {
        value: {type: 'number', default: 5}
    },

    init: function(): void {
        this.el.classList.add('Slider');
        this.el.setAttribute('material', 'color', '#ffffff');

        this.el.addEventListener('raycaster-intersected', (event) => {
            this.el.setAttribute('material', 'color', 'yellow');
        });

        this.el.addEventListener('raycaster-intersected-cleared', (event) => {
            this.el.setAttribute('material', 'color', '#ffffff');
        });
    },

    // =====For external call.=====

    getSwitchStatus(): boolean {
        return this.data.switchOn;
    }
});

export default slider;