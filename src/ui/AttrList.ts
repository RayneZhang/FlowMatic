declare const THREE:any;

class AttrList {

    // The attribute names of the 3D object.
    public attrNames: any = ['position', 'rotation', 'scale'];

    space: number = 0.2;

    constructor(AppendEl: any) {
         // Create a menu entity and append it to the controller.
         const ListEntity: any = document.createElement('a-entity'); 
         
         // Create list of attributes elements.
         for (const attrName of this.attrNames) {
            const curEntity: any = document.createElement('a-entity');
            ListEntity.appendChild(curEntity);
            curEntity.setAttribute('id', attrName);

            curEntity.setAttribute('geometry', {
                primitive: 'plane', 
                width: 0.5,
                height: 0.5
            });

            curEntity.setAttribute('material', {
                color: 'grey'
            });

            curEntity.setAttribute('text', {
                value: attrName
            });

            // Add listeners for hovering over the list.
            curEntity.addEventListener('raycaster-intersected', (event) => {
                curEntity.setAttribute('material', 'color', 'yellow'); 
            });
            curEntity.addEventListener('raycaster-intersected-cleared', (event) => {
                curEntity.setAttribute('material', 'color', 'grey'); 
            });
        }

        // Set position of the listEntity.
        const radius: number = this.calRadius(AppendEl);

        AppendEl.appendChild(ListEntity);
        ListEntity.object3D.position.set(radius, 0, 0);
        ListEntity.setAttribute('id', AppendEl.getAttribute('id') + 'attributes');
    }

    // Calculate the radius of the object.
    calRadius(obj): number {
        console.log(obj.object3DMap);
        const mesh = obj.getObject3D('mesh');
        if (!mesh) {
            console.log(mesh);
            return 0;
        }

        const box = new THREE.Box3().setFromObject(mesh);
        const size = box.getSize();
        const extent = Math.max(size.x, size.y, size.z) / 2;
        const radius = Math.sqrt(2) * extent;

        console.log("radius is: " + radius);
        
        return radius;
    }

}

export default AttrList;