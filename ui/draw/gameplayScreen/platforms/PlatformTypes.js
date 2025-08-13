import NormalPlatform from "./NormalPlatform.js";
import GhostPlatform from "./GhostPlatform.js";
import MovingPlatform from "./MovingPlatform.js";
import TeleportingPlatform from "./TeleportingPlatform.js";
import DoorPlatform from "./DoorPlatform.js";
import FirePlatform from "./FirePlatform.js";
import MuddyPlatform from "./MuddyPlatform.js";

export default class PlatformTypes {

  static TYPE_NORMAL = 0;
  static TYPE_GHOST = 1;
  static TYPE_MOVING = 2;
  static TYPE_TELEPORTING = 3;
  static TYPE_DOOR = 4;

  static platformFromType(platformTypeId) {
    switch (platformTypeId) {
      case 0: return new NormalPlatform();
      case 1: return new GhostPlatform();
      case 2: return new MovingPlatform();
      case 3: return new TeleportingPlatform();
      case 4: return new DoorPlatform();
      case 5: return new FirePlatform();
      case 6: return new MuddyPlatform();
    }
    throw 'No platform for type ' + platformTypeId;
  }

}