/* @refresh reload */
import { render } from "solid-js/web";
import '@unocss/reset/tailwind-compat.css'
import 'virtual:uno.css'

import '@/styles/index.less'
import App from "@/App";

render(() => <App />, document.getElementById("root") as HTMLElement);
