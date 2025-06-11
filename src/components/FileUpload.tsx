/**
 * @file File upload component
 */

// Imports
import {
  type Component,
  createSignal,
  JSXElement,
  Show,
  useContext,
} from "solid-js";

import {FormFieldIdContext} from "~/components/FormField";

interface FileUploadProps {
  accept?: string[];
  label: string;
  leading?: JSXElement;
  multiple: boolean;
  onUpload?: (value: File[]) => void;
  trailing?: JSXElement;
}

const FileUpload: Component<FileUploadProps> = props => {
  const id = useContext(FormFieldIdContext);

  const [filenames, setFilenames] = createSignal<string[]>([]);

  const onChange = (event: Event) => {
    if (props.onUpload === undefined) {
      return;
    }

    // Get the target
    const file = event.target as HTMLInputElement;

    // Get files
    if (file.files === null) {
      throw new TypeError("File list is null");
    }

    const files = Array.from(file.files);

    // Update the filenames
    setFilenames(files.map(currentFile => currentFile.name));

    // Emit
    props.onUpload(files);
  };

  return (
    <label class="border-1 centered-row cursor-pointer dark-within:focus:text-gray-500 flex-1 focus-within:text-gray-400 p-2 rounded-md">
      <Show when={props.leading !== undefined}>{props.leading}</Show>

      <span
        classList={{
          "ml-2": props.leading !== undefined,
          "mr-2": props.trailing !== undefined,
        }}
      >
        {props.label} {filenames().join(", ")}
      </span>

      <input
        accept={props.accept?.join(",")}
        aria-label={props.label}
        class="h-0 w-0"
        id={id}
        multiple={props.multiple}
        onChange={onChange}
        type="file"
      />

      <Show when={props.trailing !== undefined}>{props.trailing}</Show>
    </label>
  );
};

export default FileUpload;
