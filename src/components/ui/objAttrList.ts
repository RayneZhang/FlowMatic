declare const THREE:any;

const objAttrList = {
    schema: {
        freeze: {type: "boolean", default: false},
        attrNames: {type: 'array', default: []}
    },

    init: function(): void {
        // Add to the entity's class list.
        this.el.classList.add("obj-attr-list");       
        // Create a menu entity and append it to the controller.
        const ListEntity: any = this.listEntity = document.createElement('a-entity'); 
        this.el.appendChild(this.listEntity); 

        // layout offset of the attributes.
        let offset: number = 0.35;
        let currentY: number = 0;
         
        // Create list of attributes elements.
        for (const attrName of this.data.attrNames) {
            const curEntity: any = document.createElement('a-entity');
            ListEntity.appendChild(curEntity);

            curEntity.setAttribute('id', this.el.getAttribute('id') + '_' + attrName);
            curEntity.setAttribute('geometry', {
                primitive: 'plane', 
                width: 0.5,
                height: 0.3
            });

            // Initiate the panel color.
            curEntity.setAttribute('material', {
                color: 'white',
                side: 'double',
                transparent: true,
                opacity: 0.5
            });

            // Initiate tht panel content.
            curEntity.setAttribute('text', {
                value: attrName,
                side: 'double',
                wrapCount: 10,
                align: 'center'
            });

            // Update the panel's position.
            curEntity.object3D.position.set(0, currentY, 0);
            currentY += offset;

            // Creat dots for each obj attr.
            const posOffset = new THREE.Vector3(0.35, 0, 0);
            this.createDotEntity(curEntity, 'left', posOffset.clone());
            this.createDotEntity(curEntity, 'right', posOffset.clone());
        }

        // We can only access the mesh after it is loaded.
        if (this.el.getAttribute('obj-model') || this.el.getAttribute('gltf-model'))
            this.el.addEventListener('model-loaded', this.onModelLoaded.bind(this));
        else
            this.el.addEventListener('loaded', this.onModelLoaded.bind(this));
    },

    // The listener when x-button is down.
    onModelLoaded(event): void {
        // Set position of the listEntity.
        const width: number = this.calWidth(this.el);
        this.listEntity.object3D.scale.set(width, width, width);
        this.listEntity.object3D.position.set(width/2 + 0.5*width, 0, 0);
        this.listEntity.setAttribute('id', this.el.getAttribute('id') + '_' + 'attributes');
    },

    createDotEntity: function(appendEntity: any, lr: string, offset: any): void {
        if (lr != 'left' && lr != 'right') {return;}

        // Create dot entity and append it to the prompt of the bottle.
        const curDot: any = document.createElement('a-entity');
        appendEntity.appendChild(curDot);
        curDot.setAttribute('id', this.el.getAttribute('id') + '-' + lr + '-dot');
        curDot.classList.add('connectable');
        curDot.classList.add('aabb-collider');

        // Set geometry of the dot - sphere.
        curDot.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 0.06
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

    // Calculate the width of the object.
    calWidth(_entity): number {
        const mesh: any = _entity.getObject3D('mesh');
        if (!mesh) {
            return 0;
        }

        const box = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3();
        box.getSize(size);
        const width = size.x;
        
        return width;
    }
}

export default objAttrList;