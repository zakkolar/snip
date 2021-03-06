$(function(){
    $('#type').change(function(e){
        switch($('#type').val()){
            case 'general':
                $('.question').hide();
                break;
            case 'question':
                $('.question').css('display','inline-block');
                break;

        }
    });

    $('#increment').click(function(){
        $('#question_number').val(function(){
            return parseInt($(this).val()) + 1;
        })
    });

    $('#decrement').click(function(){
        $('#question_number').val(function(){
            return Math.max(parseInt($(this).val())-1,1);
        })
    });

    $('#save').click(function(){
        addLoadingImage();
        google.script.run
            .withSuccessHandler(function(o){
                addLoadedImage();
                setFolderLink(o.folder_url);
            })
            .withFailureHandler(function(e){
                addError();
            })
            .saveCrop(cropper.cropper('getCroppedCanvas').toDataURL(), $('#type').val(), $('#question_number').val(), $('#is_answer').is(':checked'));
    });

    $('#folder_link').hide();
});

var num_loading = 0;
var num_loaded = 0;
var num_errors = 0;

var load_status = $('#loader');
var loading_icon = $('#loading_icon');
var loaded_icon = $('#loaded_icon');
var error_icon = $('#error_icon');
var folder_link = $('#folder_link');

/**
 * Update the HTML of the loader
 */
function refreshLoader(){
    $("#num_loaded").html(num_loaded);
    $("#num_loading").html(num_loading);
    $("#num_errors").html(num_errors);

    if(num_loading - (num_loaded + num_errors) > 0){
        showLoadingIcon();
    }
    else if(num_errors > 0){
        showErrorIcon();
    }
    else{
        showLoadedIcon();
    }
}


/**
 * Show the loading icon and hide all others
 */
function showLoadingIcon(){
    load_status.show();
    loading_icon.show();
    loaded_icon.hide();
    error_icon.hide();
}

/**
 * Show the loaded icon and hide all others
 */
function showLoadedIcon(){
    load_status.show();
    loading_icon.hide();
    loaded_icon.show();
    error_icon.hide();
}

/**
 * Show the error icon and hide all others
 */
function showErrorIcon(){
    load_status.show();
    loading_icon.hide();
    loaded_icon.hide();
    error_icon.show();
    $('#error_message').show();
}

/**
 * Increase the number of loading images and show the user the progress
 */
function addLoadingImage(){
    num_loading++;
    refreshLoader();
}

/**
 * Increase the number of loaded images and show the user the progress
 */
function addLoadedImage(){
    num_loaded++;
    refreshLoader();

}

/**
 * Increase the number of errors and show the user the progress
 */
function addError(){
    num_errors++;
    refreshLoader();
}

/**
 * Update the folder link's href to the current URL
 * @param url The URL of the folder
 */
function setFolderLink(url){
    folder_link.show();
    folder_link.attr('href',url);
}