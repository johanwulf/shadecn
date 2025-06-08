import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { formatHex, oklch } from "culori"

type ColorCustomizerProps = {
  colors: string[]
  onColorChange: (oldColor: string, newColor: string) => void
  onBulkColorChange: (colorMap: Record<string, string>) => void
  onThemeMappingChange?: (themeMapping: Record<string, string>) => void
}

export const ColorCustomizer = ({ colors, onColorChange, onBulkColorChange, onThemeMappingChange }: ColorCustomizerProps) => {
  const [colorMap, setColorMap] = useState<Record<string, string>>({})
  const [themeConfig, setThemeConfig] = useState("")
  const [extractedThemeColors, setExtractedThemeColors] = useState<Record<string, string>>({})
  const [showThemeMapping, setShowThemeMapping] = useState(false)
  const [themeMapping, setThemeMapping] = useState<Record<string, string>>({})

  const handleColorChange = (originalColor: string, newColor: string) => {
    setColorMap(prev => ({ ...prev, [originalColor]: newColor }))
    onColorChange(originalColor, newColor)
  }

  const handleThemeExtract = () => {
    try {
      const colorValues: Record<string, string> = {}
      
      // Extract colors directly from the pasted CSS
      const rootMatch = themeConfig.match(/:root\s*{([^}]+)}/s)
      const content = rootMatch ? rootMatch[1] : themeConfig
      
      const lines = content.split('\n')
      lines.forEach(line => {
        const match = line.match(/--(\w+(?:-\w+)*): (.+);/)
        if (match) {
          const [, colorName, colorValue] = match
          const hexColor = convertColorToHex(colorValue.trim())
          if (hexColor) {
            colorValues[colorName] = hexColor
          }
        }
      })
      
      if (Object.keys(colorValues).length > 0) {
        setExtractedThemeColors(colorValues)
        setShowThemeMapping(true)
        toast.success(`Extracted ${Object.keys(colorValues).length} theme colors`)
      } else {
        toast.error("No valid colors found in theme config")
      }
    } catch (error) {
      toast.error("Invalid theme configuration")
    }
  }
  
  
  const convertColorToHex = (colorValue: string): string | null => {
    try {
      // Handle oklch format using culori
      if (colorValue.startsWith('oklch(')) {
        const match = colorValue.match(/oklch\(([^)]+)\)/)
        if (match) {
          const values = match[1].split(' ').map(v => parseFloat(v.trim()))
          if (values.length >= 3) {
            const [l, c, h] = values
            const color = oklch({ mode: 'oklch', l, c, h })
            return formatHex(color) || null
          }
        }
      }
      
      // Handle hsl format
      if (colorValue.startsWith('hsl(')) {
        // Use browser to parse HSL
        const temp = document.createElement('div')
        temp.style.color = colorValue
        document.body.appendChild(temp)
        const computed = getComputedStyle(temp).color
        document.body.removeChild(temp)
        
        const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (match) {
          const [, r, g, b] = match
          return `#${[r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}`
        }
      }
      
      // Handle hex format
      if (colorValue.startsWith('#')) {
        return colorValue
      }
      
      return null
    } catch (error) {
      console.warn('Failed to convert color:', colorValue, error)
      return null
    }
  }
  
  const handleThemeColorSelect = (svgColor: string, themeColor: string) => {
    const newThemeMapping = { ...themeMapping }
    const newColorMap = { ...colorMap }
    
    if (themeColor === 'none') {
      delete newThemeMapping[svgColor]
      delete newColorMap[svgColor]
    } else {
      newThemeMapping[svgColor] = themeColor
      // For preview, use the hex color
      newColorMap[svgColor] = extractedThemeColors[themeColor]
    }
    
    setThemeMapping(newThemeMapping)
    setColorMap(newColorMap)
    onBulkColorChange(newColorMap)
    onThemeMappingChange?.(newThemeMapping)
  }

  return (
    <Card className="flex-1 min-h-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Customize Colors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="theme">Theme Config</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-3 mt-4">
            {colors.length === 0 ? (
              <p className="text-muted-foreground text-center py-6 text-sm">
                No colors detected. Import an SVG first.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {colors.map((color, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs px-2 py-1"
                      style={{ backgroundColor: color, color: getContrastColor(color) }}
                    >
                      {color}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border border-border flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <Input
                        type="color"
                        value={colorMap[color] || color}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColorChange(color, e.target.value)}
                        className="w-16 h-8 p-1"
                      />
                      <Input
                        value={colorMap[color] || color}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColorChange(color, e.target.value)}
                        placeholder="#000000"
                        className="flex-1 h-8 text-xs font-mono"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="theme" className="space-y-3 mt-4">
            {!showThemeMapping ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="theme-config" className="text-sm">Shadcn Theme Config</Label>
                  <Textarea
                    id="theme-config"
                    placeholder={`:root {
  --primary: oklch(0.637 0.237 25.331);
  --secondary: oklch(0.967 0.001 286.375);
  --accent: oklch(0.967 0.001 286.375);
  --destructive: oklch(0.577 0.245 27.325);
  --muted: oklch(0.967 0.001 286.375);
}

.dark {
  --primary: oklch(0.637 0.237 25.331);
  --secondary: oklch(0.274 0.006 286.033);
}`}
                    value={themeConfig}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setThemeConfig(e.target.value)}
                    className="min-h-[160px] font-mono text-xs"
                  />
                </div>
                <Button onClick={handleThemeExtract} className="w-full" size="sm" disabled={!themeConfig.trim()}>
                  <Upload className="h-3 w-3 mr-2" />
                  Extract Theme Colors
                </Button>
                <p className="text-xs text-muted-foreground">
                  Paste your complete shadcn theme CSS (including :root and .dark blocks) or just the custom properties.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowThemeMapping(false)}
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Back
                  </Button>
                  <h3 className="text-sm font-medium">Map Theme Colors</h3>
                </div>
                
                {colors.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6 text-sm">
                    No SVG colors detected. Import an SVG first.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {colors.map((color, index) => (
                      <div key={index} className="space-y-2 p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border border-border flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs font-mono flex-1">{color}</span>
                        </div>
                        <Select
                          value={themeMapping[color] || 'none'}
                          onValueChange={(value) => handleThemeColorSelect(color, value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Choose theme color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Keep original</SelectItem>
                            {Object.entries(extractedThemeColors).map(([name, hexColor]) => (
                              <SelectItem key={name} value={name}>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded border border-border"
                                    style={{ backgroundColor: hexColor }}
                                  />
                                  <span className="capitalize">{name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Choose which theme colors to apply to each SVG color. Leave as "Keep original" to maintain the current color.
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

const getContrastColor = (hexColor: string): string => {
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)  
  const b = parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}