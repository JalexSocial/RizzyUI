﻿(function(){var hljsGrammar=(function(){'use strict';function http(hljs){const regex=hljs.regex;const VERSION='HTTP/([32]|1\\.[01])';const HEADER_NAME=/[A-Za-z][A-Za-z0-9-]*/;const HEADER={className:'attribute',begin:regex.concat('^',HEADER_NAME,'(?=\\:\\s)'),starts:{contains:[{className:"punctuation",begin:/: /,relevance:0,starts:{end:'$',relevance:0}}]}};const HEADERS_AND_BODY=[HEADER,{begin:'\\n\\n',starts:{subLanguage:[],endsWithParent:true}}];return{name:'HTTP',aliases:['https'],illegal:/\S/,contains:[{begin:'^(?='+VERSION+" \\d{3})",end:/$/,contains:[{className:"meta",begin:VERSION},{className:'number',begin:'\\b\\d{3}\\b'}],starts:{end:/\b\B/,illegal:/\S/,contains:HEADERS_AND_BODY}},{begin:'(?=^[A-Z]+ (.*?) '+VERSION+'$)',end:/$/,contains:[{className:'string',begin:' ',end:' ',excludeBegin:true,excludeEnd:true},{className:"meta",begin:VERSION},{className:'keyword',begin:'[A-Z]+'}],starts:{end:/\b\B/,illegal:/\S/,contains:HEADERS_AND_BODY}},hljs.inherit(HEADER,{relevance:0})]};}
return http;})();hljs.registerLanguage('http',hljsGrammar);})();