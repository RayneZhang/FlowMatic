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
        this.pointingPos = new THREE.Vector3(0.5, 0.5, 0.5);
        this.radius = 0.1;

        // Create an entity and append it to the scene.
        const subEntityBody: any = this.subEntityBody = document.createElement('a-entity');
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
        const latitude: any = this.latitude = document.createElement('a-entity');
        latitude.setAttribute('id', 'latitude' + this.data.seqId);
        const longitude: any = this.longitude = document.createElement('a-entity');
        longitude.setAttribute('id', 'longitude' + this.data.seqId);
        const latitudeAxis: any = this.latitudeAxis = document.createElement('a-entity');
        latitudeAxis.setAttribute('id', 'latitude-axis' + this.data.seqId);
        const longitudeAxis: any = this.longitudeAxis = document.createElement('a-entity');
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

        // Create magnitude arrows.
        const magnitudeUp: any = this.magnitudeUp = document.createElement('a-entity');
        magnitudeUp.setAttribute('id', 'magnitude-up' + this.data.seqId);
        this.initSelectedArrow(magnitudeUp, 'out');

        const magnitudeDown: any = this.magnitudeDown = document.createElement('a-entity');
        magnitudeDown.setAttribute('id', 'magnitude-down' + this.data.seqId);
        this.initSelectedArrow(magnitudeDown, 'in');

        this.el.appendChild(magnitudeUp);
        this.el.appendChild(magnitudeDown);

        // Init setup.
        this.initAxis();
        this.initVectorBody(subEntityHead, subEntityTail);
        this.initTorus(longitudeAxis, longitudeArrowUp, longitudeArrowDown);
        this.initTorus(latitudeAxis, latitudeArrowRight, latitudeArrowLeft);
        this.initMagnitudeArrow();

        this.setMagnitude();
        this.pointAt(subEntityBody, this.pointingPos);
        this.setTorus(latitude, longitude, this.pointingPos);

        // Init position label and output plug.
        const positionLabel: any = this.positionLabel = document.createElement('a-entity');
        const inputPlug: any = this.inputPlug = document.createElement('a-entity');
        const outputPlug: any = this.outputPlug = document.createElement('a-entity');
        this.el.appendChild(positionLabel);
        this.el.appendChild(inputPlug);
        this.el.appendChild(outputPlug);
        this.initPlug(inputPlug);
        this.initPlug(outputPlug);
        this.updatePositionLabel();
    },

    updateDataValue: function(): void {
        this.el.setAttribute('vector-source', 'dataValue', this.pointingPos.clone() as string);
    },

    updatePlugs: function(): void {
        const scaledVector = new THREE.Vector3(this.pointingPos.x / 10, this.pointingPos.y / 10, this.pointingPos.z / 10);
        const magnitude = scaledVector.length();
        const plugOffset = 0.03;
        this.inputPlug.object3D.position.set(-0.12, magnitude + plugOffset, 0);
        this.inputPlug.object3D.rotation.set(THREE.Math.degToRad(90), 0, 0);
        this.outputPlug.object3D.position.set(0.12, magnitude + plugOffset, 0);
        this.outputPlug.object3D.rotation.set(THREE.Math.degToRad(90), 0, 0);
    },

    initPlug: function(_plug: any): void {
        _plug.setAttribute('obj-model', 'obj:#plug-obj');
        _plug.setAttribute('material', 'color', 'white'); 
        _plug.classList.add('connectable', 'output');
        _plug.addEventListener('raycaster-intersected', (event) => {
            event.stopPropagation();
            _plug.setAttribute('material', 'color', 'yellow'); 
        })
        _plug.addEventListener('raycaster-intersected-cleared', (event) => {
            event.stopPropagation();
            _plug.setAttribute('material', 'color', 'white'); 
        })
    },

    updatePositionLabel: function(): void {
        const scaledVector = new THREE.Vector3(this.pointingPos.x / 10, this.pointingPos.y / 10, this.pointingPos.z / 10);
        const magnitude = scaledVector.length();
        const posLblOffset = 0.03;
        this.positionLabel.object3D.position.set(0, magnitude + posLblOffset, 0);
        this.positionLabel.setAttribute('text', {
            value: '(' + Math.round(this.pointingPos.x * 1000) / 1000 + ', ' + Math.round(this.pointingPos.y * 1000) / 1000 + ', '+ Math.round(this.pointingPos.z * 1000) / 1000 + ')',
            align: 'center',
            wrapCount: 80
        });
        this.updatePlugs();
    },

    initSelectedArrow: function(_arrow, _dir: string): void {
        _arrow.addEventListener('raycaster-intersected', (event) => {
            if (!this.data.selectedArrow)
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
            radius: this.radius,
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
            radius: this.radius,
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

    setMagnitude: function(): void {
        const scaledVector = new THREE.Vector3(this.pointingPos.x / 10, this.pointingPos.y / 10, this.pointingPos.z / 10);
        const magnitude = scaledVector.length();
        const times = magnitude / (this.cylinderHeight + this.coneHeight);
        this.subEntityBody.setAttribute('scale', 'y', times);

        // Set the radius of torus.
        this.latitude.object3D.scale.set(times, times, times);
        this.longitude.object3D.scale.set(times, times, times);
    },

    setMagnitudeArrow: function(): void {
        // Set up rotation.
        // Get the world position of current entity.
        const worldPos = new THREE.Vector3();
        worldPos.setFromMatrixPosition(this.el.object3D.matrixWorld);
        const relativePosition = new THREE.Vector3(worldPos.x + this.pointingPos.x, worldPos.y + this.pointingPos.y, worldPos.z + this.pointingPos.z);
        this.magnitudeUp.object3D.lookAt(relativePosition);
        this.magnitudeDown.object3D.lookAt(relativePosition);
        this.magnitudeUp.object3D.rotateX(THREE.Math.degToRad(90));
        this.magnitudeDown.object3D.rotateX(THREE.Math.degToRad(-90));

        // Set up position.
        const pointingPos = new THREE.Vector3(this.pointingPos.x / 10, this.pointingPos.y / 10, this.pointingPos.z / 10);
        const distance = 0.03;
        const normPointingPos = pointingPos.clone().normalize();
        normPointingPos.multiplyScalar(distance);

        pointingPos.add(normPointingPos);
        this.magnitudeDown.object3D.position.set(pointingPos.x, pointingPos.y, pointingPos.z);
        pointingPos.add(normPointingPos);
        this.magnitudeUp.object3D.position.set(pointingPos.x, pointingPos.y, pointingPos.z);
    },

    initMagnitudeArrow: function(): void {
        const arrowGeometry = {
            primitive: 'cone',
            height: 0.015,
            radiusBottom: 0.01,
            radiusTop: 0.005,
            segmentsRadial: 6,
            segmentsHeight: 18
        };

        this.magnitudeUp.setAttribute('geometry', arrowGeometry);
        this.magnitudeUp.setAttribute('material', 'color', 'green');
        this.magnitudeUp.classList.add('Arrow');
        this.magnitudeUp.addEventListener('raycaster-intersected', (event) => {
            this.magnitudeUp.setAttribute('material', 'color', 'yellow');
        });
        this.magnitudeUp.addEventListener('raycaster-intersected-cleared', (event) => {
            this.magnitudeUp.setAttribute('material', 'color', 'green');
        });

        this.magnitudeDown.setAttribute('geometry', arrowGeometry);
        this.magnitudeDown.setAttribute('material', 'color', 'red');
        this.magnitudeDown.classList.add('Arrow');
        this.magnitudeDown.addEventListener('raycaster-intersected', (event) => {
            this.magnitudeDown.setAttribute('material', 'color', 'yellow');
        });
        this.magnitudeDown.addEventListener('raycaster-intersected-cleared', (event) => {
            this.magnitudeDown.setAttribute('material', 'color', 'red');
        });

        this.setMagnitudeArrow();
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
            radius: 0.003
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

        const xLabel: any = document.createElement('a-entity');
        const yLabel: any = document.createElement('a-entity');
        const zLabel: any = document.createElement('a-entity');
        this.el.appendChild(xLabel);
        this.el.appendChild(yLabel);
        this.el.appendChild(zLabel);
        xLabel.object3D.position.set(0.1, -0.005, 0);
        yLabel.object3D.position.set(0.005, 0.1, 0);
        zLabel.object3D.position.set(0, -0.005, 0.1);
        xLabel.setAttribute('text', {
            value: 'x',
            align: 'center',
            wrapCount: 80
        });
        yLabel.setAttribute('text', {
            value: 'y',
            align: 'center',
            wrapCount: 80
        });
        zLabel.setAttribute('text', {
            value: 'z',
            align: 'center',
            wrapCount: 80
        });
    },

    // ==========For external call==========
    updateVector: function(_timeDelta): void {
        const latitude: any = document.querySelector('#latitude' + this.data.seqId);
        const longitude: any = document.querySelector('#longitude' + this.data.seqId);
        const latitudeDir = new THREE.Vector3(0, 0, 1);
        const longitudeDir = new THREE.Vector3(0, 0, 1);

        const times = 0.1 / 1000 * _timeDelta;
        const offsetVector = this.pointingPos.clone().normalize().multiplyScalar(times);

        const angleRad = THREE.Math.degToRad(15 / 1000 * _timeDelta);
        const reverseAngleRad = THREE.Math.degToRad(-15 / 1000 * _timeDelta);
        switch (this.data.selectedArrow) {
            case 'left':
                latitudeDir.applyQuaternion(latitude.object3D.quaternion);
                // console.log(latitudeDir);
                this.pointingPos.applyAxisAngle(latitudeDir, angleRad);
                break;
            case 'right':
                latitudeDir.applyQuaternion(latitude.object3D.quaternion);
                // console.log(latitudeDir);
                this.pointingPos.applyAxisAngle(latitudeDir, reverseAngleRad);
                break;
            case 'down':
                longitudeDir.applyQuaternion(longitude.object3D.quaternion);
                // console.log(longitudeDir);
                this.pointingPos.applyAxisAngle(longitudeDir, angleRad);
                break;
            case 'up':
                longitudeDir.applyQuaternion(longitude.object3D.quaternion);
                // console.log(longitudeDir);
                this.pointingPos.applyAxisAngle(longitudeDir, reverseAngleRad);
                break;
            case 'out':
                this.pointingPos.add(offsetVector);
                break;
            case 'in':
                this.pointingPos.add(new THREE.Vector3(-offsetVector.x, -offsetVector.y, -offsetVector.z));
                break;
            default:
                return;
        }
        this.setMagnitude();
        this.pointAt(this.subEntityBody, this.pointingPos);
        this.setTorus(latitude, longitude, this.pointingPos);
        this.setMagnitudeArrow();
        this.updatePositionLabel();
        this.updateDataValue();
    },

    getVector: function(): any {
        return this.pointingPos.clone() as string;
    },

    setVector: function(_vector: any): any {
        if (this.pointingPos.equals(_vector)) return;
        this.pointingPos.copy(_vector);
        this.setMagnitude();
        this.pointAt(this.subEntityBody, this.pointingPos);
        this.setTorus(this.latitude, this.longitude, this.pointingPos);
        this.setMagnitudeArrow();
        this.updatePositionLabel();
        this.updateDataValue();
    }
});

export default vector;