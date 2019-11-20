# VRBehavior
Description: TODO

## Design Procedure
This section includes some design ideas and procedures.

### Interaction Techniques
Some of the interaction technqiues was inspired by Microsoft Maquette.

- **Selection**: 
 - Raycast pointing selection; 
 - Raycast cross selection (see: https://dl.acm.org/citation.cfm?id=3300848); 
 - Touch based selection. 

It appears that the first way alone is not satisfying for FlowMatic. Perhaps we will add the third way into count.

- **Transportation**: 
  - Dragging the whole world: L_Grab & R_Grab pressed.
  - Rotate Camera: with R_Grab pressed, push R_thumbstick to left/right.
  - Forward & Backward: with R_Grab pressed, push R_thumbstick to up/down.
  - Teleportation: with R_Grab pressed, press R_trigger to teleport.

- **Create Object**: Use raycast to select an object, use R_trigger/R_grab to import it.
  - Model Preview.
  - Search from Google Poly.

- **Position, Scale, Rotation**:
  - Orbit control for rotation.
  - [Low Priority] Supports one-dimensional scaling.
  - [Low Priority] Supports one-dimensional translating.

- **Tools**:
  - Select
  - Deselect
  - Erasing
  - [Low Priority] Drawing
  - [Low Priority] Eye dropper
  - [Low Priority] Painting
  - [Low Priority] Text
  - [Low Priority] Camera


### Type Visualization and Constraints
11/12/2019 Visualizing types using primitive shapes (spheres, cones, cubes, and trapezium) and visualizing first-class abstractions (i.e. behaviors and events) using colors (red and green). This design makes it hard to diffrentiate types based on shapes as they appear similar when the colors are the same. 

- Visualize types using shapes and colors
- Type constraints: connectors for different types should turn grey when making a connection
- Inspect values passing through each edge
- A user evaluation

### Auto Layout

### More Complex Applications


## Resources
### Assets
  TODO: List the sources of all the models used.
