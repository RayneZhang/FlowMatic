declare const THREE:any;

const drawLine = {
    schema: {
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

        // THREE.Line2 ( LineGeometry, LineMaterial )
        var geometry = new THREE.LineGeometry();
        geometry.setPositions( positions );
        geometry.setColors( colors );
        var matLine = new THREE.LineMaterial( {
            color: 0xffffff,
            linewidth: 0.005, // in pixels
            vertexColors: THREE.VertexColors,
            //resolution:  // to be set by renderer, eventually
            dashed: false
        } );
        var line = new THREE.Line2( geometry, matLine );
        line.computeLineDistances();
        line.scale.set( 1, 1, 1 );
        this.el.setObject3D('mesh', line); 

        // console.log(line.geometry);
        // geometry.attributes.instanceEnd.data.needsUpdate = true;
    },

    tick: function(time, timeDelta): void {
        
    },

    update: function (oldDate): void {
        const line = this.el.getObject3D('mesh');
        this.positions[0] = this.data.startPoint.x;
        this.positions[1] = this.data.startPoint.y;
        this.positions[2] = this.data.startPoint.z;
        this.positions[3] = this.data.endPoint.x;
        this.positions[4] = this.data.endPoint.y;
        this.positions[5] = this.data.endPoint.z;

        line.geometry.setPositions(this.positions);
    }
}



export default drawLine;