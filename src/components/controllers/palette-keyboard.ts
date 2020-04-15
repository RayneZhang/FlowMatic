import * as AFRAME from 'aframe';

export const paletteKb = AFRAME.registerComponent('palette-keyboard', {
    schema: {
        targetEl: {type: 'selector', default: null}
    },

    init: function(): void {
        this.el.object3D.visible = false;

        // Place the keyboard.
        this.el.object3D.position.set(0.26, 0, -0.15);
        this.el.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
        this.el.object3D.scale.set(0.4, 0.4, 0.4);

        // Add super-keyboard component
        this.el.setAttribute('super-keyboard', {
            hand: '#rightHand',
            imagePath: 'assets/images/'
        });

        // Avoid creating multiple keyboards.
        this.el.addEventListener('clicked', (event) => {
            event.stopPropagation();
        });
        this.el.addEventListener('superkeyboardchange', (event) => {
            event.stopPropagation();
            const changedVal: string = this.el.getAttribute('super-keyboard').value;
            if (this.data.targetEl)
                this.data.targetEl.setAttribute('text', 'value', changedVal);
        });
        this.el.addEventListener('superkeyboarddismiss', (event) => {
            this.el.parentNode.removeChild(this.el);
        });
        this.el.addEventListener('superkeyboardinput', (event) => {
            this.el.parentNode.removeChild(this.el);
        });

        this.el.addEventListener('palette-keyboard-visible', (event)=>{
            // console.log('palette-keyboard-visible received');
            this.el.object3D.visible = !this.el.object3D.visible;
        });
    },

    update: function(): void {
        
    }
});