;(function(window,document,undefined){
	jQuery.vtex_get_skus = function(){

		var _vtex_get_skus = {
			skus: [],
			type: null,
			init: function()
			{
				var _type = _vtex_get_skus.set.sku.type()||null;
				if(_type && typeof _vtex_get_skus.set.sku[_type] === "function")
					return _vtex_get_skus.set.sku[_type]();
			},
			set:
			{
				sku:
				{
					type: function()
					{
						if(jQuery('.skuSelection .skuList').length>0) _vtex_get_skus.type = 'kits';
						else if(typeof window.myJSONSkuSpecification!=="undefined"&&myJSONSkuSpecification.skus.length>0) _vtex_get_skus.type = 'simple_list';
						else if(jQuery('.skuList').length>0) _vtex_get_skus.type = 'multi_list';
						else _vtex_get_skus.type = 'single';

						return _vtex_get_skus.type;
					},
					single: function()
					{
						_vtex_get_skus.skus = [];

						var _name = jQuery(".productName:first").text().replace(/^\s*([\S\s]*?)\s*$/, '$1');

						var _availability = true;
						
						var _href = jQuery(".buy-button:first").attr("href");

						if(_href.replace(/^\s*([\S\s]*?)\s*$/, '$1') !== "")
							var _sku = _href.replace(/.+Sku\=/,"");
						else
						{
							var _sku = jQuery(".notifyme-skuid").val();
							_availability = false;	
						}

						_vtex_get_skus.skus.push({index:0,sku:_sku,name:_name,availability:_availability});
						
						if(typeof _vtex_get_skus.skus !== "undefined" && _vtex_get_skus.skus !== null && _vtex_get_skus.skus.length>0)
							return _vtex_get_skus.skus;
						return false
					},
					simple_list: function()
					{
						_vtex_get_skus.skus = [];

						var _name = jQuery(".productName:first").text().replace(/^\s*([\S\s]*?)\s*$/, '$1');
						var _availability = true;

						var _sku_obj = window.myJSONSkuSpecification;
						var _index = 0;
						for(var x=0;x<=_sku_obj.skus.length-1;x++)
						{
							for(var i in _sku_obj.skus[x])
							{
								_sku = _sku_obj.skus[x][i].split(',')[0];
								_availability = (_sku_obj.skus[x][i].split(',')[1] === "True");
								_vtex_get_skus.skus.push({index:_index,sku:_sku,name:_name,availability:_availability});
								_index++;
							}
						}
						if(typeof _vtex_get_skus.skus !== "undefined" && _vtex_get_skus.skus !== null && _vtex_get_skus.skus.length>0)
							return _vtex_get_skus.skus;
						return false
					},
					multi_list: function()
					{
						_vtex_get_skus.skus = [];

						var _product_name = jQuery(".productName:first").text().replace(/^\s*([\S\s]*?)\s*$/, '$1');
						var _availability = true;

						jQuery(".skuList .nomeSku").each(function(ndx,item){
							if(typeof item === "undefined" || item === null) return false;
							
							var _sku_name = jQuery(item).text();
							var _name = _product_name + " " + _sku_name;

							if(jQuery(item).siblings(".buy-button").length>0)
							{
								var _sku = jQuery(item).siblings(".buy-button").attr("href").replace(/.+Sku\=/,"");
								_availability = true;
							}
							else
							{
								var _sku = jQuery(item).siblings(".notifyme").find(".notifyme-skuid").val();
								_availability = false;	
							}
							_vtex_get_skus.skus.push({index:ndx,sku:_sku,name:_name,availability:_availability});
						});
						if(typeof _vtex_get_skus.skus !== "undefined" && _vtex_get_skus.skus !== null && _vtex_get_skus.skus.length>0)
							return _vtex_get_skus.skus;
						return false
					},
					kits: function()
					{
						_vtex_get_skus.skus = [];
						var _name = jQuery(".productName:first").text().replace(/^\s*([\S\s]*?)\s*$/, '$1');

						jQuery(".sku-specification-index").each(function(ndx,item){
							if(typeof item === "undefined" || item === null) return false;

							var _skus = jQuery(item).val();
							if(!_skus) return false;
							
							var _sku_obj = JSON.parse(_skus).skus;

							var _index = 0;
							for(var x=0;x<_sku_obj.length;x++)
							{
								for(var i in _sku_obj[x])
								{
									_sku = _sku_obj[x][i].split(',')[0];
									_availability = (_sku_obj[x][i].split(',')[1] === "True");
									_vtex_get_skus.skus.push({index:_index,sku:_sku,name:_name,availability:_availability});
									_index++;
								}
							}
						});
						if(typeof _vtex_get_skus.skus !== "undefined" && _vtex_get_skus.skus !== null && _vtex_get_skus.skus.length>0)
							return _vtex_get_skus.skus;
						return false
					}
				}
			}
		};

		return _vtex_get_skus.init();
	}

})(window,document)