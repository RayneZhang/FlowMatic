declare const THREE:any;

const drawLine = {
    schema: {
        currentLine: {type: 'selector', default: null},
        currentSource: {type: 'selector', default: null},
        startPoint: {type: 'vec3', default: {x: -1, y: 1, z: -1}},
        endPoint: {type: 'vec3', default: {x: 1, y: 1, z: -1}},
        divisions: {type: 'number', default: 5}
    },

    init: function(): void {
        
        const positionSize = (this.data.divisions + 1) * 3;
        // Position and Color Data
        var positions = this.positions = new Array<number>(positionSize);
        var colors = this.colors = new Array<number>(positionSize);

        // positions.push(this.data.startPoint.x, this.data.startPoint.y, this.data.startPoint.z);
        // positions.push(this.data.endPoint.x, this.data.endPoint.y, this.data.endPoint.z);
        // colors.push(0, 0, 0);
        // colors.push(0, 0, 0);
        // console.log(line.geometry);
        // geometry.attributes.instanceEnd.data.needsUpdate = true;
    },

    tick: function(time, timeDelta): void {
        
    },

    update: function (oldDate): void {
        if (!this.data.currentLine)
            return;

        const currentLine: any = this.data.currentLine;
        const line: any = currentLine.getObject3D('mesh');
        if (!line) {
            this.setPositions();
            // THREE.Line2 ( LineGeometry, LineMaterial )
            const geometry = new THREE.LineGeometry();
            geometry.setPositions( this.positions );
            geometry.setColors( this.colors );
            const matLine = new THREE.LineMaterial( {
                color: 0xffffff,
                linewidth: 0.005, // in pixels
                vertexColors: THREE.VertexColors,
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
        }
    },

    getCurvePoints: function(): Array<number> {
        const startPoint = new THREE.Vector3(this.data.startPoint.x, this.data.startPoint.y, this.data.startPoint.z);
        const endPoint = new THREE.Vector3(this.data.endPoint.x, this.data.endPoint.y, this.data.endPoint.z);
        const height: number = 0.5;

        const controlPoint = new THREE.Vector3((startPoint.x + endPoint.x)/2, Math.max(startPoint.y, endPoint.y) + height, (startPoint.z + endPoint.z)/2);
        const curve = new THREE.CatmullRomCurve3([
            startPoint,
            controlPoint,
            endPoint
        ]);

        return curve.getPoints(this.data.divisions);
    }
}



export default drawLine;