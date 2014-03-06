/* JQUERY PLUGIN - Full Valida Form.
 * VERSION: 1.0.0
 * BY: THIAGO LUCIANO - BELO HORIZONTE - MG
 *
 * Descri��o: This plugin was developed to provide a simple solution for
 * validation of complex forms.
 */
;
(function($, window, undefined)
{

    // Literary methods
    var methods = {

        // Initialization method
        'InitField': function($Ob, field)
        {
            field.conf = $Ob._methods.getConf($Ob, field);
            field.position = $Ob._methods.getPosition(field);
            var Type = field.prop('type');
            switch (Type.toLowerCase())
            {

                // Input Text initialization
                case 'text':
                    if(field.conf.max)
                    {
                        $(field).attr('maxlength', field.conf.max);
                    }

                    // Checks if the field is numeric
                    if(field.conf.type.toLowerCase() == "number"){
                        field.keydown(function(e){
                            // Allows some keys
                            if((e.keyCode>=96&&e.keyCode<=105)||(e.keyCode>=48&&e.keyCode<=57)||(e.keyCode>=8&&e.keyCode<=46)||(e.keyCode>=112&&e.keyCode<=123)){
                                return true;
                            }
                            // Blocks all the rest of the keyboard
                            return false;
                        }).keyup(function(e){
                            // Remove everything that is not numeric
                            $(this).val( $(this).val().replace(/\s/g,"") );
                        });
                    }
                    break;

                // Radiobox initialization
                case 'radio':
                    break;

                // Checkbox initialization
                case 'checkbox':
                    break;

                // Textarea initialization
                case 'textarea':
                    if(field.conf.max)
                    {
                        $(field).attr('maxlength', field.conf.max);
                    }
                    $Ob._methods.SetLimitCharacter($Ob, field);
                    break;

                // Input Password initialization
                case 'password':
                    if(field.conf.max)
                    {
                        $(field).attr('maxlength', field.conf.max);
                    }
                    break;

                // Input File initialization
                case 'file':
                    break;

                // Simple select initialization
                case 'select-one':
                    break;

                // Multiple select initialization
                case 'select-multiple':
                    break;

                // Default initialization
                default:
                    break;
            }
        },

        // Method from validates
        'ValidField': function($Ob, field)
        {
            field.conf = $Ob._methods.getConf($Ob, field);
            field.position = $Ob._methods.getPosition(field);
            var Type = field.prop('type');
            if (field.conf)
            {

                // Rules for require fields
                if (field.conf.req)
                {
                    switch (Type.toLowerCase())
                    {

                        // Validates for input Text
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

                        // Validates for Radiobox
                        case 'radio':
                            if (!field.prop('checked'))
                            {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                            }
                            break;

                        // Validates for Checkbox
                        case 'checkbox':
                            if (!field.prop('checked'))
                            {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                            }
                            break;

                        // Validates for Textarea
                        case 'textarea':
                            if (field.val() == "")
                            {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                                return false;
                            }
                            break;

                        // Validates for input Password
                        case 'password':
                            if (field.val() == "")
                            {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                                return false;
                            }
                            break;

                        // Validates for input File
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

                        // Validates for simple select
                        case 'select-one':
                            if (field.val() == "")
                            {
                                $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Required, $Ob._settings.ColorErro);
                                field.focus();
                                $Ob._defaults.Success = false;
                                return false;
                            }
                            break;

                        // Validates for multiple select
                        case 'select-multiple':
                            var valor = field.val();
                            if (valor == null || valor == "")
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
        },

        // Method from show messages
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

        // Method to clear messages
        'CleanMsg': function($Ob, Id)
        {
            if (Id) {
                $("#" + Id).remove();
            } else {
                $("." + $Ob._defaults.classBoxError).remove();
            }
        },

        // Method to create for ID's
        // this method is utilized to create identifiers
        // to lists the checkbox and radiobox.
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

        // Method to validates the type for field and apply rules
        'ValidType': function($Ob, field)
        {
            switch(field.conf.type.toLowerCase())
            {
                case 'cpf':
                    var value = field.val();
                    var cpf = value.replace(/[^\d]+/g,'');
                    if(cpf == '')
                    {
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Cpf, $Ob._settings.ColorErro);
                        field.focus();
                        $Ob._defaults.Success = false;
                        return false;
                    }
                    // Delete CPFs invalid
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
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Cpf, $Ob._settings.ColorErro);
                        field.focus();
                        $Ob._defaults.Success = false;
                        return false;
                    }
                    // Validates first digit
                    var add = 0;
                    for (i=0; i < 9; i ++)
                        add += parseInt(cpf.charAt(i)) * (10 - i);
                    var rev = 11 - (add % 11);
                    if (rev == 10 || rev == 11)
                        rev = 0;
                    if (rev != parseInt(cpf.charAt(9)))
                    {
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Cpf, $Ob._settings.ColorErro);
                        field.focus();
                        $Ob._defaults.Success = false;
                        return false;
                    }
                    // Validates second digit
                    var add = 0;
                    for (i = 0; i < 10; i ++)
                        add += parseInt(cpf.charAt(i)) * (11 - i);
                    rev = 11 - (add % 11);  if (rev == 10 || rev == 11)
                    rev = 0;
                    if (rev != parseInt(cpf.charAt(10)))
                    {
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Cpf, $Ob._settings.ColorErro);
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
                    // Delete CNPJs invalid
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
                    // Validates DVs
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
                case 'date':
                    var value = field.val();
                    var ardt=new Array;
                    var ExpReg=new RegExp("(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/[0-9]{2,4}");
                    ardt=value.split("/");
                    erro=false;
                    if (value.search(ExpReg)==-1)
                    {
                        erro = true;
                    }
                    else if (((ardt[1]==4)||(ardt[1]==6)||(ardt[1]==9)||(ardt[1]==11))&&(ardt[0]>30))
                    {
                        erro = true;
                    }
                    else if ( ardt[1]==2)
                    {
                        if ((ardt[0]>28)&&((ardt[2]%4)!=0))
                        {
                            erro = true;
                        }
                        if ((ardt[0]>29)&&((ardt[2]%4)==0)){
                            erro = true;
                        }
                    }
                    if (erro)
                    {
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Date, $Ob._settings.ColorErro);
                        field.focus();
                        $Ob._defaults.Success = false;
                        return false;
                    }
                break;
                case 'number':
                    var value = field.val();
                    var reg = new RegExp("^[+\-]?(\d+([.,]\d+)?)+$");
                    if(isNaN(value))
                    {
                        $Ob._methods.ShowMsg($Ob, field, $Ob._message.Erro.Num, $Ob._settings.ColorErro);
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

        // Method to apply limit the characters in
        // fields: text or textarea or password
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

        // Method to define limit of character in
        // fields: text, textarea, password
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

        // Search field placement
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

        // Method to get the form field
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

        // Method to get the field settings
        'getConf': function($Ob, field)
        {
            var conf = eval($(field).data("conf"));
            if(conf && conf[0].msg) {
                $Ob._message.Erro.Required = conf[0].msg;
            }
            return (conf) ? conf[0] : 0;
        },

        // Method to submit the form
        'SubmitClick': function($Ob) {
            $Ob._defaults.Success = true;
            $Ob._methods.CleanMsg($Ob);
            $Ob._methods.getField($Ob, true);
            if($Ob._defaults.Success)
            {
               $Ob._methods.Post();
            }
        },

        // callback to submit
        'Post': function(){
            // idle
        }
    };

    // Variable default
    var pluginName = 'FullFormValidation',
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
                    , MaxText: "characters left: "
                }
        };

    // Constructor
    function Plugin(element, options)
    {
        this._element = element;
        this._Id = $(element).attr("id");

        // Settings
        var settings = {
            FormName: this._Id
                    , ColorErro: '#FF0000'
        };

        // Message (Error, Alert, Information)
        var message = {
            Default: 'default message!',
            Erro: {
                Required: 'required field!',
                Cpf: 'invalid CPF',
                Cnpj: 'invalid CNPJ',
                Email: 'invalid email',
                'Date': 'invalid date',
                Num: ' invalid value, allowed only numbers!'
            }
        };

        // Object plugin
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
        $('#'+this._Id+' input[type="submit"][form=' + this._settings.FormName + ']')
            .prop('type','button')
            .unbind('click')
            .on('click', $.proxy(function() {
            this._methods.SubmitClick(this);
        }, this));
    };

    $.fn.FullFormValidation = function(options)
    {
        // Preventing against multiple instantiations
        return this.each(function()
        {
            if (!$.data(this, 'plugin_' + pluginName))
            {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery);
