import { ADD_LINE } from '../actions'
import undoable, {includeAction} from 'redux-undo'

const lines = (state = [], action) => {
    switch (action.type) {
      case ADD_LINE:
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

const undoableLines = undoable(lines, {filter: includeAction([ADD_LINE])});
export default undoableLines;