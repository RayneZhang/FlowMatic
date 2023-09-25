import { ADD_EDGE } from '../actions'
import undoable, {includeAction} from 'redux-undo'

const lines = (state = [], action) => {
    switch (action.type) {
      case ADD_EDGE:
      return [
        ...state,
        {
          entity1: action.entity1,
          entity2: action.entity2,
        }
      ]
      default:
        return state
    }
}

const undoableLines = undoable(lines, {filter: includeAction([ADD_EDGE])});
export default undoableLines;