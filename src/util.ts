'use strict';

import { workspace, TextDocument } from 'vscode';
import * as fs from 'fs';
import glob from 'glob';

/**
 * Finds the controler's filepath
 * @param text
 * @param document
 */
export function getFilePath(text: string, document: TextDocument) {
  let filePath = workspace.getWorkspaceFolder(document.uri).uri.fsPath + '/app/Http/Controllers';
  // split the method (if not a resource controller) from the controller name
  let splitted = text.split('@');
  splitted[0] = splitted[0].replace(/\"|\'/g, '');
  let controllerFileName = splitted[0].replace(/\./g, '/').replace(/\"|\'/g, '') + '.php';
  let targetPath = filePath + '/' + controllerFileName;
  if (fs.existsSync(targetPath)) {
    return targetPath;
  }
  let dirItems = fs.readdirSync(filePath);
  for (let item of dirItems) {
    targetPath = filePath + '/' + item + '/' + controllerFileName;
    if (fs.existsSync(targetPath)) {
      return targetPath;
    }
  }
  return null;
}
