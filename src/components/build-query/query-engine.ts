import { ValidationService } from "./services/validation-service";
import { TreeService } from "./services/tree-service";
import { SqlService } from "./services/sql-service";
import { EvaluationService } from "./services/evaluation-service";
import { FormatService } from "./services/format-service";
import { PresetService } from "./services/preset-service";

class QueryEngine {
  readonly validation = new ValidationService();
  readonly tree = new TreeService(this.validation);
  readonly sql = new SqlService();
  readonly evaluation = new EvaluationService(this.validation);
  readonly format = new FormatService();
  readonly presets = new PresetService(this.tree);
}

const queryEngine = new QueryEngine();
export default queryEngine;
