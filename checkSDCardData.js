var system = require('system');

var process = require("child_process")
var fs = require('fs')
var spawn = process.spawn
var execFile = process.execFile

var downloadedFiles = []
var fileName = './downloads.json'

// give ip as first Argument
// folder on SDCard as second
var ip = system.args[1];
var picFolderOnSDCard = system.args[2]

var child

// console.log(ip)


function checkForPicFile(filename) {
    fileEnding = filename.substr((~-filename.lastIndexOf(".") >>> 0) + 2);
    if (fileEnding.toLowerCase() == "jpg" || fileEnding.toLowerCase() == "png" || fileEnding.toLowerCase() == "jpeg") {
        return true
    }
}

function getFileNameFromFullPath(fullPath) {
    return fullPath.replace(/^.*[\\\/]/, '');
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function diffArrays (A, B) {

  var strA = ":" + A.join("::") + ":";
  var strB = ":" +  B.join(":|:") + ":";

  var reg = new RegExp("(" + strB + ")","gi");

  var strDiff = strA.replace(reg,"").replace(/^:/,"").replace(/:$/,"");

  var arrDiff = strDiff.split("::");

  return arrDiff;
}

function diffArrays (a,b) {
    var x = new JS.Set(a);
    var y = new JS.Set(b);

    z = x.difference(y)
    return Array.from(z)
}

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};


// Start phantom page thingy

var page = require('webpage').create();

page.onConsoleMessage = function(msg) {
    system.stderr.writeLine('console: ' + msg);
};

var pageUrl = 'http://' + ip + picFolderOnSDCard
console.log(pageUrl);



function startPageLoad() {
    page.open(pageUrl, function(status) {
        // console.log('Status: ' + status)
        if (status == 'success') {
        } else {
            setTimeout(startPageLoad(), 100000);
        }     
    });
    // page.close();
}

function downLoadAndDeleteImageTEST(imageArray) {
    console.log(imageArray)
}

function downLoadAndDeleteImage(imageArray) {
   try {
        f = fs.open(fileName, "r");
        content = f.read();
        downloadedFiles = JSON.parse(content);
    } catch (e) {
        console.log(e);
    }


    console.log("donwloaded Array = " + downloadedFiles)
    console.log("to Download array = " + imageArray)
    // arrayDiffs = diffArrays(imageArray, downloadedFiles)
    arrayDiffs = imageArray.diff(downloadedFiles)
    console.log("Diff = " + arrayDiffs)
    
    downloadFiles(arrayDiffs);

    // var runLoop = true;



    // while (runLoop) {
    //     console.log("outer looping")

        
    //     var wgetAddress = 'http://' + ip + arrayDiffs[0];
    //     console.log("arrayDiff first element " + arrayDiffs[0] + "\n\n")
    //     console.log("arrayDiff before inner loop " + arrayDiffs)
    //     console.log(innerLoop)




    //     while (innerLoop) {  
    //         if (typeof child == 'undefined') {
    //             var child = spawn("wget", ['-t 1', '-T 10', wgetAddress]);

    //         }
    //         child.on("exit", function (code) {
    //             console.log("child callback")
    //             if (code == '0') { 
    //                 downloadedFiles.push(element) 
    //                 fs.write(fileName, JSON.stringify(downloadedFiles), 'w')
    //                 console.log("write to downloads.json")
    //             } else {
    //                 // remove pic if wget was unsuccesful 
    //                 console.log('Wget errorCode: ' + code)
    //                 spawn('rm', [getFileNameFromFullPath(element)]);
    //                 console.log('removed' + getFileNameFromFullPath(element))
    //             }
    //             innerLoop = false;
    //         })
    //         console.log(child.pid)
    //         sleep(2000);
    //         console.log("looping")
    //         // console.log(child.pid)
    //         console.log(innerLoop)
            
            
    //     }
    //     // delete child;
    //     console.log(innerLoop)
    //     removedElement = arrayDiffs.shift();


    //     console.log("arrayDiff after inner loop " + arrayDiffs)
    //     if (arrayDiffs.length == 0) {
    //         runLoop = false;
    //     }


    
    // }
        
}



function downloadFiles(urlArray) {
    console.log("download files form array " + urlArray)
    if (urlArray.length == 0) {phantom.exit(2)}

    var wgetAddress = 'http://' + ip + urlArray[0];
    var child = spawn("wget", ['-t 1', '-T 10', wgetAddress]);
    
        // child.on("exit", spawnOnExit(code));

    child.on("exit", function (code) {
        console.log("child callback Code: " + code);

        if (code == '0') { 
            downloadedFiles.push(urlArray[0]); 
            fs.write(fileName, JSON.stringify(downloadedFiles), 'w')
            console.log("write to downloads.json")
            removedElement = urlArray.shift();
            console.log(urlArray)
        } else {
            // remove pic if wget was unsuccesful 
            console.log('Wget errorCode: ' + code)
            spawn('rm', [getFileNameFromFullPath(urlArray[0])]);
            console.log('removed' + getFileNameFromFullPath(urlArray[0]))
            phantom.exit(1)
        }
        if (urlArray.length > 0) {
            downloadFiles(urlArray)
        } else {
            phantom.exit(2)
        }
    });
}





    // imageArray.forEach(function(element, index, array) {

    //     if (checkForPicFile(element)) {
    //         if (downloadedFiles.indexOf(element) < 0) {
    //             var wgetAddress = 'http://' + ip + element;
                
    //             // downloadFile(wgetAddress);
    //             var child = spawn("wget", ['-t 1', '-T 10', wgetAddress]);
    //                 console.log("download")
                
    //             child.on("exit", function (code) {
    //                 if (code == '0') { 
    //                     downloadedFiles.push(element) 
    //                     fs.write(fileName, JSON.stringify(downloadedFiles), 'w')
    //                     console.log("write to downloads.json")
    //                 } else {
    //                     // remove pic if wget was unsuccesful 
    //                     console.log('Wget errorCode: ' + code)
    //                     spawn('rm', [getFileNameFromFullPath(element)]);
    //                     console.log('removed' + getFileNameFromFullPath(element))
    //                 }
    //             })
                
    //             console.log(element);
    //         }
    //     }
    //      // } else { console.log("false") }
            
    // })
    // console.log(downloadedFiles)
    // phantom.exit();
// }




// function downloadFile(fullFileURL) {
//     execFile("wget", ['-t 1', '-T 10', fullFileURL], null, function (err, stdout, stderr) {
//         console.log(err);
//         console.log("execFileSTDOUT:", JSON.stringify(stdout))
//         console.log("execFileSTDERR:", JSON.stringify(stderr))
//     })
// }

// setTimeout(startPageLoad(), 10000)
startPageLoad();



page.onCallback = function(data) {
    var images = data;
    // console.log('CALLBACK: ' + JSON.stringify(data));
    // Prints 'CALLBACK: { "hello": "world" }'
    downLoadAndDeleteImage(images);
}
// console.log(images);
// phantom.exit();

phantom.onError = function(msg, trace) {
  var msgStack = ['PHANTOM ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
    });
  }
  console.error(msgStack.join('\n'));
  phantom.exit(1);
};
