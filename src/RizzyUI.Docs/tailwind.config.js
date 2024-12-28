import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

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
                sans: ['Figtree', 'open sans', ...defaultTheme.fontFamily.sans],
            }
        },
    },
    plugins: [
        forms,
        typography,
        rizzyui
    ],
};



