import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import prettier from "prettier";
import babel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";
import { XMLValidator } from "fast-xml-parser";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const REACT_TEMPLATE = `const svg = () => {
CODE
}
`;

type TransformSettings = {
  removeIds?: boolean
  react?: boolean
  removeClasses?: boolean
  removeSizing?: boolean
  format?: boolean
}

type ThemeMapping = Record<string, string>

export const transform = async (settings: TransformSettings, svg: string, themeMapping?: ThemeMapping) => {
  let obj = svg;

  if (XMLValidator.validate(svg) !== true) {
    return false;
  }

  // Apply theme color mappings to use CSS custom properties
  if (themeMapping && Object.keys(themeMapping).length > 0) {
    Object.entries(themeMapping).forEach(([originalHexColor, themeName]) => {
      const cssVar = `hsl(var(--${themeName}))`
      // Escape special regex characters in the hex color
      const escapedColor = originalHexColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      obj = obj.replace(new RegExp(escapedColor, "g"), cssVar)
    })
  }

  if (settings.removeIds) {
    obj = obj.replace(/id="[^"]*"/g, "");
  }

  if (settings.react) {
    obj = obj.replace(/class=/g, "className=");
    obj = obj.replace(/xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/g, "");
    obj = REACT_TEMPLATE.replace("CODE", obj);
  }

  if (settings.removeClasses) {
    obj = obj.replace(/className="[^"]*"/g, "");
    obj = obj.replace(/class="[^"]*"/g, "");
  }

  if (settings.removeSizing) {
    obj = obj.replace(/width="[^"]*"/, "").replace(/height="[^"]*"/, "");
  }

  if (settings.format) {
    obj = await prettier.format(obj, {
      semi: false,
      parser: "babel",
      plugins: [babel, estree],
    });
  }

  obj = obj.replace(";", "");

  return obj;
}
