declare const THREE:any;

const bottleDescription = {
    init: function(): void {
        this.el.addEventListener('model-loaded', (event) => {
            switch (this.el.id) {
                case 'blue-bottle': 
                    const blueOffset = new THREE.Vector3(-0.450, 0.55, 0);
                    this.createPrompt("Random Number", 'blue', blueOffset.clone());
                    break;
                case 'green-bottle':
                    const greenOffset = new THREE.Vector3(0.3, 0.55, 0);
                    this.createPrompt("Random color", 'green', greenOffset.clone());
                    break;
                case 'purple-bottle':
                    const purpleOffset = new THREE.Vector3(0.65, 0.55, 0);
                    this.createPrompt("Random Number", 'purple', purpleOffset.clone());
                    break;
                case 'red-bottle':
                    const redOffset = new THREE.Vector3(-0.05, 0.55, 0);
                    this.createPrompt("Random color", 'red', redOffset.clone());
                    break;
            }
        });

        this.el.addEventListener('raycaster-intersected', (event) => {
            const promptEntity: any = document.querySelector('#' + this.el.id + '-prompt');
            promptEntity.object3D.visible = true;
        });

        this.el.addEventListener('raycaster-intersected-cleared', (event) => {
            const promptEntity: any = document.querySelector('#' + this.el.id + '-prompt');
            promptEntity.object3D.visible = false;
        });
    },

    tick: function(time, timeDelta): void {

    },

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

        // Set the position related to the attached object.
        promptEntity.object3D.position.copy(position);
    
        // Set visibility of the object.
        promptEntity.object3D.visible = false;
    }
}

export default bottleDescription;