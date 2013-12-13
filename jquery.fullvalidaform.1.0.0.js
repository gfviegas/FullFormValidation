/* JQUERY PLUGIN - Full Valida Form.
 * VERSION: 1.0.0
 * BY: THIAGO LUCIANO - BELO HORIZONTE - MG
 *
 * Descri��o: Este plugin foi desenvolvido para prover uma solu��o mais simples
 * para valida��o de forumul�rios complexos. Contar� com valida��es e mascaras.
 */
;
(function($, window, undefined) {

    // M�todos Liter�rios
    var methods = {

        // M�todo de inicializa��o
        'InitField': function($Ob, field) {
            field.conf = $Ob._methods.getConf($Ob, field);
            field.position = $Ob._methods.getPosition(field);
            var Type = field.prop('type');
            switch (Type) {

                // Inicializa��o input Text
                case 'text':
                    if(field.conf.max){
                        $(field).attr('maxlength', field.conf.max);
                    }
                    break;

                // Inicializa��o Radiobox
                case 'radio':
                    break;

                // Inicializa��o Checkbox
                case 'checkbox':
                    break;

                // Inicializa��o Textarea
                case 'textarea':
                    if(field.conf.max){
                        $(field).attr('maxlength', field.conf.max);
                    }
                    $Ob._methods.SetLimitCharacter($Ob, field);
                    break;

                // Inicializa��o input Password
                case 'password':
                    if(field.conf.max){
                        $(field).attr('maxlength', field.conf.max);
                    }
                    break;

                // Inicializa��o input File
                case 'file':
                    break;

                // Inicializa��o Padr�o
                default:
                    break;
            }
        },

        // M�todo de Valida��es
        'ValidField': function($Ob, field) {
            field.conf = $Ob._methods.getConf($Ob, field);
            field.position = $Ob._methods.getPosition(field);
            var Type = field.prop('type');
            if (field.conf) {

                // Regras para campos obrigat�rios
                if (field.conf.req) {
                    switch (Type) {

                        // Valida��es para input Text
                        case 'text':
                            if (field.val() == "") {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                                return false;
                            }
                            break;

                        // Valida��es para Radiobox
                        case 'radio':
                            if (!field.prop('checked')) {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                            }
                            break;

                        // Valida��es para Checkbox
                        case 'checkbox':
                            if (!field.prop('checked')) {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                            }
                            break;

                        // Valida��es para Textarea
                        case 'textarea':
                            if (field.val() == "") {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                                return false;
                            }
                            break;

                        // Valida��es para input Password
                        case 'password':
                            if (field.val() == "") {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                                return false;
                            }
                            break;

                        // Valida��es para input File
                        case 'file':
                            var Types = field.conf.filetype.replace(/,/g,'|');
                            var FileType = new RegExp('(?:'+Types+')$');
                            if (!field.val().match(FileType)) {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                                return false;
                            }
                            break;
                    }
                }
            }
            if($Ob._defaults.Success){
               // console.log($Ob._defaults.Success);
            }
        },

        // M�todo de exibi��o de mensagens
        'ShowMsg': function($Ob, field, text, color) {
            if (field) {
                text = (text) ? text : $Ob._message.Default;
                var Id = $Ob._methods.CreateId(4);
                var ContentMsg = '<div id="' + Id + '" class="' + $Ob._defaults.classBoxError + '">' + text + '</div>';
                field.before(ContentMsg);
                field.data('rel', Id);
                field.attr('data-rel', Id);
                var ElementRelPosition = field.position;
                var ColorOld = field.css('border-color');
                field.css({'border-color': color});
                $("#" + Id).css({
                    top: (ElementRelPosition.topplus - 3) + "px"
                            , left: (ElementRelPosition.left - 20) + "px"
                            , color: color
                }).slideDown(400);
                var Type = field.prop('type');
                if(Type == "text" || Type == "password" || Type == "textarea"){
                    field.on('keypress', function() {
                        $(this).css({'border-color': ColorOld});
                        $Ob._methods.CleanMsg($Ob, $(this).data('rel'));
                    });
                }else{
                    field.on('change', function(){
                        $(this).css({'border-color': ColorOld});
                        $Ob._methods.CleanMsg($Ob, $(this).data('rel'));
                    });
                }
            }
        },

        // M�todo de limpeza de mensagens
        'CleanMsg': function($Ob, Id) {
            if (Id) {
                $("#" + Id).remove();
            } else {
                $("." + $Ob._defaults.classBoxError).remove();
            }
        },

        // M�todo para cria��o de ID's
        // Este m�todo � utilizado criar identificadores
        // para listas de checkbox e radiobox.
        'CreateId': function(size) {
            size = (size) ? size : 1;
            var randomized = Math.ceil(Math.random() * Math.pow(10, size));
            var digit = Math.ceil(Math.log(randomized));
            while (digit > 10) {
                digit = Math.ceil(Math.log(digit));
            }
            var id = randomized + '-' + digit;
            return id;
        },

        // M�todo para aplicar limite de caracters em
        // campos text ou textarea ou password
        'SetLimitCharacter': function($Ob, field) {
            if ($Ob._defaults.character.Active || field.conf.characterative) {
                var Id = $Ob._methods.CreateId(3);
                var msg = (field.conf.maxtext) ? field.conf.maxtext : $Ob._defaults.character.MaxText;
                var Max = (field.conf.max) ? field.conf.max : $Ob._defaults.character.Max;
                var ContentCharacter = '<div id="' + Id + '" class="' + $Ob._defaults.classBoxCharacter + '">' + msg + " <span>" + Max + '</span></div>';
                field.after(ContentCharacter);
                var width = field.position.width;
                $("#" + Id).css({
                    'font-family': 'Arial'
                            , 'font-size': '10px'
                            , 'width': width
                            , 'margin': 0
                            , 'paddig': 0
                            , 'text-align': 'right'
                });
                $Ob._methods.SetLimitCharacterUpD(field, Max, $("#" + Id + " > span"));
                $(document).unbind('keypress').on('keypress', field, function() {
                    $Ob._methods.SetLimitCharacterUpD(field, Max, $("#" + Id + " > span"));
                }).unbind('change').on('change', field, function() {
                    $Ob._methods.SetLimitCharacterUpD(field, Max, $("#" + Id + " > span"));
                });
            }
        },

        // M�todo que define o limite de caracter em
        // campos text ou textarea ou password
        'SetLimitCharacterUpD': function(field, Max, target) {
            var text = field.val();
            var qnt = text.length;
            var empty;
            if (qnt > Max) {
                empty = text.slice(0, Max);
                field.val(empty);
            } else {
                target.html(Max - qnt);
            }
        },

        // M�todo que pega o posicionamento do campo
        'getPosition': function(element) {
            if (element) {
                var position = element.offset();
                var Height = element.height();
                var Width = element.width();
                position.height = Height;
                position.width = Width;
                position.topplus = Height + position.top;
                position.leftplus = Width + position.left;
                return position;
            }
            return false;
        },

        // M�todo para submeter o formul�rio
        'SubmitClick': function($Ob) {
            $Ob._methods.CleanMsg($Ob);
            $Ob._methods.getField($Ob, true);
        },

        // M�todo para pegar o campo do formul�rio
        'getField': function($Ob, valid) {
            $('[form=' + $Ob._settings.FormName + ']').each(function(i) {
                var field = $(this);
                field.Id = field.attr('id');
                field.Name = field.attr('name');
                if (valid) {
                    $Ob._methods.ValidField($Ob, field);
                } else {
                    $Ob._methods.InitField($Ob, field);
                }
            });
        },

        // M�todo para pegar as configura��es do campo
        'getConf': function($Ob, field) {
            var conf = eval($(field).data("conf"));
            if(conf && conf[0].msg) {
                $Ob._message.Erro.Required = conf[0].msg;
            }
            return (conf) ? conf[0] : 0;
        }
    };
    // Vari�veis com valores pad�o
    var pluginName = 'FullValidaForm',
            defaults = {
                enctype: 'enctype="multipart/form-data"'
                , method: 'post'
                , action: 'action="javascript:void(0)"'
                , classBoxError: "plugin_boxError"
                , classBoxCharacter: "plugin_boxCharacter"
                , Success : true
                , character: {
                    Active: true
                    , Max: 100
                    , MaxText: "Resta(m) caracter(es): "
                }
        };
    // Construtor
    function Plugin(element, options) {
        this._element = element;
        this._Id = $(element).attr("id");
        // Configura��es
        var settings = {
            FormName: this._Id
                    , ColorErro: '#FF0000'
        };
        // Menssagens (Erro, Alerta, Informa��es)
        var message = {
            Default: 'Msg Campo!'
                    , Erro: {
                Required: 'Campo requerido!'
            }
        };
        // Montagem das instancias do plugin
        $.extend(true, settings, options);
        this._message = message;
        this._options = options;
        this._defaults = defaults;
        this._name = pluginName;
        this._settings = settings;
        this._methods = methods;
        this.init();
    };
    //Init prototype
    Plugin.prototype.init = function() {
        $("#" + this._Id).attr({
            action: this._defaults.action
                    , method: this._defaults.method
                    , enctype: this._defaults.enctype
        });
        this._methods.getField(this);
        $('#Submeter[form=' + this._settings.FormName + ']').unbind('click').on('click', $.proxy(function() {
            this._methods.SubmitClick(this);
        }, this));
    };
    $.fn.FullValidaForm = function(options) {
        // Call para manter encadeamento
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };
})(jQuery);