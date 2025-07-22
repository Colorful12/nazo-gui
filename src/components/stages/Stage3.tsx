import { useState, useEffect } from 'react'
import { StageProps, FileItem } from '../../types'

const Stage3 = ({ onStageComplete }: StageProps) => {
    const [fileItems] = useState<FileItem[]>([
        { id: '1', name: 'alpha_13.txt', type: 'file', order: 1 },
        { id: '2', name: 'beta_15.log', type: 'file', order: 2 },
        { id: '3', name: 'gamma_18.dat', type: 'file', order: 3 },
        { id: '4', name: 'delta_9.bin', type: 'file', order: 4 },
        { id: '5', name: 'epsilon_24.cfg', type: 'file', order: 5 },
        { id: '6', name: '.hidden_matrix', type: 'file', order: 6 },
        { id: '7', name: 'README.secret', type: 'file', order: 7 }
    ])

    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [discoveredClues, setDiscoveredClues] = useState<string[]>([])
    const [decodedPath, setDecodedPath] = useState('')
    const [showPathInput, setShowPathInput] = useState(false)
    const [pathInput, setPathInput] = useState('')

    // 正解のパス（謎解きで導き出す）
    const correctPath = "/home/user/matrix"

    useEffect(() => {
        // ファイルクリック時のヒント表示
        if (selectedFiles.length >= 3) {
            setShowPathInput(true)
        }
    }, [selectedFiles])

    const handleFileClick = (file: FileItem) => {
        if (!selectedFiles.includes(file.id)) {
            setSelectedFiles(prev => [...prev, file.id])
        }

        // ファイル名の暗号解読
        let clue = ''
        switch (file.name) {
            case 'alpha_13.txt':
                clue = "α(13) → ASCII 13番目の文字は 'M'"
                break
            case 'beta_15.log':
                clue = "β(15) → ASCII 65+15-1 = 79 = 'O' → ホームを示す"
                break
            case 'gamma_18.dat':
                clue = "γ(18) → 18番目のアルファベット = 'R' → ユーザーの略"
                break
            case 'delta_9.bin':
                clue = "δ(9) → 9番目のアルファベット = 'I' → 映画で有名な..."
                break
            case 'epsilon_24.cfg':
                clue = "ε(24) → 24番目のアルファベット = 'X' → 最後の文字"
                break
            case '.hidden_matrix':
                clue = "隠しファイル発見！ M-A-T-R-I-X → パスの最後の部分"
                break
            case 'README.secret':
                clue = "秘密の説明書: パス構造は /[home]/[user]/[movie] 形式"
                break
        }

        if (clue && !discoveredClues.includes(clue)) {
            setDiscoveredClues(prev => [...prev, clue])
        }
    }

    const handlePathSubmit = () => {
        if (pathInput.toLowerCase().replace(/\s/g, '') === correctPath.toLowerCase()) {
            onStageComplete()
        } else {
            // ヒント表示
            if (pathInput.includes('home')) {
                alert('🎯 "home"は正しいです！あと2つの部分を見つけてください')
            } else if (pathInput.includes('user')) {
                alert('🎯 "user"は正しいです！他の部分も確認してください')
            } else if (pathInput.includes('matrix')) {
                alert('🎯 "matrix"は正しいです！パス全体を正しい形式で入力してください')
            } else {
                alert('❌ 違います。ファイル名の暗号を解読してパスを構築してください')
            }
        }
    }

    const analyzeAllFiles = () => {
        const analysis = `
🔍 ファイル分析結果:

alpha_13.txt → M (13番目)
beta_15.log → A (1番目、home)  
gamma_18.dat → T (20番目、user)
delta_9.bin → I (9番目)
epsilon_24.cfg → X (24番目)

つまり: M-A-T-R-I-X

さらに、ファイルの配置から:
- beta: home(家)を示唆
- gamma: user(利用者)を示唆  
- hidden_matrix: 最終ディレクトリ名

パス: /home/user/matrix
    `
        alert(analysis)
        setDecodedPath('/home/user/matrix')
    }

    return (
        <div className="h-screen bg-gray-900 text-white p-6 relative">
            {/* 隠しヒント */}
            <div className="absolute top-0 left-0 text-transparent select-text text-xs">
                ヒント: ギリシャ文字の順序と数字がASCII値を示している
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-4">🕵️ デジタル・フォレンジック調査</h1>
                    <div className="text-gray-300 mb-4">
                        システムに残された暗号化ファイルを分析し、隠されたパスを発見してください
                    </div>

                    <div className="bg-red-900 bg-opacity-50 p-3 rounded text-red-200 text-sm">
                        ⚠️ 機密レベル: TOP SECRET | 承認されていないアクセスは禁止
                    </div>
                </div>

                {/* File system analysis */}
                <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
                    <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-green-400">forensic@system:/evidence$</span>
                            <button
                                onClick={analyzeAllFiles}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                            >
                                🔬 全ファイル分析
                            </button>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="grid grid-cols-2 gap-3">
                            {fileItems.map((file) => (
                                <div
                                    key={file.id}
                                    onClick={() => handleFileClick(file)}
                                    className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${selectedFiles.includes(file.id)
                                        ? 'bg-blue-800 border-blue-500 shadow-lg'
                                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="text-xl">
                                            {file.name.startsWith('.') ? '👁️' : '📄'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium font-mono text-sm">
                                                {file.name}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {file.type} | 最終更新: 2024-12-{Math.floor(Math.random() * 28) + 1}
                                            </div>
                                            {/* ファイル名のヒント */}
                                            {file.name.includes('alpha') && (
                                                <div className="text-xs text-yellow-400 mt-1">
                                                    α = 1番目のギリシャ文字, 数字: 13
                                                </div>
                                            )}
                                            {file.name.includes('beta') && (
                                                <div className="text-xs text-yellow-400 mt-1">
                                                    β = 2番目のギリシャ文字, ヒント: home
                                                </div>
                                            )}
                                            {file.name.includes('gamma') && (
                                                <div className="text-xs text-yellow-400 mt-1">
                                                    γ = 3番目のギリシャ文字, ヒント: user
                                                </div>
                                            )}
                                        </div>
                                        {selectedFiles.includes(file.id) && (
                                            <div className="text-green-400">✓</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 発見した手がかり */}
                {discoveredClues.length > 0 && (
                    <div className="bg-yellow-900 bg-opacity-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold mb-3 text-yellow-200">🔍 解読した手がかり:</h3>
                        <ul className="space-y-2">
                            {discoveredClues.map((clue, index) => (
                                <li key={index} className="text-yellow-100 text-sm font-mono">
                                    • {clue}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 解読されたパス */}
                {decodedPath && (
                    <div className="bg-green-900 bg-opacity-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold mb-2 text-green-200">✅ 解読完了:</h3>
                        <div className="font-mono text-green-100 bg-black bg-opacity-50 p-2 rounded">
                            {decodedPath}
                        </div>
                    </div>
                )}

                {/* パス入力 */}
                {showPathInput && (
                    <div className="bg-purple-900 bg-opacity-50 rounded-lg p-4">
                        <h3 className="font-semibold mb-3 text-purple-200">
                            🎯 最終認証 - 隠されたパスを入力してください:
                        </h3>
                        <div className="flex items-center space-x-3">
                            <span className="text-gray-300 font-mono">Path:</span>
                            <input
                                type="text"
                                value={pathInput}
                                onChange={(e) => setPathInput(e.target.value)}
                                placeholder="/path/to/secret"
                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white font-mono"
                            />
                            <button
                                onClick={handlePathSubmit}
                                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                            >
                                🔓 アクセス
                            </button>
                        </div>
                        <div className="text-xs text-purple-300 mt-2">
                            ヒント: Unix系パスの形式 (/directory/subdirectory/file)
                        </div>
                    </div>
                )}

                {/* 分析ツール */}
                <div className="mt-6 bg-gray-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">🛠 フォレンジックツール:</h4>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => {
                                const greek = "α=1, β=2, γ=3, δ=4, ε=5"
                                alert(`📚 ギリシャ文字参照:\n${greek}\n\n数字はASCII値やアルファベット順序を示している可能性があります`)
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                            ギリシャ文字表
                        </button>
                        <button
                            onClick={() => {
                                alert('📊 ASCII参照:\nA=65, M=77, O=79, R=82, I=73, X=88\n13=M, 15=O(相対), 18=R, 9=I, 24=X')
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                            ASCII変換
                        </button>
                        <button
                            onClick={() => {
                                console.log('🔍 Debug Info:')
                                console.log('File pattern: [greek_letter]_[number].[extension]')
                                console.log('Alpha(13) = M, Hidden files contain final answer')
                                console.log('Path structure: /home/user/matrix')
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                        >
                            デバッグログ
                        </button>
                    </div>
                </div>

                {/* 進行状況 */}
                <div className="mt-6 text-center text-gray-400 text-sm">
                    ファイル分析進行: {selectedFiles.length}/7 | 手がかり発見: {discoveredClues.length}
                </div>
            </div>

            {/* 隠しクリック可能エリア（右上） */}
            <div
                className="absolute top-4 right-4 w-20 h-20 cursor-help opacity-0 hover:opacity-20 bg-red-500"
                title="エマージェンシーヒント"
                onClick={() => {
                    alert('🚨 エマージェンシーヒント:\n\nファイル名の暗号:\nα(13)β(15)γ(18)δ(9)ε(24) = M-A-T-R-I-X\n\nパス: /home/user/matrix')
                }}
            />
        </div>
    )
}

export default Stage3 
