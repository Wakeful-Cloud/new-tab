/**
 * @file Generic form field component
 */

// Imports
import {
  type Component,
  createContext,
  createUniqueId,
  JSXElement,
} from "solid-js";

interface FormFieldProps {
  label: string;
  children: JSXElement;
}

export const FormFieldIdContext = createContext<string>();

const FormField: Component<FormFieldProps> = props => {
  const id = createUniqueId();

  return (
    <div class="my-1 w-full">
      <label class="text-sm" for={id}>
        {props.label}
      </label>

      <div class="mt-0.5">
        <FormFieldIdContext.Provider value={id}>
          {props.children}
        </FormFieldIdContext.Provider>
      </div>
    </div>
  );
};

export default FormField;
