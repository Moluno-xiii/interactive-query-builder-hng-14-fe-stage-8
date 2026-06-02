import type { Group, Preset } from "../types";
import { TreeService } from "./tree-service";

export class PresetService {
  constructor(private readonly tree: TreeService) {}

  buildPreset(name: string, root: Group): Preset {
    return { name, ts: Date.now(), tree: this.tree.clone(root) };
  }
}
