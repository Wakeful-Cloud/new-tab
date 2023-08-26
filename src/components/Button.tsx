/**
 * @fileoverview Button component
 */

//Imports
import {JSXElement, Show, type Component} from "solid-js";

interface TextBoxProps {
  label: string;
  leading?: JSXElement;
  onClick: () => void;
  trailing?: JSXElement;
}

const TextBox: Component<TextBoxProps> = props => {
  return (
    <button
      class="border-1 centered-row dark-within:focus:text-gray-500 focus-within:text-gray-400 my-1 outline-none p-2 rounded-md w-full"
      onClick={() => props.onClick()}
    >
      <Show when={props.leading !== undefined}>{props.leading}</Show>

      <span
        classList={{
          "ml-2": props.leading !== undefined,
          "mr-2": props.trailing !== undefined
        }}
      >
        {props.label}
      </span>

      <Show when={props.trailing !== undefined}>{props.trailing}</Show>
    </button>
  );
};

export default TextBox;
