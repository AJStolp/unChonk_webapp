// types/index.d.ts
interface Window {
  readPageText: (selector: string) => void;
}

declare module '*.png' {
  const value: string;
  export default value;
}
