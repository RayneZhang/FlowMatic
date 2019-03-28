import { combineReducers } from 'redux'
import undoableObjects from './objects'
import undoableLines from './lines'

const reducers = combineReducers({
  lines: undoableLines,
  objects: undoableObjects
})

export default reducers