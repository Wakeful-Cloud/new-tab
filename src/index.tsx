/**
 * @fileoverview Main entrypoint
 * @refresh reload
 */

//Imports
import "@unocss/reset/tailwind.css";
import {render} from "solid-js/web";
import "virtual:uno.css";
import App from "~/App";
import "~/index.css";

//Get the root element
const root = document.getElementById("root");

//Mount the root element
if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

//Render
render(() => <App />, root!);
