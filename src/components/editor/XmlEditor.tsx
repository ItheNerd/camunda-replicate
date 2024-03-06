import { Editor, EditorProps, Monaco } from "@monaco-editor/react";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import deepmerge from "deepmerge";
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface MonacoOptions {
  /**
   * Will receive the reference to the editor instance, the monaco instance, and the container
   * element.
   */
  refs?: MutableRefObject<Monaco | null>[];

  /**
   * Additional props to pass to the editor component. This will override the defaults defined by
   * this component.
   */
  props?: Partial<EditorProps>;
}

export interface XmlEditorProps {
  /**
   * The xml to display in the editor.
   */
  xml: string;

  /**
   * Whether this editor is currently active and visible to the user.
   */
  active: boolean;

  /**
   * Callback to execute whenever the diagram's xml changes.
   *
   * @param xml The new xml
   */
  onChanged: (xml: string) => void;

  /**
   * The options to pass to the monaco editor.
   */
  monacoOptions?: MonacoOptions;

  /**
   * The class name applied to the host of the modeler.
   */
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    "&>div": {
      height: "100%",
      overflow: "hidden",
    },
  },
  hidden: {
    display: "none",
  },
}));

const XmlEditor: React.FC<XmlEditorProps> = (props) => {
  const classes = useStyles();

  const { xml, onChanged, active, monacoOptions, className } = props;

  const [xmlEditorShown, setXmlEditorShown] = useState(false);

  const onXmlChanged = useCallback(
    (value: string) => {
      if (active) {
        onChanged(value);
      }
    },
    [active, onChanged]
  );

  /**
   * Initializes the editor when it is visible for the first time. If it is shown when it is
   * first mounted, the size is wrong.
   */
  useEffect(() => {
    if (active && !xmlEditorShown) {
      setXmlEditorShown(true);
    }
  }, [xmlEditorShown, active]);

  const options = useMemo(
    () =>
      deepmerge(
        {
          theme: "vs-light",
          wordWrap: "on",
          wrappingIndent: "deepIndent",
          scrollBeyondLastLine: false,
          minimap: {
            enabled: false,
          },
          fontSize: 14,
        },
        monacoOptions?.props?.options || {}
      ),
    [monacoOptions?.props?.options]
  );

  /**
   * Only show the editor once it has became active or the editor size will be wrong.
   */
  if (!xmlEditorShown) {
    return null;
  }

  return (
    <div className={clsx(classes.root, !active && classes.hidden)}>
      <Editor
        defaultLanguage="xml"
        value={xml.trim()}
        options={options}
        className={className}
        onChange={onXmlChanged as any}
        {...(monacoOptions?.props || {})}
      />
    </div>
  );
};

export default React.memo(XmlEditor);
