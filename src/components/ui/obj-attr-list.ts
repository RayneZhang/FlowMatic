declare const THREE:any;
import * as AFRAME from 'aframe';
import { objects } from '../../Objects';
import { getColorsByType } from '../../utils/TypeVis';

const objAttrList = AFRAME.registerComponent('obj-attributes-list', {
    schema: {
        freeze: {type: "boolean", default: false},
        targetModelName: {type: "string", default: ""},
        attrList: {type: "array", default: []},
        behaviorList: {type: "array", default: []},
        typeList: {type: "array", default: []}
    },

    init: function(): void {
        // Create a menu entity and append it to the controller.
        const ListEntity: any = this.listEntity = document.createElement('a-entity'); 
        this.el.appendChild(this.listEntity); 
        // Add to the entity's class list.
        ListEntity.classList.add("obj-attr-list"); 
        let index: number = 0;
        for ( let i = 0; i < objects.Models.length; i++) {
            if (objects.Models[i].name == this.data.targetModelName) { 
                index = i;
                // console.log(objects.Models[index].outputs);
                objects.Models[index].outputs.forEach((output) => {
                    this.data.attrList.push(output.name);
                    this.data.behaviorList.push(output.behavior);
                    this.data.typeList.push(output.type);
                });
            }
        }

        if (this.data.targetModelName == 'text') {
            this.data.attrList.push('object');
            this.data.behaviorList.push('event');
            this.data.typeList.push('object');
            this.data.attrList.push('position');
            this.data.behaviorList.push('signal');
            this.data.typeList.push('vector3');
            this.data.attrList.push('color');
            this.data.behaviorList.push('signal');
            this.data.typeList.push('string');
            this.data.attrList.push('value');
            this.data.behaviorList.push('signal');
            this.data.typeList.push('string');
        }

        // layout offset of the attributes.
        let offset: number = 0.35;
        let currentY: number = 0;
         
        // Create list of attributes elements.
        let j: number = 0;
        for (const attrName of this.data.attrList) {
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

            this.createDotEntity(curEntity, 'right', this.data.behaviorList[j], this.data.typeList[j], posOffset.clone());
            j++;
        }

        // We can only access the mesh after it is loaded.
        if (this.data.targetModelName == 'text') {
            let width: number = 0.6;
            this.listEntity.object3D.scale.set(width, width, width);
            this.listEntity.object3D.position.set(width, 0, 0);
            this.listEntity.setAttribute('id', this.el.getAttribute('id') + '_' + 'attributes');
        }
        else {
            this.el.addEventListener('model-loaded', this.onModelLoaded.bind(this));
            this.el.addEventListener('loaded', this.onModelLoaded.bind(this));
        }
    },

    // The listener when x-button is down.
    onModelLoaded(event): void {
        // Set position of the listEntity.
        let width: number = this.calWidth(this.el);
        this.listEntity.object3D.scale.set(width, width, width);
        this.listEntity.object3D.position.set(width, 0, 0);
        this.listEntity.setAttribute('id', this.el.getAttribute('id') + '_' + 'attributes');
    },

    createDotEntity: function(appendEntity: any, lr: string, behavior:string, type:string, offset: any): void {
        if (lr != 'left' && lr != 'right') {return;}

        // Create dot entity and append it to the prompt of the bottle.
        const curDot: any = document.createElement('a-entity');
        appendEntity.appendChild(curDot);
        curDot.setAttribute('id', this.el.getAttribute('id') + '-' + lr + '-dot');
        curDot.classList.add('connectable');

        // Set the dot position according to the left or right.
        if (lr === 'left')
            curDot.object3D.position.x -= offset.x;
        if (lr === 'right')
            curDot.object3D.position.x += offset.x;

        // Set color of the sphere to white.
        if (behavior === 'signal') {
            curDot.setAttribute('geometry', {
                primitive: 'cone',
                height: 0.15,
                radiusTop: 0.045,
                radiusBottom: 0.09
            });
            curDot.object3D.rotation.set(0, 0, THREE.Math.degToRad(-90));
        }
            
        if (behavior === 'event') {
            curDot.setAttribute('geometry', {
                primitive: 'sphere',
                radius: 0.06,
            });
            
        }

        let unselectedColor: string = getColorsByType(type)[0];
        let hoveredColor: string = getColorsByType(type)[1];
        curDot.setAttribute('material', 'color', unselectedColor);
        curDot.addEventListener('raycaster-intersected', (event) => {
            curDot.setAttribute('material', 'color', hoveredColor);
        });

        curDot.addEventListener('raycaster-intersected-cleared', (event) => {
            curDot.setAttribute('material', 'color', unselectedColor);
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
        const width = Math.max(size.x, size.y, size.z);
        
        return width;
    }
});

export default objAttrList;