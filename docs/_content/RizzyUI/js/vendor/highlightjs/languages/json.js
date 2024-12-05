﻿(function(){var hljsGrammar=(function(){'use strict';function json(hljs){const ATTRIBUTE={className:'attr',begin:/"(\\.|[^\\"\r\n])*"(?=\s*:)/,relevance:1.01};const PUNCTUATION={match:/[{}[\],:]/,className:"punctuation",relevance:0};const LITERALS=["true","false","null"];const LITERALS_MODE={scope:"literal",beginKeywords:LITERALS.join(" "),};return{name:'JSON',aliases:['jsonc'],keywords:{literal:LITERALS,},contains:[ATTRIBUTE,PUNCTUATION,hljs.QUOTE_STRING_MODE,LITERALS_MODE,hljs.C_NUMBER_MODE,hljs.C_LINE_COMMENT_MODE,hljs.C_BLOCK_COMMENT_MODE],illegal:'\\S'};}
return json;})();hljs.registerLanguage('json',hljsGrammar);})();