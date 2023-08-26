/**
 * @fileoverview File download component
 */

//Imports
import {JSXElement, Show, createMemo, type Component} from "solid-js";

interface FileDownloadProps {
  label: string;
  leading?: JSXElement;
  trailing?: JSXElement;
  filename: string;
  value: Blob;
}

const FileDownload: Component<FileDownloadProps> = props => {
  const href = createMemo(() => URL.createObjectURL(props.value));

  return (
    <a
      class="border-1 centered-row cursor-pointer dark-within:focus:text-gray-500 flex-1 focus-within:text-gray-400 p-2 rounded-md"
      href={href()}
      download={props.filename}
      target="_blank"
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
    </a>
  );
};

export default FileDownload;
