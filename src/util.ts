'use strict';

import { workspace, TextDocument, DocumentLink, Range, Uri } from 'vscode';
import * as fs from 'fs';
import * as readLine from 'n-readlines';

export class LaravelControllerLink extends DocumentLink {
  filePath: string;
  funcName: string;
  controllerName: string;
  constructor(range: Range, path: string, controllerName: string, funcName: string) {
    super(range, null);
    this.filePath = path;
    this.controllerName = controllerName;
    this.funcName = funcName;
  }
}

/**
 * Finds the controler's filepath
 * @param text
 * @param document
 */
export function getFilePath(text: string, document: TextDocument) {
  let filePath = workspace.getWorkspaceFolder(document.uri).uri.fsPath + '/app/Http/Controllers';
  // split the method (if not a resource controller) from the controller name
  let controllerFileName = text.replace(/\./g, '/').replace(/\"|\'/g, '') + '.php';
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

export function getLineNumber(text: string, path: string) {
    let file = new readLine(path);
    let lineNum = 0;
    let line: string;
    while (line = file.next()) {
        lineNum++;
        line = line.toString();
        if (line.toLowerCase().includes('function ' + text.toLowerCase() + '(')) {
            return lineNum;
        }
    }
    return -1;
}
