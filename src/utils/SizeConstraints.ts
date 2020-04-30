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

export const getBox = (entity: any): {x: number, y: number, z: number} => {
    const mesh: Object3D = entity.getObject3D('mesh');
    if (!mesh) {return;}

    const box: Box3 = new Box3().setFromObject(mesh);
    const objectSize = new Vector3();
    box.getSize(objectSize);
    const result = {x: objectSize.x, y: objectSize.y, z: objectSize.z};
    return result;
};

export const recenter = (entity: any): void => {
    const mesh: Object3D = entity.getObject3D('mesh');
    if (!mesh) {return;}

    const box: Box3 = new Box3().setFromObject(mesh);
    const worldCenterPoint = new Vector3();

    // centerPoint is the world position.
    box.getCenter(worldCenterPoint);

    entity.object3D.updateMatrix();
    entity.object3D.updateWorldMatrix();
    const entityWorldPos: any = entity.object3D.localToWorld(new THREE.Vector3(0, 0, 0));
    const meshWorldOffset = worldCenterPoint.clone().sub(entityWorldPos);
    const meshLocalOffset = entity.object3D.worldToLocal(entityWorldPos.clone().sub(meshWorldOffset));
    // 0 -----> entityWorldPos
    // 0 ------------------------------------------>centerPoint
    //                                 0----------->meshCenter
    //          0---------------------------------->meshPosition
    // console.log(meshWorldOffset);
    // console.log(meshLocalOffset);
    mesh.position.add(meshLocalOffset);
}