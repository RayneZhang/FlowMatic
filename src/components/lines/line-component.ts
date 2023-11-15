import * as AFRAME from 'aframe';
import { Vector3 } from 'three';

const lineComponent = AFRAME.registerComponent('line-component', {
    schema: {
        startPoint: {type: 'vec3', default: {x: -1, y: 1, z: -1}},
        endPoint: {type: 'vec3', default: {x: 1, y: 1, z: -1}},
        sourceType: {type: 'string', default: ""},
        sourceBehavior: {type: 'string', default: ""},
        sourceEntity: {type: 'selector', default: null},
        targetEntity: {type: 'selector', default: null},
        sourcePropEl: {type: 'selector', default: null},
        targetPropEl: {type: 'selector', default: null},
        sourceProp: {type: 'string', default: ""},
        targetProp: {type: 'string', default: ""}
    },

    init: function(): void {
        this.sourcePosition = new Vector3(0, 0, 0);
        this.targetPosition = new Vector3(0, 0, 0);
        this.arrow = null;
        this.lineBody = null;
    },

    // remove: function(): void {
    //     this.el.setAttribute('line-component', 'sourceEntity', null);
    //     this.el.setAttribute('line-component', 'targetEntity', null);
    // },

    tick: function(): void {
        if (this.data.sourceEntity && this.data.targetEntity) {
            if (this.data.sourcePropEl && this.data.targetPropEl) {
                const startingPos: Vector3 = new Vector3();
                const endPos: Vector3 = new Vector3();
                this.data.sourcePropEl.object3D.getWorldPosition(startingPos);
                this.data.targetPropEl.object3D.getWorldPosition(endPos);

                if (startingPos.equals(this.sourcePosition) && endPos.equals(this.targetPosition)) return;

                this.sourcePosition = startingPos.clone();
                this.targetPosition = endPos.clone();
                const SP = {x:startingPos.x, y:startingPos.y, z:startingPos.z};
                const EP = {x:endPos.x, y:endPos.y, z:endPos.z};

                this.el.setAttribute('line-component', 'startPoint', SP);
                this.el.setAttribute('line-component', 'endPoint', EP);
            }
        }
    },

    update: function (oldDate): void {
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
            let arrowColor: string = "FED650";
            if (this.data.sourcePropEl)
                arrowColor = this.data.sourcePropEl.getAttribute('material').color;
                
            arrow.setAttribute('material', {
                color: arrowColor
            });
            this.el.appendChild(lineBody);
            this.el.appendChild(arrow);
        }
        
        const startPoint = new THREE.Vector3(this.data.startPoint.x, this.data.startPoint.y, this.data.startPoint.z);
        let ctlPoint1 = startPoint.clone();
        const endPoint = new THREE.Vector3(this.data.endPoint.x, this.data.endPoint.y, this.data.endPoint.z);
        let ctlPoint2 = endPoint.clone();

        if (this.data.sourceEntity && this.data.sourcePropEl) {
            const srcEl = this.data.sourceEntity;
            const srcPropEl = this.data.sourcePropEl;
            srcEl.object3D.updateMatrix();
            srcEl.object3D.updateWorldMatrix();

            const propLocalPos = srcEl.object3D.worldToLocal(srcPropEl.object3D.getWorldPosition(new Vector3()).clone());
            ctlPoint1 = srcEl.object3D.localToWorld(propLocalPos.add(new THREE.Vector3(0.1, 0, 0)));
        }

        if (this.data.targetEntity && this.data.targetPropEl) {
            const tgtEl = this.data.targetEntity;
            const tgtPropEl = this.data.targetPropEl;
            tgtEl.object3D.updateMatrix();
            tgtEl.object3D.updateWorldMatrix();

            const propLocalPos = tgtEl.object3D.worldToLocal(tgtPropEl.object3D.getWorldPosition(new Vector3()).clone());
            ctlPoint2 = tgtEl.object3D.localToWorld(propLocalPos.add(new THREE.Vector3(-0.1, 0, 0)));
        }

        const path = new THREE.CatmullRomCurve3([
            startPoint,
            ctlPoint1,
            ctlPoint2,
            endPoint
        ]);

        const tubularSegments = 20;
        const radius = 0.01;
        const radialSegments = 8;
        const closed = false;
        const geometry = new THREE.TubeBufferGeometry(path, tubularSegments, radius, radialSegments, closed);

        const mesh = new THREE.Mesh(geometry);
        this.lineBody.setObject3D('mesh', mesh);

        this.setArrow();
    },

    // Draw the arrow at the end of the line indicating the dataflow direction.
    setArrow: function(): void {
        if (!this.arrow) {
            console.warn("The line has no arrow.");
            return;
        }

        const endPoint = new THREE.Vector3(this.data.endPoint.x, this.data.endPoint.y, this.data.endPoint.z);

        // Set arrow position.
        let dir = new THREE.Vector3();
        if (this.data.targetEntity && this.data.targetPropEl) {
            const tgtEl = this.data.targetEntity;
            const tgtPropEl = this.data.targetPropEl;
            tgtEl.object3D.updateMatrix();
            tgtEl.object3D.updateWorldMatrix();

            const propLocalPos = tgtEl.object3D.worldToLocal(tgtPropEl.object3D.getWorldPosition(new Vector3()).clone());
            const ctlPoint2 = tgtEl.object3D.localToWorld(propLocalPos.add(new THREE.Vector3(-0.1, 0, 0)));
            dir = endPoint.clone().sub(ctlPoint2).normalize();
        }

        const arrowPos = endPoint.clone().sub(dir.multiplyScalar(0.03));
        const localPosition: any = this.el.object3D.worldToLocal(arrowPos);
        this.arrow.object3D.position.copy(localPosition);

        // Set arrow rotation.
        this.arrow.object3D.lookAt(endPoint.add(dir));
        this.arrow.object3D.rotateX(THREE.MathUtils.degToRad(90));
    }

});

export default lineComponent;