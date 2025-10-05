declare module 'html2canvas' {
  type Html2CanvasOptions = {
    backgroundColor?: string | null
    useCORS?: boolean
    scale?: number
  }

  const html2canvas: (element: HTMLElement, options?: Html2CanvasOptions) => Promise<HTMLCanvasElement>
  export default html2canvas
}

declare module 'jspdf' {
  export class jsPDF {
    constructor(...args: unknown[])
    setFontSize(size: number): void
    text(text: string, x: number, y: number): void
    addImage(...args: unknown[]): void
    save(filename?: string): void
  }
}
