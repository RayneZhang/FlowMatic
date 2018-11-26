declare const THREE:any;

const objAttrList = {
    init: function(): void {

        const attrNames: any = ['position', 'rotation', 'scale', 'color'];
        
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

            const posOffset = new THREE.Vector3(0.17, 0, 0);
            this.createDotEntity(curEntity, 'left', posOffset.clone());
            this.createDotEntity(curEntity, 'right', posOffset.clone());

           // Add listeners for hovering over the list.
        //    curEntity.addEventListener('raycaster-intersected', (event) => {
        //        curEntity.setAttribute('material', 'color', 'yellow'); 
        //    });
        //    curEntity.addEventListener('raycaster-intersected-cleared', (event) => {
        //        curEntity.setAttribute('material', 'color', 'grey'); 
        //    });

           // this.createSlider(curEntity);
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

    createDotEntity: function(appendEntity: any, lr: string, offset: any): void {
        if (lr != 'left' && lr != 'right') {return;}

        // Create dot entity and append it to the prompt of the bottle.
        const curDot: any = document.createElement('a-entity');
        appendEntity.appendChild(curDot);
        curDot.setAttribute('id', this.el.getAttribute('id') + '-' + lr + '-dot');

        // Set geometry of the dot - sphere.
        curDot.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 0.03
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

    // Create the sliders of x,y,z of the attribute.
    createSlider(appendEl): void {
        const xyz: any = ['x', 'y', 'z'];
        let offset: number = 0.05;
        let currentY: number = 0;
        const sceneEl = document.querySelector('a-scene');
        sceneEl.addEventListener('loaded', (event) => {
            const modelGroup = document.querySelector('#modelGroup');
        
            for (const i of xyz) {
                const SliderEl: any = document.createElement('a-entity');
                const CursorEl: any = document.createElement('a-entity');

                appendEl.appendChild(SliderEl);
                SliderEl.appendChild(CursorEl);

                SliderEl.setAttribute('id', appendEl.getAttribute('id') + '_' + 'slider' + '_' + i);
                CursorEl.setAttribute('id', appendEl.getAttribute('id') + '_' + 'cursor' + '_' + i);

                SliderEl.setAttribute('model-subset', {
                    target: modelGroup,
                    name: 'sizebg'
                });
                CursorEl.setAttribute('model-subset', {
                    target: modelGroup,
                    name: 'size'
                });

                // Attach the material component to the slider entity.
                SliderEl.setAttribute('material', {
                    color: '#ffffff',
                    flatShading: true,
                    shader: 'flat',
                    transparent: true,
                    fog: false,
                    src: '#uinormal'
                });
                // Attach the same material component to the cursor entity.
                CursorEl.setAttribute('material', {
                    color: '#ffffff',
                    flatShading: true,
                    shader: 'flat',
                    transparent: true,
                    fog: false,
                    alphaTest: 0.5,
                    src: '#uinormal'
                });

                SliderEl.setAttribute('class', 'ui');
                CursorEl.setAttribute('class', 'ui');

                // Adjust the position offset of the cursor entity.
                CursorEl.object3D.position.set(0.06409, 0.01419, -0.10242);

                // Place the slider entity in the layout.
                SliderEl.object3D.position.set(0.2, currentY, 0.12);
                SliderEl.object3D.rotation.set(45, 0, 0);
                currentY -= offset;
            }
        });
    }    
}

export default objAttrList;