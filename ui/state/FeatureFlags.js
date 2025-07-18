
class FeatureFlags {

  constructor() {
    this.loadFlags(0);
  }

  loadFlags(flags) {
    this.flags = {
      turnBased: flags%2==1
    }
  }

  getFlag(flagName) {
    if (this.flags[flagName]!=null) {
      return this.flags[flagName];
    }
    throw 'Unrecognized feature flag ' + flagName;
  }

}

let instance = new FeatureFlags();
export default instance;