/**
 *  main.js
 *
 *  Created by Junichi Kitano on 2013/05/15.
 * 
 *  Copyright (c) 2013, Fixstars Corporation
 *  All rights reserved.
 *  Released under the BSD 2-Clause license.
 *   http://flashair-developers.com/documents/license.html
 */
// JavaScript Document

var picsArray =[];

// Judge the card is V1 or V2.
function isV1(wlansd) {
    if ( wlansd.length == undefined || wlansd.length == 0 ) {
        // List is empty so the card version is not detectable. Assumes as V2.
        return false;
    } else if ( wlansd[0].length != undefined ) {
        // Each row in the list is array. V1.
        return true;
    } else {
        // Otherwise V2.
        return false;
    }
}
// Convert data format from V1 to V2.
function convertFileList(wlansd) {
    for (var i = 0; i < wlansd.length; i++) {
        var elements = wlansd[i].split(",");
        wlansd[i] = new Array();
        wlansd[i]["r_uri"] = elements[0];
        wlansd[i]["fname"] = elements[1];
        wlansd[i]["fsize"] = Number(elements[2]);
        wlansd[i]["attr"]  = Number(elements[3]);
        wlansd[i]["fdate"] = Number(elements[4]);
        wlansd[i]["ftime"] = Number(elements[5]);
    }
}
// Callback Function for sort()
function cmptime(a, b) {
    if( a["fdate"] == b["fdate"] ) {
        return a["ftime"] - b["ftime"];
    }else{
        return a["fdate"] - b["fdate"];
    }
}
// Show file list
function showFileList(path) {
    // Clear box.
    $("#list").html('');
    // Output a link to the parent directory if it is not the root directory.
    if ( path != "/" ) {
        // Make parent path
        var parentpath = path;
        if ( parentpath[parentpath.length - 1] != '/' ) {
            parentpath += '/';
        }
        parentpath += '..';
        // Make a link to the parent path.
        $("#list").append(
            $("<div></div>").append(
                $('<a href="' + parentpath + '" class="dir">..</a>')
            )
        );
    }
    $.each(wlansd, function() {
        var file = this;
        // Skip hidden file.
        if( file["attr"] & 0x02 ) {
            return;
        }
        // Make a link to directories and files.
        var filelink = $('<a></a>').attr('href',file["r_uri"]+'/'+file["fname"]);
        var caption = file["fname"];
        var fileobj = $("<div></div>");
        // Append a file entry or directory to the end of the list.
        $("#list").append(
            fileobj.append(
                filelink.append(
                    caption
                )
            )
        );
        if (checkForPicFile(file["fname"])) {
            picsArray.push(file['r_uri'] + '/' + file["fname"]);   
        }
    });     
}

function checkForPicFile(filename) {
    fileEnding = filename.substr((~-filename.lastIndexOf(".") >>> 0) + 2);
    if (fileEnding.toLowerCase() == "jpg" || fileEnding.toLowerCase() == "png" || fileEnding.toLowerCase() == "jpeg") {
        return true
    }
}

function polling() {
    var url="/command.cgi?op=102";
    $.get(url, function(data) {
        if ( $.trim(data) == "1" ) {
            // console.log(picsArray)
            if (typeof window.callPhantom === 'function') {
                window.callPhantom(picsArray);
            }
            location.reload(true);
            // picsArray = [];
            // currentPath = location.pathname;
            // getFileList('DCIM');
        }
    });
}

// Document Ready
$(function() {
    if ( isV1(wlansd) ) {
        convertFileList(wlansd);
    }
    wlansd.sort(cmptime);
    showFileList(location.pathname);

    if (typeof window.callPhantom === 'function') {
        window.callPhantom(picsArray);
    }

    // setInterval(polling, 5000);
});

