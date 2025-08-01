# 謎解きWebアプリ

Vibe coding研修で作成したギミック満載の謎解き(?)Webアプリケーション

## 背景

ギミックのあるサイトを作ってみたい！という気持ちからはじまっています。
単純な機能実装ではなく、ユーザーが「あれ？」「どうやって？」と思わず考え込んでしまうような、
インタラクティブで遊び心のあるWebサイトを目指しました。

## ゲーム概要

全6ステージ: 各ステージには独自のギミックが仕込まれています。
プレイヤーは観察力と直感を頼りに、隠された仕組みを見つけ出してステージをクリアしていきます。

## 技術スタック

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Graphics**: HTML5 Canvas
- **Font**: Share Tech Mono (Google Fonts)

## 実装のポイント

### Canvas活用
- ノイズエフェクトによる背景演出
- 動的なUI描画（偽ボタンなど）
- リアルタイムアニメーション

### インタラクション設計
- ドラッグ&ドロップによるUI操作
- ホバー/クリックによる隠し要素の発見
- モールス信号などの視覚的フィードバック

### 状態管理
- React hooksによるシンプルな状態管理
- ステージ進行の管理
- 各ステージ独立の状態制御

🎨 **Created with passion during Vibe coding training**
