/**
 * @author wpatterson
 * @email wpatterson@horizonhobby.com
 * @version 1.0.1
 * @date 1/7/2015
 */

(function(root, $, document, undefined){
  'use strict';
  var dataUrl = 'http://104.236.76.97/search/';
  //var dataUrl = 'http://il-wpatterson:3080/search/';
  function partsFinderinit() {
    // set up our scaffold
    $('[data-parts-finder]').each(function() {
      var arr = ['brand', 'type', 'model'],
          div = $('<div />', {class: 'row parts-bar'});
      $.each(arr, function(i) {
        div.append(
          $('<div />', {class: 'large-4 columns step-' + parseInt(i + 1)})
          .append(
            $('<fieldset />')
            .append(
              $('<legend />', {text: 'Step ' + parseInt(i + 1)})
            )
            .append(
              $('<select />', {name: arr[i] + '-list'})
            )
          )
        )
      });
      
      var cat = $(this).data('category') ? { $elemMatch : { ID : { $regex : encodeURIComponent('^' + $(this).data('category') + '_(?!BATTERIES)') } } } : { $elemMatch : { ID : { $regex : encodeURIComponent('[A-Z]_(?!BATTERIES)') } } };
      div.data('cat', $(this).data('category') || 'ALL');
      $(this).append(div);
      getBrands($(this), cat);
    })
  }
  
  function getBrands(el, cat) {
    var q = JSON.stringify({
          HasPartsListing: 1,
          Displayable: 1,
          Categories: cat
        }), s = JSON.stringify({
          BrandName: 1
        }), f = JSON.stringify({
          _id: 0,
          BrandID: 1,
          BrandName: 1,
          Categories: 1,
          Status: 1
        });
    $.ajax({
      url : dataUrl+q+'/0/'+s+'/'+f+'?callback=?',
      type : 'GET',
      dataType : 'json',
      success : function(data) {
        clearActive(el);
        el.find('[name="type-list"], [name="model-list"]').empty();
        el.find('[name="brand-list"]')
        .empty()
        .parent().addClass('active').end()
        .append($('<option />', {text: 'Select Brand'}))
        .off()
        .on('change', function(e){
          e.preventDefault();
          el.find('.step-3').animate({opacity: 0}, 250);
          $(this).parent().removeClass('active');
          getType(el, cat, this.value);
        });
        var brandid = [], name = {};
        $.each(data, function(i, item) {
          brandid[i] = item.BrandID;
          name[item.BrandID] = item.BrandName;
        })
        brandid = brandid.unique();
        $.each(brandid, function(i){
          el.find('[name="brand-list"]').append(
            $('<option />', {value: brandid[i], text: name[brandid[i]]})
          );
        });
      }
    });
  }
  
  function getType(el, cat, id) {
    var q = JSON.stringify({
          HasPartsListing: 1,
          Displayable: 1,
          BrandID: id,
          Categories: cat
        }), s = JSON.stringify({
          Categories: 1
        }), f = JSON.stringify({
          _id: 0,
          Categories: 1
        });
    $.ajax({
      url : dataUrl+q+'/0/'+s+'/'+f+'?callback=?',
      type : 'GET',
      dataType : 'json',
      success : function(data) {
        clearActive(el);
        el.find('.step-2').animate({opacity: 1}, 500);
        el.find('[name="model-list"]').empty();
        el.find('[name="type-list"]')
        .empty()
        .parent().addClass('active').end()
        .append($('<option />', {text: 'Select Type'}))
        .off()
        .on('change', function(e){
          e.preventDefault();
          $(this).parent().removeClass('active');
          getModels(el, id, this.value);
        });
        var catid = [], desc = {};
        $.each(data, function(i, a) {
          $.each(a, function(i, b){
            $.each(b, function(i, c) {
              catid = catid.concat(c.ID);
              desc[c.ID] = c.Name;
            })
          })
        });
        catid = catid.unique();
        $.each(catid, function(i){
          el.find('[name="type-list"]').append(
            $('<option />', {value: catid[i], text:desc[catid[i]]})
          );
        });
      }
    });
  }
  
  function getModels(el, id, catid) {
    var q = JSON.stringify({
          HasPartsListing: 1,
          Displayable: 1,
          BrandID: id,
          Categories: { $elemMatch : { ID : catid } }
        }), f = JSON.stringify({
          _id: 0,
          ProdID: 1,
          Name: 1
        });
    $.ajax({
      url : dataUrl+q+'/0/{}/'+f+'?callback=?',
      type : 'GET',
      dataType : 'json',
      success : function(data) {
        clearActive(el);
        el.find('.step-3').animate({opacity: 1}, 500);
        el.find('[name="model-list"]')
        .empty()
        .parent().addClass('active').end()
        .append($('<option />', {text: 'Select Model'}))
        .off()
        .on('change', function(e){
          e.preventDefault();
          if($('.no-touch').length) { // attempt to keep the new windows only to desktop
            var win = window.open('http://www.horizonhobby.com/' + this.value + '?clickpath='+$(this).closest('.parts-bar').data('cat')+'_partsfinder#parts');
	            if(win === undefined) { // popup blocker on eg. safari has it on by default and does not even tell the user that it blocked the new window so the user thinks your script is broken,
		            location.href = 'http://www.horizonhobby.com/' + this.value + '?clickpath='+$(this).closest('.parts-bar').data('cat')+'_partsfinder#parts';
	            }
          } else {
            location.href = 'http://www.horizonhobby.com/' + this.value + '?clickpath='+$(this).closest('.parts-bar').data('cat')+'_partsfinder#parts';
          }
        });
        $.each(data, function(i){
          el.find('[name="model-list"]').append(
            $('<option />', {value: data[i].ProdID, text:data[i].Name.replace(/&trade;/g, '™').replace(/&reg;/g, '®') + ' (' + data[i].ProdID + ')'})
          );
        });
      }
    });
  }
  
  function clearActive(el) {
    el.find('.parts-bar .active').removeClass('active');
  }
  
  partsFinderinit();
  
  Array.prototype.shuffle = function(){var o=this; for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);return o;};
  Array.prototype.unique = function(){var n=this; return n.reduce(function(n,r){return n.indexOf(r)<0&&n.push(r),n},[])}
}(window, window.jQuery, document))()


