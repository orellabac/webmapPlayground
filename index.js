#!/usr/bin/env node
if (process.argv.length < 5) {
    console.log("WebMap for Angular Playground\r\n");
    console.log("=============================\r\n");
    console.log("Usage: npm pagemockforplayground fullpath_to_html_template directory_for_sandbox");
    process.exit(1);

}
var path = require('path');
// We need a replaceAll for the templates
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
var HTMLParser = require('node-html-parser');
var htmlfile = process.argv[2];
var outdir   = process.argv[3];
var module   = process.argv[4];

var normalizedhtmlfile = htmlfile.replace(".component","");
// we asume that the filename already follow the kebak format
var viewfilename = path.basename(normalizedhtmlfile).replace(".html","");

var fs = require("fs");

console.log("Reading file " + htmlfile);
var htmlfileContents = fs.readFileSync(htmlfile, 'utf-8');

console.log(htmlfileContents);
var root = HTMLParser.parse(htmlfileContents);
console.log("Done parsing template. Creating mockup model from html");


var model = {
    FormBorderStyle: 3,
    ControlCollectionChanged: true,
    PropertiesState: 0,
    TextInternal: "text",
    Enabled: true,
    Visible: true,
    Text: "text",
    IsForm: true,
    IsModalView: true,
    IsDisposed: false,
    IsMdiContainer: false,
    IsMdiChild: false
};


const regex = /\[model\]="model.(\w+)"/;

function populateModelFromTag(child) 
{
    switch(child.tagName) {
        case 'wm-window':
            model["Name"] = child.attributes["id"];
            break;

            
        default:

            var m = regex.exec(child.rawAttrs);
            if (m !== null)
            {
                var elementName = m[1];

                model[elementName] = { Name: child.attributes["id"], Enabled:true, Visible: true, "Text": "xxxx"};
                if (child.tagName == 'wm-label') {
                    model[elementName]["Text"] = child.text;
                }
            }
            else {
                //console.log("noooo");
            }
        break;

    }
}

function extractModel(root) {
    for(var childIndex =0;childIndex < root.childNodes.length; childIndex++) 
    {
        var child = root.childNodes[childIndex];
        if (child && child.tagName) {
            var tag = child.tagName;
            console.log(child.tagName);
            console.log(child.rawAttrs);           
            populateModelFromTag(child);
            extractModel(child);
         }
    }
}

extractModel(root);
console.log("Done building model");


var sandboxtemplate =
`
import { sandboxOf } from 'angular-playground';
import { AppComponent } from '../app.component';
import { WebMapKendoModule } from '@mobilize/winforms-components';
import { WebMapService, WebMapModule } from '@mobilize/angularclient';
import { @@moduleModule } from "../@@mlower.module";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';


import * as data_@@cunderscore from './@@component.model';



const sandboxConfig = {
  imports: [
    InputsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ButtonsModule,
    @@moduleModule, 
    WebMapKendoModule,
    WebMapModule,
    ],
  providers: [
    WebMapService
  ],
  label: '@@component'
};

export default sandboxOf(AppComponent, sandboxConfig)
   .add('@@component', 
  { ` +
'    template: ` <app-root></app-root><@@mlower-@@component [model]="model"></@@mlower-@@component>`, ' +
`
    context: 
    {
      model: data_@@cunderscore.model
    }
  });  
`;

var component = viewfilename;
var cunderscore = component.replaceAll("-","_");

var results = sandboxtemplate
.replaceAll("@@component", component)
.replaceAll("@@cunderscore", cunderscore)
.replaceAll("@@module", module)
.replaceAll("@@mlower",module.toLowerCase());

fs.mkdirSync(outdir + path.sep + "app", {recursive: true});
var modelfile  = outdir + path.sep + "app" + path.sep + viewfilename + ".model.ts";
var targetFile = outdir + path.sep + "app" + path.sep + viewfilename + ".sandbox.ts"


var modeltext = "var model = \r\n" + JSON.stringify(model, null, 4) + ";\r\n export { model };\r\n";
fs.writeFileSync(modelfile, modeltext);
fs.writeFileSync(targetFile, results);
console.log("done!");

console.log('NOTE: you might need to update your angular.json file. Find the angular-playground definition and add   "node_modules/jquery/dist/jquery.min.js" to the scripts sections' );
console.log(`
Also note that you might need to copy the styles section to look like
"src/styles.css",
"node_modules/@progress/kendo-theme-default/dist/all.css",

In some cases I have needed to modify the index.html adding links to web fonts for example:

<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
rel="stylesheet" />

`);