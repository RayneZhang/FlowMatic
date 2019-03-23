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
        this.createOperatorPlane();

        const length = this.data.functionInputs.length;
        
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

    // Create a plane of an operator.
    createOperatorPlane(): void {
        this.el.setAttribute('geometry', 'primitive', 'plane');

        this.el.setAttribute('material', {
            color: '#7befb2', 
            shader: 'standard',
            emissive: '#7befb2',
            emissiveIntensity: 0.35,
            side: 'double',
            transparent: true,
            opacity: 0.9,
            fog: true
        });
    }  
}

export default filterDescription;