declare const THREE:any;

class AttrList {

    // The attribute names of the 3D object.
    attrNames: any = ['position', 'rotation', 'scale'];

    constructor(AppendEl: any) {
         // Create a menu entity and append it to the controller.
         const ListEntity: any = document.createElement('a-entity');
         AppendEl.appendChild(ListEntity);
         ListEntity.setAttribute('id', AppendEl.getAttribute('id') + 'attributes');
         
         for (const attrName of this.attrNames) {
            const curEntity: any = document.createElement('a-entity');
            ListEntity.appendChild(curEntity);
            curEntity.setAttribute('id', attrName);
            curEntity.setAttribute('geometry', {
                primitive: 'plane',
                width: 0.5,
                height: 0.5
            });

            curEntity.setAttribute('text', {
                value: attrName
            });
         }
    }
    
}

export default AttrList;