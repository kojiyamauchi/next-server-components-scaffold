---
name: code-qa
description: eslint,typecheck,spellcheckを実行してコードの品質を担保する
---

## コードの品質の担保
1. yarn lintを実行してエラーが発生すれば修正する
2. yarn typecheckを実行してエラーが発生すれば修正する
3. yarn spellcheckを実行してエラーが発生すれば修正する
4. 修正が完了したら該当ファイルをgit add, git commitまで実行する

- 修正は1つのコマンドごとに直列で実行すること
- コードの削除をする時は事前に確認すること
- スペルチェックで辞書に文言を追加する場合はcspell.ymlに追加すること
- コミットコメントは修正内容を明確に記述すること
