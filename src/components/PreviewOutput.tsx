import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { transform } from "@/lib/utils"
import { toast } from "sonner"

type Settings = {
  removeIds: boolean
  react: boolean
  removeClasses: boolean
  removeSizing: boolean
  format: boolean
}

type PreviewOutputProps = {
  svgContent: string
  originalSvgContent: string
  themeMapping: Record<string, string>
  settings: Settings
  onReset: () => void
  onDownload: () => void
}

export const PreviewOutput = ({ svgContent, originalSvgContent, themeMapping, settings, onReset, onDownload }: PreviewOutputProps) => {
  const [transformedOutput, setTransformedOutput] = useState("")

  useEffect(() => {
    const generateOutput = async () => {
      if (!originalSvgContent) {
        setTransformedOutput("")
        return
      }

      try {
        const result = await transform(settings, originalSvgContent, themeMapping)
        setTransformedOutput(typeof result === 'string' ? result : originalSvgContent)
      } catch (error) {
        console.error('Transform failed:', error)
        setTransformedOutput(originalSvgContent)
      }
    }

    generateOutput()
  }, [originalSvgContent, settings, themeMapping])
  return (
    <Card className="flex-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Preview & Output</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="output">Code Output</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">SVG Preview</h3>
              <div className="flex gap-2">
                <button 
                  onClick={onReset}
                  className="text-xs px-3 py-1 border rounded hover:bg-muted"
                >
                  Reset
                </button>
                <button 
                  onClick={onDownload}
                  className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Download
                </button>
              </div>
            </div>
            <div className="flex justify-center p-4 bg-muted/20 rounded-lg h-[500px] items-center overflow-hidden">
              {svgContent ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                  className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto [&>svg]:object-contain"
                />
              ) : (
                <div className="text-muted-foreground text-center">
                  <div className="h-12 w-12 mx-auto mb-2 opacity-50 bg-current rounded" />
                  <p>No SVG loaded</p>
                  <p className="text-sm">Paste or upload an SVG to get started</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="output" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Generated Code</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    if (!transformedOutput) return
                    navigator.clipboard.writeText(transformedOutput)
                    toast.success("Code copied to clipboard")
                  }}
                  className="text-xs px-3 py-1 border rounded hover:bg-muted"
                >
                  Copy
                </button>
                <button 
                  onClick={() => {
                    if (!transformedOutput) return
                    const blob = new Blob([transformedOutput], { type: "text/plain" })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = settings.react ? "Component.jsx" : "output.svg"
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                  }}
                  className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Download
                </button>
              </div>
            </div>
            <div className="h-[500px] border rounded-lg p-4 bg-muted/10 overflow-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {transformedOutput || "Processed code will appear here..."}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}