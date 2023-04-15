import { Constructor, SpriteFrame, resources, Asset } from "cc";

class Loader {
  loadDir(path: string, type: typeof SpriteFrame = SpriteFrame) {
    return new Promise<SpriteFrame[]>((res, rej) => {
      resources.loadDir(path, type, (err, asset) => {
        if (err) {
          console.error(err);
          res(null);
        } else {
          res(asset);
        }
      });
    });
  }
}

export const loader = new Loader();
