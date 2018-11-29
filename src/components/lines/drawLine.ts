declare const THREE:any;

const drawLine = {
    init: function(): void {
        
        // Position and Color Data
        var positions = [];
        var colors = [];

        positions.push(-1, 1, -1);
        positions.push(1, 1, -1);
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
    },

    tick: function(time, timeDelta): void {
        
    }
}



export default drawLine;