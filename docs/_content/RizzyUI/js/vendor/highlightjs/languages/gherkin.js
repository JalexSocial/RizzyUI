﻿(function(){var hljsGrammar=(function(){'use strict';function gherkin(hljs){return{name:'Gherkin',aliases:['feature'],keywords:'Feature Background Ability Business\ Need Scenario Scenarios Scenario\ Outline Scenario\ Template Examples Given And Then But When',contains:[{className:'symbol',begin:'\\*',relevance:0},{className:'meta',begin:'@[^@\\s]+'},{begin:'\\|',end:'\\|\\w*$',contains:[{className:'string',begin:'[^|]+'}]},{className:'variable',begin:'<',end:'>'},hljs.HASH_COMMENT_MODE,{className:'string',begin:'"""',end:'"""'},hljs.QUOTE_STRING_MODE]};}
return gherkin;})();hljs.registerLanguage('gherkin',hljsGrammar);})();