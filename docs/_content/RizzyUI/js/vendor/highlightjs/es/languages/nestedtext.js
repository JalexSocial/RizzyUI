﻿var hljsGrammar=(function(){'use strict';function nestedtext(hljs){const NESTED={match:[/^\s*(?=\S)/,/[^:]+/,/:\s*/,/$/],className:{2:"attribute",3:"punctuation"}};const DICTIONARY_ITEM={match:[/^\s*(?=\S)/,/[^:]*[^: ]/,/[ ]*:/,/[ ]/,/.*$/],className:{2:"attribute",3:"punctuation",5:"string"}};const STRING={match:[/^\s*/,/>/,/[ ]/,/.*$/],className:{2:"punctuation",4:"string"}};const LIST_ITEM={variants:[{match:[/^\s*/,/-/,/[ ]/,/.*$/]},{match:[/^\s*/,/-$/]}],className:{2:"bullet",4:"string"}};return{name:'Nested Text',aliases:['nt'],contains:[hljs.inherit(hljs.HASH_COMMENT_MODE,{begin:/^\s*(?=#)/,excludeBegin:true}),LIST_ITEM,STRING,NESTED,DICTIONARY_ITEM]};}
return nestedtext;})();;export default hljsGrammar;