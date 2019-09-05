import * as AFRAME from 'aframe';
declare const THREE:any;

const lineComponent = AFRAME.registerComponent('line-component', {
    schema: {
        startPoint: {type: 'vec3', default: {x: -1, y: 1, z: -1}},
        endPoint: {type: 'vec3', default: {x: 1, y: 1, z: -1}},
        sourceEntity: {type: 'selector', default: null},
        targetEntity: {type: 'selector', default: null},
        sourceProp: {type: 'string', default: ""},
        targetProp: {type: 'string', default: ""}
    },

    init: function(): void {
        this.divisions = 20;
        const positionSize: number = ( this.divisions + 1) * 3;
        // Position and Color Data
        this.positions = new Array<number>(positionSize);

        this.sourcePosition = new THREE.Vector3();
        this.targetPosition = new THREE.Vector3();
        this.updatedSourcePosition = new THREE.Vector3();
        this.updatedTargetPosition = new THREE.Vector3();

        this.arrow = null;
        this.lineBody = null;
    },

    tick: function(): void {
        if (this.data.sourceEntity && this.data.targetEntity) {
            this.data.sourceEntity.object3D.getWorldPosition(this.updatedSourcePosition);
            this.data.targetEntity.object3D.getWorldPosition(this.updatedTargetPosition);
            if (this.sourcePosition.equals(this.updatedSourcePosition) && this.targetPosition.equals(this.updatedTargetPosition)) {
                return;
            }
            const deltaSource = this.updatedSourcePosition.clone().sub(this.sourcePosition);
            const deltaTarget = this.updatedTargetPosition.clone().sub(this.targetPosition);

            const SP = {x: this.data.startPoint.x + deltaSource.x, y: this.data.startPoint.y + deltaSource.y, z: this.data.startPoint.z + deltaSource.z};
            const EP = {x: this.data.endPoint.x + deltaTarget.x, y: this.data.endPoint.y + deltaTarget.y, z: this.data.endPoint.z + deltaTarget.z};
            this.el.setAttribute('line-component', 'startPoint', SP);
            this.el.setAttribute('line-component', 'endPoint', EP);

            this.sourcePosition = this.updatedSourcePosition.clone();
            this.targetPosition = this.updatedTargetPosition.clone();

            //this.setArrow();
        }
    },

    update: function (oldDate): void {
        // Initiate entities positions for line updates.
        if (this.data.sourceEntity) {
            this.data.sourceEntity.object3D.getWorldPosition(this.sourcePosition);
        }
        if (this.data.targetEntity) {
            this.data.targetEntity.object3D.getWorldPosition(this.targetPosition);
        }
        
        if (!this.el.hasChildNodes()) {
            const lineBody: any = this.lineBody = document.createElement('a-entity');
            const arrow: any = this.arrow = document.createElement('a-entity');
            // this.lineBody.classList.add('line');
            
            arrow.setAttribute('geometry', {
                primitive: 'cone',
                height: 0.06,
                radiusBottom: 0.025,
                radiusTop: 0
            });
            this.el.appendChild(lineBody);
            this.el.appendChild(arrow);
        }
        
        this.setPositions();
        const startPoint = new THREE.Vector3(this.data.startPoint.x, this.data.startPoint.y, this.data.startPoint.z);
        const endPoint = new THREE.Vector3(this.data.endPoint.x, this.data.endPoint.y, this.data.endPoint.z);
        const bodyHeight: number = startPoint.distanceTo(endPoint);
        this.lineBody.setAttribute('geometry', {
            primitive: 'cylinder',
            height: bodyHeight,
            radius: 0.005
        });
        const dir = endPoint.clone().sub(startPoint).normalize();
        const bodyPos = endPoint.clone().add(startPoint).multiplyScalar(0.5);
        this.lineBody.object3D.position.copy(bodyPos);

        // Set line rotation.
        this.lineBody.object3D.lookAt(endPoint.add(dir));
        this.lineBody.object3D.rotateX(THREE.Math.degToRad(90));

        this.setArrow();
    },

    setPositions: function(): void {
        const curvePoints = this.getCurvePoints();
        for (let i = 0; i <  this.divisions + 1; i++) {
            const {x, y, z} = curvePoints[i];
            this.positions[i * 3] = x;
            this.positions[i * 3 + 1] = y;
            this.positions[i * 3 + 2] = z;
        }
    },

    // Set curve points using built-in THREE.CatmullRomCurve3.
    getCurvePoints: function(): Array<number> {
        const startPoint = new THREE.Vector3(this.data.startPoint.x, this.data.startPoint.y, this.data.startPoint.z);
        const endPoint = new THREE.Vector3(this.data.endPoint.x, this.data.endPoint.y, this.data.endPoint.z);

        const curve = new THREE.CatmullRomCurve3([
            startPoint,
            endPoint
        ]);

        return curve.getPoints( this.divisions);
    },

    // Draw the arrow at the end of the line indicating the dataflow direction.
    setArrow: function(): void {
        if (!this.arrow) {
            console.warn("The line has no arrow.");
            return;
        }

        const startPoint = new THREE.Vector3(this.data.startPoint.x, this.data.startPoint.y, this.data.startPoint.z);
        const endPoint = new THREE.Vector3(this.data.endPoint.x, this.data.endPoint.y, this.data.endPoint.z);

        // Set arrow position.
        const dir = endPoint.clone().sub(startPoint).normalize();
        const arrowPos = endPoint.clone().sub(dir.multiplyScalar(0.03));
        const localPosition: any = this.el.object3D.worldToLocal(arrowPos);
        this.arrow.object3D.position.copy(localPosition);

        // Set arrow rotation.
        this.arrow.object3D.lookAt(endPoint.add(dir));
        this.arrow.object3D.rotateX(THREE.Math.degToRad(90));
    }

});

export default lineComponent;