import * as AFRAME from 'aframe';
import * as ENVIRONMENT from 'aframe-environment-component';
ENVIRONMENT;
import * as TELEPORT from 'aframe-teleport-controls';
TELEPORT;
import * as PHYSICS from 'aframe-physics-system';
PHYSICS;
import * as EXTRAS from 'aframe-extras';
EXTRAS;
import * as PHYSICSEX from 'aframe-physics-extras';
PHYSICSEX;
import * as CUBEMAP from 'aframe-cubemap-component';
CUBEMAP;
import * as GLTFPART from 'aframe-gltf-part-component';
GLTFPART;
import * as KEYBOARD from 'aframe-super-keyboard';
KEYBOARD;
import * as HAPTICS from 'aframe-haptics-component';
HAPTICS;

import rightTriggerListener from './components/controllers/right-trigger-listener';
import rotationController from './components/controllers/right-thumb-controller';
import scaleController from './components/controllers/scale-controller';
import {absorbController} from './components/controllers/absorb-controller';
absorbController;

import { rightAButtonListener } from './components/controllers/right-abutton-listener';
rightAButtonListener;
import { rightBButtonListener } from './components/controllers/right-bbutton-listener';
rightBButtonListener;
import { rightGripListener } from './components/controllers/right-grip-listener';
rightGripListener;

import controllerMaterial from './components/controllers/controller-material';
controllerMaterial;
import entityFollow from './components/utils/entity-follow';
entityFollow;
import { colliderController } from './components/controllers/collider-controller';
colliderController;
import {cameraRotation} from './components/controllers/camera-rotation';
cameraRotation;

import paletteMenu from './components/ui/palette-menu';
paletteMenu;
import { attributeList } from './components/ui/attribute-list'; attributeList;

import vectorSource from './components/dataflow/vectorSource'
vectorSource;
import switchSource from './components/dataflow/switchSource'
switchSource;
import sliderSource from './components/dataflow/sliderSource'
sliderSource;

import plusOperator from './components/dataflow/operators/plus'
plusOperator;
import subtractOperator from './components/dataflow/operators/subtract'
subtractOperator;
import vecToNum from './components/dataflow/operators/vecToNum'
vecToNum;
import numToVec from './components/dataflow/operators/numToVec'
numToVec;
import conditionBool from './components/dataflow/operators/conditionBool'
conditionBool;
import conditionLarger from './components/dataflow/operators/conditionLarger'
conditionLarger;

import lineComponent from './components/lines/line-component';
lineComponent;
import { curveComponent } from './components/lines/curve'; curveComponent;
import { storedEdges } from './components/lines/stored-edges'; storedEdges;

import stateBinding from './state-binding/index'
stateBinding;

import vector from './components/utils/vector'
vector;
import swtch from './components/utils/swtch'
swtch;
import slider from './components/utils/slider'
slider;
import {operatorModel} from './components/utils/operator-model'
operatorModel;
import spotLight from './components/lights/spot-light'
spotLight;
import { objInit } from './components/utils/obj-init';
objInit;

import headset from './components/avatars/headset'
headset;
import leftController from './components/avatars/leftController'
leftController;
import rightController from './components/avatars/rightController'
rightController;
AFRAME.registerComponent('right-trigger-listener', rightTriggerListener);
AFRAME.registerComponent('rotation-controller', rotationController);
AFRAME.registerComponent('scale-controller', scaleController);

import collisionDetector from './components/frp/operators/collision-detector';
collisionDetector;
import conditionalEvent from './components/frp/operators/conditional-event';
conditionalEvent;
import eventReceiver from './components/frp/event-receiver';
eventReceiver;

import mtlLighting from './components/utils/mtl-lighting';
mtlLighting;
import { canvasGenerator } from './components/ui/canvas';
canvasGenerator;
import { objNodeUpdate } from './components/frp/obj-node-update';
objNodeUpdate;
import { avatarNodeUpdate } from './components/frp/avatar-node-update';
avatarNodeUpdate;
import { opNodeUpdate } from './components/frp/op-node-update';
opNodeUpdate;
import { opContainer } from './components/frp/operators/container';
opContainer;

import {primitiveVal} from './components/dataflow/primitives/pmtVal'; primitiveVal;

import { paletteKb } from './components/controllers/palette-keyboard'; paletteKb;