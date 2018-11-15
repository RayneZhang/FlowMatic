const bottleDescription = {
    init: function(): void {
        this.el.addEventListener('model-loaded', (event) => {
            switch (this.el.id) {
                case 'blue-bottle': 
                    this.createPrompt("Random Number");
                    break;
                case 'green-bottle':
                    this.createPrompt("Random color");
                    break;
                case 'purple-bottle':
                    this.createPrompt("Random Number");
                    break;
                case 'red-bottle':
                    this.createPrompt("Random color");
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

    createPrompt: function(prompt: string): void {
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
            color: 'green',
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
        promptEntity.object3D.position.set(0, 0.5, 0);
        
        promptEntity.object3D.visible = false;
    }
}

export default bottleDescription;