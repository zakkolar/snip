/**
 * Create the Snip folder in the user's Google Drive. This is where all of the form folders will live.
 */
function createAppFolder(){
    var folder = DriveApp.createFolder(settings().folder_name);
    PropertiesService.getUserProperties().setProperty('appFolder',folder.getId());
}

/**
 * Create the folder for images specific to this form.
 */
function createFormFolder(){
    initAppFolder();
    const folder = getAppFolder().createFolder(getFormTitle());
    PropertiesService.getUserProperties().setProperty(getFormFolderKey(),folder.getId());
}

/**
 * Gets the title of the current form. NOTE: Due to a bug in the Google API, this sometimes returns an empty string. At the moment, the only workaround is for the user to manually change the title of the form and save it.
 * @returns {string} Title of the form
 */
function getFormTitle() {
    return getForm().getTitle();
}

/**
 * Check if the folder with the given ID exists in the user's Drive folder and is not in the Trash.
 * @param folderId ID of the folder to check
 * @returns {boolean} Whether the file exists and is not trashed
 */
function folderExists(folderId: string){
    let folder;
    try{
        folder = DriveApp.getFolderById(folderId);
    }
    catch(e){
        return false;
    }
    return !folder.isTrashed();
}

/**
 * Checks if the necessary folders exist; creates them if they don't
 */
function initFolders(){
    initAppFolder();
    initFormFolder();
}

/**
 * Checks if the app folder exists; if not, creates it.
 */
function initAppFolder(){
    if(!folderExists(getAppFolderId())) {
        createAppFolder();
    }
}

/**
 * Checks if the form folder exists; if not, creates it.
 */
function initFormFolder(){
    if(!folderExists(getFormFolderId())){
        createFormFolder();
    }
}

/**
 * Retrieves the ID of the app folder from storage. Returns null if the ID is not stored.
 * @returns {string|null} ID of the app folder
 */
function getAppFolderId(){
    const properties = PropertiesService.getUserProperties().getProperties();
    return properties['appFolder'] || null;
}

/**
 * Retrieves the ID of the form folder from storage. Returns null if the ID is not stored.
 * @returns {string|null} ID of the form folder
 */
function getFormFolderId(){
    const properties = PropertiesService.getUserProperties().getProperties();
    return properties[getFormFolderKey()] || null;
}

/**
 * Retrieves the App Folder.
 * @returns {Folder} App Folder
 */
function getAppFolder(){
    return DriveApp.getFolderById(getAppFolderId());
}

/**
 * Retrieves the Form Folder.
 * @returns {Folder} Form Folder
 */
function getFormFolder(){
    return DriveApp.getFolderById(getFormFolderId());
}

/**
 * Retrieves the ID of the current form.
 * @returns {string} ID of the current Form
 */
function getFormId(){
    return getForm().getId();
}

/**
 * Retrieves the active Form.
 * @returns {Form} The active Form
 */
function getForm(){
    return FormApp.getActiveForm();
}


/**
 * Gets the key to store/retrieve the current form's folder ID in the UserProperties.
 * @returns {string}
 */
function getFormFolderKey(){
    return 'formFolder-'+getFormId();
}


/**
 * Saves an image to the current user's Google Drive folder.
 * @param blob Blob containing the image
 * @param folder Folder in which to save the image
 * @param mode Mode of image - either "question" or "instruction"
 * @param question_number Question number (only required for image mode)
 * @param response Boolean indicating whether image is a response (only required for image mode)
 */
function saveImage(blob, folder, mode: string, question_number?: number, response?: boolean){
    blob.setName("New upload - will automatically be renamed shortly");
    let file = folder.createFile(blob);
    const lock = LockService.getDocumentLock();
    let name;
    // Make sure only one file gets named at a time. Otherwise, the names will overlap
    try {
        lock.waitLock(60000);
        name = generateImageName(folder, mode, question_number, response);
        file.setName(name);
        lock.releaseLock();
    } catch (e) {
        name = generateImageName(folder, mode, question_number, response, true);
        file.setName(name);
    }

}

/**
 * Generates the appropriate name for an image.
 * @param folder Folder in which to save the image
 * @param mode Mode of image - either "question" or "instruction"
 * @param question_number Question number (only required for image mode)
 * @param response Boolean indicating whether image is a response (only required for image mode)
 * @returns {string} Name of image
 */
function generateImageName(folder, mode: string, question_number: number, response: boolean, noCount = false){
    let name;
    switch(mode){
        case "question":
            name="Question "+question_number;
            if(response){
                name+=" Response ";
                if(!noCount) {
                    name += (countSimilarFiles(name, folder) + 1);
                }
            }
            else{
                name+=" part ";
                if(!noCount){
                    name+=(countSimilarFiles(name,folder)+1);
                }

            }
            break;
        default:
            name = "Instruction ";
            if(!noCount){
                name+=(countSimilarFiles(name,folder)+1);
            }
            break;
    }
    return name;
}

/**
 * Takes client-side data (including an image URL) and saves it to the Drive.
 * @param imgString Base64 embeddable image string
 * @param mode Mode of image - either "question" or "instruction"
 * @param question_number Question number (only required for image mode)
 * @param response Boolean indicating whether image is a response (only required for image mode)
 */
function saveCrop(imgString: string, mode: string, question_number: number, response: boolean){
    const blob = getBlobFromEmbed(imgString);
    saveImage(blob, getFormFolder(), mode, question_number, response);
    return {
        folder_url: getFormFolder().getUrl()
    };
}