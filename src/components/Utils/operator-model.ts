import * as AFRAME from 'aframe';
import { MathUtils } from 'three';
declare const THREE:any;
import { getTypeByColor, getBehaviorByShape, getColorsByType } from '../../utils/TypeVis'

const lineHeight: number = 0.1;
const boxWidth: number = 0.3;

export const operatorModel = AFRAME.registerComponent('operator-model', {
    schema: {
        functionInputs: {type: 'array', default: []},
        functionOutputs: {type: 'array', default: []},
        behaviorInputs: {type: 'array', default: []},
        behaviorOutputs: {type: 'array', default: []},
        typeInputs: {type: 'array', default: []},
        typeOutputs: {type: 'array', default: []},
        functionName: {type: 'string', default: "Example Function"}
    },

    init: function(): void {
        // Parameters.
        this.lineHeight = 0.1;
        this.boxHeight = this.lineHeight * Math.max(this.data.functionInputs.length, this.data.functionOutputs.length);
        this.boxWidth = 0.3;

        // Add to the entity's class list.
        this.el.setAttribute('geometry', {
            primitive: 'box',
            width: this.boxWidth,
            height: this.boxHeight,
            depth: 0.1
        });

        this.el.setAttribute('material', {
            color: '#FCA044',
            transparent: true,
            opacity: 0.8
        });

        // Initiate plugs.
        let i: number = 0;
        for (const inputName of this.data.functionInputs) {
            const behavior: string = this.data.behaviorInputs[i];
            const type: string = this.data.typeInputs[i];
            createOnePlug(inputName, type, behavior, -boxWidth/2, this.boxHeight/2 - this.lineHeight*(i+0.5), true, this.el);
            //if (this.data.functionInputs.length >= 1)
            //    this.createPipe(new THREE.Vector3(-this.boxWidth/2, this.boxHeight/2 - this.lineHeight*(i+0.5), 0), new THREE.Vector3(this.boxWidth/2, this.boxHeight/2 - this.lineHeight/2, 0));
            i++;
        }

        // Initiate output.
        let j: number = 0;
        for (const outputName of this.data.functionOutputs) {
            const behavior: string = this.data.behaviorOutputs[j];
            const type: string = this.data.typeOutputs[j];
            createOnePlug(outputName, type, behavior, boxWidth/2, this.boxHeight/2 - this.lineHeight*(j+0.5), false, this.el);
            //if (this.data.functionOutputs.length >= 1)
            //    this.createPipe(new THREE.Vector3(-this.boxWidth/2, this.boxHeight/2 - this.lineHeight/2, 0), new THREE.Vector3(this.boxWidth/2, this.boxHeight/2 - this.lineHeight*(j+0.5), 0));
            j++;
        }

        // Initiate operator name.
        const textEntity: any = document.createElement('a-entity');
        this.el.appendChild(textEntity);
        this.createTextEntity(textEntity, this.data.functionName, new THREE.Vector3(0, this.boxHeight/2 + 0.05, 0));
    },

    // Create pipes.
    createPipe: function(_point1: any, _point2: any): void {
        const pipe: any = document.createElement('a-entity');
        this.el.appendChild(pipe);

        const height: number = _point1.distanceTo(_point2);
        const middlePoint: any = _point1.clone().add(_point2).multiplyScalar(0.5);
        const angle: number = new THREE.Vector3(0, 1, 0).angleTo(_point2.clone().sub(middlePoint));
        pipe.setAttribute('geometry', {
            primitive: 'cylinder',
            radius: 0.005,
            height: height
        });
        pipe.setAttribute('material', 'color', '#ffffff');

        pipe.object3D.position.copy(middlePoint);
        pipe.object3D.rotation.set(0, 0, -angle);
    },

    // Create a text geometry given by the entity and name.
    createTextEntity(_textEntity: any, _inputName: string, _pos: any): void {
        var loader = new THREE.FontLoader();
        loader.load( '../vendor/fonts/helvetiker_regular.typeface.json', function ( font ) {

            var geometry = new THREE.TextGeometry( _inputName, {
                font: font,
                size: 0.03,
                height: 0.005,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 0.5,
                bevelSegments: 3
            } );
            
            geometry.computeBoundingBox();
            geometry.computeVertexNormals();
            geometry.center();
            const b_geometry = new THREE.BufferGeometry().fromGeometry( geometry );
            const material = new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.8, transparent: true});
            var mesh = new THREE.Mesh( b_geometry, material );
            _textEntity.setObject3D('mesh', mesh);
            _textEntity.object3D.position.copy(_pos.clone());

        } );
    }

});

export function createOnePlug(_inputName: string, _type: string, _behavior: string, _xOffset: number, _yOffset: number, _input: boolean, operatorEl: any): any {
    // Create a plug first.
    const plug: any = document.createElement('a-entity');
    operatorEl.appendChild(plug);
    const operatorId: string = operatorEl.getAttribute('id');
    const inout: string = _input ? 'in' : 'out';
    plug.setAttribute('id', operatorId+'-'+_inputName+'-'+inout);
    plug.classList.add('connectable');
    if (_input) plug.classList.add('input');
    else plug.classList.add('output');

    if (_behavior === 'signal') {
        plug.setAttribute('geometry', {
            primitive: 'cone',
            height: 0.05,
            radiusTop: 0.015,
            radiusBottom: 0.03
        });
        if (_input)
            plug.object3D.rotation.set(0, 0, MathUtils.degToRad(90));
        else 
            plug.object3D.rotation.set(0, 0, MathUtils.degToRad(-90));
    }
        
    if (_behavior === 'event') {
        plug.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 0.02,
        });
        
    }

    let unselectedColor: string = getColorsByType(_type)[0];
    let hoveredColor: string = getColorsByType(_type)[1];    
    plug.setAttribute('material', 'color', unselectedColor);
    plug.addEventListener('raycaster-intersected', (event) => {
        const type: string = getTypeByColor(plug.getAttribute('material').color);
        const updatedHoveredColor: string = getColorsByType(type)[1];
        plug.setAttribute('material', 'color', updatedHoveredColor);
    });

    plug.addEventListener('raycaster-intersected-cleared', (event) => {
        const type: string = getTypeByColor(plug.getAttribute('material').color);
        const updatedUnselectedColor: string = getColorsByType(type)[0];
        plug.setAttribute('material', 'color', updatedUnselectedColor);
    });
    // Set up plug position.
    plug.object3D.position.set(_xOffset, _yOffset, 0);

    // Create plug description.
    const plugDescription: any = document.createElement('a-entity');
    plug.appendChild(plugDescription);

    plugDescription.setAttribute('text', {
        value: _inputName,
        side: 'double',
        wrapCount: 70,
        align: 'center',
        color: '#ffffff'
    });

    if (_input){
        plugDescription.object3D.position.set(0.06, 0, 0.05);
        if (_behavior === 'signal') {
            plugDescription.object3D.position.set(0, -0.06, 0.05);
            plugDescription.object3D.rotation.set(0, 0, MathUtils.degToRad(-90));
        }
    }
    else {
        plugDescription.object3D.position.set(-0.06, 0, 0.05);
        if (_behavior === 'signal') {
            plugDescription.object3D.position.set(0, -0.06, 0.05);
            plugDescription.object3D.rotation.set(0, 0, MathUtils.degToRad(90));
        }
    }

    return plug;
}