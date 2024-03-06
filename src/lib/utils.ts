import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function detectDiagramType(xml: string) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");

  // Check if the root element is from the DMN or BPMN namespace
  const rootElement = xmlDoc.documentElement;
  const rootNamespace = rootElement.namespaceURI;
  if (
    rootElement.namespaceURI === "https://www.omg.org/spec/DMN/20191111/MODEL/"
  ) {
    return "DMN";
  } else if (
    rootNamespace === "http://www.omg.org/spec/BPMN/20100524/MODEL" ||
    rootNamespace === "http://www.trisotech.com/definitions/_1275940932088"
  ) {
    return "BPMN";
  } else {
    return "Unknown";
  }
}
