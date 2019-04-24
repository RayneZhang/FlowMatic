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
        this.controlPoints = [];
        const positionSize = (this.data.divisions + 1) * 3;
        // Position and Color Data
        var positions = this.positions = new Array<number>(positionSize);
        var colors = this.colors = new Array<any>(positionSize);
    },

    tick: function(time, timeDelta): void {
        
    },

    update: function (oldDate): void {
        if (!this.data.currentLine) {
            this.controlPoints = [];
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

        }
        else {
            this.setPositions();
            line.geometry.setPositions(this.positions);
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
        const height: number = 0.5;

        const controlPoint = new THREE.Vector3((startPoint.x + endPoint.x)/2, Math.max(startPoint.y, endPoint.y) + height, (startPoint.z + endPoint.z)/2);
        // this.controlPoints = [];
        // this.controlPoints[0] = startPoint;
        // this.controlPoints.push(endPoint);

        const curve = new THREE.CatmullRomCurve3([
            startPoint,
            endPoint
        ]);

        return curve.getPoints(this.data.divisions);
    }
}



export default drawLine;