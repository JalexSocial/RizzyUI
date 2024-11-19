import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";
import plugin from "tailwindcss/plugin";

import aspectRatio from "@tailwindcss/aspect-ratio";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

import rizzyui from "../RizzyUI/Scripts/rizzyui-tailwind/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./Components/**/*.{razor,html,cshtml,js}"
    ],
    safelist: rizzyui.safelist,
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito Sans', 'open sans', ...defaultTheme.fontFamily.sans],
            }
        },
    },
    plugins: [
        aspectRatio,
        forms,
        typography,
        rizzyui,
        plugin(function ({ addVariant }) {
            addVariant('htmx-settling', ['&.htmx-settling', '.htmx-settling &']);
            addVariant('htmx-request', ['&.htmx-request', '.htmx-request &']);
            addVariant('htmx-swapping', ['&.htmx-swapping', '.htmx-swapping &']);
            addVariant('htmx-added', ['&.htmx-added', '.htmx-added &']);
        }),
    ],
};



