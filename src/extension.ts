'use strict';

import { workspace, languages, Hover, ExtensionContext } from 'vscode';
import { LinkProvider } from './link';
import * as util from './util';

const REG = /(['"])[^'"]*\1/;

export function activate(context: ExtensionContext) {
    let hover = languages.registerHoverProvider({scheme: 'file', language: 'php'}, {
        provideHover(document, position, token) {
            let linkRange = document.getWordRangeAtPosition(position, REG);
            if (linkRange) {
                let filePath = util.getFilePath(document.getText(linkRange), document);
                let workspaceFolder = workspace.getWorkspaceFolder(document.uri);
                if (filePath != null) {
                    return new Hover(workspaceFolder.name + filePath.replace(workspaceFolder.uri.fsPath, ''));
                }
            }
            return;
        }
    });
    let link = languages.registerDocumentLinkProvider({scheme: 'file', language: 'php'}, new LinkProvider());
    context.subscriptions.push(hover);
    context.subscriptions.push(link);
}

export function deactivate() {
    //
}
