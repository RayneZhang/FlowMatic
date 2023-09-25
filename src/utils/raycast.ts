import * as AFRAME from 'aframe'

export const getIntersectedEl = (entity: any) => {
    // Retrieve all intersected Elements through raycaster.
    const intersectedEls = entity.components.raycaster.intersectedEls;
    // Check if there is intersected object.
    if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
        return null;
    }
    else 
        return intersectedEls[0];
};

export const getIntersections = (entity: any) => {
    // Retrieve all intersections through raycaster.
    const intersections = entity.components.raycaster.intersections;
    if (!Array.isArray(intersections) || !intersections.length) {
        // console.log('There is NO intersections when triggering');
        return null;
    }
    return intersections;
};