/**
 * @file Submit button component
 */

// Imports
import {JSXElement, Show, useContext} from "solid-js";

import {FormFieldIdContext} from "~/components/FormField";

interface SubmitButtonProps {
  label: string;
  leading?: JSXElement;
  trailing?: JSXElement;
}

const SubmitButton = (props: SubmitButtonProps) => {
  const id = useContext(FormFieldIdContext);

  return (
    <label class="border-1 centered-row cursor-pointer dark-within:focus:text-gray-500 focus-within:text-gray-400 my-2 p-2 rounded-md w-full">
      <Show when={props.leading !== undefined}>{props.leading}</Show>

      <span
        classList={{
          "ml-2": props.leading !== undefined,
          "mr-2": props.trailing !== undefined,
        }}
      >
        {props.label}
      </span>

      <input class="h-0 w-0" id={id} type="submit" />

      <Show when={props.trailing !== undefined}>{props.trailing}</Show>
    </label>
  );
};

export default SubmitButton;
