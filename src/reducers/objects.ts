import { ADD_OBJ } from '../actions'
import undoable, {includeAction} from 'redux-undo'

const objects = (state = [], action) => {
    switch (action.type) {
      case ADD_OBJ:
        return [
          ...state,
          {
            targetModel: action.targetModel,
            position: action.position,
            color: action.color
          }
        ]
      default:
        return state
    }
}

export const undoableObjects = undoable(objects, {filter: includeAction([ADD_OBJ])});