/**
 * @file Text box component
 */

// Imports
import {type Component, JSXElement, Show, useContext} from "solid-js";

import {FormFieldIdContext} from "~/components/FormField";

interface TextBoxProps {
  leading?: JSXElement;
  onChange?: (value: string) => void;
  placeholder?: string;
  trailing?: JSXElement;
  type: "email" | "number" | "password" | "search" | "tel" | "text" | "url";
  value: string;
}

const TextBox: Component<TextBoxProps> = props => {
  const id = useContext(FormFieldIdContext);

  return (
    <div class="border-1 p-2 rounded-md centered-row">
      <Show when={props.leading !== undefined}>{props.leading}</Show>

      <input
        class="bg-transparent outline-none w-full"
        classList={{
          "ml-2": props.leading !== undefined,
          "mr-2": props.trailing !== undefined,
        }}
        id={id}
        onChange={event => props.onChange?.(event.target.value)}
        placeholder={props.placeholder}
        type={props.type}
        value={props.value}
      />

      <Show when={props.trailing !== undefined}>{props.trailing}</Show>
    </div>
  );
};

export default TextBox;
