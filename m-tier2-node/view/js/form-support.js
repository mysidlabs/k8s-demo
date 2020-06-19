var selectedId;

$.fn.serializeObject = function () {
    var o = {};
    var outputCopy = o;
    var form = this;
    var a = form.serializeArray();
    var regex = /(\w+)+/g;
    $.each(a, function (index, item) {
      var keys = item.name.match(regex);
      keys.forEach(function (key, localIndex) {
        if (!outputCopy.hasOwnProperty(key)) {
          outputCopy[key] = {};
        }
        if (localIndex == keys.length - 1) {
          if (item.value == "" || isNaN(item.value)) {
            var elType = form.find('[name="'+item.name+'"]').attr('type');
            if(elType === "checkbox") {
              outputCopy[key] = true;
            } else {
              outputCopy[key] = item.value;
            }
          } else {
            outputCopy[key] = +item.value;
          }
        }
        outputCopy = outputCopy[key];
      });
      outputCopy = o;
    });
    return o;
  };

  $(document).ready(function() {
    $('.mdb-select').materialSelect(); //initialize mdb select boxes
   });

   function resetForm(formId) {
       $("#"+formId+" :input").each(function(index,element) {
            $(element).prop('value','');
       });
       $("#"+formId+" option[value='']").prop("selected",true);
       $("#"+formId+" :checkbox").prop('checked',false);
   }

   function saveForm(obj,action,reload) {
    var form = $(obj).closest("form");
    var formId = form.attr("id");

    var operationType = $("#"+formId).attr('method');
    var data = $("#"+formId).serializeObject();
    if(selectedId) {
      data._id = selectedId;
    }
    invoke(operationType,action, JSON.stringify(data), function (result) {
        if(reload) {
            window.location.reload();
        } else {
            toastr.success("Saved")
        }
    }, function (err) {
      toastr.error("An error occurred when saving form: " + JSON.stringify(err));
    })
   }

   function deleteForm(obj,reload) {
    var form = $(obj).closest("form");
    var formAction = form.attr("action");
    invoke("DELETE",formAction+"/"+selectedId,JSON.stringify({id: selectedId}),function(result) {
        if(reload) {
            window.location.reload();
        } else {
            toastr.success("Deleted");
        }
    },function(err) {
      toastr.error("Unable to perform delete operation: "+JSON.stringify(err));
    });
   }

   function showingForm(formId) {
    resetForm(formId);
    $("#"+formId).attr('method','POST');
   }

   function loadForm(formId,path,objectId) {
    selectedId = objectId; //used for updating
    resetForm(formId);
    invoke("GET",path+"/"+objectId,null,function(json) {
      formData = JSON.parse(json);
      $("#"+formId+" :input").each(function(index,element) { //for every input in the form
        var formVal = '';
        var attributeString = $(element).prop('name').replace(/\[(.*?)\]/g,"['$1']");
        if(attributeString && attributeString !== "") {
          try {
            formVal = eval("formData."+attributeString);
          } catch(e) {
            console.log(e.message);
            return;
          }
        }
        if(formVal !== undefined) {
          if(element.multiple) { //multiple select box
              $(element).prev().find("li:contains('"+formVal+"')").trigger('click');
          } else {
            if(element.tagName.toUpperCase() === "SELECT") {
              $(element).val(formVal);
              $(element).trigger("change"); //trigger onchange event
            } else if($(element).is(":checkbox")) {
              $(element).prop('checked',true); //always set to true, because field would otherwise not be returned from db
            } else {
              if(moment(formVal, moment.ISO_8601, true).isValid() && typeof formVal == 'string') { //is valid date String
                var date = formVal.substring(0,formVal.indexOf('T'));
                $(element).prop('value',date);  //set string values
              } else {
                $(element).prop('value',formVal);  //set string values
              }
            }
          }
        }
      });
      $("#"+formId).attr('method','PATCH');
    }, function(err,reason) {
      toastr.error("Unable to load form: "+reason);
    });
  }

  function invoke(method,url, data, success, error) {
    $.ajax({
      type: method,
      url: url,
      cache: false,
      dataType: 'json',
      contentType: 'application/json',
      data: data,
      success: success,
      error: error
    });
  }