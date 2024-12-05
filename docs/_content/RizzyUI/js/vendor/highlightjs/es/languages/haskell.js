﻿var hljsGrammar=(function(){'use strict';function haskell(hljs){const decimalDigits='([0-9]_*)+';const hexDigits='([0-9a-fA-F]_*)+';const binaryDigits='([01]_*)+';const octalDigits='([0-7]_*)+';const ascSymbol='[!#$%&*+.\\/<=>?@\\\\^~-]';const uniSymbol='(\\p{S}|\\p{P})';const special='[(),;\\[\\]`|{}]';const symbol=`(${ascSymbol}|(?!(${special}|[_:"']))${uniSymbol})`;const COMMENT={variants:[hljs.COMMENT('--+','$'),hljs.COMMENT(/\{-/,/-\}/,{contains:['self']})]};const PRAGMA={className:'meta',begin:/\{-#/,end:/#-\}/};const PREPROCESSOR={className:'meta',begin:'^#',end:'$'};const CONSTRUCTOR={className:'type',begin:'\\b[A-Z][\\w\']*',relevance:0};const LIST={begin:'\\(',end:'\\)',illegal:'"',contains:[PRAGMA,PREPROCESSOR,{className:'type',begin:'\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?'},hljs.inherit(hljs.TITLE_MODE,{begin:'[_a-z][\\w\']*'}),COMMENT]};const RECORD={begin:/\{/,end:/\}/,contains:LIST.contains};const NUMBER={className:'number',relevance:0,variants:[{match:`\\b(${decimalDigits})(\\.(${decimalDigits}))?`+`([eE][+-]?(${decimalDigits}))?\\b`},{match:`\\b0[xX]_*(${hexDigits})(\\.(${hexDigits}))?`+`([pP][+-]?(${decimalDigits}))?\\b`},{match:`\\b0[oO](${octalDigits})\\b`},{match:`\\b0[bB](${binaryDigits})\\b`}]};return{name:'Haskell',aliases:['hs'],keywords:'let in if then else case of where do module import hiding '
+'qualified type data newtype deriving class instance as default '
+'infix infixl infixr foreign export ccall stdcall cplusplus '
+'jvm dotnet safe unsafe family forall mdo proc rec',unicodeRegex:true,contains:[{beginKeywords:'module',end:'where',keywords:'module where',contains:[LIST,COMMENT],illegal:'\\W\\.|;'},{begin:'\\bimport\\b',end:'$',keywords:'import qualified as hiding',contains:[LIST,COMMENT],illegal:'\\W\\.|;'},{className:'class',begin:'^(\\s*)?(class|instance)\\b',end:'where',keywords:'class family instance where',contains:[CONSTRUCTOR,LIST,COMMENT]},{className:'class',begin:'\\b(data|(new)?type)\\b',end:'$',keywords:'data family type newtype deriving',contains:[PRAGMA,CONSTRUCTOR,LIST,RECORD,COMMENT]},{beginKeywords:'default',end:'$',contains:[CONSTRUCTOR,LIST,COMMENT]},{beginKeywords:'infix infixl infixr',end:'$',contains:[hljs.C_NUMBER_MODE,COMMENT]},{begin:'\\bforeign\\b',end:'$',keywords:'foreign import export ccall stdcall cplusplus jvm '
+'dotnet safe unsafe',contains:[CONSTRUCTOR,hljs.QUOTE_STRING_MODE,COMMENT]},{className:'meta',begin:'#!\\/usr\\/bin\\/env\ runhaskell',end:'$'},PRAGMA,PREPROCESSOR,{scope:'string',begin:/'(?=\\?.')/,end:/'/,contains:[{scope:'char.escape',match:/\\./,},]},hljs.QUOTE_STRING_MODE,NUMBER,CONSTRUCTOR,hljs.inherit(hljs.TITLE_MODE,{begin:'^[_a-z][\\w\']*'}),{begin:`(?!-)${symbol}--+|--+(?!-)${symbol}`},COMMENT,{begin:'->|<-'}]};}
return haskell;})();;export default hljsGrammar;