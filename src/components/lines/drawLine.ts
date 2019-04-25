declare const THREE:any;

const drawLine = {
    schema: {
        currentLine: {type: 'selector', default: null},
        currentSource: {type: 'selector', default: null},
        dataType: {type: 'string', default: ""},
        startPoint: {type: 'vec3', default: {x: -1, y: 1, z: -1}},
        endPoint: {type: 'vec3', default: {x: 1, y: 1, z: -1}},
        divisions: {type: 'number', default: 20}
    },

    init: function(): void {
        const positionSize = (this.data.divisions + 1) * 3;
        // Position and Color Data
        var positions = this.positions = new Array<number>(positionSize);
        var colors = this.colors = new Array<any>(positionSize);
    },

    tick: function(time, timeDelta): void {
        
    },

    update: function (oldDate): void {
        if (!this.data.currentLine) {
            return;
        }

        const currentLine: any = this.data.currentLine;
        const line: any = currentLine.getObject3D('mesh');
        if (!line) {
            this.setPositions();
            // THREE.Line2 ( LineGeometry, LineMaterial )
            const geometry = new THREE.LineGeometry();
            geometry.setPositions( this.positions );
            geometry.setColors( this.colors );
            const matLine = new THREE.LineMaterial( {
                linewidth: 0.005, // in pixels
                vertexColors: this.colors,
                //resolution:  // to be set by renderer, eventually
                dashed: false
            } );
            const lineMesh = new THREE.Line2( geometry, matLine );
            lineMesh.computeLineDistances();
            lineMesh.scale.set( 1, 1, 1 );
            currentLine.setObject3D('mesh', lineMesh); 

            this.drawArrow();
        }
        else {
            this.setPositions();
            line.geometry.setPositions(this.positions);

            this.setArrow();
        }
    },

    setPositions: function(): void {
        const curvePoints = this.getCurvePoints();
        for (let i = 0; i < this.data.divisions + 1; i++) {
            const {x, y, z} = curvePoints[i];
            this.positions[i * 3] = x;
            this.positions[i * 3 + 1] = y;
            this.positions[i * 3 + 2] = z;

            // Set vertex color.
            this.colors[i * 3] = 0xff0000;
            this.colors[i * 3 + 1] = 0xff0000;
            this.colors[i * 3 + 2] = 0xff0000;
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

        return curve.getPoints(this.data.divisions);
    },

    drawArrow: function(): void {
        const endPoint = new THREE.Vector3(this.data.endPoint.x, this.data.endPoint.y, this.data.endPoint.z);
        const currentLine: any = this.data.currentLine;
        const arrow: any = document.createElement('a-entity');
        arrow.setAttribute('geometry', {
            primitive: 'cone',
            height: 0.2,
            radiusBottom: 0.08,
            radiusTop: 0
        });
        arrow.setAttribute('position', {x: this.data.endPoint.x, y: this.data.endPoint.y, z: this.data.endPoint.z});
        currentLine.appendChild(arrow);
        const localPosition: any = currentLine.object3D.worldToLocal(endPoint);
        arrow.object3D.position.copy(localPosition);
    },

    setArrow: function(): void {
        const endPoint = new THREE.Vector3(this.data.endPoint.x, this.data.endPoint.y, this.data.endPoint.z);
        const currentLine: any = this.data.currentLine;
        const localPosition: any = currentLine.object3D.worldToLocal(endPoint);
        const arrow: any = currentLine.firstChild;
        arrow.object3D.position.copy(localPosition);
    }
}



export default drawLine;