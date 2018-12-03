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
                    this.createPrompt("Random Number", 'blue', blueOffset.clone());
                    this.initDots();
                    break;
                case 'green-bottle':
                    const greenOffset = new THREE.Vector3(0.3, 0.55, 0);
                    this.createPrompt("Random color", 'green', greenOffset.clone());
                    this.initDots();
                    break;
                case 'purple-bottle':
                    const purpleOffset = new THREE.Vector3(0.65, 0.55, 0);
                    this.createPrompt("Random Number", 'purple', purpleOffset.clone());
                    this.initDots();
                    break;
                case 'red-bottle':
                    const redOffset = new THREE.Vector3(-0.05, 0.55, 0);
                    this.createPrompt("Random color", 'red', redOffset.clone());
                    this.initDots();
                    break;
            }
        });

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
        this.createDotEntity(promptEntity, 'left', posOffset.clone());
        this.createDotEntity(promptEntity, 'right', posOffset.clone());
    },

    createDotEntity: function(appendEntity: any, lr: string, offset: any): void {
        if (lr != 'left' && lr != 'right') {return;}

        // Create dot entity and append it to the prompt of the bottle.
        const curDot: any = document.createElement('a-entity');
        appendEntity.appendChild(curDot);
        curDot.setAttribute('id', this.el.getAttribute('id') + '-' + lr + '-dot');
        curDot.classList.add('connectable');

        // Set geometry of the dot - sphere.
        curDot.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 0.025
        });

        // Set color of the sphere to white.
        curDot.setAttribute('material', 'color', 'white');

        // Set the dot position according to the left or right.
        if (lr === 'left')
            curDot.object3D.position.x -= offset.x;
        if (lr === 'right')
            curDot.object3D.position.x += offset.x;

        curDot.addEventListener('raycaster-intersected', (event) => {
            curDot.setAttribute('material', 'color', 'yellow');
        });

        curDot.addEventListener('raycaster-intersected-cleared', (event) => {
            curDot.setAttribute('material', 'color', 'white');
        });
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

        // Set the position related to the attached object.
        promptEntity.object3D.position.copy(position);
    
        // Set visibility of the object.
        // promptEntity.object3D.visible = false;
    }
}

export default bottleDescription;