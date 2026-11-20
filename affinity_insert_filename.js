
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
            app.alert('ドキュメントを開いてください。', TITLE);
            return;
        }

        // 選択オブジェクトを取得
        const items = [];

        for (const item of doc.selection.items) {
            items.push(item);
        }

        // 1個だけ選択されているか確認
        if (items.length !== 1) {
            app.alert(
                'テキストオブジェクトを1個だけ選択してください。',
                TITLE
            );
            return;
        }

        const node = items[0].node;

        // テキストオブジェクトか確認
        if (!node || !node.isTextNode) {
            app.alert(
                'テキストオブジェクトを選択してください。',
                TITLE
            );
            return;
        }

        // ドキュメント名を取得
        const documentTitle = String(doc.title || '');

        if (!documentTitle) {
            app.alert('ドキュメント名を取得できませんでした。', TITLE);
            return;
        }

        // テキスト全体を選択範囲として指定
        const range = node.storyRange;

        const selection = Selection.create(doc, node, true);

        const textSelection = TextSelection.create([{
            begin: range.begin,
            end: range.end
        }]);

        selection.addSubSelectionForNode(node, textSelection);

        // 既存テキストをドキュメント名に置換
        const command = DocumentCommand.createSetText(
            selection,
            documentTitle
        );

        doc.executeCommand(command);

    } catch (error) {
        app.alert(
            '処理中にエラーが発生しました。\n\n' + String(error),
            TITLE
        );
    }
}

main();
