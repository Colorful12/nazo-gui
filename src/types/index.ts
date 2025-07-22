// Game state interfaces
export interface GameState {
    currentStage: number;
    stageProgress: Record<number, any>;
    globalFlags: Record<string, boolean>;
}

// Stage component props
export interface StageProps {
    onStageComplete: () => void;
    stageData?: any;
}

// Stage 0 - Loading screen types
export interface Stage0State {
    showNoise: boolean;
    fakeButtonsVisible: boolean;
    realButtonRevealed: boolean;
}

// Stage 1 - Login screen types
export interface Stage1State {
    hiddenInputOpacity: number;
    loginEnabled: boolean;
    dragPosition: { x: number; y: number };
}

// Stage 2 - Email screen types
export interface EmailData {
    subject: string;
    body: string;
    attachments: Array<{
        name: string;
        alt: string;
        dataHint?: string;
    }>;
}

// Stage 3 - File browser types
export interface FileItem {
    id: string;
    name: string;
    type: 'folder' | 'file';
    order: number;
}

// Stage 4 - Settings screen types
export interface SettingItem {
    id: string;
    type: 'slider' | 'toggle' | 'checkbox';
    value: boolean | number;
    required: boolean | number;
}

// Stage 5 - Terminal types
export interface TerminalState {
    commandHistory: string[];
    currentCommand: string;
    isDestroying: boolean;
    destructionProgress: number;
} 
