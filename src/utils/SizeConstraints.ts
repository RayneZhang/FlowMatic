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

export const recenter = (entity: any): void => {
    const mesh: Object3D = entity.getObject3D('mesh');
    console.log(mesh);
    if (!mesh) {return;}

    const box: Box3 = new Box3().setFromObject(mesh);
    const centerPoint = new Vector3();
    box.getCenter(centerPoint);
    mesh.position.sub(centerPoint);
    const entityPos = entity.object3D.position;
    // console.log(entityPos);
    // console.log(mesh.position);
    mesh.position.add(entityPos);
    //console.log(mesh.position);
}