/**
 * @fileoverview Drawer component
 */

//Imports
import {X} from "phosphor-solid";
import {JSXElement, Show, type Component, type Setter} from "solid-js";

interface DrawerProps {
  open: boolean;
  setOpen: Setter<boolean>;
  children: JSXElement;
}

const Drawer: Component<DrawerProps> = props => {
  return (
    <div class="absolute bottom-0 left-0 overflow-hidden pointer-events-none right-0 top-0 z-10">
      <Show when={props.open}>
        <div
          class="absolute bg-dark-900/50 bottom-0 left-0 pointer-events-auto right-0 top-0"
          onClick={() => props.setOpen(false)}
        />
      </Show>

      <div
        class="absolute acrylic bottom-0 duration-350 hcentered-col p-4 pointer-events-auto right-0 rounded-l-xl top-0 transition-all w-84"
        style={
          props.open
            ? {}
            : {
                right: "-84rem"
              }
        }
      >
        <div class="centered-row w-full">
          <button
            class="p-1 outline-none focus:text-gray-400 dark:focus:text-gray-500"
            onClick={() => props.setOpen(false)}
          >
            <X size="1.5rem" />
          </button>

          <div class="flex-1" />
        </div>

        <div class="centered-col h-full w-full">{props.children}</div>
      </div>
    </div>
  );
};

export default Drawer;
