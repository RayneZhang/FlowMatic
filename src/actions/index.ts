/*
 * action types
 */

export const ADD_OBJECT = 'ADD_OBJECT'
export const ADD_LINE = 'ADD_LINE'

export const addObject = (id, targetModel, position, color) => ({
  type: ADD_OBJECT,
  id,
  targetModel,
  position,
  color
})

export const addLine = (filter) => ({
  type: ADD_LINE,
  filter
})