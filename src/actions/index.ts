/*
 * action types
 */

export const ADD_OBJ = 'ADD_OBJECT'
export const ADD_EDGE = 'ADD_EDGE'

export const addObj = (targetModel, position, color) => ({
  type: ADD_OBJ,
  targetModel,
  position,
  color
})

export const addEdge = (entity1, entity2) => ({
  type: ADD_EDGE,
  entity1,
  entity2
})