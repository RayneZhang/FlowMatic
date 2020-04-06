import { Object3D, Box3, Vector3 } from 'three';

export const resize = (entity: any, constraint: number) => {
    const mesh: Object3D = entity.getObject3D('mesh');
    if (!mesh) {return;}

    console.log(mesh);
    const box: Box3 = new Box3().setFromObject(mesh);
    const objectSize = new Vector3();
    box.getSize(objectSize);
    console.log(objectSize);
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
    if (!mesh) {return;}

    const box: Box3 = new Box3().setFromObject(mesh);
    const centerPoint = new Vector3();

    // centerPoint is the world position.
    box.getCenter(centerPoint);

    console.log(centerPoint);
    console.log(entity.object3D.position);
    console.log(mesh.position);

    entity.object3D.updateMatrix();
    entity.object3D.updateWorldMatrix();
    const entityWorldPos: any = entity.object3D.localToWorld(new THREE.Vector3(0, 0, 0));

    const meshOffset = centerPoint.clone().sub(entityWorldPos);
    // 0 -----> entityWorldPos
    // 0 ---------------------->centerPoint
    //          0-------------->meshOffset
    mesh.position.add(meshOffset);
}