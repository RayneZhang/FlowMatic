import { Object3D, Box3, Vector3 } from 'three';

export const resize = (entity: any, constraint: number) => {
    const mesh: Object3D = entity.getObject3D('mesh');
    if (!mesh) {return;}

    const box: Box3 = new Box3().setFromObject(mesh);
    const objectSize = new Vector3();
    box.getSize(objectSize);
    const maxLength: number = Math.max(objectSize.x, objectSize.y, objectSize.z);
    mesh.scale.set(0.8*constraint/maxLength, 0.8*constraint/maxLength, 0.8*constraint/maxLength);
};

export const getRadius = (entity: any): number => {
    const mesh: Object3D = entity.getObject3D('mesh');
    if (!mesh) {return;}

    const box: Box3 = new Box3().setFromObject(mesh);
    const objectSize = new Vector3();
    box.getSize(objectSize);
    const maxLength: number = Math.max(objectSize.x, objectSize.y, objectSize.z);
    return maxLength;
};