/**
 * @fileoverview Background component
 */

//Imports
import {Show, type Component} from "solid-js";
import {BackgroundData} from "~/lib/types";

interface BackgroundProps {
  background?: BackgroundData;
}

const Background: Component<BackgroundProps> = props => {
  return (
    <div class="absolute bottom-0 left-0 pointer-events-none right-0 top-0">
      <div class="absolute dark:bg-dark-700 h-full object-cover w-full -z-2" />

      <Show when={props.background !== undefined}>
        <img
          alt={`${props.background!.alt} icon`}
          class="absolute h-full object-cover w-full -z-1"
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
          src={props.background!.url}
        />
      </Show>
    </div>
  );
};

export default Background;
