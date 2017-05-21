/**
 * Counts the number of files in a particular folder that contain the given string in their own names.
 * @param str String to search for in existing files
 * @param folder Folder to search
 * @returns {number} Number of files that contain the given string in the Folder
 */
function countSimilarFiles(str, folder){
    let similar=0;
    const files = folder.getFiles();
    let file;
    while(files.hasNext()){
        file = files.next();
        if(file.getName().indexOf(str)>-1){
            similar++;
        }
    }
    return similar;
}

/**
 * Converts an embeddable image string to a Blob.
 * @param imgString Embeddable bas64 image string
 * @returns {Blob} Blob representing the image
 */
function getBlobFromEmbed(imgString){
    const parts = imgString.split(/[\s,:;]+/);
    const MIME = parts[1];
    const base64 = parts[3];

    const data=Utilities.base64Decode(base64);

    const blob = Utilities.newBlob(data, MIME);

    return blob;
}

/**
 * Creates an embeddable base64 image string from an image stored in Drive.
 * @param fileID ID of the existing Drive image file
 * @returns {string} Embeddable base64 image string
 */
function getEmbeddableImage(fileID){
    const file = DriveApp.getFileById(fileID);
    const blob = file.getBlob();
    const base64 = Utilities.base64Encode(blob.getBytes());
    const contentType = blob.getContentType();

    const embeddableURL = "data:"+contentType+";base64,"+base64;

    return embeddableURL;
}

/**
 * Get an OAuthToken for the UI to use for the Picker
 * @returns {any}
 */
function getOAuthToken() {
    DriveApp.getRootFolder();
    return ScriptApp.getOAuthToken();
}