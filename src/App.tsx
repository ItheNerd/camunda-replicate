import {
  BpmnModeler,
  ContentSavedReason,
  CustomBpmnJsModeler,
  CustomDmnJsModeler,
  Event,
  isBpmnIoEvent,
  isContentSavedEvent,
  isNotificationEvent,
  isPropertiesPanelResizedEvent,
  isUIUpdateRequiredEvent,
} from "@/components/index";
import { getHardcodedXmlString } from "@/lib/pizza-collaboration";
import React, { useCallback, useMemo, useRef, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";

const App: React.FC = () => {
  const modelerRef = useRef<CustomDmnJsModeler | CustomBpmnJsModeler>();

  const [xml, setXml] = useState<string>(BPMN);
  const [_, setSvg] = useState<string | undefined>();

  const onXmlChanged = useCallback(
    (
      newXml: string,
      newSvg: string | undefined,
      reason: ContentSavedReason
    ) => {
      console.log(`Model has been changed because of ${reason}`);
      // Do whatever you want here, save the XML and SVG in the backend etc.
      setXml(newXml);
      setSvg(newSvg);
    },
    []
  );

  const onSaveSvgClicked = useCallback(async () => {
    if (!modelerRef.current) {
      console.error("Modeler is not initialized");
      return;
    }

    try {
      // Check if modelerRef.current is an instance of CustomBpmnJsModeler
      if (modelerRef.current instanceof CustomBpmnJsModeler) {
        const diagramData = await modelerRef.current.exportSvg();
        const blob = new Blob([diagramData], { type: "image/svg+xml" }); // Convert diagram data to Blob
        const url = window.URL.createObjectURL(blob); // Create a download URL for the Blob
        const a = document.createElement("a"); // Create a link element
        a.href = url;
        a.download = "diagram.svg"; // Set the filename for download as SVG
        document.body.appendChild(a); // Append link to body
        a.click(); // Simulate click on the link
        window.URL.revokeObjectURL(url); // Release the object URL
        document.body.removeChild(a); // Remove link from body
        console.log("SVG diagram exported successfully!");
      } else {
        console.error("Modeler does not support exporting SVG");
      }
    } catch (error) {
      console.error("Error exporting SVG diagram:", error);
    }
  }, []);

  const onSaveXmlClicked = useCallback(async () => {
    if (!modelerRef.current) {
      console.error("Modeler is not initialized");
      return;
    }

    try {
      const diagramData = await modelerRef.current.exportXml();
      const blob = new Blob([diagramData], { type: "application/xml" }); // Convert diagram data to Blob
      const url = window.URL.createObjectURL(blob); // Create a download URL for the Blob
      const a = document.createElement("a"); // Create a link element
      a.href = url;
      if (modelerRef.current instanceof CustomBpmnJsModeler) {
        a.download = "diagram.bpmn";
      } else {
        a.download = "diagram.dmn";
      }

      document.body.appendChild(a); // Append link to body
      a.click(); // Simulate click on the link
      window.URL.revokeObjectURL(url); // Release the object URL
      document.body.removeChild(a); // Remove link from body
      console.log("BPMN diagram exported successfully!");
    } catch (error) {
      console.error("Error exporting BPMN diagram:", error);
    }
  }, []);

  const toggleMinimap = useCallback(() => {
    if (!modelerRef.current) {
      console.error("Modeler is not initialized");
      return;
    }
    modelerRef.current.toggleMinimap();
  }, []);

  const onEvent = useCallback(
    async (event: Event<any>) => {
      if (isContentSavedEvent(event)) {
        // Content has been saved, e.g. because user edited the model or because he switched
        // from BPMN to XML.
        onXmlChanged(event.data.xml, event.data.svg, event.data.reason);
        return;
      }

      if (isNotificationEvent(event)) {
        // There's a notification the user is supposed to see, e.g. the model could not be
        // imported because it was invalid.
        return;
      }

      if (isUIUpdateRequiredEvent(event)) {
        // Something in the modeler has changed and the UI (e.g. menu) should be updated.
        // This happens when the user selects an element, for example.
        return;
      }

      if (isPropertiesPanelResizedEvent(event)) {
        // The user has resized the properties panel. You can save this value e.g. in local
        // storage to restore it on next load and pass it as initializing option.
        console.log(`Properties panel has been resized to ${event.data.width}`);
        return;
      }

      if (isBpmnIoEvent(event)) {
        // Just a regular bpmn-js event - actually lots of them
        return;
      }

      // eslint-disable-next-line no-console
      console.log("Unhandled event received", event);
    },
    [onXmlChanged]
  );

  /**
   * ====
   * CAUTION: Using useMemo() is important to prevent additional render cycles!
   * ====
   */

  const xmlTabOptions = useMemo(
    () => ({
      className: undefined,
      disabled: undefined,
      monacoOptions: undefined,
    }),
    []
  );

  const propertiesPanelOptions = useMemo(
    () => ({
      className: undefined,
      containerId: undefined,
      container: undefined,
      elementTemplates: undefined,
      hidden: undefined,
      size: {
        max: undefined,
        min: undefined,
        initial: undefined,
      },
    }),
    []
  );

  const modelerOptions = useMemo(
    () => ({
      className: undefined,
      refs: [modelerRef],
      container: undefined,
      containerId: undefined,
      size: {
        max: undefined,
        min: undefined,
        initial: undefined,
      },
    }),
    []
  );

  const bpmnJsOptions = useMemo(() => undefined, []);

  const modelerTabOptions = useMemo(
    () => ({
      className: undefined,
      disabled: undefined,
      bpmnJsOptions: bpmnJsOptions,
      modelerOptions: modelerOptions,
      propertiesPanelOptions: propertiesPanelOptions,
    }),
    [bpmnJsOptions, modelerOptions, propertiesPanelOptions]
  );

  return (
    <div className="h-screen">
      <div
        style={{
          position: "absolute",
          zIndex: 100,
          top: 25,
          left: "calc(50vw - 125px)",
        }}
        className="flex gap-2">
        <Button
          variant={"outline"}
          className="bg-gray-100"
          onClick={onSaveXmlClicked}
          aria-label="xml">
          Save Diagram
        </Button>
        <Button
          variant={"outline"}
          className="bg-gray-100"
          onClick={onSaveSvgClicked}
          aria-label="xml">
          Save SVG
        </Button>
        <Button
          variant={"outline"}
          className="bg-gray-100"
          onClick={toggleMinimap}>
          Open Minimap
        </Button>
      </div>
      <BpmnModeler
        xml={xml}
        onEvent={onEvent}
        xmlTabOptions={xmlTabOptions}
        modelerTabOptions={modelerTabOptions as any}
      />
    </div>
  );
};

export default App;

const BPMN = getHardcodedXmlString();
