import { useState, useEffect } from 'react'
import { StageProps } from '../../types'

const Stage2 = ({ onStageComplete }: StageProps) => {
    const [selectedEmail, setSelectedEmail] = useState(0)
    const [discoveredHints, setDiscoveredHints] = useState<string[]>([])
    const [decodedMessages, setDecodedMessages] = useState<string[]>([])
    const [showFinalPuzzle, setShowFinalPuzzle] = useState(false)
    const [cipherInput, setCipherInput] = useState('')

    // 最終的な答え
    const finalAnswer = "MATRIX"

    const emails = [
        {
            id: 1,
            from: "alex.researcher@quantum-corp.com",
            subject: "Re: プロジェクト・エニグマの進捗報告",
            date: "2024/12/21 10:30",
            body: `チーム各位、

プロジェクト・エニグマの暗号解析が完了しました。
添付の画像に最終手がかりを隠しました。

重要: 以下の順序で解読してください：
1. 最初に画像内の隠し文字を発見
2. Rot13暗号を適用: "ZNEVK"
3. 逆順にして最終コードを取得

セキュリティレベル: 🔴 CRITICAL

※ この情報は機密です。部外者には絶対に漏らさないでください。

Alex`,
            attachments: [
                {
                    name: "project_enigma.png",
                    alt: "Hidden clue: Look for numbers 13-1-20-18-9-24 in ASCII decimal",
                    dataHint: "coordinates",
                    secretText: "MATRIX encoded in positions"
                }
            ]
        },
        {
            id: 2,
            from: "dr.cipher@securecomm.net",
            subject: "緊急: 暗号鍵の更新について",
            date: "2024/12/20 15:45",
            body: `機密事項

システムのセキュリティ侵害を検知しました。
新しい暗号化プロトコルに移行します。

暗号化キー: 
- Base64: TUFUUklY
- Binary: 01001101 01000001 01010100 01010010 01001001 01011000
- Morse: -- .- - .-. .. -..-

この3つの暗号はすべて同じ単語を示します。
緊急時のアクセスキーとして使用してください。

システム管理者より`,
            attachments: [
                {
                    name: "security_protocol.pdf",
                    alt: "ASCII values: M=77, A=65, T=84, R=82, I=73, X=88",
                    dataHint: "ascii_values",
                    secretMessage: "Convert to characters"
                },
                {
                    name: "backup_codes.txt",
                    alt: "Caesar cipher shift 13: ZNEVK → ?",
                    dataHint: "caesar13"
                }
            ]
        },
        {
            id: 3,
            from: "admin@matrix-systems.com",
            subject: "【最終通知】システム終了プロトコル",
            date: "2024/12/19 23:59",
            body: `=== SYSTEM ALERT ===

最終段階に到達しました。
すべてのヒントを収集し、最終暗号を解読してください。

ヒント統合:
1. 画像の座標: 13-1-20-18-9-24
2. 文字変換: ASCII → 文字
3. 暗号方式: ROT13 / Caesar
4. 検証: Base64, Binary, Morse

最終パスワード入力後、次の段階に進行可能。

=== COUNTDOWN ACTIVE ===`,
            attachments: [
                {
                    name: "final_key.encrypted",
                    alt: "ROT13: ZNEVK backwards is XINEV → flip again",
                    dataHint: "final_transformation"
                }
            ]
        }
    ]

    useEffect(() => {
        // CSS内に隠しヒント
        const style = document.createElement('style')
        style.textContent = `
      /* Secret Hint: 13-1-20-18-9-24 in ASCII = M-A-T-R-I-X */
      .email-viewer::before { 
        content: "Hidden: TUFUUklY decoded is MATRIX"; 
        position: absolute; 
        left: -9999px; 
      }
    `
        document.head.appendChild(style)

        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style)
            }
        }
    }, [])

    const handleAttachmentClick = (attachment: any) => {
        const hintText = `ファイル: ${attachment.name} | ${attachment.alt}`

        if (!discoveredHints.includes(hintText)) {
            setDiscoveredHints(prev => [...prev, hintText])
        }

        // ASCII 数値のヒント処理
        if (attachment.dataHint === "coordinates") {
            const asciiHint = "ASCII値 13-1-20-18-9-24 → M-A-T-R-I-X"
            if (!decodedMessages.includes(asciiHint)) {
                setDecodedMessages(prev => [...prev, asciiHint])
            }
        }

        // Base64デコード
        if (attachment.dataHint === "ascii_values") {
            const base64Hint = "Base64 'TUFUUklY' → MATRIX"
            if (!decodedMessages.includes(base64Hint)) {
                setDecodedMessages(prev => [...prev, base64Hint])
            }
        }

        // ROT13暗号
        if (attachment.dataHint === "caesar13") {
            const rot13Hint = "ROT13: ZNEVK → MATRIX"
            if (!decodedMessages.includes(rot13Hint)) {
                setDecodedMessages(prev => [...prev, rot13Hint])
            }
        }

        // 最終段階トリガー
        if (decodedMessages.length >= 2) {
            setShowFinalPuzzle(true)
        }
    }

    const handleCipherSubmit = () => {
        if (cipherInput.toUpperCase() === finalAnswer) {
            onStageComplete()
        } else {
            // 部分的に正しい場合のヒント
            if (cipherInput.toLowerCase().includes('mat')) {
                alert('🎯 部分的に正解！もう少しです！')
            } else {
                alert('❌ 違います。全てのヒントを組み合わせてください。')
            }
        }
    }

    const decodeBase64 = () => {
        try {
            const decoded = atob("TUFUUklY")
            alert(`🔓 Base64デコード結果: ${decoded}`)
            const base64Hint = "Base64 'TUFUUklY' → MATRIX"
            if (!decodedMessages.includes(base64Hint)) {
                setDecodedMessages(prev => [...prev, base64Hint])
            }
        } catch (e) {
            alert('デコードに失敗しました')
        }
    }

    const solveMorseCode = () => {
        const morseHint = "Morse '-- .- - .-. .. -..-' → MATRIX"
        alert(`🔓 モールス信号解読: ${morseHint}`)
        if (!decodedMessages.includes(morseHint)) {
            setDecodedMessages(prev => [...prev, morseHint])
        }
    }

    return (
        <div className="h-screen bg-gray-100 flex relative">
            {/* 隠し画像要素 */}
            <div className="absolute top-0 left-0 opacity-0 hover:opacity-20 transition-opacity">
                <img
                    src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHRleHQgeD0iMTAiIHk9IjMwIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjEyIiBmaWxsPSIjY2NjIj5NQVRSSVg8L3RleHQ+Cjx0ZXh0IHg9IjEwIiB5PSI1MCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSI4IiBmaWxsPSIjY2NjIj4xMy0xLTIwLTE4LTktMjQ8L3RleHQ+Cjwvc3ZnPg=="
                    alt="Hidden image with MATRIX coordinates"
                    className="w-32 h-16"
                />
            </div>

            {/* Email list sidebar */}
            <div className="w-1/3 bg-white border-r border-gray-300">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">📧 機密メール</h2>
                    <div className="text-xs text-gray-500 font-mono">
                        暗号化レベル: AES-256
                    </div>
                </div>
                <div className="overflow-y-auto">
                    {emails.map((email, index) => (
                        <div
                            key={email.id}
                            onClick={() => setSelectedEmail(index)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedEmail === index ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                }`}
                        >
                            <div className="font-medium text-gray-900">{email.from}</div>
                            <div className="text-sm text-gray-700 truncate">{email.subject}</div>
                            <div className="text-xs text-gray-500">{email.date}</div>
                            {/* 機密レベル表示 */}
                            <div className="text-xs text-red-600 font-bold mt-1">
                                {index === 0 ? '🔴 TOP SECRET' : index === 1 ? '🟡 CLASSIFIED' : '🔴 FINAL PROTOCOL'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Email content */}
            <div className="flex-1 flex flex-col email-viewer">
                <div className="p-6 border-b border-gray-200 bg-white">
                    <h1 className="text-xl font-semibold text-gray-800">
                        {emails[selectedEmail].subject}
                    </h1>
                    <div className="text-sm text-gray-600 mt-1">
                        From: {emails[selectedEmail].from} • {emails[selectedEmail].date}
                    </div>
                </div>

                <div className="flex-1 p-6 bg-white overflow-y-auto">
                    <div className="mb-6">
                        <pre className="whitespace-pre-wrap font-sans text-gray-800">
                            {emails[selectedEmail].body}
                        </pre>
                    </div>

                    {/* Attachments with enhanced mystery */}
                    {emails[selectedEmail].attachments.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">🔒 暗号化された添付ファイル</h3>
                            <div className="space-y-2">
                                {emails[selectedEmail].attachments.map((attachment, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer border border-dashed border-gray-300"
                                        onClick={() => handleAttachmentClick(attachment)}
                                        data-hint={attachment.dataHint}
                                        title="クリックして暗号を解読"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">🔐</span>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="text-sm font-medium text-gray-900">
                                                {attachment.name}
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono">
                                                暗号化済み | {attachment.dataHint}
                                            </div>
                                        </div>
                                        {/* 隠されたデータ */}
                                        <div style={{ position: 'absolute', left: '-9999px' }}>
                                            {attachment.alt}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 発見したヒント */}
                    {discoveredHints.length > 0 && (
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="text-sm font-medium text-yellow-800 mb-2">🔍 発見した暗号:</h4>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                {discoveredHints.map((hint, index) => (
                                    <li key={index} className="font-mono">• {hint}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 解読済みメッセージ */}
                    {decodedMessages.length > 0 && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="text-sm font-medium text-green-800 mb-2">✅ 解読済み:</h4>
                            <ul className="text-sm text-green-700 space-y-1">
                                {decodedMessages.map((message, index) => (
                                    <li key={index} className="font-mono">• {message}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 暗号解読ツール */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 mb-3">🛠 暗号解読ツール:</h4>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={decodeBase64}
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                            >
                                Base64デコード
                            </button>
                            <button
                                onClick={solveMorseCode}
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                            >
                                モールス信号
                            </button>
                            <button
                                onClick={() => {
                                    const rot13 = (str: string) => str.replace(/[a-zA-Z]/g, (c) => {
                                        const charCode = c.charCodeAt(0)
                                        const base = c <= 'Z' ? 65 : 97
                                        return String.fromCharCode(((charCode - base + 13) % 26) + base)
                                    })
                                    alert(`🔄 ROT13: ZNEVK → ${rot13('ZNEVK')}`)
                                    setDecodedMessages(prev => [...prev, "ROT13: ZNEVK → MATRIX"])
                                }}
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                            >
                                ROT13暗号
                            </button>
                        </div>
                    </div>

                    {/* 最終パズル */}
                    {showFinalPuzzle && (
                        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                            <h4 className="text-sm font-medium text-purple-800 mb-3">
                                🎯 最終暗号 - すべての手がかりは同じ言葉を示しています:
                            </h4>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={cipherInput}
                                    onChange={(e) => setCipherInput(e.target.value)}
                                    placeholder="最終パスワードを入力"
                                    className="flex-1 px-3 py-2 border border-purple-300 rounded-md"
                                />
                                <button
                                    onClick={handleCipherSubmit}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                >
                                    解読実行
                                </button>
                            </div>
                            <div className="text-xs text-purple-600 mt-2">
                                ヒント: ASCII, Base64, ROT13, Morse - すべて同じ単語です
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ASCII参照表 */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-400 opacity-30 font-mono">
                ASCII: A=65, M=77, T=84, R=82, I=73, X=88
            </div>

            {/* 隠しクリック可能エリア（左上角） */}
            <div
                className="absolute top-0 left-0 w-16 h-16 cursor-help"
                title="隠しヒント"
                onClick={() => {
                    alert('🕵️ 全てのヒントが "MATRIX" を示しています:\n\n• ASCII: 77-65-84-82-73-88\n• Base64: TUFUUklY\n• ROT13: ZNEVK\n• Morse: -- .- - .-. .. -..-')
                }}
            />
        </div>
    )
}

export default Stage2 
