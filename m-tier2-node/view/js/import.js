var dropArea = document.getElementById('dropArea');
dropArea.addEventListener('dragenter',prevent,false);
dropArea.addEventListener('dragleave',prevent,false);
dropArea.addEventListener('dragover',prevent,false);
dropArea.addEventListener('drop',prevent,false);
dropArea.addEventListener('drop', handleDrop, false)
var filesToTransfer = [];

;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
})

$('#clear').on("click",function(e) {
    filesToTransfer.length = 0;
    $('#upload-table tbody').empty();
    $('#data-table').addClass('d-none');
});

$('#upload').on("click",function(e) {
    ([...filesToTransfer]).forEach(uploadFile);
});

$('#analyze').on("click",function(e) {
    document.location.href = "/import/analyze";
});

$('#import').on("click",function(e) {
    document.location.href = "/import/perform";
});

$('#upload-table').on("click",'.btn',function(e) {
    var fileToRemove = $(e.target).attr("name");
    for(var i=0;i < filesToTransfer.length; i++) {
        if(filesToTransfer[i].name === fileToRemove) {
            filesToTransfer.splice(i,1);
            $(e.target).parent().parent().remove();
            break;
        }
    }
    if(filesToTransfer.length == 0) {
        $('#upload-table tbody').empty();
        $('#data-table').addClass('d-none');
    }

});

function prevent(e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
    $('#dropArea').addClass("highlight");
    $('#dragText').addClass("highlight-text");
}

function unhighlight(e) {
    $('#dropArea').removeClass("highlight");
    $('#dragText').removeClass("highlight-text");
}

function handleDrop(e) {
    handleFiles(e.dataTransfer.files);
}

function handleFiles(files) {
  ([...files]).forEach(evaluateFile);
}

function validFileType(file) {
    if(file.type !== "text/csv") {
        toastr.error(file.name + " is not a supported file format");
        return false;
    }
    return true;
}

function notDuplicate(file) {
    for(var i=0;i < filesToTransfer.length; i++) {
        if(filesToTransfer[i].name === file.name) {
            return false;
        }
    }
    return true;
}

function evaluateFile(file) {
    if(validFileType(file)) {
        if(notDuplicate(file)) {
            $('#data-table').removeClass('d-none');
            filesToTransfer.push(file);
            var template = `
                <tr>
                    <td class="align-middle">${file.name}</td>
                    <td class="align-middle">${file.size}</td>
                    <td class='text-center'>
                        <button class='btn btn-sm btn-secondary' name='${file.name}'>
                            <i class='fa fa-times'></i>
                            Remove
                        </button>
                    </td>
                </tr>\n`;
            $('#upload-table tbody').append(template);
        } else {
            toastr.error("Ignoring "+file.name+". Duplicate file detected");
        }        
    }
}

function uploadFile(file) {
  var url = '/import/upload';
  var xhr = new XMLHttpRequest();
  var formData = new FormData();
  xhr.open('POST', url, true);

  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      toastr.success("Upload was successful");
      $('#upload').addClass('d-none');
      $('#analyze').removeClass('d-none');
      $('#analyze').addClass('wobble');
    } else if (xhr.readyState == 4 && xhr.status != 200) {
      toastr.error("Failed to upload transactions to server");
    }
  })

  formData.append('file', file);
  xhr.send(formData);
}