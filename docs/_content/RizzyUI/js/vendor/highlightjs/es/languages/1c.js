﻿var hljsGrammar=(function(){'use strict';function _1c(hljs){const UNDERSCORE_IDENT_RE='[A-Za-zА-Яа-яёЁ_][A-Za-zА-Яа-яёЁ_0-9]+';const v7_keywords='далее ';const v8_keywords='возврат вызватьисключение выполнить для если и из или иначе иначеесли исключение каждого конецесли '
+'конецпопытки конеццикла не новый перейти перем по пока попытка прервать продолжить тогда цикл экспорт ';const KEYWORD=v7_keywords+v8_keywords;const v7_meta_keywords='загрузитьизфайла ';const v8_meta_keywords='вебклиент вместо внешнеесоединение клиент конецобласти мобильноеприложениеклиент мобильноеприложениесервер '
+'наклиенте наклиентенасервере наклиентенасерверебезконтекста насервере насерверебезконтекста область перед '
+'после сервер толстыйклиентобычноеприложение толстыйклиентуправляемоеприложение тонкийклиент ';const METAKEYWORD=v7_meta_keywords+v8_meta_keywords;const v7_system_constants='разделительстраниц разделительстрок символтабуляции ';const v7_global_context_methods='ansitooem oemtoansi ввестивидсубконто ввестиперечисление ввестипериод ввестиплансчетов выбранныйплансчетов '
+'датагод датамесяц датачисло заголовоксистемы значениевстроку значениеизстроки каталогиб каталогпользователя '
+'кодсимв конгода конецпериодаби конецрассчитанногопериодаби конецстандартногоинтервала конквартала конмесяца '
+'коннедели лог лог10 максимальноеколичествосубконто названиеинтерфейса названиенабораправ назначитьвид '
+'назначитьсчет найтиссылки началопериодаби началостандартногоинтервала начгода начквартала начмесяца '
+'начнедели номерднягода номерднянедели номернеделигода обработкаожидания основнойжурналрасчетов '
+'основнойплансчетов основнойязык очиститьокносообщений периодстр получитьвремята получитьдатута '
+'получитьдокументта получитьзначенияотбора получитьпозициюта получитьпустоезначение получитьта '
+'префиксавтонумерации пропись пустоезначение разм разобратьпозициюдокумента рассчитатьрегистрына '
+'рассчитатьрегистрыпо симв создатьобъект статусвозврата стрколичествострок сформироватьпозициюдокумента '
+'счетпокоду текущеевремя типзначения типзначениястр установитьтана установитьтапо фиксшаблон шаблон ';const v8_global_context_methods='acos asin atan base64значение base64строка cos exp log log10 pow sin sqrt tan xmlзначение xmlстрока '
+'xmlтип xmlтипзнч активноеокно безопасныйрежим безопасныйрежимразделенияданных булево ввестидату ввестизначение '
+'ввестистроку ввестичисло возможностьчтенияxml вопрос восстановитьзначение врег выгрузитьжурналрегистрации '
+'выполнитьобработкуоповещения выполнитьпроверкуправдоступа вычислить год данныеформывзначение дата день деньгода '
+'деньнедели добавитьмесяц заблокироватьданныедляредактирования заблокироватьработупользователя завершитьработусистемы '
+'загрузитьвнешнююкомпоненту закрытьсправку записатьjson записатьxml записатьдатуjson записьжурналарегистрации '
+'заполнитьзначениясвойств запроситьразрешениепользователя запуститьприложение запуститьсистему зафиксироватьтранзакцию '
+'значениевданныеформы значениевстрокувнутр значениевфайл значениезаполнено значениеизстрокивнутр значениеизфайла '
+'изxmlтипа импортмоделиxdto имякомпьютера имяпользователя инициализироватьпредопределенныеданные информацияобошибке '
+'каталогбиблиотекимобильногоустройства каталогвременныхфайлов каталогдокументов каталогпрограммы кодироватьстроку '
+'кодлокализацииинформационнойбазы кодсимвола командасистемы конецгода конецдня конецквартала конецмесяца конецминуты '
+'конецнедели конецчаса конфигурациябазыданныхизмененадинамически конфигурацияизменена копироватьданныеформы '
+'копироватьфайл краткоепредставлениеошибки лев макс местноевремя месяц мин минута монопольныйрежим найти '
+'найтинедопустимыесимволыxml найтиокнопонавигационнойссылке найтипомеченныенаудаление найтипоссылкам найтифайлы '
+'началогода началодня началоквартала началомесяца началоминуты началонедели началочаса начатьзапросразрешенияпользователя '
+'начатьзапускприложения начатькопированиефайла начатьперемещениефайла начатьподключениевнешнейкомпоненты '
+'начатьподключениерасширенияработыскриптографией начатьподключениерасширенияработысфайлами начатьпоискфайлов '
+'начатьполучениекаталогавременныхфайлов начатьполучениекаталогадокументов начатьполучениерабочегокаталогаданныхпользователя '
+'начатьполучениефайлов начатьпомещениефайла начатьпомещениефайлов начатьсозданиедвоичныхданныхизфайла начатьсозданиекаталога '
+'начатьтранзакцию начатьудалениефайлов начатьустановкувнешнейкомпоненты начатьустановкурасширенияработыскриптографией '
+'начатьустановкурасширенияработысфайлами неделягода необходимостьзавершениясоединения номерсеансаинформационнойбазы '
+'номерсоединенияинформационнойбазы нрег нстр обновитьинтерфейс обновитьнумерациюобъектов обновитьповторноиспользуемыезначения '
+'обработкапрерыванияпользователя объединитьфайлы окр описаниеошибки оповестить оповеститьобизменении '
+'отключитьобработчикзапросанастроекклиенталицензирования отключитьобработчикожидания отключитьобработчикоповещения '
+'открытьзначение открытьиндекссправки открытьсодержаниесправки открытьсправку открытьформу открытьформумодально '
+'отменитьтранзакцию очиститьжурналрегистрации очиститьнастройкипользователя очиститьсообщения параметрыдоступа '
+'перейтипонавигационнойссылке переместитьфайл подключитьвнешнююкомпоненту '
+'подключитьобработчикзапросанастроекклиенталицензирования подключитьобработчикожидания подключитьобработчикоповещения '
+'подключитьрасширениеработыскриптографией подключитьрасширениеработысфайлами подробноепредставлениеошибки '
+'показатьвводдаты показатьвводзначения показатьвводстроки показатьвводчисла показатьвопрос показатьзначение '
+'показатьинформациюобошибке показатьнакарте показатьоповещениепользователя показатьпредупреждение полноеимяпользователя '
+'получитьcomобъект получитьxmlтип получитьадреспоместоположению получитьблокировкусеансов получитьвремязавершенияспящегосеанса '
+'получитьвремязасыпанияпассивногосеанса получитьвремяожиданияблокировкиданных получитьданныевыбора '
+'получитьдополнительныйпараметрклиенталицензирования получитьдопустимыекодылокализации получитьдопустимыечасовыепояса '
+'получитьзаголовокклиентскогоприложения получитьзаголовоксистемы получитьзначенияотборажурналарегистрации '
+'получитьидентификаторконфигурации получитьизвременногохранилища получитьимявременногофайла '
+'получитьимяклиенталицензирования получитьинформациюэкрановклиента получитьиспользованиежурналарегистрации '
+'получитьиспользованиесобытияжурналарегистрации получитькраткийзаголовокприложения получитьмакетоформления '
+'получитьмаскувсефайлы получитьмаскувсефайлыклиента получитьмаскувсефайлысервера получитьместоположениепоадресу '
+'получитьминимальнуюдлинупаролейпользователей получитьнавигационнуюссылку получитьнавигационнуюссылкуинформационнойбазы '
+'получитьобновлениеконфигурациибазыданных получитьобновлениепредопределенныхданныхинформационнойбазы получитьобщиймакет '
+'получитьобщуюформу получитьокна получитьоперативнуюотметкувремени получитьотключениебезопасногорежима '
+'получитьпараметрыфункциональныхопцийинтерфейса получитьполноеимяпредопределенногозначения '
+'получитьпредставлениянавигационныхссылок получитьпроверкусложностипаролейпользователей получитьразделительпути '
+'получитьразделительпутиклиента получитьразделительпутисервера получитьсеансыинформационнойбазы '
+'получитьскоростьклиентскогосоединения получитьсоединенияинформационнойбазы получитьсообщенияпользователю '
+'получитьсоответствиеобъектаиформы получитьсоставстандартногоинтерфейсаodata получитьструктурухранениябазыданных '
+'получитьтекущийсеансинформационнойбазы получитьфайл получитьфайлы получитьформу получитьфункциональнуюопцию '
+'получитьфункциональнуюопциюинтерфейса получитьчасовойпоясинформационнойбазы пользователиос поместитьвовременноехранилище '
+'поместитьфайл поместитьфайлы прав праводоступа предопределенноезначение представлениекодалокализации представлениепериода '
+'представлениеправа представлениеприложения представлениесобытияжурналарегистрации представлениечасовогопояса предупреждение '
+'прекратитьработусистемы привилегированныйрежим продолжитьвызов прочитатьjson прочитатьxml прочитатьдатуjson пустаястрока '
+'рабочийкаталогданныхпользователя разблокироватьданныедляредактирования разделитьфайл разорватьсоединениесвнешнимисточникомданных '
+'раскодироватьстроку рольдоступна секунда сигнал символ скопироватьжурналрегистрации смещениелетнеговремени '
+'смещениестандартноговремени соединитьбуферыдвоичныхданных создатькаталог создатьфабрикуxdto сокрл сокрлп сокрп сообщить '
+'состояние сохранитьзначение сохранитьнастройкипользователя сред стрдлина стрзаканчиваетсяна стрзаменить стрнайти стрначинаетсяс '
+'строка строкасоединенияинформационнойбазы стрполучитьстроку стрразделить стрсоединить стрсравнить стрчисловхождений '
+'стрчислострок стршаблон текущаядата текущаядатасеанса текущаяуниверсальнаядата текущаяуниверсальнаядатавмиллисекундах '
+'текущийвариантинтерфейсаклиентскогоприложения текущийвариантосновногошрифтаклиентскогоприложения текущийкодлокализации '
+'текущийрежимзапуска текущийязык текущийязыксистемы тип типзнч транзакцияактивна трег удалитьданныеинформационнойбазы '
+'удалитьизвременногохранилища удалитьобъекты удалитьфайлы универсальноевремя установитьбезопасныйрежим '
+'установитьбезопасныйрежимразделенияданных установитьблокировкусеансов установитьвнешнююкомпоненту '
+'установитьвремязавершенияспящегосеанса установитьвремязасыпанияпассивногосеанса установитьвремяожиданияблокировкиданных '
+'установитьзаголовокклиентскогоприложения установитьзаголовоксистемы установитьиспользованиежурналарегистрации '
+'установитьиспользованиесобытияжурналарегистрации установитькраткийзаголовокприложения '
+'установитьминимальнуюдлинупаролейпользователей установитьмонопольныйрежим установитьнастройкиклиенталицензирования '
+'установитьобновлениепредопределенныхданныхинформационнойбазы установитьотключениебезопасногорежима '
+'установитьпараметрыфункциональныхопцийинтерфейса установитьпривилегированныйрежим '
+'установитьпроверкусложностипаролейпользователей установитьрасширениеработыскриптографией '
+'установитьрасширениеработысфайлами установитьсоединениесвнешнимисточникомданных установитьсоответствиеобъектаиформы '
+'установитьсоставстандартногоинтерфейсаodata установитьчасовойпоясинформационнойбазы установитьчасовойпояссеанса '
+'формат цел час часовойпояс часовойпояссеанса число числопрописью этоадресвременногохранилища ';const v8_global_context_property='wsссылки библиотекакартинок библиотекамакетовоформлениякомпоновкиданных библиотекастилей бизнеспроцессы '
+'внешниеисточникиданных внешниеобработки внешниеотчеты встроенныепокупки главныйинтерфейс главныйстиль '
+'документы доставляемыеуведомления журналыдокументов задачи информацияобинтернетсоединении использованиерабочейдаты '
+'историяработыпользователя константы критерииотбора метаданные обработки отображениерекламы отправкадоставляемыхуведомлений '
+'отчеты панельзадачос параметрзапуска параметрысеанса перечисления планывидоврасчета планывидовхарактеристик '
+'планыобмена планысчетов полнотекстовыйпоиск пользователиинформационнойбазы последовательности проверкавстроенныхпокупок '
+'рабочаядата расширенияконфигурации регистрыбухгалтерии регистрынакопления регистрырасчета регистрысведений '
+'регламентныезадания сериализаторxdto справочники средствагеопозиционирования средствакриптографии средствамультимедиа '
+'средстваотображениярекламы средствапочты средствателефонии фабрикаxdto файловыепотоки фоновыезадания хранилищанастроек '
+'хранилищевариантовотчетов хранилищенастроекданныхформ хранилищеобщихнастроек хранилищепользовательскихнастроекдинамическихсписков '
+'хранилищепользовательскихнастроекотчетов хранилищесистемныхнастроек ';const BUILTIN=v7_system_constants
+v7_global_context_methods+v8_global_context_methods
+v8_global_context_property;const v8_system_sets_of_values='webцвета windowsцвета windowsшрифты библиотекакартинок рамкистиля символы цветастиля шрифтыстиля ';const v8_system_enums_interface='автоматическоесохранениеданныхформывнастройках автонумерациявформе автораздвижениесерий '
+'анимациядиаграммы вариантвыравниванияэлементовизаголовков вариантуправлениявысотойтаблицы '
+'вертикальнаяпрокруткаформы вертикальноеположение вертикальноеположениеэлемента видгруппыформы '
+'виддекорацииформы виддополненияэлементаформы видизмененияданных видкнопкиформы видпереключателя '
+'видподписейкдиаграмме видполяформы видфлажка влияниеразмеранапузырекдиаграммы горизонтальноеположение '
+'горизонтальноеположениеэлемента группировкаколонок группировкаподчиненныхэлементовформы '
+'группыиэлементы действиеперетаскивания дополнительныйрежимотображения допустимыедействияперетаскивания '
+'интервалмеждуэлементамиформы использованиевывода использованиеполосыпрокрутки '
+'используемоезначениеточкибиржевойдиаграммы историявыборапривводе источникзначенийоситочекдиаграммы '
+'источникзначенияразмерапузырькадиаграммы категориягруппыкоманд максимумсерий начальноеотображениедерева '
+'начальноеотображениесписка обновлениетекстаредактирования ориентациядендрограммы ориентациядиаграммы '
+'ориентацияметокдиаграммы ориентацияметоксводнойдиаграммы ориентацияэлементаформы отображениевдиаграмме '
+'отображениевлегендедиаграммы отображениегруппыкнопок отображениезаголовкашкалыдиаграммы '
+'отображениезначенийсводнойдиаграммы отображениезначенияизмерительнойдиаграммы '
+'отображениеинтерваладиаграммыганта отображениекнопки отображениекнопкивыбора отображениеобсужденийформы '
+'отображениеобычнойгруппы отображениеотрицательныхзначенийпузырьковойдиаграммы отображениепанелипоиска '
+'отображениеподсказки отображениепредупрежденияприредактировании отображениеразметкиполосырегулирования '
+'отображениестраницформы отображениетаблицы отображениетекстазначениядиаграммыганта '
+'отображениеуправленияобычнойгруппы отображениефигурыкнопки палитрацветовдиаграммы поведениеобычнойгруппы '
+'поддержкамасштабадендрограммы поддержкамасштабадиаграммыганта поддержкамасштабасводнойдиаграммы '
+'поисквтаблицепривводе положениезаголовкаэлементаформы положениекартинкикнопкиформы '
+'положениекартинкиэлементаграфическойсхемы положениекоманднойпанелиформы положениекоманднойпанелиэлементаформы '
+'положениеопорнойточкиотрисовки положениеподписейкдиаграмме положениеподписейшкалызначенийизмерительнойдиаграммы '
+'положениесостоянияпросмотра положениестрокипоиска положениетекстасоединительнойлинии положениеуправленияпоиском '
+'положениешкалывремени порядокотображенияточекгоризонтальнойгистограммы порядоксерийвлегендедиаграммы '
+'размеркартинки расположениезаголовкашкалыдиаграммы растягиваниеповертикалидиаграммыганта '
+'режимавтоотображениясостояния режимвводастроктаблицы режимвыборанезаполненного режимвыделениядаты '
+'режимвыделениястрокитаблицы режимвыделениятаблицы режимизмененияразмера режимизменениясвязанногозначения '
+'режимиспользованиядиалогапечати режимиспользованияпараметракоманды режиммасштабированияпросмотра '
+'режимосновногоокнаклиентскогоприложения режимоткрытияокнаформы режимотображениявыделения '
+'режимотображениягеографическойсхемы режимотображениязначенийсерии режимотрисовкисеткиграфическойсхемы '
+'режимполупрозрачностидиаграммы режимпробеловдиаграммы режимразмещениянастранице режимредактированияколонки '
+'режимсглаживаниядиаграммы режимсглаживанияиндикатора режимсписказадач сквозноевыравнивание '
+'сохранениеданныхформывнастройках способзаполнениятекстазаголовкашкалыдиаграммы '
+'способопределенияограничивающегозначениядиаграммы стандартнаягруппакоманд стандартноеоформление '
+'статусоповещенияпользователя стильстрелки типаппроксимациилиниитрендадиаграммы типдиаграммы '
+'типединицышкалывремени типимпортасерийслоягеографическойсхемы типлиниигеографическойсхемы типлиниидиаграммы '
+'типмаркерагеографическойсхемы типмаркерадиаграммы типобластиоформления '
+'типорганизацииисточникаданныхгеографическойсхемы типотображениясериислоягеографическойсхемы '
+'типотображенияточечногообъектагеографическойсхемы типотображенияшкалыэлементалегендыгеографическойсхемы '
+'типпоискаобъектовгеографическойсхемы типпроекциигеографическойсхемы типразмещенияизмерений '
+'типразмещенияреквизитовизмерений типрамкиэлементауправления типсводнойдиаграммы '
+'типсвязидиаграммыганта типсоединениязначенийпосериямдиаграммы типсоединенияточекдиаграммы '
+'типсоединительнойлинии типстороныэлементаграфическойсхемы типформыотчета типшкалырадарнойдиаграммы '
+'факторлиниитрендадиаграммы фигуракнопки фигурыграфическойсхемы фиксациявтаблице форматдняшкалывремени '
+'форматкартинки ширинаподчиненныхэлементовформы ';const v8_system_enums_objects_properties='виддвижениябухгалтерии виддвижениянакопления видпериодарегистрарасчета видсчета видточкимаршрутабизнеспроцесса '
+'использованиеагрегатарегистранакопления использованиегруппиэлементов использованиережимапроведения '
+'использованиесреза периодичностьагрегатарегистранакопления режимавтовремя режимзаписидокумента режимпроведениядокумента ';const v8_system_enums_exchange_plans='авторегистрацияизменений допустимыйномерсообщения отправкаэлементаданных получениеэлементаданных ';const v8_system_enums_tabular_document='использованиерасшифровкитабличногодокумента ориентациястраницы положениеитоговколоноксводнойтаблицы '
+'положениеитоговстроксводнойтаблицы положениетекстаотносительнокартинки расположениезаголовкагруппировкитабличногодокумента '
+'способчтениязначенийтабличногодокумента типдвустороннейпечати типзаполненияобластитабличногодокумента '
+'типкурсоровтабличногодокумента типлиниирисункатабличногодокумента типлинииячейкитабличногодокумента '
+'типнаправленияпереходатабличногодокумента типотображениявыделениятабличногодокумента типотображениялинийсводнойтаблицы '
+'типразмещениятекстатабличногодокумента типрисункатабличногодокумента типсмещениятабличногодокумента '
+'типузоратабличногодокумента типфайлатабличногодокумента точностьпечати чередованиерасположениястраниц ';const v8_system_enums_sheduler='отображениевремениэлементовпланировщика ';const v8_system_enums_formatted_document='типфайлаформатированногодокумента ';const v8_system_enums_query='обходрезультатазапроса типзаписизапроса ';const v8_system_enums_report_builder='видзаполнениярасшифровкипостроителяотчета типдобавленияпредставлений типизмеренияпостроителяотчета типразмещенияитогов ';const v8_system_enums_files='доступкфайлу режимдиалогавыборафайла режимоткрытияфайла ';const v8_system_enums_query_builder='типизмеренияпостроителязапроса ';const v8_system_enums_data_analysis='видданныханализа методкластеризации типединицыинтервалавременианализаданных типзаполнениятаблицырезультатаанализаданных '
+'типиспользованиячисловыхзначенийанализаданных типисточникаданныхпоискаассоциаций типколонкианализаданныхдереворешений '
+'типколонкианализаданныхкластеризация типколонкианализаданныхобщаястатистика типколонкианализаданныхпоискассоциаций '
+'типколонкианализаданныхпоискпоследовательностей типколонкимоделипрогноза типмерырасстоянияанализаданных '
+'типотсеченияправилассоциации типполяанализаданных типстандартизациианализаданных типупорядочиванияправилассоциациианализаданных '
+'типупорядочиванияшаблоновпоследовательностейанализаданных типупрощениядереварешений ';const v8_system_enums_xml_json_xs_dom_xdto_ws='wsнаправлениепараметра вариантxpathxs вариантзаписидатыjson вариантпростоготипаxs видгруппымоделиxs видфасетаxdto '
+'действиепостроителяdom завершенностьпростоготипаxs завершенностьсоставноготипаxs завершенностьсхемыxs запрещенныеподстановкиxs '
+'исключениягруппподстановкиxs категорияиспользованияатрибутаxs категорияограниченияидентичностиxs категорияограниченияпространствименxs '
+'методнаследованияxs модельсодержимогоxs назначениетипаxml недопустимыеподстановкиxs обработкапробельныхсимволовxs обработкасодержимогоxs '
+'ограничениезначенияxs параметрыотбораузловdom переносстрокjson позициявдокументеdom пробельныесимволыxml типатрибутаxml типзначенияjson '
+'типканоническогоxml типкомпонентыxs типпроверкиxml типрезультатаdomxpath типузлаdom типузлаxml формаxml формапредставленияxs '
+'форматдатыjson экранированиесимволовjson ';const v8_system_enums_data_composition_system='видсравнениякомпоновкиданных действиеобработкирасшифровкикомпоновкиданных направлениесортировкикомпоновкиданных '
+'расположениевложенныхэлементоврезультатакомпоновкиданных расположениеитоговкомпоновкиданных расположениегруппировкикомпоновкиданных '
+'расположениеполейгруппировкикомпоновкиданных расположениеполякомпоновкиданных расположениереквизитовкомпоновкиданных '
+'расположениересурсовкомпоновкиданных типбухгалтерскогоостаткакомпоновкиданных типвыводатекстакомпоновкиданных '
+'типгруппировкикомпоновкиданных типгруппыэлементовотборакомпоновкиданных типдополненияпериодакомпоновкиданных '
+'типзаголовкаполейкомпоновкиданных типмакетагруппировкикомпоновкиданных типмакетаобластикомпоновкиданных типостаткакомпоновкиданных '
+'типпериодакомпоновкиданных типразмещениятекстакомпоновкиданных типсвязинаборовданныхкомпоновкиданных типэлементарезультатакомпоновкиданных '
+'расположениелегендыдиаграммыкомпоновкиданных типпримененияотборакомпоновкиданных режимотображенияэлементанастройкикомпоновкиданных '
+'режимотображениянастроеккомпоновкиданных состояниеэлементанастройкикомпоновкиданных способвосстановлениянастроеккомпоновкиданных '
+'режимкомпоновкирезультата использованиепараметракомпоновкиданных автопозицияресурсовкомпоновкиданных '
+'вариантиспользованиягруппировкикомпоновкиданных расположениересурсоввдиаграммекомпоновкиданных фиксациякомпоновкиданных '
+'использованиеусловногооформлениякомпоновкиданных ';const v8_system_enums_email='важностьинтернетпочтовогосообщения обработкатекстаинтернетпочтовогосообщения способкодированияинтернетпочтовоговложения '
+'способкодированиянеasciiсимволовинтернетпочтовогосообщения типтекстапочтовогосообщения протоколинтернетпочты '
+'статусразборапочтовогосообщения ';const v8_system_enums_logbook='режимтранзакциизаписижурналарегистрации статустранзакциизаписижурналарегистрации уровеньжурналарегистрации ';const v8_system_enums_cryptography='расположениехранилищасертификатовкриптографии режимвключениясертификатовкриптографии режимпроверкисертификатакриптографии '
+'типхранилищасертификатовкриптографии ';const v8_system_enums_zip='кодировкаименфайловвzipфайле методсжатияzip методшифрованияzip режимвосстановленияпутейфайловzip режимобработкиподкаталоговzip '
+'режимсохраненияпутейzip уровеньсжатияzip ';const v8_system_enums_other='звуковоеоповещение направлениепереходакстроке позициявпотоке порядокбайтов режимблокировкиданных режимуправленияблокировкойданных '
+'сервисвстроенныхпокупок состояниефоновогозадания типподписчикадоставляемыхуведомлений уровеньиспользованиязащищенногосоединенияftp ';const v8_system_enums_request_schema='направлениепорядкасхемызапроса типдополненияпериодамисхемызапроса типконтрольнойточкисхемызапроса типобъединениясхемызапроса '
+'типпараметрадоступнойтаблицысхемызапроса типсоединениясхемызапроса ';const v8_system_enums_properties_of_metadata_objects='httpметод автоиспользованиеобщегореквизита автопрефиксномеразадачи вариантвстроенногоязыка видиерархии видрегистранакопления '
+'видтаблицывнешнегоисточникаданных записьдвиженийприпроведении заполнениепоследовательностей индексирование '
+'использованиебазыпланавидоврасчета использованиебыстроговыбора использованиеобщегореквизита использованиеподчинения '
+'использованиеполнотекстовогопоиска использованиеразделяемыхданныхобщегореквизита использованиереквизита '
+'назначениеиспользованияприложения назначениерасширенияконфигурации направлениепередачи обновлениепредопределенныхданных '
+'оперативноепроведение основноепредставлениевидарасчета основноепредставлениевидахарактеристики основноепредставлениезадачи '
+'основноепредставлениепланаобмена основноепредставлениесправочника основноепредставлениесчета перемещениеграницыприпроведении '
+'периодичностьномерабизнеспроцесса периодичностьномерадокумента периодичностьрегистрарасчета периодичностьрегистрасведений '
+'повторноеиспользованиевозвращаемыхзначений полнотекстовыйпоискпривводепостроке принадлежностьобъекта проведение '
+'разделениеаутентификацииобщегореквизита разделениеданныхобщегореквизита разделениерасширенийконфигурацииобщегореквизита '
+'режимавтонумерацииобъектов режимзаписирегистра режимиспользованиямодальности '
+'режимиспользованиясинхронныхвызововрасширенийплатформыивнешнихкомпонент режимповторногоиспользованиясеансов '
+'режимполученияданныхвыборапривводепостроке режимсовместимости режимсовместимостиинтерфейса '
+'режимуправленияблокировкойданныхпоумолчанию сериикодовпланавидовхарактеристик сериикодовпланасчетов '
+'сериикодовсправочника созданиепривводе способвыбора способпоискастрокипривводепостроке способредактирования '
+'типданныхтаблицывнешнегоисточникаданных типкодапланавидоврасчета типкодасправочника типмакета типномерабизнеспроцесса '
+'типномерадокумента типномеразадачи типформы удалениедвижений ';const v8_system_enums_differents='важностьпроблемыприменениярасширенияконфигурации вариантинтерфейсаклиентскогоприложения вариантмасштабаформклиентскогоприложения '
+'вариантосновногошрифтаклиентскогоприложения вариантстандартногопериода вариантстандартнойдатыначала видграницы видкартинки '
+'видотображенияполнотекстовогопоиска видрамки видсравнения видцвета видчисловогозначения видшрифта допустимаядлина допустимыйзнак '
+'использованиеbyteordermark использованиеметаданныхполнотекстовогопоиска источникрасширенийконфигурации клавиша кодвозвратадиалога '
+'кодировкаxbase кодировкатекста направлениепоиска направлениесортировки обновлениепредопределенныхданных обновлениеприизмененииданных '
+'отображениепанелиразделов проверказаполнения режимдиалогавопрос режимзапускаклиентскогоприложения режимокругления режимоткрытияформприложения '
+'режимполнотекстовогопоиска скоростьклиентскогосоединения состояниевнешнегоисточникаданных состояниеобновленияконфигурациибазыданных '
+'способвыборасертификатаwindows способкодированиястроки статуссообщения типвнешнейкомпоненты типплатформы типповеденияклавишиenter '
+'типэлементаинформацииовыполненииобновленияконфигурациибазыданных уровеньизоляциитранзакций хешфункция частидаты';const CLASS=v8_system_sets_of_values
+v8_system_enums_interface
+v8_system_enums_objects_properties
+v8_system_enums_exchange_plans
+v8_system_enums_tabular_document
+v8_system_enums_sheduler
+v8_system_enums_formatted_document
+v8_system_enums_query
+v8_system_enums_report_builder
+v8_system_enums_files
+v8_system_enums_query_builder
+v8_system_enums_data_analysis
+v8_system_enums_xml_json_xs_dom_xdto_ws
+v8_system_enums_data_composition_system
+v8_system_enums_email
+v8_system_enums_logbook
+v8_system_enums_cryptography
+v8_system_enums_zip
+v8_system_enums_other
+v8_system_enums_request_schema
+v8_system_enums_properties_of_metadata_objects
+v8_system_enums_differents;const v8_shared_object='comобъект ftpсоединение httpзапрос httpсервисответ httpсоединение wsопределения wsпрокси xbase анализданных аннотацияxs '
+'блокировкаданных буфердвоичныхданных включениеxs выражениекомпоновкиданных генераторслучайныхчисел географическаясхема '
+'географическиекоординаты графическаясхема группамоделиxs данныерасшифровкикомпоновкиданных двоичныеданные дендрограмма '
+'диаграмма диаграммаганта диалогвыборафайла диалогвыборацвета диалогвыборашрифта диалограсписаниярегламентногозадания '
+'диалогредактированиястандартногопериода диапазон документdom документhtml документацияxs доставляемоеуведомление '
+'записьdom записьfastinfoset записьhtml записьjson записьxml записьzipфайла записьданных записьтекста записьузловdom '
+'запрос защищенноесоединениеopenssl значенияполейрасшифровкикомпоновкиданных извлечениетекста импортxs интернетпочта '
+'интернетпочтовоесообщение интернетпочтовыйпрофиль интернетпрокси интернетсоединение информациядляприложенияxs '
+'использованиеатрибутаxs использованиесобытияжурналарегистрации источникдоступныхнастроеккомпоновкиданных '
+'итераторузловdom картинка квалификаторыдаты квалификаторыдвоичныхданных квалификаторыстроки квалификаторычисла '
+'компоновщикмакетакомпоновкиданных компоновщикнастроеккомпоновкиданных конструктормакетаоформлениякомпоновкиданных '
+'конструкторнастроеккомпоновкиданных конструкторформатнойстроки линия макеткомпоновкиданных макетобластикомпоновкиданных '
+'макетоформлениякомпоновкиданных маскаxs менеджеркриптографии наборсхемxml настройкикомпоновкиданных настройкисериализацииjson '
+'обработкакартинок обработкарасшифровкикомпоновкиданных обходдереваdom объявлениеатрибутаxs объявлениенотацииxs '
+'объявлениеэлементаxs описаниеиспользованиясобытиядоступжурналарегистрации '
+'описаниеиспользованиясобытияотказвдоступежурналарегистрации описаниеобработкирасшифровкикомпоновкиданных '
+'описаниепередаваемогофайла описаниетипов определениегруппыатрибутовxs определениегруппымоделиxs '
+'определениеограниченияидентичностиxs определениепростоготипаxs определениесоставноготипаxs определениетипадокументаdom '
+'определенияxpathxs отборкомпоновкиданных пакетотображаемыхдокументов параметрвыбора параметркомпоновкиданных '
+'параметрызаписиjson параметрызаписиxml параметрычтенияxml переопределениеxs планировщик полеанализаданных '
+'полекомпоновкиданных построительdom построительзапроса построительотчета построительотчетаанализаданных '
+'построительсхемxml поток потоквпамяти почта почтовоесообщение преобразованиеxsl преобразованиекканоническомуxml '
+'процессорвыводарезультатакомпоновкиданныхвколлекциюзначений процессорвыводарезультатакомпоновкиданныхвтабличныйдокумент '
+'процессоркомпоновкиданных разыменовательпространствименdom рамка расписаниерегламентногозадания расширенноеимяxml '
+'результатчтенияданных своднаядиаграмма связьпараметравыбора связьпотипу связьпотипукомпоновкиданных сериализаторxdto '
+'сертификатклиентаwindows сертификатклиентафайл сертификаткриптографии сертификатыудостоверяющихцентровwindows '
+'сертификатыудостоверяющихцентровфайл сжатиеданных системнаяинформация сообщениепользователю сочетаниеклавиш '
+'сравнениезначений стандартнаядатаначала стандартныйпериод схемаxml схемакомпоновкиданных табличныйдокумент '
+'текстовыйдокумент тестируемоеприложение типданныхxml уникальныйидентификатор фабрикаxdto файл файловыйпоток '
+'фасетдлиныxs фасетколичестваразрядовдробнойчастиxs фасетмаксимальноговключающегозначенияxs '
+'фасетмаксимальногоисключающегозначенияxs фасетмаксимальнойдлиныxs фасетминимальноговключающегозначенияxs '
+'фасетминимальногоисключающегозначенияxs фасетминимальнойдлиныxs фасетобразцаxs фасетобщегоколичестваразрядовxs '
+'фасетперечисленияxs фасетпробельныхсимволовxs фильтрузловdom форматированнаястрока форматированныйдокумент '
+'фрагментxs хешированиеданных хранилищезначения цвет чтениеfastinfoset чтениеhtml чтениеjson чтениеxml чтениеzipфайла '
+'чтениеданных чтениетекста чтениеузловdom шрифт элементрезультатакомпоновкиданных ';const v8_universal_collection='comsafearray деревозначений массив соответствие списокзначений структура таблицазначений фиксированнаяструктура '
+'фиксированноесоответствие фиксированныймассив ';const TYPE=v8_shared_object
+v8_universal_collection;const LITERAL='null истина ложь неопределено';const NUMBERS=hljs.inherit(hljs.NUMBER_MODE);const STRINGS={className:'string',begin:'"|\\|',end:'"|$',contains:[{begin:'""'}]};const DATE={begin:"'",end:"'",excludeBegin:true,excludeEnd:true,contains:[{className:'number',begin:'\\d{4}([\\.\\\\/:-]?\\d{2}){0,5}'}]};const PUNCTUATION={match:/[;()+\-:=,]/,className:"punctuation",relevance:0};const COMMENTS=hljs.inherit(hljs.C_LINE_COMMENT_MODE);const META={className:'meta',begin:'#|&',end:'$',keywords:{$pattern:UNDERSCORE_IDENT_RE,keyword:KEYWORD+METAKEYWORD},contains:[COMMENTS]};const SYMBOL={className:'symbol',begin:'~',end:';|:',excludeEnd:true};const FUNCTION={className:'function',variants:[{begin:'процедура|функция',end:'\\)',keywords:'процедура функция'},{begin:'конецпроцедуры|конецфункции',keywords:'конецпроцедуры конецфункции'}],contains:[{begin:'\\(',end:'\\)',endsParent:true,contains:[{className:'params',begin:UNDERSCORE_IDENT_RE,end:',',excludeEnd:true,endsWithParent:true,keywords:{$pattern:UNDERSCORE_IDENT_RE,keyword:'знач',literal:LITERAL},contains:[NUMBERS,STRINGS,DATE]},COMMENTS]},hljs.inherit(hljs.TITLE_MODE,{begin:UNDERSCORE_IDENT_RE})]};return{name:'1C:Enterprise',case_insensitive:true,keywords:{$pattern:UNDERSCORE_IDENT_RE,keyword:KEYWORD,built_in:BUILTIN,class:CLASS,type:TYPE,literal:LITERAL},contains:[META,FUNCTION,COMMENTS,SYMBOL,NUMBERS,STRINGS,DATE,PUNCTUATION]};}
return _1c;})();;export default hljsGrammar;