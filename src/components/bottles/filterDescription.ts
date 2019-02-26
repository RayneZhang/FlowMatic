import Dot from "../../modules/Dot";

declare const THREE:any;

const filterDescription = {
    schema: {
        freeze: {type: "boolean", default: false},
        sliding: {type: "boolean", default: false},
        filterName: {type: 'string', default: ""}
    },

    init: function(): void {
        const offset = new THREE.Vector3(0, 0.25, 0);
        this.data.filterName = this.el.getAttribute('data-filter').filterName;
        this.createPrompt(this.data.filterName, 'blue', offset.clone());
        this.createOperatorModel();
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

    // Create Prompt of an operator
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
            side: 'double',
            transparent: true,
            opacity: 0.5
        });

        // Initiate tht panel content.
        promptEntity.setAttribute('text', {
            value: prompt,
            side: 'double',
            wrapCount: 10,
            align: 'center'
        });

        // Set the position related to the attached object.
        promptEntity.object3D.position.copy(position);
    },

    // Create a model of an operator.
    createOperatorModel(): void {
        const ShellEl: any = document.createElement('a-entity');
        const SliderEl: any = document.createElement('a-entity');
        const InputEl: any = document.createElement('a-entity');
        const OutputEl: any = document.createElement('a-entity');

        this.el.appendChild(ShellEl);
        this.el.appendChild(SliderEl);
        this.el.appendChild(InputEl);
        this.el.appendChild(OutputEl);

        ShellEl.setAttribute('id', this.el.getAttribute('id') + '-' + 'shell');
        SliderEl.setAttribute('id', this.el.getAttribute('id') + '-' + 'slider');
        InputEl.setAttribute('id', this.el.getAttribute('id') + '-' + 'input');
        OutputEl.setAttribute('id', this.el.getAttribute('id') + '-' + 'output');

        ShellEl.setAttribute('obj-model', 'obj:#shell-obj');
        SliderEl.setAttribute('obj-model', 'obj:#slider-obj');
        InputEl.setAttribute('obj-model', 'obj:#input-obj');
        OutputEl.setAttribute('obj-model', 'obj:#output-obj');

        // Attach the material component to the slider entity.
        ShellEl.setAttribute('material', 'color', 'grey');
        SliderEl.setAttribute('material', 'color', 'white');
        InputEl.setAttribute('material', 'color', 'white');
        OutputEl.setAttribute('material', 'color', 'white');

        SliderEl.classList.add('ui', 'slider');
        InputEl.classList.add('connectable', 'input');
        OutputEl.classList.add('connectable', 'output');

        // Adjust the position offset of the cursor entity.
        // if (this.data.filterName === "darkness")
        //     CursorEl.object3D.position.set(0, 0.1, 0);

        // Handle material when hover.
        SliderEl.addEventListener('raycaster-intersected', (event) => {
            event.stopPropagation();
            SliderEl.setAttribute('material', 'color', 'yellow'); 
        })

        // Handle material when hover cleared.
        SliderEl.addEventListener('raycaster-intersected-cleared', (event) => {
            event.stopPropagation();
            if (this.data.sliding)
                return;
            SliderEl.setAttribute('material', 'color', 'grey'); 
        })
    }  
}

export default filterDescription;