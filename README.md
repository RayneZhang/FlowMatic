# VRBehavior
Description: TODO

## Design Procedure
This section includes some design ideas and procedures.

### Interaction Techniques
Some of the interaction technqiues was inspired by Microsoft Maquette.

- **Selection**: 
  - :heavy_check_mark: Raycast pointing selection; 
  - Raycast cross selection (see: https://dl.acm.org/citation.cfm?id=3300848); 
  - :heavy_check_mark: Touch based selection. 

It appears that the first way alone is not satisfying for FlowMatic. Perhaps we will add the third way into count.

- **Transportation**: 
  - Dragging the whole world: L_Grab & R_Grab pressed.
  - :heavy_check_mark: Rotate Camera: with R_Grab pressed, push R_thumbstick to left/right.
  - :heavy_check_mark: Forward & Backward: with R_Grab pressed, push R_thumbstick to up/down.
  - :heavy_check_mark: Teleportation: with R_Grab pressed, press R_trigger to teleport.

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

### More Complex Applications (Pain Points)

- **Dynamically Create Objects**
  - 
- **Collision with a class of objects**
  - 

### 3D Dataflow Interactions

- **Abstractions of operators**
  - The ability of dragging an operator to see the logic inside as well as the ability to create user-defined operator by putting existing operators inside one box.
- **Abstractions of types**
  - Just like the *Interface* feature in Typescript, we can enable users to create new objects as new types (e.g. a sphere with a specialized texture) containing existing types (e.g. int, string). Users can peek into the new type to see the childs and make connections with them.

## Resources
### Assets
  TODO: List the sources of all the models used.
