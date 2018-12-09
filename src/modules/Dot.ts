declare const THREE:any;

class Dot {
    
    constructor(appendEntity: any, lr: string, offset: any) {
        if (lr != 'left' && lr != 'right') {return;}

        // Create dot entity and append it to the prompt of the bottle.
        const curDot: any = document.createElement('a-entity');
        appendEntity.appendChild(curDot);
        curDot.setAttribute('id', appendEntity.getAttribute('id') + '-' + lr + '-dot');
        curDot.classList.add('connectable');

        // Set geometry of the dot - sphere.
        curDot.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 0.03
        });

        // Set color of the sphere to white.
        curDot.setAttribute('material', 'color', 'white');

        // Set the dot position according to the left or right.
        if (lr === 'left')
            curDot.object3D.position.x -= offset.x;
        if (lr === 'right')
            curDot.object3D.position.x += offset.x;

        curDot.addEventListener('raycaster-intersected', (event) => {
            curDot.setAttribute('material', 'color', 'yellow');
        });

        curDot.addEventListener('raycaster-intersected-cleared', (event) => {
            curDot.setAttribute('material', 'color', 'white');
        });
    }
}

export default Dot;