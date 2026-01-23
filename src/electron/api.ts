export interface BookInfo {
    name: string;
    testament: 'Old' | 'New';
    chapters: number;
}

export interface BooksResponse {
    oldTestament: BookInfo[];
    newTestament: BookInfo[];
}

export interface VerseInfo {
    verse: number;
    text: string;
}

export interface SelectedVerseData {
    book: string;
    chapter: number;
    verses: VerseInfo[];
}

export interface VerseGroup {
    id: string;
    title: string;
    body: string;
    createdAt: number;
    modifiedAt: number;
}

export interface VmixSettings {
    host: string;
    port: number;
    inputKey: string;
    inputName: string;
    titleField: string;
    bodyField: string;
    overlay: number;
}

export interface VmixInput {
    key: string;
    number: number;
    name: string;
    type: string;
    textFields: string[];
}

export interface VmixState {
    active: number;
    preview: number;
    inputName: string;
    inputStatus: 'active' | 'preview' | 'inactive' | 'unknown';
}

export interface Api {
    sayHello: (param: string) => Promise<string>;
    closeApp: () => Promise<void>;
    closeWindow: () => void;
    toggleWindow: () => void;
    toggleDevTools: () => void;
    // Bible API
    uploadBible: (bibleJson: any) => Promise<{ success: boolean; error?: string }>;
    isBibleLoaded: () => Promise<boolean>;
    getBooks: () => Promise<BooksResponse>;
    clearBible: () => Promise<{ success: boolean; error?: string }>;
    getChapterCount: (bookName: string) => Promise<number>;
    getChapterVerses: (bookName: string, chapter: number) => Promise<VerseInfo[]>;
    openVerseWindow: (bookName: string, chapter: number, selectedVerses: number[]) => Promise<void>;
    sendVerseSelection: (bookName: string, chapter: number, verses: VerseInfo[]) => Promise<void>;
    onVerseSelection: (callback: (data: SelectedVerseData) => void) => void;
    // Verse Groups API
    saveVerseGroup: (group: Omit<VerseGroup, 'id' | 'createdAt' | 'modifiedAt'>) => Promise<VerseGroup>;
    getVerseGroups: () => Promise<VerseGroup[]>;
    updateVerseGroup: (group: VerseGroup) => Promise<VerseGroup>;
    deleteVerseGroup: (id: string) => Promise<void>;
    // vMix API
    getVmixSettings: () => Promise<VmixSettings>;
    saveVmixSettings: (settings: VmixSettings) => Promise<void>;
    getVmixInputs: (host: string, port: number) => Promise<VmixInput[]>;
    sendToVmix: (title: string, body: string) => Promise<{ success: boolean; error?: string }>;
    sendToVmixAndShow: (title: string, body: string) => Promise<{ success: boolean; error?: string }>;
    getVmixState: () => Promise<VmixState>;
}
