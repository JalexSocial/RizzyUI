import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";
import plugin from "tailwindcss/plugin";

import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

import rizzyui from "./Scripts/rizzyui-tailwind/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./Components/**/*.{razor,html,cshtml,js,cs}",
        './wwwroot/js/rizzyui.js'
    ],
    darkMode: 'class',
    plugins: [
        forms,
        typography,
        rizzyui,
    ],
};
