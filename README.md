# WebmapPlayground

This tool is just meant to quickly generate an Angular Playground
Sandbox config, so you can start enjoying your WebMap templates using Angular Playground


An example of how to use it is:

node index.js /Users/mauriciorojas/WebMAPDemos/src/WFNet/SKS/SKS_Web/Upgraded/sks-angular/src/app/components/sks/frm-customers/frm-customers.component.html /Users/mauriciorojas/WebMAPDemos/src/WFNet/SKS/SKS_Web/Upgraded/sks-angular/src/app SKS

Also note that you might need to copy the styles section to look like
"src/styles.css",
"node_modules/@progress/kendo-theme-default/dist/all.css",

In some cases I have needed to modify the index.html adding links to web fonts for example:

<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
rel="stylesheet" />


I hope you enjoy it.

Atte.
Mauricio Rojas

