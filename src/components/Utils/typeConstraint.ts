import * as AFRAME from 'aframe'
import { Vector3 } from 'three'
import { getTypeByColor, getBehaviorByShape } from './typeVis';

const interval: number = 0.1;

export const disableConnectors = (type: string, behavior: string) => {
    const els = document.querySelectorAll('.connectable');
    els.forEach((el: any) => {
        const curType = getTypeByColor(el.getAttribute('material').color);
        const curBehavior = getBehaviorByShape(el.getAttribute('geometry').primitive);
        if ((curType != type && (curType != 'any') && (type != 'any')) || curBehavior != behavior) {
            el.setAttribute('material', {
                transparent: true,
                opacity: 0.1
            })
            el.classList.remove('connectable');
            el.classList.add('unconnectable');
        }
    });
};

export const enableConnectors = () => {
    const els = document.querySelectorAll('.unconnectable');
    els.forEach((el: any) => {
        el.setAttribute('material', {
            transparent: false,
            opacity: 1
        })
        el.classList.remove('unconnectable');
        el.classList.add('connectable');
    });
};