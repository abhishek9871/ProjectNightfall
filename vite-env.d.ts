/// <reference types="vite/client" />

declare module "*.css" {
  const content: any;
  export default content;
}//
 Plyr.js type declarations
declare module 'plyr' {
  export default class Plyr {
    constructor(element: HTMLElement | string, options?: any);
    on(event: string, callback: () => void): void;
    destroy(): void;
    currentTime?: number;
  }
}