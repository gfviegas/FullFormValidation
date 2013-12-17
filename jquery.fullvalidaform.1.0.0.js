/* JQUERY PLUGIN - Full Valida Form.
 * VERSION: 1.0.0
 * BY: THIAGO LUCIANO - BELO HORIZONTE - MG
 *
 * Descrição: Este plugin foi desenvolvido para prover uma solução mais simples
 * para validação de forumulários complexos. Contará com validações e mascaras.
 */
;
(function($, window, undefined)
{

    // Métodos Literários
    var methods = {

        // Método de inicialização
        'InitField': function($Ob, field)
        {
            field.conf = $Ob._methods.getConf($Ob, field);
            field.position = $Ob._methods.getPosition(field);
            var Type = field.prop('type');
            switch (Type.toLowerCase())
            {

                // Inicialização input Text
                case 'text':
                    if(field.conf.max)
                    {
                        $(field).attr('maxlength', field.conf.max);
                    }
                    break;

                // Inicialização Radiobox
                case 'radio':
                    break;

                // Inicialização Checkbox
                case 'checkbox':
                    break;

                // Inicialização Textarea
                case 'textarea':
                    if(field.conf.max)
                    {
                        $(field).attr('maxlength', field.conf.max);
                    }
                    $Ob._methods.SetLimitCharacter($Ob, field);
                    break;

                // Inicialização input Password
                case 'password':
                    if(field.conf.max)
                    {
                        $(field).attr('maxlength', field.conf.max);
                    }
                    break;

                // Inicialização input File
                case 'file':
                    break;

                // Inicialização Padrão
                default:
                    break;
            }
        },

        // Método de Validações
        'ValidField': function($Ob, field)
        {
            field.conf = $Ob._methods.getConf($Ob, field);
            field.position = $Ob._methods.getPosition(field);
            var Type = field.prop('type');
            if (field.conf)
            {

                // Regras para campos obrigatórios
                if (field.conf.req)
                {
                    switch (Type.toLowerCase())
                    {

                        // Validações para input Text
                        case 'text':
                            if (field.val() == "")
                            {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                                return false;
                            }

                            if (field.conf.type != "")
                            {
                                $Ob._methods.ValidType($Ob, field);
                            }
                            break;

                        // Validações para Radiobox
                        case 'radio':
                            if (!field.prop('checked'))
                            {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                            }
                            break;

                        // Validações para Checkbox
                        case 'checkbox':
                            if (!field.prop('checked'))
                            {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                            }
                            break;

                        // Validações para Textarea
                        case 'textarea':
                            if (field.val() == "")
                            {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                                return false;
                            }
                            break;

                        // Validações para input Password
                        case 'password':
                            if (field.val() == "")
                            {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                                return false;
                            }
                            break;

                        // Validações para input File
                        case 'file':
                            var Types = field.conf.filetype.replace(/,/g,'|');
                            var FileType = new RegExp('(?:'+Types+')$');
                            if (!field.val().match(FileType))
                            {
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

        // Método de exibição de mensagens
        'ShowMsg': function($Ob, field, text, color)
        {
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
                if(Type == "text" || Type == "password" || Type == "textarea")
                {
                    field.on('keypress', function() {
                        $(this).css({'border-color': ColorOld});
                        $Ob._methods.CleanMsg($Ob, $(this).data('rel'));
                    });
                }
                else
                {
                    field.on('change', function(){
                        $(this).css({'border-color': ColorOld});
                        $Ob._methods.CleanMsg($Ob, $(this).data('rel'));
                    });
                }
            }
        },

        // Método de limpeza de mensagens
        'CleanMsg': function($Ob, Id)
        {
            if (Id) {
                $("#" + Id).remove();
            } else {
                $("." + $Ob._defaults.classBoxError).remove();
            }
        },

        // Método para criação de ID's
        // Este método é utilizado criar identificadores
        // para listas de checkbox e radiobox.
        'CreateId': function(size) {
            size = (size) ? size : 1;
            var randomized = Math.ceil(Math.random() * Math.pow(10, size));
            var digit = Math.ceil(Math.log(randomized));
            while (digit > 10)
            {
                digit = Math.ceil(Math.log(digit));
            }
            var id = randomized + '-' + digit;
            return id;
        },

        // Método para validar o tipo do campo e aplicar regras específicas
        'ValidType': function($Ob, field)
        {
            switch(field.conf.type.toLowerCase())
            {
                case 'cpf':
                    var value = field.val();
                    var cpf = value.replace(/[^\d]+/g,'');
                    if(cpf == '')
                    {
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Cnpj, $Ob._settings.ColorErro);
                        field.focus();
                        $Ob._defaults.Success = false;
                        return false;
                    }
                    // Elimina CPFs invalidos conhecidos
                    if (cpf.length != 11 ||
                        cpf == "00000000000" ||
                        cpf == "11111111111" ||
                        cpf == "22222222222" ||
                        cpf == "33333333333" ||
                        cpf == "44444444444" ||
                        cpf == "55555555555" ||
                        cpf == "66666666666" ||
                        cpf == "77777777777" ||
                        cpf == "88888888888" ||
                        cpf == "99999999999")
                    {
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Cnpj, $Ob._settings.ColorErro);
                        field.focus();
                        $Ob._defaults.Success = false;
                        return false;
                    }
                    // Valida 1o digito
                    var add = 0;
                    for (i=0; i < 9; i ++)
                        add += parseInt(cpf.charAt(i)) * (10 - i);
                    var rev = 11 - (add % 11);
                    if (rev == 10 || rev == 11)
                        rev = 0;
                    if (rev != parseInt(cpf.charAt(9)))
                    {
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Cnpj, $Ob._settings.ColorErro);
                        field.focus();
                        $Ob._defaults.Success = false;
                        return false;
                    }
                    // Valida 2o digito
                    var add = 0;
                    for (i = 0; i < 10; i ++)
                        add += parseInt(cpf.charAt(i)) * (11 - i);
                    rev = 11 - (add % 11);  if (rev == 10 || rev == 11)
                    rev = 0;
                    if (rev != parseInt(cpf.charAt(10)))
                    {
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Cnpj, $Ob._settings.ColorErro);
                        field.focus();
                        $Ob._defaults.Success = false;
                        return false;
                    }
                break;
                case'cnpj':
                    var value = field.val();
                    var cnpj = value.replace(/[^\d]+/g,'');
                    if(cnpj == '')
                    {
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Cnpj, $Ob._settings.ColorErro);
                        field.focus();
                        $Ob._defaults.Success = false;
                        return false;
                    }
                    if (cnpj.length != 14)
                        return false;
                    // Elimina CNPJs invalidos conhecidos
                    if (cnpj == "00000000000000" ||
                        cnpj == "11111111111111" ||
                        cnpj == "22222222222222" ||
                        cnpj == "33333333333333" ||
                        cnpj == "44444444444444" ||
                        cnpj == "55555555555555" ||
                        cnpj == "66666666666666" ||
                        cnpj == "77777777777777" ||
                        cnpj == "88888888888888" ||
                        cnpj == "99999999999999")
                    {
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Cnpj, $Ob._settings.ColorErro);
                        field.focus();
                        $Ob._defaults.Success = false;
                        return false;
                    }
                    // Valida DVs
                    var tamanho = cnpj.length - 2
                    var numeros = cnpj.substring(0,tamanho);
                    var digitos = cnpj.substring(tamanho);
                    var soma = 0;
                    var pos = tamanho - 7;
                    for (i = tamanho; i >= 1; i--) {
                      soma += numeros.charAt(tamanho - i) * pos--;
                      if (pos < 2)
                            pos = 9;
                    }
                    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                    if (resultado != digitos.charAt(0))
                    {
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Cnpj, $Ob._settings.ColorErro);
                        field.focus();
                        $Ob._defaults.Success = false;
                        return false;
                    }
                    tamanho = tamanho + 1;
                    numeros = cnpj.substring(0,tamanho);
                    soma = 0;
                    pos = tamanho - 7;
                    for (i = tamanho; i >= 1; i--) {
                      soma += numeros.charAt(tamanho - i) * pos--;
                      if (pos < 2)
                            pos = 9;
                    }
                    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                    if (resultado != digitos.charAt(1))
                    {
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Cnpj, $Ob._settings.ColorErro);
                        field.focus();
                        $Ob._defaults.Success = false;
                        return false;
                    }
                break;
                case 'mail':
                    var value = field.val();
                    var regex = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
                    if(typeof(value) == "string"){
                        if(!regex.test(value))
                        {
                            $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Email, $Ob._settings.ColorErro);
                            field.focus();
                            $Ob._defaults.Success = false;
                            return false;
                        }
                    }
                    else if(typeof(value) == "object")
                    {
                        if(!regex.test(value.value))
                        {
                            $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Email, $Ob._settings.ColorErro);
                            field.focus();
                            $Ob._defaults.Success = false;
                            return false;
                        }
                    }
                    else
                    {
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Email, $Ob._settings.ColorErro);
                        field.focus();
                        $Ob._defaults.Success = false;
                        return false;
                    }
                break;
            }
        },

        // Método para aplicar limite de caracters em
        // campos text ou textarea ou password
        'SetLimitCharacter': function($Ob, field)
        {
            if ($Ob._defaults.character.Active || field.conf.characterative)
            {
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

        // Método que define o limite de caracter em
        // campos text ou textarea ou password
        'SetLimitCharacterUpD': function(field, Max, target)
        {
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

        // Método que pega o posicionamento do campo
        'getPosition': function(element)
        {
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

        // Método para submeter o formulário
        'SubmitClick': function($Ob) {
            $Ob._methods.CleanMsg($Ob);
            $Ob._methods.getField($Ob, true);
        },

        // Método para pegar o campo do formulário
        'getField': function($Ob, valid)
        {
            $('[form=' + $Ob._settings.FormName + ']').each(function(i)
            {
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

        // Método para pegar as configurações do campo
        'getConf': function($Ob, field)
        {
            var conf = eval($(field).data("conf"));
            if(conf && conf[0].msg) {
                $Ob._message.Erro.Required = conf[0].msg;
            }
            return (conf) ? conf[0] : 0;
        }
    };

    // Variáveis com valores padrão
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
    function Plugin(element, options)
    {
        this._element = element;
        this._Id = $(element).attr("id");

        // Configurações
        var settings = {
            FormName: this._Id
                    , ColorErro: '#FF0000'
        };

        // Menssagens (Erro, Alerta, Informações)
        var message = {
            Default: 'Msg Campo!',
            Erro: {
                Required: 'Campo requerido!',
                Cpf: 'CPF inv&aacute;lido',
                Cnpj: 'CNPJ inv&aacute;lido',
                Email: 'E-mail inv&aacute;lido'
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
    Plugin.prototype.init = function()
    {
        $("#" + this._Id).attr({
            action: this._defaults.action
                    , method: this._defaults.method
                    , enctype: this._defaults.enctype
        });
        this._methods.getField(this);
        $('#Submeter[form=' + this._settings.FormName + ']')
            .prop('type','button')
            .unbind('click')
            .on('click', $.proxy(function() {
            this._methods.SubmitClick(this);
        }, this));
    };

    $.fn.FullValidaForm = function(options)
    {
        // Call para manter encadeamento
        return this.each(function()
        {
            if (!$.data(this, 'plugin_' + pluginName))
            {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery);