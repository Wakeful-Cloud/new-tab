/**
 * @file Shortcut group component
 */

// Imports
import {type Component, For} from "solid-js";

import Shortcut from "~/components/Shortcut";
import {ShortcutGroupMetadata} from "~/lib/types";

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
