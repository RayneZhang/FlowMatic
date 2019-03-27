import Dot from "../../modules/Dot";

declare const THREE:any;

const bottleDescription = {
    schema: {
        freeze: {type: "boolean", default: false}
    },

    init: function(): void {
        this.el.addEventListener('model-loaded', (event) => {
            switch (this.el.id) {
                case 'blue-bottle': 
                    const blueOffset = new THREE.Vector3(-0.450, 0.55, 0);
                    this.createPrompt("Random Color", 'blue', blueOffset.clone());
                    this.initDots();
                    break;
                case 'green-bottle':
                    const greenOffset = new THREE.Vector3(0.3, 0.55, 0);
                    this.createPrompt("Random color", 'green', greenOffset.clone());
                    this.initDots();
                    break;
                case 'purple-bottle':
                    const purpleOffset = new THREE.Vector3(0.65, 0.55, 0);
                    this.createPrompt("Random Color", 'purple', purpleOffset.clone());
                    this.initDots();
                    break;
                case 'red-bottle':
                    const redOffset = new THREE.Vector3(-0.05, 0.55, 0);
                    this.createPrompt("Random color", 'red', redOffset.clone());
                    this.initDots();
                    break;
                default:
                    const defaultOffset = new THREE.Vector3(-0.450, 0.55, 0);
                    this.createPrompt("Random Color", 'blue', defaultOffset.clone());
                    this.initDots();
                    break;
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
    
        // Set visibility of the object.
        // promptEntity.object3D.visible = false;
    }
}

export default bottleDescription;