declare const THREE:any;

const objAttrList = {
    init: function(): void {

        const attrNames: any = ['position', 'rotation', 'scale'];
        
        // Create a menu entity and append it to the controller.
        const ListEntity: any = document.createElement('a-entity'); 

        // layout offset of the attributes.
        let offset: number = 0.2;
        let currentY: number = 0;
         
        // Create list of attributes elements.
        for (const attrName of attrNames) {
           const curEntity: any = document.createElement('a-entity');
           ListEntity.appendChild(curEntity);

           curEntity.setAttribute('id', this.el.getAttribute('id') + '_' + attrName);

           curEntity.setAttribute('geometry', {
               primitive: 'plane', 
               width: 0.25,
               height: 0.15
           });

           // Initiate the panel color.
           curEntity.setAttribute('material', {
               color: 'grey'
           });

           // Initiate tht panel content.
           curEntity.setAttribute('text', {
               value: attrName,
               wrapCount: 10,
               align: 'center'
           });

           // Update the panel's position.
           curEntity.object3D.position.set(0, currentY, 0);
           currentY += offset;

           // Add listeners for hovering over the list.
           curEntity.addEventListener('raycaster-intersected', (event) => {
               curEntity.setAttribute('material', 'color', 'yellow'); 
           });
           curEntity.addEventListener('raycaster-intersected-cleared', (event) => {
               curEntity.setAttribute('material', 'color', 'grey'); 
           });

           this.createSlider(curEntity);
        }

        // We can only access the mesh after it is loaded.
        this.el.addEventListener('loaded', (event) => {
            // Set position of the listEntity.
            const radius: number = this.calRadius(this.el);

            this.el.appendChild(ListEntity);
            ListEntity.object3D.position.set(radius + 0.25/2, 0, 0);
            ListEntity.setAttribute('id', this.el.getAttribute('id') + '_' + 'attributes');
        });
    },

    update: function(): void {
        
    },

    tick: function(time, timeDelta): void {

    }, 

    // Calculate the radius of the object.
    calRadius(obj): number {
        const mesh = obj.getObject3D('mesh');
        if (!mesh) {
            return 0;
        }

        const box = new THREE.Box3().setFromObject(mesh);
        const size = box.getSize();
        const extent = Math.max(size.x, size.y, size.z) / 2;
        const radius = Math.sqrt(2) * extent;
        
        return radius;
    },

    createSlider(appendEl): void {
        const xyz: any = ['x', 'y', 'z'];
        let offset: number = 0.05;
        let currentY: number = 0.06;
        const sceneEl = document.querySelector('a-scene');
        sceneEl.addEventListener('loaded', (event) => {
            const modelGroup = document.querySelector('#modelGroup');
        
            for (const i of xyz) {
                const SliderEl: any = document.createElement('a-entity');
                appendEl.appendChild(SliderEl);
                SliderEl.setAttribute('id', appendEl.getAttribute('id') + '_' + 'slider' + i);
                SliderEl.setAttribute('model-subset', {
                    target: modelGroup,
                    name: 'sizebg'
                });
                // Add the same material component of the sub-menu entity.
                SliderEl.setAttribute('material', {
                    color: '#ffffff',
                    flatShading: true,
                    shader: 'flat',
                    transparent: true,
                    fog: false,
                    src: '#uinormal'
                });

                SliderEl.object3D.position.set(0.2, currentY, 0.12);
                currentY -= offset;
            }
        });
    }    
}

export default objAttrList;