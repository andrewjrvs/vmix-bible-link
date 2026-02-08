"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BibleService = void 0;
// Old Testament books in order (39 books: Genesis through Malachi)
const OLD_TESTAMENT_BOOKS = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
    '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
    'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms',
    'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah',
    'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
    'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah',
    'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai',
    'Zechariah', 'Malachi'
];
// New Testament books in order (27 books: Matthew through Revelation)
const NEW_TESTAMENT_BOOKS = [
    'Matthew', 'Mark', 'Luke', 'John', 'Acts',
    'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
    'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians',
    '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus',
    'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
    '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];
// Create a map for quick lookup
const BOOK_TESTAMENT_MAP = {};
OLD_TESTAMENT_BOOKS.forEach(book => BOOK_TESTAMENT_MAP[book] = 'Old');
NEW_TESTAMENT_BOOKS.forEach(book => BOOK_TESTAMENT_MAP[book] = 'New');
class BibleService {
    store = null;
    bibleData = null;
    initialized = false;
    async initialize() {
        if (this.initialized)
            return;
        const Store = (await import('electron-store')).default;
        this.store = new Store({
            name: 'bible-data',
        });
        // Load Bible data from store on initialization
        this.loadBibleFromStore();
        this.initialized = true;
    }
    loadBibleFromStore() {
        if (!this.store)
            return;
        const storedData = this.store.get('bibleData');
        if (storedData) {
            this.bibleData = storedData;
        }
    }
    /**
     * Upload and store Bible JSON data
     */
    uploadBible(bibleJson) {
        if (!this.store)
            throw new Error('BibleService not initialized');
        this.bibleData = bibleJson;
        this.store.set('bibleData', bibleJson);
    }
    /**
     * Check if Bible data is loaded
     */
    isBibleLoaded() {
        return this.bibleData !== null;
    }
    /**
     * Clear Bible data from memory and storage
     */
    clearBible() {
        if (!this.store)
            throw new Error('BibleService not initialized');
        this.bibleData = null;
        this.store.delete('bibleData');
    }
    /**
     * Get all books grouped by testament, in biblical order
     * Uses the natural Bible structure: first 39 books are OT, next 27 are NT
     */
    getBooks() {
        if (!this.bibleData || !this.bibleData.books) {
            return { oldTestament: [], newTestament: [] };
        }
        const oldTestament = [];
        const newTestament = [];
        // Process each book
        this.bibleData.books.forEach((book, index) => {
            const bookInfo = {
                name: book.name,
                testament: index < 39 ? 'Old' : 'New', // First 39 books are OT, rest are NT
                chapters: book.chapters.length,
            };
            if (bookInfo.testament === 'Old') {
                oldTestament.push(bookInfo);
            }
            else {
                newTestament.push(bookInfo);
            }
        });
        return { oldTestament, newTestament };
    }
    /**
     * Get a specific book's chapters
     */
    getBook(bookName) {
        if (!this.bibleData || !this.bibleData.books) {
            return null;
        }
        return this.bibleData.books.find(book => book.name === bookName);
    }
    /**
     * Get a specific chapter
     */
    getChapter(bookName, chapterNumber) {
        const book = this.getBook(bookName);
        if (!book) {
            return null;
        }
        return book.chapters.find(ch => ch.chapter === chapterNumber);
    }
    /**
     * Get specific verses
     */
    getVerses(bookName, chapterNumber, verseNumbers) {
        const chapter = this.getChapter(bookName, chapterNumber);
        if (!chapter) {
            return null;
        }
        return verseNumbers.map(verseNum => {
            const verse = chapter.verses.find(v => v.verse === verseNum);
            return {
                verse: verseNum,
                text: verse?.text || '',
            };
        });
    }
}
exports.BibleService = BibleService;
