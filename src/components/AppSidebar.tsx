import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Bug } from "lucide-react"

type Settings = {
  removeIds: boolean
  react: boolean
  removeClasses: boolean
  removeSizing: boolean
  format: boolean
}

type AppSidebarProps = {
  settings: Settings
  onSettingChange: (key: keyof Settings, value: boolean) => void
}

export const AppSidebar = ({ settings, onSettingChange }: AppSidebarProps) => {
  const settingsConfig = [
    {
      key: 'react' as const,
      label: 'Export as React Component',
      description: 'Convert to JSX format with className attributes'
    },
    {
      key: 'format' as const,
      label: 'Format Code',
      description: 'Prettify and format the output code'
    },
    {
      key: 'removeIds' as const,
      label: 'Remove IDs',
      description: 'Strip all id attributes from elements'
    },
    {
      key: 'removeClasses' as const,
      label: 'Remove Classes',
      description: 'Strip class and className attributes'
    },
    {
      key: 'removeSizing' as const,
      label: 'Remove Sizing',
      description: 'Strip width and height attributes'
    }
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Export Settings</h2>
        <p className="text-sm text-sidebar-foreground/70">Configure how your SVG will be processed</p>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60 mb-4">
            Output Format
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-6">
            {settingsConfig.slice(0, 2).map((setting) => (
              <div key={setting.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-1">
                    <Label 
                      htmlFor={setting.key} 
                      className="text-sm font-medium text-sidebar-foreground cursor-pointer"
                    >
                      {setting.label}
                    </Label>
                    <p className="text-xs text-sidebar-foreground/60 leading-relaxed">
                      {setting.description}
                    </p>
                  </div>
                  <Switch
                    id={setting.key}
                    checked={settings[setting.key]}
                    onCheckedChange={(checked) => onSettingChange(setting.key, checked)}
                    className="ml-4"
                  />
                </div>
              </div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-6" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60 mb-4">
            Cleanup Options
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-6">
            {settingsConfig.slice(2).map((setting) => (
              <div key={setting.key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-1">
                    <Label 
                      htmlFor={setting.key} 
                      className="text-sm font-medium text-sidebar-foreground cursor-pointer"
                    >
                      {setting.label}
                    </Label>
                    <p className="text-xs text-sidebar-foreground/60 leading-relaxed">
                      {setting.description}
                    </p>
                  </div>
                  <Switch
                    id={setting.key}
                    checked={settings[setting.key]}
                    onCheckedChange={(checked) => onSettingChange(setting.key, checked)}
                    className="ml-4"
                  />
                </div>
              </div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => window.open('https://github.com/johanwulf/shadecn/issues/new', '_blank')}
        >
          <Bug className="h-4 w-4 mr-2" />
          Report a Bug
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}