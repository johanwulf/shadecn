import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileImage } from "lucide-react"
import { Button } from "@/components/ui/button"

type SVGPreviewProps = {
  svgContent: string
  onReset: () => void
  onDownload: () => void
}

export const SVGPreview = ({ 
  svgContent, 
  onReset, 
  onDownload 
}: SVGPreviewProps) => {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Preview</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            Reset
          </Button>
          <Button size="sm" onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center p-4 bg-muted/20 rounded-lg h-[500px] items-center overflow-hidden">
          {svgContent ? (
            <div 
              dangerouslySetInnerHTML={{ __html: svgContent }}
              className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto [&>svg]:object-contain"
            />
          ) : (
            <div className="text-muted-foreground text-center">
              <FileImage className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No SVG loaded</p>
              <p className="text-sm">Paste or upload an SVG to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

