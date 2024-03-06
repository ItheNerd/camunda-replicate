import { FormEditor } from '@bpmn-io/form-js-editor';

export interface FormDefinition {
  components: FormComponent[];
  type: string;
}

export interface FormComponent {
  type: string;
  key?: string;
  label?: string;
  text?: string;
  description?: string;
  validate?: ValidationRule;
  layout?: Layout;
  conditional?: Conditional;
  values?: Value[];
  valuesKey?: string;
  subtype?: string;
  dateLabel?: string;
  timeLabel?: string;
  timeSerializingFormat?: string;
  timeInterval?: number;
  use24h?: boolean;
  source?: string;
  alt?: string;
  defaultValue?: any;
  disabled?: boolean;
  readonly?: boolean;
  action?: string;
}

export interface ValidationRule {
  required?: boolean;
  pattern?: string;
  min?: number;
  max?: number;
  validationType?: string;
}

export interface Layout {
  columns?: number;
  row?: string;
}

export interface Conditional {
  hide?: string;
}

export interface Value {
  label: string;
  value: string;
}

export interface CustomFormJsModelerOptions {
  container: string;
  formJsOptions?: any;
  schema: FormDefinition;
}

class CustomFormJsModeler extends FormEditor {
  private schema: FormDefinition;

  constructor(options: CustomFormJsModelerOptions) {
    const mergedOptions = {
      ...options.formJsOptions,
      container: options.container,
    };

    super(mergedOptions);
    this.schema = options.schema;
  }

  // Implement additional methods here as needed
}

export default CustomFormJsModeler;
