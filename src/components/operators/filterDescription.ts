import Dot from "../../modules/Dot";

declare const THREE:any;

const filterDescription = {
    schema: {
        functionInputs: {type: 'array', default: []},
        functionName: {type: 'string', default: ""}
    },

    init: function(): void {
        const yOffset = 0.05;
        const inputPromptOffset = new THREE.Vector3(-0.078, 0, 0.026);
        this.createOperatorModel();

        const length = this.data.functionInputs.length;
        const startingY = 0.025 * (length - 1);
        for (let i = 0; i < length; i++) {
            const paramEl: any = document.createElement('a-entity');
            const InputEl: any = document.createElement('a-entity');

            this.el.appendChild(paramEl);
            this.el.appendChild(InputEl);

            paramEl.object3D.position.y += startingY - yOffset * i; 
            InputEl.object3D.position.y += startingY - yOffset * i; 
            this.createPrompt(this.data.functionInputs[i], '#00e640', inputPromptOffset.clone().setY(startingY - 0.05 * i));

            paramEl.setAttribute('id', this.el.getAttribute('id') + '-' + 'param' + i);
            InputEl.setAttribute('id', this.el.getAttribute('id') + '-' + 'input' + i);

            paramEl.setAttribute('obj-model', 'obj:#paramBlock-obj');
            InputEl.setAttribute('obj-model', 'obj:#input-obj');

            // Attach the material component to the slider entity.
            paramEl.setAttribute('material', 'color', '#22313f');
            InputEl.setAttribute('material', 'color', 'white');

            InputEl.classList.add('connectable', 'input');

            InputEl.addEventListener('raycaster-intersected', (event) => {
                event.stopPropagation();
                InputEl.setAttribute('material', 'color', 'yellow'); 
            })
            InputEl.addEventListener('raycaster-intersected-cleared', (event) => {
                event.stopPropagation();
                InputEl.setAttribute('material', 'color', 'white'); 
            })
        }
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
        const functionEl: any = document.createElement('a-entity');
        functionEl.setAttribute('id', this.el.getAttribute('id') + '-' + 'function');
        this.el.appendChild(functionEl);
        functionEl.setAttribute('obj-model', 'obj:#functionBlock-obj');
        functionEl.setAttribute('material', 'color', '#22313f');
        functionEl.object3D.scale.set(1, this.data.functionInputs.length, 1);

        const OutputEl: any = document.createElement('a-entity');
        OutputEl.setAttribute('id', this.el.getAttribute('id') + '-' + 'output');
        OutputEl.classList.add('connectable', 'output');
        this.el.appendChild(OutputEl);

        OutputEl.setAttribute('obj-model', 'obj:#output-obj');
        OutputEl.setAttribute('material', 'color', 'white');

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