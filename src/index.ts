import * as AFRAME from 'aframe';
import * as ENVIRONMENT from 'aframe-environment-component';
ENVIRONMENT;
import * as TELEPORT from 'aframe-teleport-controls';
TELEPORT;
import * as PHYSICS from 'aframe-physics-system';
PHYSICS;
import * as EXTRAS from 'aframe-extras';
EXTRAS;
import * as PHYSICSEx from 'aframe-physics-extras';
PHYSICSEx;
import * as cubemap from 'aframe-cubemap-component';
cubemap;
import * as gltfpart from 'aframe-gltf-part-component';
gltfpart;
import * as KEYBOARD from 'aframe-super-keyboard';
KEYBOARD;
import * as HAPTICS from 'aframe-haptics-component';
HAPTICS;

import rightTriggerListener from './components/controllers/right-trigger-listener';
import rotationController from './components/controllers/right-thumb-controller';
import scaleController from './components/controllers/scale-controller';

import { rightAButtonListener } from './components/controllers/right-abutton-listener';
rightAButtonListener;
import { rightBButtonListener } from './components/controllers/right-bbutton-listener';
rightBButtonListener;
import { rightGripListener } from './components/controllers/right-grip-listener';
rightGripListener;

import controllerMaterial from './components/controllers/controller-material';
controllerMaterial;
import entityFollow from './components/utils/entityFollow';
entityFollow;
import { colliderController } from './components/controllers/collider-controller';
colliderController;
import {cameraRotation} from './components/controllers/camera-rotation';
cameraRotation;

import paletteMenu from './components/ui/paletteMenu';
paletteMenu;
import objAttrList from './components/ui/objAttrList';
objAttrList;

import dataSource from './components/dataflow/dataSource';
import dataFilter from './components/dataflow/dataFilter';
import dataReceiver from './components/dataflow/dataReceiver';
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

import lineComponent from './components/lines/LineComponent';
lineComponent;
import { storedEdges } from './components/lines/StoredEdges';
storedEdges;

import stateBinding from './state-binding/index'
stateBinding;

import vector from './components/utils/vector'
vector;
import swtch from './components/utils/swtch'
swtch;
import slider from './components/utils/slider'
slider;
import operatorModel from './components/utils/operatorModel'
operatorModel;
import spotLight from './components/lights/spotlight'
spotLight;
import { objInit } from './components/Utils/ObjInit';
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
AFRAME.registerComponent('data-source', dataSource);
AFRAME.registerComponent('data-filter', dataFilter);
AFRAME.registerComponent('data-receiver', dataReceiver);

import collisionDetector from './components/frp/operators/collisionDetector';
collisionDetector;
import conditionalEvent from './components/frp/operators/conditionalEvent';
conditionalEvent;
import eventReceiver from './components/frp/eventReceiver';
eventReceiver;

import mtlLighting from './components/Utils/mtlLighting';
mtlLighting;
import { canvasGenerator } from './components/ui/Canvas';
canvasGenerator;
import { objNodeUpdate } from './components/frp/ObjNodeUpdate';
objNodeUpdate;
import { avatarNodeUpdate } from './components/frp/AvatarNodeUpdate';
avatarNodeUpdate;
import { opNodeUpdate } from './components/frp/OpNodeUpdate';
opNodeUpdate;

import {primitiveVal} from './components/dataflow/primitives/pmtVal';
primitiveVal;