import "@/styles/dmn-css/diagram-js.css";
import "@/styles/dmn-css/dmn-font/css/dmn-embedded.css";
import "@/styles/dmn-css/dmn-js-decision-table-controls.css";
import "@/styles/dmn-css/dmn-js-decision-table.css";
import "@/styles/dmn-css/dmn-js-drd.css";
import "@/styles/dmn-css/dmn-js-literal-expression.css";
import "@/styles/dmn-css/dmn-js-shared.css";
import "@/styles/dmn-css/properties-panel.css";
import camundaModdleDescriptor from "camunda-dmn-moddle/resources/camunda.json";
import deepmerge from "deepmerge";
import diagramOriginModule from "diagram-js-origin";
import {
  CamundaPropertiesProviderModule,
  DmnPropertiesPanelModule,
  DmnPropertiesProviderModule,
} from "dmn-js-properties-panel";
import Modeler from "dmn-js/lib/Modeler";
import GlobalEventListenerUtil, {
  EventCallback,
} from "../GlobalEventListenerUtil";

export interface ViewsChangedEvent {
  activeView: DmnView | undefined;
  views: DmnView[];
}

export interface DmnView {
  element: any;
  id: string;
  name: string;
  type: "drd" | "decisionTable" | "literalExpression";
}

export interface DmnViewer {
  /**
   * Returns a named component.
   *
   * @param name The name
   * @param strict If an error should be thrown if the component does not exist. If false, null
   *     will be returned.
   */
  get: (name: string, strict?: boolean) => any;

  /**
   * Registers a new event handler.
   *
   * @param event The event name
   * @param handler The handler
   */
  on: (event: string, handler: (event: any) => void) => void;

  /**
   * Unregisters a previously registered event handler.
   *
   * @param event The event name
   * @param handler The handler
   */
  off: (event: string, handler: (event: any) => void) => void;
}

export interface CustomDmnJsModelerOptions {
  /**
   * The ID of the div to use as host for the properties panel. The div must be present inside
   * the page HTML. If missing or undefined is passed, no properties panel will be initialized.
   */
  propertiesPanel?: string;

  /**
   * The ID of the div to use as host for the editor itself. The div must be present inside the
   * page HTML.
   */
  container: string;

  /**
   * The options passed to dmn-js. Will be merged with the options defined by this library,
   * with the latter taking precedence in case of conflict.
   * CAUTION: If you pass invalid properties, the modeler can break!
   */
  dmnJsOptions?: any;
}

class CustomDmnJsModeler extends Modeler {
  /**
   * Creates a new instance of the bpmn-js modeler.
   *
   * @param options The options to include
   */
  constructor(options: CustomDmnJsModelerOptions) {
    const mergedOptions = deepmerge.all([
      // The options passed by the user
      options.dmnJsOptions || {},

      // The library's default options
      {
        container: options.container,
        drd: {
          additionalModules: [
            diagramOriginModule,
            {
              __init__: ["globalEventListenerUtil"],
              globalEventListenerUtil: ["type", GlobalEventListenerUtil],
            },
          ],
        },
        decisionTable: {
          additionalModules: [
            {
              __init__: ["globalEventListenerUtil"],
              globalEventListenerUtil: ["type", GlobalEventListenerUtil],
            },
          ],
        },
        literalExpression: {
          additionalModules: [
            {
              __init__: ["globalEventListenerUtil"],
              globalEventListenerUtil: ["type", GlobalEventListenerUtil],
            },
          ],
        },
        moddleExtensions: {
          camunda: camundaModdleDescriptor,
        },
      },

      // The options required to display the properties panel (if desired)
      options.propertiesPanel
        ? {
            drd: {
              propertiesPanel: {
                parent: options.propertiesPanel,
              },
              additionalModules: [
                DmnPropertiesPanelModule,
                DmnPropertiesProviderModule,
                CamundaPropertiesProviderModule,
              ],
            },
            decisionTable: {
              propertiesPanel: {
                parent: options.propertiesPanel,
              },
              additionalModules: [
                DmnPropertiesPanelModule,
                DmnPropertiesProviderModule,
                CamundaPropertiesProviderModule,
              ],
            },
            literalExpression: {
              propertiesPanel: {
                parent: options.propertiesPanel,
              },
              additionalModules: [
                DmnPropertiesPanelModule,
                DmnPropertiesProviderModule,
                CamundaPropertiesProviderModule,
              ],
            },
          }
        : {},
    ]);
    super(mergedOptions);
  }

  /**
   * Saves the editor content as XML.
   */
  public save(params: { format: boolean }): Promise<{ xml: string }> {
    return new Promise((resolve, reject) => {
      this.saveXML(params, (err, xml) => {
        if (err) {
          reject(err);
        } else {
          resolve({ xml });
        }
      });
    });
  }

  /**
   * Imports the specified XML.
   *
   * @param xml The XML to import
   * @param open Whether to open the view after importing
   */
  public import(
    xml: string,
    open = true
  ): Promise<{ warnings: ImportWarning[] }> {
    return new Promise((resolve, reject) => {
      this.importXML(xml, { open }, (error, warnings) => {
        if (error) {
          reject(error);
        } else {
          resolve({ warnings });
        }
      });
    });
  }

  /**
   * Returns whether the command stack contains any actions that can be undone.
   * Can be used to determine if the undo button should be enabled or not.
   */
  public canUndo(): boolean {
    return this.getActiveViewer()?.get("commandStack").canUndo();
  }

  /**
   * Returns whether the command stack contains any actions that can be repeated.
   * Can be used to determine if the redo button should be enabled or not.
   */
  public canRedo(): boolean {
    return this.getActiveViewer()?.get("commandStack").canRedo();
  }

  /**
   * Returns the size of the current selection.
   */
  public getSelectionSize(): number {
    return this.getActiveViewer()?.get("selection")?.get()?.length || 0;
  }

  /**
   * Binds the keyboard to the curretn document.
   * Keyboard shortcuts will trigger actions in the editor after this has been called.
   */
  public bindKeyboard(): void {
    this.getActiveViewer()?.get("keyboard").bind(document);
  }

  /**
   * Unbinds the keyboard from the current document.
   * Keyboard shortcuts won't work anymore after this has been called.
   */
  public unbindKeyboard(): void {
    this.getActiveViewer()?.get("keyboard").unbind();
  }

  /**
   * Returns the current stack index.
   */
  public getStackIndex(): number {
    // eslint-disable-next-line no-underscore-dangle
    return this.getActiveViewer()?.get("commandStack")._stackIdx;
  }

  /**
   * Instructs the command stack to undo the last action.
   */
  public undo(): void {
    return this.getActiveViewer()?.get("commandStack").undo();
  }

  /**
   * Instructs the command stack to repeat the last undone action.
   */
  public redo(): void {
    return this.getActiveViewer()?.get("commandStack").redo();
  }

  /**
   * Registers a global event listener that will receive all bpmn-js events.
   *
   * @param listener The listener to register
   */
  public registerGlobalEventListener(listener: EventCallback): void {
    this.getActiveViewer()?.get("globalEventListenerUtil").on(listener);
  }

  /**
   * Unregisters a previously registered global event listener.
   *
   * @param listener The listener to unregister
   */
  public unregisterGlobalEventListener(listener: EventCallback): void {
    this.getActiveViewer()?.get("globalEventListenerUtil").off(listener);
  }
}

export default CustomDmnJsModeler;
