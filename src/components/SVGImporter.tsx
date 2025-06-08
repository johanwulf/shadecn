import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText } from "lucide-react"
import { toast } from "sonner"

type SVGImporterProps = {
  onSVGLoad: (svgContent: string) => void
}

export const SVGImporter = ({ onSVGLoad }: SVGImporterProps) => {
  const [pastedSVG, setPastedSVG] = useState("")

  const handlePasteSVG = () => {
    if (!pastedSVG.trim()) {
      toast.error("Please paste SVG content first")
      return
    }
    
    if (!pastedSVG.includes('<svg')) {
      toast.error("Invalid SVG content")
      return
    }

    onSVGLoad(pastedSVG)
    toast.success("SVG loaded successfully!")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.svg')) {
      toast.error("Please select an SVG file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      onSVGLoad(content)
      toast.success("SVG file uploaded successfully!")
    }
    reader.readAsText(file)
  }

  return (
    <Card className="flex-shrink-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Import SVG</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="paste" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">Paste</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paste" className="space-y-3 mt-4">
            <Textarea
              placeholder="Paste your SVG code here..."
              value={pastedSVG}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPastedSVG(e.target.value)}
              className="min-h-[120px] font-mono text-xs"
            />
            <Button onClick={handlePasteSVG} className="w-full" size="sm">
              <FileText className="h-3 w-3 mr-2" />
              Load SVG
            </Button>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-3 mt-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground mb-3">Select an SVG file to upload</p>
              <Input
                type="file"
                accept=".svg"
                onChange={handleFileUpload}
                className="max-w-xs mx-auto text-xs"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}