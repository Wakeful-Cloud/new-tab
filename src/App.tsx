/**
 * @fileoverview App shell
 */

//Imports
import {capitalize} from "lodash-es";
import {ArrowClockwise, Gear, Image} from "phosphor-solid";
import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  type Component
} from "solid-js";
import {Dynamic} from "solid-js/web";
import Background from "~/components/Background";
import Drawer from "~/components/Drawer";
import GeneralMode from "~/components/GeneralMode";
import Shortcut from "~/components/Shortcut";
import ShortcutMode from "~/components/ShortcutMode";
import {generateBackground} from "~/lib/background";
import {initializeSettingsStore, setSettings, settings} from "~/lib/store";
import {BackgroundProvider, ShortcutMetadata} from "~/lib/types";

/**
 * Drawer view modes
 */
enum DrawerMode {
  /**
   * General settings and information
   */
  GENERAL = "general",

  /**
   * Upsert a shortcut
   */
  SHORTCUT = "shortcut"
}

/**
 * Dark mode media query
 */
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

const App: Component = () => {
  //Reactively update dark mode
  const [dark, setDark] = createSignal(darkQuery.matches);
  const darkListener = (event: MediaQueryListEvent) => setDark(event.matches);

  darkQuery.addEventListener("change", darkListener);
  onCleanup(() => darkQuery.removeEventListener("change", darkListener));

  createEffect(() => document.documentElement.classList.toggle("dark", dark()));

  const [drawerOpen, setDrawerOpen] = createSignal(false);
  const [drawerMode, setDrawerMode] = createSignal(DrawerMode.GENERAL);

  const [shortcut, setShortcut] = createSignal<ShortcutMetadata>();

  const formattedProvider = createMemo(() =>
    capitalize(settings.background.provider)
  );

  const onOpenSettings = () => {
    setDrawerMode(DrawerMode.GENERAL);
    setDrawerOpen(true);
  };

  const onRefreshBackground = async () => {
    await generateBackground();
  };

  const onEdit = (metadata: ShortcutMetadata) => {
    //Force-refresh the shortcut metadata to prevent the ShorcutMode from displaying stale data
    setShortcut(undefined);
    setShortcut(metadata);

    setDrawerMode(DrawerMode.SHORTCUT);
    setDrawerOpen(true);
  };

  const onCreateShortcut = () => {
    setDrawerMode(DrawerMode.SHORTCUT);
    setDrawerOpen(true);
  };

  const onMetadataSave = (metadata: ShortcutMetadata) => {
    //Generate shortcuts
    const shortcuts: ShortcutMetadata[] = [];

    let overwroteMetadata = false;
    for (const shortcut of settings.shortcuts) {
      if (shortcut.id === metadata.id) {
        overwroteMetadata = true;
        shortcuts.push(metadata);
      } else {
        shortcuts.push(shortcut);
      }
    }

    if (!overwroteMetadata) {
      shortcuts.push(metadata);
    }

    //Update settings
    setSettings(previous => ({
      ...previous,
      shortcuts
    }));

    //Close
    setDrawerOpen(false);
  };

  const onMetadataDelete = () => {
    //Generate shortcuts
    const currentShortcut = shortcut();
    const shortcuts = settings.shortcuts.filter(
      existing => existing.id !== currentShortcut?.id
    );

    //Update settings
    setSettings(previous => ({
      ...previous,
      shortcuts
    }));

    //Close
    setDrawerOpen(false);
  };

  onMount(async () => {
    //Initialize the settings store
    await initializeSettingsStore();

    //Generate the background
    if (
      //No existing background
      settings.background?.metadata === undefined ||
      //Background has expired
      (settings.background.refreshAfter > 0 &&
        Date.now() -
          new Date(settings.background.metadata.generatedAt).getTime() >
          settings.background.refreshAfter)
    ) {
      await generateBackground();
    }
  });

  return (
    <>
      <button
        aria-label="Open settings"
        class="absolute p-2 acrylic top-2 right-2 rounded-full"
        onClick={onOpenSettings}
      >
        <Gear size="1.5rem" />
      </button>

      <button
        aria-label="Manually refresh background"
        class="absolute p-2 acrylic bottom-2 right-2 rounded-full"
        onClick={onRefreshBackground}
      >
        <ArrowClockwise size="1.5rem" />
      </button>

      <div class="centered-row flex-wrap m-12">
        <For each={settings.shortcuts}>
          {item => <Shortcut metadata={item} onEdit={() => onEdit(item)} />}
        </For>
      </div>

      <Show when={settings.background.metadata?.photographerName !== undefined}>
        <Dynamic
          component={
            settings.background.metadata!.link !== undefined ? "a" : "p"
          }
          href={settings.background.metadata!.link}
          rel="noopener noreferrer"
          class="absolute acrylic bottom-2 centered-row px-1.5 py-1 left-2 rounded-md text-sm"
        >
          <Image />
          <span class="ml-1">
            {settings.background.metadata!.photographerName}{" "}
            <Show
              when={settings.background.provider !== BackgroundProvider.CUSTOM}
            >
              {" "}
              via {formattedProvider()}
            </Show>
          </span>
        </Dynamic>
      </Show>

      <Drawer open={drawerOpen()} setOpen={setDrawerOpen}>
        <Switch>
          <Match when={drawerMode() === DrawerMode.GENERAL}>
            <GeneralMode
              settings={settings}
              setSettings={setSettings}
              onCreateShortcut={onCreateShortcut}
            />
          </Match>

          <Match when={drawerMode() === DrawerMode.SHORTCUT}>
            <ShortcutMode
              metadata={shortcut()}
              onSave={onMetadataSave}
              onDelete={onMetadataDelete}
            />
          </Match>
        </Switch>
      </Drawer>

      <Background background={settings.background.metadata} />
    </>
  );
};

export default App;
