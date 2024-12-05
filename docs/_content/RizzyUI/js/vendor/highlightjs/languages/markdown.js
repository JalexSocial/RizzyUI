﻿(function(){var hljsGrammar=(function(){'use strict';function markdown(hljs){const regex=hljs.regex;const INLINE_HTML={begin:/<\/?[A-Za-z_]/,end:'>',subLanguage:'xml',relevance:0};const HORIZONTAL_RULE={begin:'^[-\\*]{3,}',end:'$'};const CODE={className:'code',variants:[{begin:'(`{3,})[^`](.|\\n)*?\\1`*[ ]*'},{begin:'(~{3,})[^~](.|\\n)*?\\1~*[ ]*'},{begin:'```',end:'```+[ ]*$'},{begin:'~~~',end:'~~~+[ ]*$'},{begin:'`.+?`'},{begin:'(?=^( {4}|\\t))',contains:[{begin:'^( {4}|\\t)',end:'(\\n)$'}],relevance:0}]};const LIST={className:'bullet',begin:'^[ \t]*([*+-]|(\\d+\\.))(?=\\s+)',end:'\\s+',excludeEnd:true};const LINK_REFERENCE={begin:/^\[[^\n]+\]:/,returnBegin:true,contains:[{className:'symbol',begin:/\[/,end:/\]/,excludeBegin:true,excludeEnd:true},{className:'link',begin:/:\s*/,end:/$/,excludeBegin:true}]};const URL_SCHEME=/[A-Za-z][A-Za-z0-9+.-]*/;const LINK={variants:[{begin:/\[.+?\]\[.*?\]/,relevance:0},{begin:/\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,relevance:2},{begin:regex.concat(/\[.+?\]\(/,URL_SCHEME,/:\/\/.*?\)/),relevance:2},{begin:/\[.+?\]\([./?&#].*?\)/,relevance:1},{begin:/\[.*?\]\(.*?\)/,relevance:0}],returnBegin:true,contains:[{match:/\[(?=\])/},{className:'string',relevance:0,begin:'\\[',end:'\\]',excludeBegin:true,returnEnd:true},{className:'link',relevance:0,begin:'\\]\\(',end:'\\)',excludeBegin:true,excludeEnd:true},{className:'symbol',relevance:0,begin:'\\]\\[',end:'\\]',excludeBegin:true,excludeEnd:true}]};const BOLD={className:'strong',contains:[],variants:[{begin:/_{2}(?!\s)/,end:/_{2}/},{begin:/\*{2}(?!\s)/,end:/\*{2}/}]};const ITALIC={className:'emphasis',contains:[],variants:[{begin:/\*(?![*\s])/,end:/\*/},{begin:/_(?![_\s])/,end:/_/,relevance:0}]};const BOLD_WITHOUT_ITALIC=hljs.inherit(BOLD,{contains:[]});const ITALIC_WITHOUT_BOLD=hljs.inherit(ITALIC,{contains:[]});BOLD.contains.push(ITALIC_WITHOUT_BOLD);ITALIC.contains.push(BOLD_WITHOUT_ITALIC);let CONTAINABLE=[INLINE_HTML,LINK];[BOLD,ITALIC,BOLD_WITHOUT_ITALIC,ITALIC_WITHOUT_BOLD].forEach(m=>{m.contains=m.contains.concat(CONTAINABLE);});CONTAINABLE=CONTAINABLE.concat(BOLD,ITALIC);const HEADER={className:'section',variants:[{begin:'^#{1,6}',end:'$',contains:CONTAINABLE},{begin:'(?=^.+?\\n[=-]{2,}$)',contains:[{begin:'^[=-]*$'},{begin:'^',end:"\\n",contains:CONTAINABLE}]}]};const BLOCKQUOTE={className:'quote',begin:'^>\\s+',contains:CONTAINABLE,end:'$'};const ENTITY={scope:'literal',match:/&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/};return{name:'Markdown',aliases:['md','mkdown','mkd'],contains:[HEADER,INLINE_HTML,LIST,BOLD,ITALIC,BLOCKQUOTE,CODE,HORIZONTAL_RULE,LINK,LINK_REFERENCE,ENTITY]};}
return markdown;})();hljs.registerLanguage('markdown',hljsGrammar);})();