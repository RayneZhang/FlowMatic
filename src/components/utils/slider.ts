import * as AFRAME from 'aframe'
declare const THREE:any;

const slider = AFRAME.registerComponent('slider', {
    schema: {
        value: {type: 'number', default: 5}
    },

    init: function(): void {
        // Private properties.
        this.valueRange = 0.3;
        this.maxValue = 10;

        this.el.classList.add('Slider');
        this.el.setAttribute('material', 'color', '#ffffff');

        this.el.addEventListener('raycaster-intersected', (event) => {
            this.el.setAttribute('material', 'color', 'yellow');
        });

        this.el.addEventListener('raycaster-intersected-cleared', (event) => {
            this.el.setAttribute('material', 'color', '#ffffff');
        });

        // Init value label and output plug.
        const valueLabel: any = this.valueLabel = document.createElement('a-entity');
        const inputPlug: any = this.inputPlug = document.createElement('a-entity');
        const outputPlug: any = this.outputPlug = document.createElement('a-entity');
        this.el.parentNode.appendChild(valueLabel);
        this.el.parentNode.appendChild(inputPlug);
        this.el.parentNode.appendChild(outputPlug);
        this.initPlug(inputPlug);
        this.initPlug(outputPlug);
        this.updateValueLabel();
    },

    initPlug: function(_plug: any): void {
        _plug.setAttribute('obj-model', 'obj:#plug-obj');
        _plug.setAttribute('material', 'color', 'white'); 
        _plug.classList.add('connectable');
        _plug.addEventListener('raycaster-intersected', (event) => {
            event.stopPropagation();
            _plug.setAttribute('material', 'color', 'yellow'); 
        })
        _plug.addEventListener('raycaster-intersected-cleared', (event) => {
            event.stopPropagation();
            _plug.setAttribute('material', 'color', 'white'); 
        })
        _plug.object3D.rotation.set(THREE.Math.degToRad(90), 0, 0);
        _plug.object3D.scale.set(3, 3, 3);
    },

    updateValueLabel: function(): void {
        this.valueLabel.object3D.position.set(0, 0.12, 0);
        this.valueLabel.setAttribute('text', {
            value: this.data.value.toString(),
            align: 'center',
            wrapCount: 20
        });
        this.inputPlug.object3D.position.set(-0.12, 0.12, 0);
        this.outputPlug.object3D.position.set(0.12, 0.12, 0);
    },

    // =====For external call.=====

    getSliderValue(): number {
        return this.data.value;
    },

    // This function is just used to display a number value.
    setSliderValue(_value: number): void {
        this.data.value = Math.round(_value * 100) / 100;
        this.valueLabel.setAttribute('text', 'value', this.data.value.toString());
        this.el.object3D.position.set(0.3, 0, 0);
    },

    getValueRange(): number {
        return this.valueRange;
    },

    setSliderValueByPosX(_posX: number): void {
        this.data.value = Math.round((_posX + this.valueRange) / (2*this.valueRange) * 1000) / (1000/this.maxValue);
        this.valueLabel.setAttribute('text', 'value', this.data.value.toString());
    }
});

export default slider;