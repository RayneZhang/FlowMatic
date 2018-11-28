declare const THREE:any;

const drawLine = {
    schema: {
        curve: {type: 'selector'}
    },

    init: function(): void {
        const material = new THREE.LineBasicMaterial({
            color: 0x0000ff
        });

        const geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(-1, 1, -3),
            new THREE.Vector3(1, 1, -3)
        );

        const line = new THREE.Line(geometry, material);
        this.el.setObject3D('mesh', line);
    },

    tick: function(time, timeDelta): void {
        
    }
}

export default drawLine;