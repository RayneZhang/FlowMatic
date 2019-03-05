declare const THREE:any;

const objAttrList = {
    schema: {
        freeze: {type: "boolean", default: false}
    },

    init: function(): void {
        // Add to the entity's class list.
        this.el.classList.add("obj-attr-list");

        const attrNames: any = ["color", "position"];
        
        // Create a menu entity and append it to the controller.
        const ListEntity: any = document.createElement('a-entity'); 

        // layout offset of the attributes.
        let offset: number = 0.4;
        let currentY: number = 0;
         
        // Create list of attributes elements.
        for (const attrName of attrNames) {
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
                color: 'grey',
                side: 'double'
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
        this.el.addEventListener('loaded', (event) => {
            // Set position of the listEntity.
            const height: number = this.calHeight(this.el);
            this.el.appendChild(ListEntity);
            ListEntity.object3D.scale.set(height, height, height);
            ListEntity.object3D.position.set(0, height/2 + offset*height, 0);
            ListEntity.setAttribute('id', this.el.getAttribute('id') + '_' + 'attributes');
        });

        // Set visible of the attribute list when (not) intersected.
        this.el.addEventListener('raycaster-intersected', (event) => {
            ListEntity.object3D.visible = true;
        });

        this.el.addEventListener('raycaster-intersected-cleared', (event) => {
            if(!this.data.freeze)
                ListEntity.object3D.visible = false;
        });
    },

    update: function(): void {
        
    },

    tick: function(time, timeDelta): void {

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

    // Calculate the height of the object.
    calHeight(obj): number {
        const mesh = obj.getObject3D('mesh');
        if (!mesh) {
            return 0;
        }

        const box = new THREE.Box3().setFromObject(mesh);
        const size = box.getSize();
        const height = size.y;
        
        return height;
    }  
}

export default objAttrList;