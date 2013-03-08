var _vtex_shipping_popup = {
	selector: '.calc_shipping',
	main_container: "._vsp_main",
	results_container: "._vsp_results",
	cep:null,
	skus:null,
	default_button_text: "Calcular",
	on_hold_button_text: "Aguarde...",
	base_url:'/frete/calcula/',
	one: false,
	init: function()
	{
		_vtex_shipping_popup.load.vtex_get_skus();
	},
	load:
	{
		vtex_get_skus: function()
		{
			if(typeof jQuery.vtex_get_skus !== "function")
				jQuery.getScript("/arquivos/vtex_get_skus.js",function(){
					_vtex_shipping_popup.load.vtex_popup();
				});
			else
				_vtex_shipping_popup.load.vtex_popup();
		},
		vtex_popup: function()
		{
			if(typeof jQuery.fn.vtex_popup !== "function")
				jQuery.getScript("/arquivos/vtex_popup.js",function(){
					_vtex_shipping_popup.set.skus();
				});
			else
				_vtex_shipping_popup.set.skus();
		}
	},
	set:
	{
		skus: function()
		{
			_vtex_shipping_popup.skus = jQuery.vtex_get_skus();
			if(typeof _vtex_shipping_popup.skus !== "undefined" && _vtex_shipping_popup.skus !== null && _vtex_shipping_popup.skus.length>0)
				_vtex_shipping_popup.set.events();
		},
		events: function()
		{
		   _vtex_shipping_popup.set.event.run_btn();		   
		},
		event:
		{
			run_btn: function()
			{
				jQuery(_vtex_shipping_popup.selector+":not('active')").addClass('active').click(function(){
					_vtex_shipping_popup.show.dialog();
				});
			},
			calc: function()
			{
        if(jQuery(_vtex_shipping_popup.main_container).find('button').hasClass('active')) return false;
        
        jQuery(_vtex_shipping_popup.main_container).find('button:not("active")').unbind().addClass('active').click(function()
        {
            _vtex_shipping_popup.get.shipping();
        });

        return true;
			},
			inputs: function()
			{
        jQuery(_vtex_shipping_popup.main_container).find('input[type="text"]:not(".active")').keydown(function(e){
            var key = e.charCode || e.keyCode || 0;
            
            return (
                    key == 8 || 
                    key == 9 ||
                    key == 46 ||
                    (key >= 37 && key <= 40) ||
                    (key >= 48 && key <= 57) ||
                    (key >= 96 && key <= 105)
                    );

        });
        jQuery(_vtex_shipping_popup.main_container).find('input[type="text"]:not(".active")').keyup(function(){
            _vtex_shipping_popup.check.cep();
        });
			}
		},
		wait: function()
		{
			jQuery(_vtex_shipping_popup.main_container).find('button').text(_vtex_shipping_popup.on_hold_button_text);
			jQuery(_vtex_shipping_popup.main_container).find('button').unbind().removeClass('active').addClass('on-hold');
		},
		release: function()
		{
			jQuery(_vtex_shipping_popup.main_container).find('button').text(_vtex_shipping_popup.default_button_text).removeClass('on-hold');
		}
	},
	get:
	{
		dialog: function()
		{
			var _div_results = jQuery("<div>").addClass("_vsp_results");
			var _div_main = jQuery("<div>").addClass("_vsp_main");
			var _div_form = jQuery("<div>").addClass("_vsp_form");
			var _label = jQuery("<label>").text("CEP:");
			var _input1 = jQuery("<input>",{type:"text",maxlength:5}).addClass("cep1");
			var _input2 = jQuery("<input>",{type:"text",maxlength:3}).addClass("cep2");
			var _btn = jQuery("<button>").addClass("_vsp_btn").text(_vtex_shipping_popup.default_button_text);

			jQuery(_div_form).append(_label).append(_input1).append(_input2).append(_btn);
			jQuery(_div_main).append(_div_form).append(_div_results);

			return _div_main;
		},
		shipping: function()
    {
    	_vtex_shipping_popup.set.wait();

    	function set_tables(ndx,item)
    	{
    		if(ndx==0)
				jQuery(_vtex_shipping_popup.results_container).html('');

    		var _url = _vtex_shipping_popup.get.url(ndx,item.sku,_vtex_shipping_popup.cep);

    		if(!_url) return false;

    		jQuery.ajax({
					url:_url,
					success: function(data){
        		if(ndx == _vtex_shipping_popup.skus.length-1)
        			_vtex_shipping_popup.set.release();

        		jQuery(_vtex_shipping_popup.main_container).parents().eq(2).not("._showing_results").addClass('_showing_results');

						_result = jQuery(data).clone();
						if(jQuery(_result).attr('class')=='cep-invalido')
						{
							jQuery(_vtex_shipping_popup.results_container).html(_result);
							return false;
						}
						jQuery(_result).find('thead tr :contains("Valor do frete")').text('Valor do frete para '+item.name);
						jQuery(_result).find('thead tr').append(jQuery("<th>")); // fix bad formatted table
						jQuery(_result).find('tbody tr:odd').addClass("odd");

            jQuery(_vtex_shipping_popup.results_container).append(_result);
            if(jQuery(_vtex_shipping_popup.results_container).find('table').length>0) 
            	jQuery(_vtex_shipping_popup.results_container).find('.cep-invalido').remove();
            return true;
    			}
    		});
    	}

    	if(typeof _vtex_shipping_popup.skus !== "undefined" && _vtex_shipping_popup.skus !== null)
      		for(var ndx in _vtex_shipping_popup.skus)
      		{
      			if(!_vtex_shipping_popup.skus.hasOwnProperty(ndx)) return false;
            if(_vtex_shipping_popup.skus[ndx].availability)
            	set_tables(ndx,_vtex_shipping_popup.skus[ndx]);
      		}
    },
		url: function(index,sku,cep,qty)
		{
			if(typeof sku === "undefined" || sku === null) return false;

			_ndx = index||0;
			_cep = cep||_vtex_shipping_popup.cep;
			_sku = sku||_vtex_shipping_popup.sku[_ndx].sku;

			_vtex_shipping_popup.url = "//"+document.location.host+_vtex_shipping_popup.base_url+_sku+'?shippinCep='+_cep; //+'&quantity='+_qty;
			return _vtex_shipping_popup.url;
		}
	},
	show:
	{
		dialog: function()
		{
			var _div = _vtex_shipping_popup.get.dialog();
			jQuery(_div).vtex_popup({title:"Calcular prazo de entrega",classes:"._vsp_popup"});
			_vtex_shipping_popup.set.event.inputs();
		}
	},
	check:
	{
    cep: function()
    {                    
        jQuery(_vtex_shipping_popup.main_container).find('button').unbind().removeClass('active');
        _cep1 = jQuery('.cep1').val();
        _cep2 = jQuery('.cep2').val();
        _vtex_shipping_popup.cep = _cep1+_cep2;
        
        // check cep is valid to continue...
        if(_vtex_shipping_popup.cep.length<8) return false;
        
        _vtex_shipping_popup.set.event.calc();
    }
	}

}