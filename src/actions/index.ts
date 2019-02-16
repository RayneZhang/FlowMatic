/*
 * action types
 */

export const ADD_OBJECT = 'ADD_OBJECT'
export const ADD_LINE = 'ADD_LINE'

export const addObject = (id, targetModel, position) => ({
  type: ADD_OBJECT,
  id,
  targetModel,
  position
})

export const addLine = (filter) => ({
  type: ADD_LINE,
  filter
})