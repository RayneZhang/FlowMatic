import * as AFRAME from 'aframe'
import store from '../../store'
import { ActionCreators as UndoActionCreators } from 'redux-undo'

const leftGripListener = AFRAME.registerComponent('left-grip-listener', {
    init: function(): void {

        this.el.addEventListener('gripdown', (event) => {  
            // store.dispatch(UndoActionCreators.undo());
        });
    }, 
});

export default leftGripListener;