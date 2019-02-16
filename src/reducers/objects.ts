import { ADD_OBJECT } from '../actions'
import undoable, {includeAction} from 'redux-undo'

const objects = (state = [], action) => {
    switch (action.type) {
      case ADD_OBJECT:
        // Original Version down here.
        // Object.assign({}, state, {
        // })
        return [
          ...state,
          {
            id: action.id,
            targetObject: action.targetObject,
            position: action.position
          }
        ]
      default:
        return state
    }
}

const undoableObjects = undoable(objects, {filter: includeAction([ADD_OBJECT])});
export default undoableObjects;