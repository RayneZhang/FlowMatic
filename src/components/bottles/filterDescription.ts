import Dot from "../../modules/Dot";

declare const THREE:any;

const filterDescription = {
    schema: {
        freeze: {type: "boolean", default: false}
    },

    init: function(): void {
        const offset = new THREE.Vector3(-0.25, 0, 0);
        this.createPrompt("Darkness", 'blue', offset.clone());
        this.createSlider(this.el);
        this.initDots();

        this.el.addEventListener('raycaster-intersected', (event) => {
            const promptEntity: any = document.querySelector('#' + this.el.id + '-prompt');
            promptEntity.object3D.visible = true;
        });

        this.el.addEventListener('raycaster-intersected-cleared', (event) => {
            if(!this.data.freeze) {
                const promptEntity: any = document.querySelector('#' + this.el.id + '-prompt');
                promptEntity.object3D.visible = false;
            }
        });
    },

    tick: function(time, timeDelta): void {

    },

    // Initiate dots for connection
    initDots: function(): void {
        const posOffset = new THREE.Vector3(0.17, 0, 0);
        const promptEntity: any = document.querySelector('#' + this.el.getAttribute('id') + '-prompt');
        const leftDot: any = new Dot(promptEntity, 'left', posOffset.clone());
        const rightDot: any = new Dot(promptEntity, 'right', posOffset.clone());
    },

    // Create prompts of the function of the bottle.
    createPrompt: function(prompt: string, _color: string, position: any): void {
        const promptEntity: any = document.createElement('a-entity');
        this.el.appendChild(promptEntity);

        promptEntity.setAttribute('id', this.el.getAttribute('id') + '-prompt');

        promptEntity.setAttribute('geometry', {
            primitive: 'plane', 
            width: 0.25,
            height: 0.15
        });

        // Initiate the panel color.
        promptEntity.setAttribute('material', {
            color: _color,
            transparent: true,
            opacity: 0.5
        });

        // Initiate tht panel content.
        promptEntity.setAttribute('text', {
            value: prompt,
            wrapCount: 10,
            align: 'center'
        });

        promptEntity.object3D.rotation.z += THREE.Math.degToRad(90);
        // Set the position related to the attached object.
        promptEntity.object3D.position.copy(position);

        // Set visibility of the object.
        // promptEntity.object3D.visible = false;
    },

    // Create the sliders of x,y,z of the attribute.
    createSlider(appendEl): void {
        const SliderEl: any = document.createElement('a-entity');
        const CursorEl: any = document.createElement('a-entity');

        appendEl.appendChild(SliderEl);
        SliderEl.appendChild(CursorEl);

        SliderEl.setAttribute('id', appendEl.getAttribute('id') + '_' + 'slider');
        CursorEl.setAttribute('id', appendEl.getAttribute('id') + '_' + 'cursor');

        SliderEl.setAttribute('geometry', {
            primitive: 'cone',
            height: 0.2,
            radiusBottom: 0.018,
            radiusTop: 0
        });
        CursorEl.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 0.025
        });

        // Attach the material component to the slider entity.
        SliderEl.setAttribute('material', 'color', this.el.getAttribute("material").color);

        // Attach the same material component to the cursor entity.
        CursorEl.setAttribute('material', 'color', this.el.getAttribute("material").color);

        SliderEl.classList.add('ui');
        CursorEl.classList.add('ui', 'slider_cursor');

        // Adjust the position offset of the cursor entity.
        CursorEl.object3D.position.set(0, 0.1, 0);

        // Place the slider entity in the layout.
        SliderEl.object3D.position.set(0, 0.15, 0);
        SliderEl.object3D.rotation.set(0, 0, THREE.Math.degToRad(90));

        // Handle material when hover.
        CursorEl.addEventListener('raycaster-intersected', (event) => {
            event.stopPropagation();
            CursorEl.setAttribute('material', 'color', 'pink'); 
        })

        // Handle material when hover cleared.
        CursorEl.addEventListener('raycaster-intersected-cleared', (event) => {
            event.stopPropagation();
            CursorEl.setAttribute('material', 'color', this.el.getAttribute("material").color); 
        })
    }  
}

export default filterDescription;