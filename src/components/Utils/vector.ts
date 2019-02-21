import * as AFRAME from 'aframe'
declare const THREE:any;

const vector = AFRAME.registerComponent('vector', {
    schema: {
        seqId: {type: 'number', default: 0},
        selectedArrow: {type: 'string', default: ''}
    },

    init: function(): void {
        // Private properties.
        this.coneHeight = 0.025;
        this.cylinderHeight = 0.075;

        // Create an entity and append it to the scene.
        const subEntityBody: any = document.createElement('a-entity');
        const subEntityHead: any = document.createElement('a-entity');
        const subEntityTail: any = document.createElement('a-entity');
        // Set up id for the sub-entities.
        subEntityBody.setAttribute('id', 'vector-body' + this.data.seqId);
        subEntityHead.setAttribute('id', 'vector-head' + this.data.seqId);
        subEntityTail.setAttribute('id', 'vector-tail' + this.data.seqId);
        // Append children.
        subEntityBody.appendChild(subEntityHead);
        subEntityBody.appendChild(subEntityTail);
        this.el.appendChild(subEntityBody);

        // Create longitude and latitude axis.
        const latitude: any = document.createElement('a-entity');
        latitude.setAttribute('id', 'latitude' + this.data.seqId);
        const longitude: any = document.createElement('a-entity');
        longitude.setAttribute('id', 'longitude' + this.data.seqId);
        const latitudeAxis: any = document.createElement('a-entity');
        latitudeAxis.setAttribute('id', 'latitude-axis' + this.data.seqId);
        const longitudeAxis: any = document.createElement('a-entity');
        longitudeAxis.setAttribute('id', 'longitude-axis' + this.data.seqId);

        const latitudeArrowLeft: any = document.createElement('a-entity');
        latitudeArrowLeft.setAttribute('id', 'latitude-arrow-left' + this.data.seqId);
        this.initSelectedArrow(latitudeArrowLeft, 'left');

        const latitudeArrowRight: any = document.createElement('a-entity');
        latitudeArrowRight.setAttribute('id', 'latitude-arrow-right' + this.data.seqId);
        this.initSelectedArrow(latitudeArrowRight, 'right');

        const longitudeArrowUp: any = document.createElement('a-entity');
        longitudeArrowUp.setAttribute('id', 'longitude-arrow-up' + this.data.seqId);
        this.initSelectedArrow(longitudeArrowUp, 'up');

        const longitudeArrowDown: any = document.createElement('a-entity');
        longitudeArrowDown.setAttribute('id', 'longitude-arrow-down' + this.data.seqId);
        this.initSelectedArrow(longitudeArrowDown, 'down');

        // Append children.
        latitude.appendChild(latitudeAxis);
        latitude.appendChild(latitudeArrowLeft);
        latitude.appendChild(latitudeArrowRight);
        longitude.appendChild(longitudeAxis);
        longitude.appendChild(longitudeArrowUp);
        longitude.appendChild(longitudeArrowDown);
        this.el.appendChild(latitude);
        this.el.appendChild(longitude);

        // Init setup.
        this.initAxis();
        this.initVectorBody(subEntityHead, subEntityTail);
        this.initTorus(longitudeAxis, longitudeArrowUp, longitudeArrowDown);
        this.initTorus(latitudeAxis, latitudeArrowRight, latitudeArrowLeft);

        this.setLength(subEntityBody, 0.1);
        this.pointAt(subEntityBody, new THREE.Vector3(1, 1, 1));
        
        this.setTorus(latitude, longitude, new THREE.Vector3(1, 1, 1));
    },

    initSelectedArrow: function(_arrow, _dir: string): void {
        _arrow.addEventListener('raycaster-intersected', (event) => {
            this.data.selectedArrow = _dir;
        });
        _arrow.addEventListener('raycaster-intersected-cleared', (event) => {
            this.data.selectedArrow = '';
        });
    },

    setTorus: function(_latitude, _longitude, _position): void {
        // First look at the position.
        // Get the world position of current entity.
        const worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(this.el.object3D.matrixWorld);
        const relativePosition = new THREE.Vector3(worldPos.x + _position.x, worldPos.y + _position.y, worldPos.z + _position.z);
        _latitude.object3D.lookAt(relativePosition);
        _longitude.object3D.lookAt(relativePosition);

        _longitude.object3D.rotateY(THREE.Math.degToRad(90));
        _longitude.object3D.rotateZ(THREE.Math.degToRad(90));

        _latitude.object3D.rotateX(THREE.Math.degToRad(90));
    },

    initTorus: function(_axis, _arrowUp, _arrowDown): void {
        // Set geometry of the Axis.
        _axis.setAttribute('geometry', {
            primitive: 'torus',
            radius: 0.1,
            radiusTubular: 0.001,
            segmentsRadial: 36,
            segmentsTubular: 32,
            arc: 360
        });

        // Set up two components of the down arrow.
        const arrowDownHead: any = document.createElement('a-entity');
        const arrowDownTail: any = document.createElement('a-entity');
        // Append children.
        _arrowDown.appendChild(arrowDownHead);
        _arrowDown.appendChild(arrowDownTail);

        // Add intersection.
        arrowDownHead.classList.add('Arrow');
        arrowDownTail.classList.add('Arrow');
        arrowDownHead.addEventListener('raycaster-intersected', (event) => {
            arrowDownHead.setAttribute('material', 'color', 'yellow');
            arrowDownTail.setAttribute('material', 'color', 'yellow');
        });
        arrowDownHead.addEventListener('raycaster-intersected-cleared', (event) => {
            arrowDownHead.setAttribute('material', 'color', 'red');
            arrowDownTail.setAttribute('material', 'color', 'red');
        });
        arrowDownTail.addEventListener('raycaster-intersected', (event) => {
            arrowDownHead.setAttribute('material', 'color', 'yellow');
            arrowDownTail.setAttribute('material', 'color', 'yellow');
        });
        arrowDownTail.addEventListener('raycaster-intersected-cleared', (event) => {
            arrowDownHead.setAttribute('material', 'color', 'red');
            arrowDownTail.setAttribute('material', 'color', 'red');
        });

        const tailGeometry = {
            primitive: 'torus',
            radius: 0.1,
            radiusTubular: 0.002,
            segmentsRadial: 36,
            segmentsTubular: 32,
            arc: 25
        };

        const headGeometry = {
            primitive: 'cone',
            height: 0.02,
            radiusBottom: 0.01,
            radiusTop: 0.005,
            segmentsRadial: 6,
            segmentsHeight: 18
        };
        
        arrowDownTail.setAttribute('geometry', tailGeometry);
        arrowDownTail.setAttribute('material', 'color', 'red');
        arrowDownHead.setAttribute('geometry', headGeometry);
        arrowDownHead.setAttribute('material', 'color', 'red');
        arrowDownHead.object3D.position.set(0.0866, 0.05, 0);
        arrowDownHead.object3D.rotation.set(0, 0, THREE.Math.degToRad(30));

        // Set up two components of the up arrow.
        const arrowUpHead: any = document.createElement('a-entity');
        const arrowUpTail: any = document.createElement('a-entity');
        // Append children.
        _arrowUp.appendChild(arrowUpHead);
        _arrowUp.appendChild(arrowUpTail);

        // Add intersection.
        arrowUpHead.classList.add('Arrow');
        arrowUpTail.classList.add('Arrow');
        arrowUpHead.addEventListener('raycaster-intersected', (event) => {
            arrowUpHead.setAttribute('material', 'color', 'yellow');
            arrowUpTail.setAttribute('material', 'color', 'yellow');
        });
        arrowUpHead.addEventListener('raycaster-intersected-cleared', (event) => {
            arrowUpHead.setAttribute('material', 'color', 'green');
            arrowUpTail.setAttribute('material', 'color', 'green');
        });
        arrowUpTail.addEventListener('raycaster-intersected', (event) => {
            arrowUpHead.setAttribute('material', 'color', 'yellow');
            arrowUpTail.setAttribute('material', 'color', 'yellow');
        });
        arrowUpTail.addEventListener('raycaster-intersected-cleared', (event) => {
            arrowUpHead.setAttribute('material', 'color', 'green');
            arrowUpTail.setAttribute('material', 'color', 'green');
        });

        arrowUpTail.setAttribute('geometry', tailGeometry);
        arrowUpTail.setAttribute('material', 'color', 'green');
        arrowUpTail.object3D.rotation.set(0, 0, THREE.Math.degToRad(-25));
        arrowUpHead.setAttribute('geometry', headGeometry);
        arrowUpHead.setAttribute('material', 'color', 'green');
        arrowUpHead.object3D.position.set(0.0866, -0.05, 0);
        arrowUpHead.object3D.rotation.set(0, 0, THREE.Math.degToRad(150));

        _arrowDown.object3D.rotation.set(0, 0, THREE.Math.degToRad(90));
        _arrowUp.object3D.rotation.set(0, 0, THREE.Math.degToRad(90));
    },

    setLength: function(_subEntityBody, _length): void {
        const times = _length / (this.cylinderHeight + this.coneHeight);
        _subEntityBody.setAttribute('scale', 'y', times);
    },
    
    pointAt: function(_subEntityBody, _position): void {
        // Get the world position of current entity.
        const worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(this.el.object3D.matrixWorld);
        const relativePosition = new THREE.Vector3(worldPos.x + _position.x, worldPos.y + _position.y, worldPos.z + _position.z);
        // lookAt function takes a vector in world space.
        _subEntityBody.object3D.lookAt(relativePosition);
        _subEntityBody.object3D.rotateX(THREE.Math.degToRad(90));
    },

    initVectorBody: function(_subEntityHead, _subEntityTail): void {
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

    initAxis: function(): void {
        const xAxis: any = document.createElement('a-entity');
        const yAxis: any = document.createElement('a-entity');
        const zAxis: any = document.createElement('a-entity');
        this.el.appendChild(xAxis);
        this.el.appendChild(yAxis);
        this.el.appendChild(zAxis);

        const axisGeometry = {
            primitive: 'cylinder',
            height: 0.1,
            radius: 0.003,
        };

        xAxis.setAttribute('geometry', axisGeometry);
        xAxis.setAttribute('material', 'color', 'blue');
        xAxis.object3D.position.set(0.05, 0, 0);
        xAxis.object3D.rotation.set(0, 0, THREE.Math.degToRad(90));

        yAxis.setAttribute('geometry', axisGeometry);
        yAxis.setAttribute('material', 'color', 'green');
        yAxis.object3D.position.set(0, 0.05, 0);

        zAxis.setAttribute('geometry', axisGeometry);
        zAxis.setAttribute('material', 'color', 'red');
        zAxis.object3D.position.set(0, 0, 0.05);
        zAxis.object3D.rotation.set(THREE.Math.degToRad(90), 0, 0);
    }
});

export default vector;