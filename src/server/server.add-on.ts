/**
 * Add the Snip menu to the Form UI
 */
function onOpen(e) {
    let menu = FormApp.getUi().createMenu('Snip');
    let aboutFunction;
    menu.addItem('Snip Images', 'showSnip');
    menu.addItem('View Snipped Images','showFolderLink');
    menu.addSeparator();
    if(e && e.authMode == ScriptApp.AuthMode.LIMITED){
        aboutFunction='showAboutAuthLimited';
    }
    else{
        aboutFunction='showAboutAuthNone';
    }
    menu.addItem('Instructions', aboutFunction);
    menu.addSeparator();
    menu.addToUi();
}

function onInstall(e){
    onOpen(e);
}

/**
 * Display the Snip popup
 */
function showSnip() {
    initFolders();

    var html = HtmlService.createTemplateFromFile('ui/Snip').evaluate()
        .setWidth(700)
        .setHeight(425)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    FormApp.getUi().showModalDialog(html, 'Snip Image');
}

/**
 * Display a popup with a link to the Google Drive Folder for the current form
 */
function showFolderLink() {
    var html = HtmlService.createTemplateFromFile('ui/FolderLink').evaluate()
        .setWidth(200)
        .setHeight(100)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    FormApp.getUi().showModalDialog(html, 'View Snipped Images');
}

/**
 * Show the instructions for AuthMode.NONE
 */
function showAboutAuthNone(){
    showAbout(ScriptApp.AuthMode.NONE);
}

/**
 * Show the instructions for AuthMode.LIMITED
 */
function showAboutAuthLimited(){
    showAbout(ScriptApp.AuthMode.LIMITED);
}

/**
 * Show the instructions
 * @param authMode the AuthMode for the application (ScriptApp.AuthMode.NONE or ScriptApp.AuthMode.LIMITED)
 */
function showAbout(authMode){
    var html = HtmlService.createTemplateFromFile('ui/Instructions');
    html.data={
        authMode:authMode
    };
    html = html.evaluate()
        .setWidth(700)
        .setHeight(425)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);

    FormApp.getUi().showModalDialog(html, 'Instructions');
}

/**
 * Include a partial file in an HTML template
 * @param filename The name of the file to be included (without the .html extension)
 * @returns Content from the HTML file
 */
function include(filename) {
    return HtmlService.createTemplateFromFile(filename)
        .getRawContent();
}