/**
 * @fileoverview Multiselect component
 */

//Imports
import {For, JSXElement, Show, useContext, type Component} from "solid-js";
import {FormFieldIdContext} from "~/components/FormField";

export interface MultiselectOption<T> {
  label: string;
  value: T;
}

interface MultiselectProps<T> {
  leading?: JSXElement;
  multiple: boolean;
  onChange?: (value: T) => void;
  options: MultiselectOption<T>[];
  trailing?: JSXElement;
  value?: T;
}

const Multiselect: Component<MultiselectProps<any>> = props => {
  const id = useContext(FormFieldIdContext);

  const onChange = (event: Event) => {
    if (props.onChange === undefined) {
      return;
    }

    //Get the raw value
    const raw = (event.target as HTMLSelectElement).value;

    //Find the matching option
    const option = props.options.find(
      option => JSON.stringify(option.value) === raw
    );

    if (option === undefined) {
      throw new TypeError(
        `[Multiselect] Could not find option for value ${raw}!`
      );
    }

    //Emit
    props.onChange(option.value);
  };

  return (
    <div class="border-1 p-2 rounded-md centered-row">
      <Show when={props.leading !== undefined}>{props.leading}</Show>

      <select
        class="bg-transparent cursor-pointer dark-within:focus:text-gray-500 focus-within:text-gray-400 outline-none w-full"
        classList={{
          "ml-2": props.leading !== undefined,
          "mr-2": props.trailing !== undefined
        }}
        id={id}
        multiple={props.multiple}
        onChange={onChange}
        value={JSON.stringify(props.value)}
      >
        <For each={props.options}>
          {item => (
            <option
              class="bg-light-900 color-dark-900 dark:bg-dark-900 dark:color-light-900"
              value={JSON.stringify(item.value)}
            >
              {item.label}
            </option>
          )}
        </For>
      </select>

      <Show when={props.trailing !== undefined}>{props.trailing}</Show>
    </div>
  );
};

export default Multiselect;
