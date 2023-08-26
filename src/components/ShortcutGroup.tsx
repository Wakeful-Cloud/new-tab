/**
 * @fileoverview Shortcut group component
 */

//Imports
import {For, type Component} from "solid-js";
import {ShortcutGroupMetadata} from "~/lib/types";
import Shortcut from "~/components/Shortcut";

interface ShortcutGroupProps {
  metadata: ShortcutGroupMetadata;
}

const ShortcutGroup: Component<ShortcutGroupProps> = props => {
  return (
    <div>
      <For each={props.metadata.shortcuts}>
        {item => <Shortcut metadata={item} />}
      </For>
    </div>
  );
};

export default ShortcutGroup;
