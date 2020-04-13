import * as AFRAME from 'aframe';

export const paletteKb = AFRAME.registerComponent('palette-keyboard', {
    schema: {
        targetEl: {type: 'selector', default: null}
    },

    init: function(): void {        
        // Create a keyboard.
        const kbEl: any = this.kbEl = document.createElement('a-entity');
        this.el.appendChild(kbEl);
        kbEl.setAttribute('id', 'palette-keyboard');
        kbEl.object3D.visible = false;
        this.visible = false;

        // Place the keyboard.
        kbEl.object3D.position.set(0.26, 0, -0.15);
        kbEl.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
        kbEl.object3D.scale.set(0.4, 0.4, 0.4);

        // Add super-keyboard component
        kbEl.setAttribute('super-keyboard', {
            hand: '#rightHand',
            imagePath: 'assets/images/'
        });

        // Avoid creating multiple keyboards.
        kbEl.addEventListener('clicked', (event) => {
            event.stopPropagation();
        });
        kbEl.addEventListener('superkeyboardchange', (event) => {
            event.stopPropagation();
            const changedVal: string = kbEl.getAttribute('super-keyboard').value;
            if (this.data.targetEl)
                this.data.targetEl.setAttribute('text', 'value', changedVal);
        });
        kbEl.addEventListener('superkeyboarddismiss', (event) => {
            kbEl.parentNode.removeChild(kbEl);
        });
        kbEl.addEventListener('superkeyboardinput', (event) => {
            kbEl.parentNode.removeChild(kbEl);
        });
    },

    update: function(): void {
        if (!this.data.targetEl) this.visible = false;
        else this.visible = !this.visible;

        this.kbEl.object3D.visible = this.visible;
    }
});