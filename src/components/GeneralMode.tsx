/**
 * @file General settings and information drawer mode component
 */

// Imports
import {capitalize} from "lodash-es";
import {
  ArrowClockwise,
  ClockClockwise,
  DownloadSimple,
  FloppyDisk,
  Funnel,
  Globe,
  Image,
  Plus,
  UploadSimple,
} from "phosphor-solid";
import {
  type Component,
  createEffect,
  createMemo,
  createSignal,
  Show,
} from "solid-js";

import Button from "~/components/Button";
import FileDownload from "~/components/FileDownload";
import FileUpload from "~/components/FileUpload";
import FormField from "~/components/FormField";
import Multiselect, {MultiselectOption} from "~/components/Multiselect";
import SubmitButton from "~/components/SubmitButton";
import {generateBackground} from "~/lib/background";
import {resetStore, setStore, store} from "~/lib/store";
import {BackgroundCategory, BackgroundProvider} from "~/lib/types";
import {createDataURL} from "~/lib/utils";

interface GeneralModeProps {
  onCreateShortcut: () => void;
}

const refreshAfterOptions: MultiselectOption<number>[] = [
  {
    label: "15 Minutes",
    value: 1000 * 60 * 10,
  },
  {
    label: "30 Minutes",
    value: 1000 * 60 * 30,
  },
  {
    label: "1 Hour",
    value: 1000 * 60 * 60,
  },
  {
    label: "3 Hours",
    value: 1000 * 60 * 60,
  },
  {
    label: "6 Hours",
    value: 1000 * 60 * 60 * 6,
  },
  {
    label: "12 Hours",
    value: 1000 * 60 * 60 * 12,
  },
  {
    label: "1 Day",
    value: 1000 * 60 * 60 * 24,
  },
  {
    label: "7 Days",
    value: 1000 * 60 * 60 * 24 * 7,
  },
  {
    label: "Never",
    value: -1,
  },
];

const GeneralMode: Component<GeneralModeProps> = props => {
  const [category, setCategory] = createSignal<BackgroundCategory>(
    BackgroundCategory.NONE,
  );

  const [customBackground, setCustomBackground] = createSignal<string>();

  const [provider, setProvider] = createSignal<BackgroundProvider>(
    BackgroundProvider.PEXELS,
  );

  const [refreshAfter, setRefreshAfter] = createSignal(0);

  createEffect(() => {
    if (store.background.category !== undefined) {
      setCategory(store.background.category);
    }

    setProvider(store.background.provider);
    setRefreshAfter(store.background.refreshAfter);
  });

  const backgroundProviderOptions = createMemo(() =>
    Object.values(BackgroundProvider).map(
      backgroundProvider =>
        ({
          label: capitalize(backgroundProvider),
          value: backgroundProvider,
        }) as MultiselectOption<string>,
    ),
  );

  const backgroundCategoryOptions = createMemo(() =>
    Object.values(BackgroundCategory).map(
      backgroundCategory =>
        ({
          label: capitalize(backgroundCategory),
          value: backgroundCategory,
        }) as MultiselectOption<string>,
    ),
  );

  const onUploadCustomBackground = async (files: File[]) => {
    if (files.length !== 1) {
      throw new Error(`Expected 1 file, got ${files.length}!`);
    }

    // Convert to a data URL
    const dataURL = await createDataURL(files[0]!);

    // Update the background
    setCustomBackground(dataURL);
  };

  const onSaveSettings = async (event: Event) => {
    event.preventDefault();

    // Update store
    setStore({
      ...store,
      background: {
        ...store.background,
        category: category(),
        provider: provider(),
        refreshAfter: refreshAfter(),
      },
    });

    // Regenerate background
    await generateBackground(customBackground());
  };

  const onResetSettings = async () => {
    // Reset store
    resetStore();

    // Regenerate background
    await generateBackground();
  };

  const serializedSettings = createMemo(() => {
    const raw = JSON.stringify(store, undefined, 2);

    const blob = new Blob([raw], {
      type: "application/json",
    });

    return blob;
  });

  const onUploadSettings = async (files: File[]) => {
    if (files.length !== 1) {
      throw new Error(`Expected 1 file, got ${files.length}!`);
    }

    // Parse the file
    const raw = await files[0]!.text();
    const deserialized = JSON.parse(raw);

    // Update store
    setStore(deserialized);
  };

  return (
    <>
      <div class="w-full">
        <h1 class="font-medium text-center text-xl">Shortcuts</h1>

        <Button
          label="Create Shortcut"
          leading={<Plus />}
          onClick={props.onCreateShortcut}
        />
      </div>

      <div class="my-2 w-full" />

      <form class="centered-col w-full" onSubmit={onSaveSettings}>
        <h1 class="font-medium text-center text-xl w-full">Background</h1>

        <FormField label="Background provider">
          <Multiselect
            leading={<Globe />}
            multiple={false}
            onChange={setProvider}
            options={backgroundProviderOptions()}
            value={store.background.provider}
          />
        </FormField>

        <Show when={provider() === BackgroundProvider.CUSTOM}>
          <FormField label="Upload custom background">
            <FileUpload
              accept={["image/*"]}
              label="Upload Image"
              leading={<Image />}
              multiple={false}
              onUpload={onUploadCustomBackground}
            />
          </FormField>
        </Show>

        <FormField label="Background category">
          <Multiselect
            leading={<Funnel />}
            multiple={false}
            onChange={setCategory}
            options={backgroundCategoryOptions()}
            value={store.background.category}
          />
        </FormField>

        <FormField label="Refresh Background After">
          <Multiselect
            leading={<ClockClockwise />}
            multiple={false}
            onChange={setRefreshAfter}
            options={refreshAfterOptions}
            value={store.background.refreshAfter}
          />
        </FormField>

        <SubmitButton leading={<FloppyDisk />} label="Save" />
      </form>

      <div class="my-2 w-full" />

      <div class="w-full">
        <h1 class="font-medium text-center text-xl">Miscellaneous</h1>

        <Button
          label="Reset Settings"
          leading={<ArrowClockwise />}
          onClick={onResetSettings}
        />

        <div class="py-1">
          <FileDownload
            leading={<DownloadSimple />}
            label="Download Settings"
            filename="new-tab.json"
            value={serializedSettings()}
          />
        </div>

        <div class="py-1">
          <FileUpload
            accept={["application/json", ".json"]}
            label="Upload Settings"
            leading={<UploadSimple />}
            multiple={false}
            onUpload={onUploadSettings}
          />
        </div>
      </div>

      <div class="my-2 w-full" />

      <p class="w-full text-center">
        Version: {import.meta.env.VERSION}
        <br />
        Built with ❤️ by{" "}
        <a href="https://wakefulcloud.dev" rel="noopener noreferrer">
          Wakeful Cloud
        </a>
      </p>
    </>
  );
};

export default GeneralMode;
