export interface BookOverview {
    identifier: string; // abbreviation as identifier
    name: string;
    chapters: number;
    testament: 'Old' | 'New';
};
