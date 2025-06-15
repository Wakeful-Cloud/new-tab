/**
 * @file Shortcut component
 */

// Imports
import {Show} from "solid-js";

import {ShortcutLinkHint, ShortcutMetadata} from "~/lib/types";

interface ShortcutProps {
  metadata: ShortcutMetadata;
  onEdit: () => void;
}

const Shortcut = (props: ShortcutProps) => {
  const onContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    props.onEdit();
  };

  return (
    <div>
      <a
        class="centered-col rounded-xl m-4 p-1"
        href={props.metadata.link}
        rel="noopener noreferrer"
        onContextMenu={onContextMenu}
      >
        <img
          alt={`${props.metadata.title} icon`}
          class="h-[14vh] w-[14vh] object-contain"
          src={props.metadata.icon}
        />
        <h1 class="text-lg">{props.metadata.title}</h1>
      </a>

      <Show when={props.metadata.linkHint !== ShortcutLinkHint.NONE}>
        <link rel={props.metadata.linkHint} href={props.metadata.link} />
      </Show>
    </div>
  );
};

export default Shortcut;
