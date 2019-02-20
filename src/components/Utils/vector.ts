import * as AFRAME from 'aframe'
declare const THREE:any;

const vector = AFRAME.registerComponent('vector', {
    schema: {
        seqId: {type: 'number', default: 0}
    },

    init: function(): void {
        // Private properties.
        this.coneHeight = 0.025;
        this.cylinderHeight = 0.075;

        // Create an entity and append it to the scene.
        const subEntityBody: any = document.createElement('a-entity');
        const subEntityHead: any = document.createElement('a-entity');
        const subEntityTail: any = document.createElement('a-entity');
        subEntityBody.appendChild(subEntityHead);
        subEntityBody.appendChild(subEntityTail);
        this.el.appendChild(subEntityBody);    
    
        // Set up id for the sub-entities.
        subEntityBody.setAttribute('id', 'vector-body' + this.data.seqId);
        subEntityHead.setAttribute('id', 'vector-head' + this.data.seqId);
        subEntityTail.setAttribute('id', 'vector-tail' + this.data.seqId);

        this.setVectorBody(subEntityHead, subEntityTail);

        this.setAxis();
        this.pointAt(subEntityBody, new THREE.Vector3(1, 1, 1));
    },
    
    pointAt: function(_subEntityBody, _position): void {
        // let xRad = 0;
        // let yRad = 0;
        // const startingDir = new THREE.Vector3(0, 1, 0);

        // const xPlaneProject = new THREE.Vector3(0, _position.y, _position.z);
        // xRad = startingDir.angleTo(xPlaneProject);
        // xRad = _position.z > 0 ? xRad : -xRad;

        // // Apply this x radian to starting direction.
        // startingDir.applyAxisAngle(new THREE.Vector3(1, 0, 0), xRad);
        // _subEntityBody.object3D.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), xRad);
        
        // yRad = startingDir.angleTo(_position);
        // yRad = _position.x > 0 ? yRad : -yRad;

        // // The order of rotation matters!
        // _subEntityBody.object3D.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), yRad);

        // Get the world position of current entity.
        const worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(this.el.object3D.matrixWorld);
        const relativePosition = new THREE.Vector3(worldPos.x + _position.x, worldPos.y + _position.y, worldPos.z + _position.z);
        // lookAt function takes a vector in world space.
        _subEntityBody.object3D.lookAt(relativePosition);
        _subEntityBody.object3D.rotateX(THREE.Math.degToRad(90));
    },

    setVectorBody: function(_subEntityHead, _subEntityTail): void {
        // Set up the geometry of both.
        _subEntityHead.setAttribute('geometry', {
            primitive: 'cone',
            height: this.coneHeight,
            radiusBottom: 0.01,
            radiusTop: 0
        }); 

        _subEntityTail.setAttribute('geometry', {
            primitive: 'cylinder',
            height: this.cylinderHeight,
            radius: 0.005
        }); 

        // Set up the relative position of both.
        _subEntityTail.object3D.position.set(0, this.cylinderHeight / 2, 0);
        _subEntityHead.object3D.position.set(0, this.cylinderHeight + this.coneHeight / 2, 0);
    },

    setAxis: function(): void {
        const xAxis: any = document.createElement('a-entity');
        const yAxis: any = document.createElement('a-entity');
        const zAxis: any = document.createElement('a-entity');
        this.el.appendChild(xAxis);
        this.el.appendChild(yAxis);
        this.el.appendChild(zAxis);

        xAxis.setAttribute('geometry', {
            primitive: 'cylinder',
            height: 0.1,
            radius: 0.005,
        });
        xAxis.object3D.position.set(0.05, 0, 0);
        xAxis.object3D.rotation.set(0, 0, THREE.Math.degToRad(90));

        yAxis.setAttribute('geometry', {
            primitive: 'cylinder',
            height: 0.1,
            radius: 0.005,
        });
        yAxis.object3D.position.set(0, 0.05, 0);

        zAxis.setAttribute('geometry', {
            primitive: 'cylinder',
            height: 0.1,
            radius: 0.005,
        });
        zAxis.object3D.position.set(0, 0, 0.05);
        zAxis.object3D.rotation.set(THREE.Math.degToRad(90), 0, 0);
    }
});

export default vector;