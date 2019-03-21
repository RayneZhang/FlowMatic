import Dot from "../../modules/Dot";

declare const THREE:any;

const filterDescription = {
    schema: {
        functionInput: {type: 'array', default: []},
        functionName: {type: 'string', default: ""}
    },

    init: function(): void {
        const offset = new THREE.Vector3(-0.078, 0, 0.026);
        this.createPrompt(this.data.functionName, '#00e640', offset.clone());
        this.createOperatorModel();
    },

    tick: function(time, timeDelta): void {

    },

    // Create Prompt of an operator
    createPrompt: function(prompt: string, _color: string, position: any): void {
        const promptEntity: any = document.createElement('a-entity');
        this.el.appendChild(promptEntity);

        promptEntity.setAttribute('id', this.el.getAttribute('id') + '-prompt');

        promptEntity.setAttribute('geometry', {
            primitive: 'plane', 
            width: 0.055,
            height: 0.025
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
        const paramEl: any = document.createElement('a-entity');
        const InputEl: any = document.createElement('a-entity');
        const OutputEl: any = document.createElement('a-entity');

        this.el.appendChild(paramEl);
        this.el.appendChild(InputEl);
        this.el.appendChild(OutputEl);

        paramEl.setAttribute('id', this.el.getAttribute('id') + '-' + 'param');
        InputEl.setAttribute('id', this.el.getAttribute('id') + '-' + 'input');
        OutputEl.setAttribute('id', this.el.getAttribute('id') + '-' + 'output');

        this.el.setAttribute('obj-model', 'obj:#functionBlock-obj');
        paramEl.setAttribute('obj-model', 'obj:#paramBlock-obj');
        InputEl.setAttribute('obj-model', 'obj:#input-obj');
        OutputEl.setAttribute('obj-model', 'obj:#output-obj');

        // Attach the material component to the slider entity.
        this.el.setAttribute('material', 'color', '#22313f');
        paramEl.setAttribute('material', 'color', '#22313f');
        InputEl.setAttribute('material', 'color', 'white');
        OutputEl.setAttribute('material', 'color', 'white');

        InputEl.classList.add('connectable', 'input');
        OutputEl.classList.add('connectable', 'output');

        InputEl.addEventListener('raycaster-intersected', (event) => {
            event.stopPropagation();
            InputEl.setAttribute('material', 'color', 'yellow'); 
        })
        InputEl.addEventListener('raycaster-intersected-cleared', (event) => {
            event.stopPropagation();
            InputEl.setAttribute('material', 'color', 'white'); 
        })

        OutputEl.addEventListener('raycaster-intersected', (event) => {
            event.stopPropagation();
            OutputEl.setAttribute('material', 'color', 'yellow'); 
        })
        OutputEl.addEventListener('raycaster-intersected-cleared', (event) => {
            event.stopPropagation();
            OutputEl.setAttribute('material', 'color', 'white'); 
        })
    }  
}

export default filterDescription;