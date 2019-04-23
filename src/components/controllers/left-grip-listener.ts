import * as AFRAME from 'aframe'
import store from '../../store'
import { ActionCreators as UndoActionCreators } from 'redux-undo'

const leftGripListener = AFRAME.registerComponent('left-grip-listener', {
    init: function(): void {
        const listeningEl = document.querySelector('#leftHand');

        listeningEl.addEventListener('gripdown', (event) => {  
            // store.dispatch(UndoActionCreators.undo());
        });
    }, 
});

export default leftGripListener;