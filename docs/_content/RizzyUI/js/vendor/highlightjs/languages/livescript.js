﻿(function(){var hljsGrammar=(function(){'use strict';const KEYWORDS=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends"];const LITERALS=["true","false","null","undefined","NaN","Infinity"];const TYPES=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"];const ERROR_TYPES=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"];const BUILT_IN_GLOBALS=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"];const BUILT_INS=[].concat(BUILT_IN_GLOBALS,TYPES,ERROR_TYPES);function livescript(hljs){const LIVESCRIPT_BUILT_INS=['npm','print'];const LIVESCRIPT_LITERALS=['yes','no','on','off','it','that','void'];const LIVESCRIPT_KEYWORDS=['then','unless','until','loop','of','by','when','and','or','is','isnt','not','it','that','otherwise','from','to','til','fallthrough','case','enum','native','list','map','__hasProp','__extends','__slice','__bind','__indexOf'];const KEYWORDS$1={keyword:KEYWORDS.concat(LIVESCRIPT_KEYWORDS),literal:LITERALS.concat(LIVESCRIPT_LITERALS),built_in:BUILT_INS.concat(LIVESCRIPT_BUILT_INS)};const JS_IDENT_RE='[A-Za-z$_](?:-[0-9A-Za-z$_]|[0-9A-Za-z$_])*';const TITLE=hljs.inherit(hljs.TITLE_MODE,{begin:JS_IDENT_RE});const SUBST={className:'subst',begin:/#\{/,end:/\}/,keywords:KEYWORDS$1};const SUBST_SIMPLE={className:'subst',begin:/#[A-Za-z$_]/,end:/(?:-[0-9A-Za-z$_]|[0-9A-Za-z$_])*/,keywords:KEYWORDS$1};const EXPRESSIONS=[hljs.BINARY_NUMBER_MODE,{className:'number',begin:'(\\b0[xX][a-fA-F0-9_]+)|(\\b\\d(\\d|_\\d)*(\\.(\\d(\\d|_\\d)*)?)?(_*[eE]([-+]\\d(_\\d|\\d)*)?)?[_a-z]*)',relevance:0,starts:{end:'(\\s*/)?',relevance:0}},{className:'string',variants:[{begin:/'''/,end:/'''/,contains:[hljs.BACKSLASH_ESCAPE]},{begin:/'/,end:/'/,contains:[hljs.BACKSLASH_ESCAPE]},{begin:/"""/,end:/"""/,contains:[hljs.BACKSLASH_ESCAPE,SUBST,SUBST_SIMPLE]},{begin:/"/,end:/"/,contains:[hljs.BACKSLASH_ESCAPE,SUBST,SUBST_SIMPLE]},{begin:/\\/,end:/(\s|$)/,excludeEnd:true}]},{className:'regexp',variants:[{begin:'//',end:'//[gim]*',contains:[SUBST,hljs.HASH_COMMENT_MODE]},{begin:/\/(?![ *])(\\.|[^\\\n])*?\/[gim]*(?=\W)/}]},{begin:'@'+JS_IDENT_RE},{begin:'``',end:'``',excludeBegin:true,excludeEnd:true,subLanguage:'javascript'}];SUBST.contains=EXPRESSIONS;const PARAMS={className:'params',begin:'\\(',returnBegin:true,contains:[{begin:/\(/,end:/\)/,keywords:KEYWORDS$1,contains:['self'].concat(EXPRESSIONS)}]};const SYMBOLS={begin:'(#=>|=>|\\|>>|-?->|!->)'};const CLASS_DEFINITION={variants:[{match:[/class\s+/,JS_IDENT_RE,/\s+extends\s+/,JS_IDENT_RE]},{match:[/class\s+/,JS_IDENT_RE]}],scope:{2:"title.class",4:"title.class.inherited"},keywords:KEYWORDS$1};return{name:'LiveScript',aliases:['ls'],keywords:KEYWORDS$1,illegal:/\/\*/,contains:EXPRESSIONS.concat([hljs.COMMENT('\\/\\*','\\*\\/'),hljs.HASH_COMMENT_MODE,SYMBOLS,{className:'function',contains:[TITLE,PARAMS],returnBegin:true,variants:[{begin:'('+JS_IDENT_RE+'\\s*(?:=|:=)\\s*)?(\\(.*\\)\\s*)?\\B->\\*?',end:'->\\*?'},{begin:'('+JS_IDENT_RE+'\\s*(?:=|:=)\\s*)?!?(\\(.*\\)\\s*)?\\B[-~]{1,2}>\\*?',end:'[-~]{1,2}>\\*?'},{begin:'('+JS_IDENT_RE+'\\s*(?:=|:=)\\s*)?(\\(.*\\)\\s*)?\\B!?[-~]{1,2}>\\*?',end:'!?[-~]{1,2}>\\*?'}]},CLASS_DEFINITION,{begin:JS_IDENT_RE+':',end:':',returnBegin:true,returnEnd:true,relevance:0}])};}
return livescript;})();hljs.registerLanguage('livescript',hljsGrammar);})();