import { Vector3 } from 'three';

export const emitData = (el: any, from: any, to: any) => {
    if (!el) return;
    const data: any = document.createElement('a-entity');
    data.setAttribute('geometry', {
        primitive: 'sphere',
        radius: 0.01
    });
    data.setAttribute('material', {
        color: 'yellow',
        emissive: 'yellow',
        emissiveIntensity: 20,
        metalness: 1,
        roughness: 0.2,
        fog: true
    });
    el.appendChild(data);
    const fromVector3: Vector3 = new Vector3(from.x, from.y, from.z);
    const toVector3: Vector3 = new Vector3(to.x, to.y, to.z);
    const distance: number = fromVector3.distanceTo(toVector3);
    data.setAttribute('animation', {
        property: "position",
        from: {x: from.x, y: from.y, z: from.z},
        to: {x: to.x, y: to.y, z: to.z},
        dur: distance * 1000
    });

    data.addEventListener('animationcomplete', (event) => {
        data.parentNode.removeChild(data);
        data.destroy();
    });
};