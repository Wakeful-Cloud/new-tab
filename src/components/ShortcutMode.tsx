/**
 * @file Shortcut metadata drawer mode component
 */

// Imports
import {capitalize} from "lodash-es";
import {FloppyDisk, Image, Lightbulb, Link, TextT, Trash} from "phosphor-solid";
import {type Component, createEffect, createMemo, createSignal} from "solid-js";

import Button from "~/components/Button";
import FileUpload from "~/components/FileUpload";
import FormField from "~/components/FormField";
import Multiselect, {MultiselectOption} from "~/components/Multiselect";
import SubmitButton from "~/components/SubmitButton";
import TextBox from "~/components/TextBox";
import {ShortcutLinkHint, ShortcutMetadata} from "~/lib/types";
import {createDataURL} from "~/lib/utils";

interface ShortcutModeProps {
  metadata?: ShortcutMetadata;
  onSave: (metadata: ShortcutMetadata) => void;
  onDelete: () => void;
}

const ShortcutMode: Component<ShortcutModeProps> = props => {
  const [title, setTitle] = createSignal("");
  const [icon, setIcon] = createSignal("");
  const [link, setLink] = createSignal("");
  const [linkHint, setLinkHint] = createSignal(ShortcutLinkHint.NONE);

  createEffect(() => {
    if (props.metadata !== undefined) {
      setTitle(props.metadata.title);
      setIcon(props.metadata.icon);
      setLink(props.metadata.link);
      setLinkHint(props.metadata.linkHint);
    }
  });

  const linkHintOptions = createMemo(() =>
    Object.values(ShortcutLinkHint).map(
      provider =>
        ({
          label: capitalize(provider),
          value: provider,
        }) as MultiselectOption<string>,
    ),
  );

  const onIconChange = async (files: File[]) => {
    if (files.length !== 1) {
      throw new Error(`Expected 1 file, got ${files.length}!`);
    }

    const iconURL = await createDataURL(files[0]!);
    setIcon(iconURL);
  };

  const onSave = (event: Event) => {
    event.preventDefault();

    // Get the ID
    let id = props.metadata?.id;

    if (id === undefined) {
      const random = new Uint32Array(10);
      window.crypto.getRandomValues(random);

      id = Array.from(random)
        .map(number => number.toString(16).padStart(2, "0"))
        .join("");
    }

    props.onSave({
      icon: icon(),
      id,
      link: link(),
      linkHint: linkHint(),
      title: title(),
    });
  };

  return (
    <div class="centered-col flex-1">
      <form onSubmit={onSave}>
        <FormField label="Title">
          <TextBox
            leading={<TextT />}
            onChange={setTitle}
            placeholder="My Awesome Website"
            type="text"
            value={title()}
          />
        </FormField>

        <FormField label="Icon">
          <FileUpload
            accept={["image/*"]}
            label="Upload Image"
            leading={<Image />}
            multiple={false}
            onUpload={onIconChange}
          />
        </FormField>

        <FormField label="URL">
          <TextBox
            leading={<Link />}
            onChange={setLink}
            placeholder="https://example.com"
            type="text"
            value={link()}
          />
        </FormField>

        <FormField label="Link Hint">
          <Multiselect
            leading={<Lightbulb />}
            multiple={false}
            onChange={setLinkHint}
            options={linkHintOptions()}
            value={linkHint()}
          />
        </FormField>

        <SubmitButton leading={<FloppyDisk />} label="Save" />
      </form>

      <Button label="Delete" leading={<Trash />} onClick={props.onDelete} />
    </div>
  );
};

export default ShortcutMode;
