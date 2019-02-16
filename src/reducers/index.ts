import { combineReducers } from 'redux'
import { ADD_LINE } from '../actions'
import undoableObjects from './objects'

function lines(state = [], action) {
  switch (action.type) {
    case ADD_LINE:
      return action.filter
    default:
      return state
  }
}

const reducers = combineReducers({
  lines,
  undoableObjects
})

export default reducers