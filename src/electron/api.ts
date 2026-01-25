export interface Api {
    sayHello: (param: string) => Promise<string>;
    closeApp: () => Promise<void>;
    closeWindow: () => void;
    toggleWindow: () => void;
    toggleDevTools: () => void;
}
