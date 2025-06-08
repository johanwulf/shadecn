import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download } from "lucide-react"
import { toast } from "sonner"
import { transform } from "@/lib/utils"

type Settings = {
  removeIds: boolean
  react: boolean
  removeClasses: boolean
  removeSizing: boolean
  format: boolean
}

type CodeOutputProps = {
  svgContent: string
  settings: Settings
}

export const CodeOutput = ({ svgContent, settings }: CodeOutputProps) => {
  const [outputCode, setOutputCode] = useState("")

  useEffect(() => {
    const generateOutput = async () => {
      if (!svgContent) {
        setOutputCode("")
        return
      }

      try {
        const result = await transform(settings, svgContent)
        if (result === false) {
          setOutputCode("Invalid SVG content")
          return
        }
        setOutputCode(result)
      } catch (error) {
        setOutputCode("Error processing SVG")
      }
    }

    generateOutput()
  }, [svgContent, settings])

  const handleCopy = async () => {
    if (!outputCode) return
    
    try {
      await navigator.clipboard.writeText(outputCode)
      toast.success("Code copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy code")
    }
  }

  const handleDownload = () => {
    if (!outputCode) return
    
    const blob = new Blob([outputCode], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = settings.react ? "Component.jsx" : "output.svg"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("File downloaded!")
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Output</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!outputCode}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button size="sm" onClick={handleDownload} disabled={!outputCode}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={outputCode}
          readOnly
          placeholder="Processed code will appear here..."
          className="h-[400px] font-mono text-sm resize-none"
        />
      </CardContent>
    </Card>
  )
}