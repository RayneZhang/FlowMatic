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

export const addLine = (entity1, entity2) => ({
  type: ADD_LINE,
  entity1,
  entity2
})