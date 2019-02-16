import { combineReducers } from 'redux'
import undoable, {includeAction} from 'redux-undo'
import {
  ADD_OBJECT,
  ADD_LINE
} from '../actions'

function lines(state = [], action) {
  switch (action.type) {
    case ADD_LINE:
      return action.filter
    default:
      return state
  }
}

function objects(state = [], action) {
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
    // case TOGGLE_TODO:
    //   return state.map((todo, index) => {
    //     if (index === action.id) {
    //       return Object.assign({}, todo, {
    //         completed: !todo.completed
    //       })
    //     }
    //     return todo
    //   })
    default:
      return state
  }
}

const undoableObjects = undoable(objects, {filter: includeAction([ADD_OBJECT])});

const todoApp = combineReducers({
  lines,
  undoableObjects
})

export default todoApp