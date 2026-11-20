
'use strict';

const { app } = require('/application');
const { Document } = require('/document');
const { Selection, TextSelection } = require('/selections');
const { DocumentCommand } = require('/commands');

const TITLE = 'Document Title Inserter';

function main() {
    try {
        const doc = Document.current;

        if (!doc) {
            app.alert(
                'ドキュメントを開いてください。\nOpen a document.',
                TITLE
            );
            return;
        }

        // 選択オブジェクトを取得
        // Collect the selected objects.
        const items = [];

        for (const item of doc.selection.items) {
            items.push(item);
        }

        // 1個だけ選択されているか確認
        // Check that exactly one object is selected.
        if (items.length !== 1) {
            app.alert(
                'テキストオブジェクトを1個だけ選択してください。\nSelect exactly one text object.',
                TITLE
            );
            return;
        }

        const node = items[0].node;

        // テキストオブジェクトか確認
        // Check that the selected object is a text object.
        if (!node || !node.isTextNode) {
            app.alert(
                'テキストオブジェクトを選択してください。\nSelect a text object.',
                TITLE
            );
            return;
        }

        // ドキュメント名を取得
        // Get the document name.
        const documentTitle = String(doc.title || '');

        if (!documentTitle) {
            app.alert(
                'ドキュメント名を取得できませんでした。\nCould not get the document name.',
                TITLE
            );
            return;
        }

        // テキスト全体を選択範囲として指定
        // Set the selection range to cover the entire text.
        const range = node.storyRange;

        const selection = Selection.create(doc, node, true);

        const textSelection = TextSelection.create([{
            begin: range.begin,
            end: range.end
        }]);

        selection.addSubSelectionForNode(node, textSelection);

        // 既存テキストをドキュメント名に置換
        // Replace the existing text with the document name.
        const command = DocumentCommand.createSetText(
            selection,
            documentTitle
        );

        doc.executeCommand(command);

    } catch (error) {
        app.alert(
            '処理中にエラーが発生しました。\nAn error occurred while running the script.\n\n' + String(error),
            TITLE
        );
    }
}

main();
