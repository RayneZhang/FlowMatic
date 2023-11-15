import * as AFRAME from 'aframe';

export const paletteKb = AFRAME.registerComponent('palette-keyboard', {
    schema: {
        targetEl: {type: 'selector', default: null}
    },

    init: function(): void {
        // Place the keyboard.
        this.el.object3D.position.set(0.26, 0, -0.15);
        this.el.object3D.rotation.set(THREE.MathUtils.degToRad(-90), 0, 0);
        this.el.object3D.scale.set(0.4, 0.4, 0.4);

        // Add super-keyboard component
        this.el.setAttribute('super-keyboard', {
            hand: '#rightHand',
            imagePath: 'assets/images/'
        });

        this.el.setAttribute('super-keyboard', {
            show: false
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
        this.el.addEventListener('palette-keyboard-visible', (event)=>{
            this.el.object3D.visible = true;
            this.el.setAttribute('super-keyboard', {
                show: true
            });
        });
    },

    update: function(): void {
        
    }
});