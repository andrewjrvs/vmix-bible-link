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
}
