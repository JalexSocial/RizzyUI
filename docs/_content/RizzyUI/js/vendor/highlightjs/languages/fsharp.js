﻿(function(){var hljsGrammar=(function(){'use strict';function escape(value){return new RegExp(value.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&'),'m');}
function source(re){if(!re)return null;if(typeof re==="string")return re;return re.source;}
function lookahead(re){return concat('(?=',re,')');}
function concat(...args){const joined=args.map((x)=>source(x)).join("");return joined;}
function stripOptionsFromArgs(args){const opts=args[args.length-1];if(typeof opts==='object'&&opts.constructor===Object){args.splice(args.length-1,1);return opts;}else{return{};}}
function either(...args){const opts=stripOptionsFromArgs(args);const joined='('
+(opts.capture?"":"?:")
+args.map((x)=>source(x)).join("|")+")";return joined;}
function fsharp(hljs){const KEYWORDS=["abstract","and","as","assert","base","begin","class","default","delegate","do","done","downcast","downto","elif","else","end","exception","extern","finally","fixed","for","fun","function","global","if","in","inherit","inline","interface","internal","lazy","let","match","member","module","mutable","namespace","new","of","open","or","override","private","public","rec","return","static","struct","then","to","try","type","upcast","use","val","void","when","while","with","yield"];const BANG_KEYWORD_MODE={scope:'keyword',match:/\b(yield|return|let|do|match|use)!/};const PREPROCESSOR_KEYWORDS=["if","else","endif","line","nowarn","light","r","i","I","load","time","help","quit"];const LITERALS=["true","false","null","Some","None","Ok","Error","infinity","infinityf","nan","nanf"];const SPECIAL_IDENTIFIERS=["__LINE__","__SOURCE_DIRECTORY__","__SOURCE_FILE__"];const KNOWN_TYPES=["bool","byte","sbyte","int8","int16","int32","uint8","uint16","uint32","int","uint","int64","uint64","nativeint","unativeint","decimal","float","double","float32","single","char","string","unit","bigint","option","voption","list","array","seq","byref","exn","inref","nativeptr","obj","outref","voidptr","Result"];const BUILTINS=["not","ref","raise","reraise","dict","readOnlyDict","set","get","enum","sizeof","typeof","typedefof","nameof","nullArg","invalidArg","invalidOp","id","fst","snd","ignore","lock","using","box","unbox","tryUnbox","printf","printfn","sprintf","eprintf","eprintfn","fprintf","fprintfn","failwith","failwithf"];const ALL_KEYWORDS={keyword:KEYWORDS,literal:LITERALS,built_in:BUILTINS,'variable.constant':SPECIAL_IDENTIFIERS};const ML_COMMENT=hljs.COMMENT(/\(\*(?!\))/,/\*\)/,{contains:["self"]});const COMMENT={variants:[ML_COMMENT,hljs.C_LINE_COMMENT_MODE,]};const IDENTIFIER_RE=/[a-zA-Z_](\w|')*/;const QUOTED_IDENTIFIER={scope:'variable',begin:/``/,end:/``/};const BEGIN_GENERIC_TYPE_SYMBOL_RE=/\B('|\^)/;const GENERIC_TYPE_SYMBOL={scope:'symbol',variants:[{match:concat(BEGIN_GENERIC_TYPE_SYMBOL_RE,/``.*?``/)},{match:concat(BEGIN_GENERIC_TYPE_SYMBOL_RE,hljs.UNDERSCORE_IDENT_RE)}],relevance:0};const makeOperatorMode=function({includeEqual}){let allOperatorChars;if(includeEqual)
allOperatorChars="!%&*+-/<=>@^|~?";else
allOperatorChars="!%&*+-/<>@^|~?";const OPERATOR_CHARS=Array.from(allOperatorChars);const OPERATOR_CHAR_RE=concat('[',...OPERATOR_CHARS.map(escape),']');const OPERATOR_CHAR_OR_DOT_RE=either(OPERATOR_CHAR_RE,/\./);const OPERATOR_FIRST_CHAR_OF_MULTIPLE_RE=concat(OPERATOR_CHAR_OR_DOT_RE,lookahead(OPERATOR_CHAR_OR_DOT_RE));const SYMBOLIC_OPERATOR_RE=either(concat(OPERATOR_FIRST_CHAR_OF_MULTIPLE_RE,OPERATOR_CHAR_OR_DOT_RE,'*'),concat(OPERATOR_CHAR_RE,'+'),);return{scope:'operator',match:either(SYMBOLIC_OPERATOR_RE,/:\?>/,/:\?/,/:>/,/:=/,/::?/,/\$/),relevance:0};};const OPERATOR=makeOperatorMode({includeEqual:true});const OPERATOR_WITHOUT_EQUAL=makeOperatorMode({includeEqual:false});const makeTypeAnnotationMode=function(prefix,prefixScope){return{begin:concat(prefix,lookahead(concat(/\s*/,either(/\w/,/'/,/\^/,/#/,/``/,/\(/,/{\|/,)))),beginScope:prefixScope,end:lookahead(either(/\n/,/=/)),relevance:0,keywords:hljs.inherit(ALL_KEYWORDS,{type:KNOWN_TYPES}),contains:[COMMENT,GENERIC_TYPE_SYMBOL,hljs.inherit(QUOTED_IDENTIFIER,{scope:null}),OPERATOR_WITHOUT_EQUAL]};};const TYPE_ANNOTATION=makeTypeAnnotationMode(/:/,'operator');const DISCRIMINATED_UNION_TYPE_ANNOTATION=makeTypeAnnotationMode(/\bof\b/,'keyword');const TYPE_DECLARATION={begin:[/(^|\s+)/,/type/,/\s+/,IDENTIFIER_RE],beginScope:{2:'keyword',4:'title.class'},end:lookahead(/\(|=|$/),keywords:ALL_KEYWORDS,contains:[COMMENT,hljs.inherit(QUOTED_IDENTIFIER,{scope:null}),GENERIC_TYPE_SYMBOL,{scope:'operator',match:/<|>/},TYPE_ANNOTATION]};const COMPUTATION_EXPRESSION={scope:'computation-expression',match:/\b[_a-z]\w*(?=\s*\{)/};const PREPROCESSOR={begin:[/^\s*/,concat(/#/,either(...PREPROCESSOR_KEYWORDS)),/\b/],beginScope:{2:'meta'},end:lookahead(/\s|$/)};const NUMBER={variants:[hljs.BINARY_NUMBER_MODE,hljs.C_NUMBER_MODE]};const QUOTED_STRING={scope:'string',begin:/"/,end:/"/,contains:[hljs.BACKSLASH_ESCAPE]};const VERBATIM_STRING={scope:'string',begin:/@"/,end:/"/,contains:[{match:/""/},hljs.BACKSLASH_ESCAPE]};const TRIPLE_QUOTED_STRING={scope:'string',begin:/"""/,end:/"""/,relevance:2};const SUBST={scope:'subst',begin:/\{/,end:/\}/,keywords:ALL_KEYWORDS};const INTERPOLATED_STRING={scope:'string',begin:/\$"/,end:/"/,contains:[{match:/\{\{/},{match:/\}\}/},hljs.BACKSLASH_ESCAPE,SUBST]};const INTERPOLATED_VERBATIM_STRING={scope:'string',begin:/(\$@|@\$)"/,end:/"/,contains:[{match:/\{\{/},{match:/\}\}/},{match:/""/},hljs.BACKSLASH_ESCAPE,SUBST]};const INTERPOLATED_TRIPLE_QUOTED_STRING={scope:'string',begin:/\$"""/,end:/"""/,contains:[{match:/\{\{/},{match:/\}\}/},SUBST],relevance:2};const CHAR_LITERAL={scope:'string',match:concat(/'/,either(/[^\\']/,/\\(?:.|\d{3}|x[a-fA-F\d]{2}|u[a-fA-F\d]{4}|U[a-fA-F\d]{8})/),/'/)};SUBST.contains=[INTERPOLATED_VERBATIM_STRING,INTERPOLATED_STRING,VERBATIM_STRING,QUOTED_STRING,CHAR_LITERAL,BANG_KEYWORD_MODE,COMMENT,QUOTED_IDENTIFIER,TYPE_ANNOTATION,COMPUTATION_EXPRESSION,PREPROCESSOR,NUMBER,GENERIC_TYPE_SYMBOL,OPERATOR];const STRING={variants:[INTERPOLATED_TRIPLE_QUOTED_STRING,INTERPOLATED_VERBATIM_STRING,INTERPOLATED_STRING,TRIPLE_QUOTED_STRING,VERBATIM_STRING,QUOTED_STRING,CHAR_LITERAL]};return{name:'F#',aliases:['fs','f#'],keywords:ALL_KEYWORDS,illegal:/\/\*/,classNameAliases:{'computation-expression':'keyword'},contains:[BANG_KEYWORD_MODE,STRING,COMMENT,QUOTED_IDENTIFIER,TYPE_DECLARATION,{scope:'meta',begin:/\[</,end:/>\]/,relevance:2,contains:[QUOTED_IDENTIFIER,TRIPLE_QUOTED_STRING,VERBATIM_STRING,QUOTED_STRING,CHAR_LITERAL,NUMBER]},DISCRIMINATED_UNION_TYPE_ANNOTATION,TYPE_ANNOTATION,COMPUTATION_EXPRESSION,PREPROCESSOR,NUMBER,GENERIC_TYPE_SYMBOL,OPERATOR]};}
return fsharp;})();hljs.registerLanguage('fsharp',hljsGrammar);})();