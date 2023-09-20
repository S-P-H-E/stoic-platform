declare module '@vimeo/player' {
    export default class Player {
      constructor(element: HTMLIFrameElement | null, options?: object);
      on(eventName: string, callback: (data: any) => void): void;
    }
  }
  