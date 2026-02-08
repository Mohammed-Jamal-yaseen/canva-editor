declare module "@imgly/background-removal" {
  export interface Config {
    publicPath?: string;
    debug?: boolean;
    device?: "cpu" | "gpu";
    model?: "isnet" | "isnet_fp16" | "isnet_quint8";
    progress?: (key: string, current: number, total: number) => void;
    output?: {
      format?: "image/png" | "image/jpeg" | "image/webp";
      quality?: number;
    };
  }

  export function removeBackground(
    image: string | File | Blob | ArrayBuffer | Uint8Array,
    config?: Config
  ): Promise<Blob>;

  export default removeBackground;
}