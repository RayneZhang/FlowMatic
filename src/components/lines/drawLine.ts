declare const THREE:any;

const drawLine = {
    schema: {
        currentLine: {type: 'selector', default: null},
        startPoint: {type: 'vec3', default: {x: -1, y: 1, z: -1}},
        endPoint: {type: 'vec3', default: {x: 1, y: 1, z: -1}}
    },

    init: function(): void {
        
        // Position and Color Data
        var positions = this.positions = [];
        var colors = this.colors = [];

        positions.push(this.data.startPoint.x, this.data.startPoint.y, this.data.startPoint.z);
        positions.push(this.data.endPoint.x, this.data.endPoint.y, this.data.endPoint.z);
        colors.push(0, 0, 0);
        colors.push(0, 0, 0);
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
        this.positions[0] = this.data.startPoint.x;
        this.positions[1] = this.data.startPoint.y;
        this.positions[2] = this.data.startPoint.z;
        this.positions[3] = this.data.endPoint.x;
        this.positions[4] = this.data.endPoint.y;
        this.positions[5] = this.data.endPoint.z;
    }
}



export default drawLine;