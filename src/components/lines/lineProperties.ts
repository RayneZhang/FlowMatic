declare const THREE:any;

const lineProperties = {
    schema: {
        sourceEntity: {type: 'selector', default: null},
        targetEntity: {type: 'selector', default: null}
    },

    init: function(): void {
        this.startPoint = new THREE.Vector3();
        this.endPoint = new THREE.Vector3();
        this.sourcePosition = new THREE.Vector3();
        this.targetPosition = new THREE.Vector3();
        this.positions = new Array<number>(63);

        this.updatedSourcePosition = new THREE.Vector3();
        this.updatedTargetPosition = new THREE.Vector3();
    },

    tick: function(time, timeDelta): void {
        if (this.data.sourceEntity && this.data.targetEntity) {
            this.data.sourceEntity.object3D.getWorldPosition(this.updatedSourcePosition);
            this.data.targetEntity.object3D.getWorldPosition(this.updatedTargetPosition);
            if (this.sourcePosition.equals(this.updatedSourcePosition) && this.targetPosition.equals(this.updatedTargetPosition)) {
                return;
            }
            this.startPoint.add(this.updatedSourcePosition.clone().sub(this.sourcePosition));
            this.endPoint.add(this.updatedTargetPosition.clone().sub(this.targetPosition));
            this.sourcePosition = this.updatedSourcePosition.clone();
            this.targetPosition = this.updatedTargetPosition.clone();
            const line: any = this.el.getObject3D('mesh');
            if (!line) return;
            this.setPositions();
            line.geometry.setPositions(this.positions);

            this.setArrow();
        }
    },

    update: function (oldDate): void {
        if (this.data.sourceEntity){
            const {x, y, z} = this.el.parentNode.getAttribute('draw-line').startPoint;
            this.startPoint.set(x, y, z);
            this.data.sourceEntity.object3D.getWorldPosition(this.sourcePosition);
        }
        if (this.data.targetEntity) {
            const {x, y, z} = this.el.parentNode.getAttribute('draw-line').endPoint;
            this.endPoint.set(x, y, z);
            this.data.targetEntity.object3D.getWorldPosition(this.targetPosition);
        }
    },

    setPositions: function(): void {
        const curvePoints = this.getCurvePoints();
        for (let i = 0; i < 20 + 1; i++) {
            const {x, y, z} = curvePoints[i];
            this.positions[i * 3] = x;
            this.positions[i * 3 + 1] = y;
            this.positions[i * 3 + 2] = z;
        }
    },

    // Set curve points using built-in THREE.CatmullRomCurve3.
    getCurvePoints: function(): Array<number> {
        const startPoint = new THREE.Vector3(this.startPoint.x, this.startPoint.y, this.startPoint.z);
        const endPoint = new THREE.Vector3(this.endPoint.x, this.endPoint.y, this.endPoint.z);
        const height: number = 0.5;

        const controlPoint = new THREE.Vector3((startPoint.x + endPoint.x)/2, Math.max(startPoint.y, endPoint.y) + height, (startPoint.z + endPoint.z)/2);
        const curve = new THREE.CatmullRomCurve3([
            startPoint,
            endPoint
        ]);

        return curve.getPoints(20);
    },

    setArrow: function(): void {
        const currentLine: any = this.data.currentLine;

        // Set arrow position.
        const dir = this.endPoint.clone().sub(this.startPoint).normalize();
        const arrowPos = this.endPoint.clone().sub(dir.multiplyScalar(0.03));
        const localPosition: any = this.el.object3D.worldToLocal(arrowPos);
        const arrow: any = this.el.firstChild;
        arrow.object3D.position.copy(localPosition);

        // Set arrow rotation.
        arrow.object3D.lookAt(this.endPoint.clone().add(dir));
        arrow.object3D.rotateX(THREE.Math.degToRad(90));
    }
}

export default lineProperties;