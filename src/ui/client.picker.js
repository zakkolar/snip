var DIALOG_DIMENSIONS = {
    width: 600,
    height: 425
};
var pickerApiLoaded = false;
var cropper;



function onApiLoad() {
    gapi.load('picker', {
        'callback': function () {
            pickerApiLoaded = true;
            $('#pick_image').click(function () {
                showPicker()
            }).prop('disabled',false).html("Select Image");
        }
    });

}

function createPicker(token) {
    if (pickerApiLoaded && token) {

        var docsView = new google.picker.DocsView()
            .setIncludeFolders(true)
            .setMimeTypes("image/png,image/jpeg,image/jpg");

        var uploadView = new google.picker.DocsUploadView();


        var picker = new google.picker.PickerBuilder()
            .addView(docsView)
            .addView(uploadView)
            .hideTitleBar()
            .setSize(DIALOG_DIMENSIONS.width - 2, DIALOG_DIMENSIONS.height - 2)
            .setOAuthToken(token)
            .setCallback(pickerCallback)
            .setOrigin('https://docs.google.com')
            .build();

        picker.setVisible(true);

    } else {
        showError('Unable to load the file picker.');
    }
}

function showPicker(){
    google.script.run.withSuccessHandler(createPicker)
        .withFailureHandler(showError).getOAuthToken();
}

/**
 * A callback function that extracts the chosen document's metadata from the
 * response object. For details on the response object, see
 * https://developers.google.com/picker/docs/result
 *
 * @param {object} data The response object.
 */
function pickerCallback(data) {
    var action = data[google.picker.Response.ACTION];
    if (action == google.picker.Action.PICKED) {
        var doc = data[google.picker.Response.DOCUMENTS][0];
        $('#save').prop('disabled',true);
        loadEmbeddableImage(doc.id, function(result){
            placeImage(result);
            $('#save').prop('disabled',false);
        });
        $('#snipper').html("<div id='big_loader'><svg class='big spinner' viewBox='0 0 66 66' xmlns='http://www.w3.org/2000/svg'><circle class='path' fill='none' stroke-width='6' stroke-linecap='round' cx='33' cy='33' r='30'></circle></svg></div>");
        $('.image-only').css('display','inline-block');

    }
}

function showError(message) {
    document.getElementById('snipper').innerHTML = 'Error: ' + message;
}

/**
 * Display the image and init the cropper
 * @param src The src of the image
 */
function placeImage(src){
    $('#snipper').html("<img src='"+src+"'>");
    cropper=$('#snipper img').cropper({
        dragMode:'move',
        toggleDragModeOnDblclick:false
    })
}

/**
 * Obtain the base64 embeddable version of an image in Drive and perform a function
 * @param id ID of the image in the user's Drive
 * @param callback Function to execute after retrieving the embeddable version
 */
function loadEmbeddableImage(id,callback){
    google.script.run.withSuccessHandler(callback).getEmbeddableImage(id);
}