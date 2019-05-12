var sass = require('sass');
var fs = require('fs-extra');
var glob = require('glob');
var path = require('path');



var temp = './temp';
var src = './src';
var output = './dist';


if(!fs.existsSync(temp)){
    fs.mkdirSync(temp);
}

if(!fs.existsSync(output)){
    fs.mkdirSync(output);
}

fs.copySync(src,temp)


glob.sync(temp+"/ui/**/*.scss").forEach((file) => {
    var css = sass.renderSync({file: file}).css;
    var outFile =  path.dirname(file)+"/"+path.basename(file,'.scss')+".css";
    fs.writeFileSync(outFile, css);
    fs.unlink(file);
});

glob.sync(temp+"/ui/**/*.{css,js}").forEach((file)=>{
    var extension = path.extname(file);
    var contents = fs.readFileSync(file).toString();

    var openTag, closeTag;

    switch(extension){
        case ".js":
            openTag="<script type='text/javascript'>";
            closeTag="</script>";
            break;
        case ".css":
            openTag="<style type='text/css'>";
            closeTag="</style>";
            break;
        default:
            openTag="";
            closeTag="";
            break;
    }

    var contents = openTag+"\n"+contents+"\n"+closeTag;

    fs.writeFileSync(file+".html", contents);

    fs.unlink(file);

});


fs.copySync(temp,output);

fs.removeSync(temp);
