export interface NaxtUserConfig {
    dev: {
        port: number;
    }
}

export interface NaxtConfig extends NaxtUserConfig {
    cwd: string;
}