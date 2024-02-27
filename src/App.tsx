import {
  BpmnModeler,
  ContentSavedReason,
  CustomBpmnJsModeler,
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
  const modelerRef = useRef<CustomBpmnJsModeler>();

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

  const onSaveClicked = useCallback(async () => {
    if (!modelerRef.current) {
      // Should actually never happen, but required for type safety
      return;
    }

    console.log("Saving model...");
    const result = await modelerRef.current.save();
    console.log("Saved model!", result.xml, result.svg);
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
      <Button
        onClick={onSaveClicked}
        style={{
          position: "absolute",
          zIndex: 100,
          top: 25,
          left: "calc(50% - 100px)",
        }}>
        Save Diagram
      </Button>

      <BpmnModeler
        xml={xml}
        onEvent={onEvent}
        xmlTabOptions={xmlTabOptions}
        modelerTabOptions={modelerTabOptions}
      />
    </div>
  );
};

export default App;

const BPMN = getHardcodedXmlString();
