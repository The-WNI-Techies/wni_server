
import { readFileSync } from "fs";
import path from "path";
import YAML from "yaml";



// Function to recursively resolve $ref in YAML
export default function resolveRefs(obj: any, baseDir: string): any {
    if (typeof obj !== 'object' || obj === null) return obj;
  
    if ('$ref' in obj) {
      const refPath = path.join(baseDir, obj['$ref']);
      const content = readFileSync(refPath, 'utf8');
      return resolveRefs(YAML.parse(content), path.dirname(refPath));
    }
  
    for (const key in obj) {
      obj[key] = resolveRefs(obj[key], baseDir);
    }
  
    return obj;
  }