declare module "react" {
  // allow CSS custom properties
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  interface CSSProperties {
    [varName: `--${string}`]: string | number | undefined;
  }
}

export {};
