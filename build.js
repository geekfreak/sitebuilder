"use strict";

const DEBUG     = true;
const LOG       = console.log;
const WORKSHEET = 1;
const GS        = require( "google-spreadsheet" );
const FS        = require( "fs" );
const jsB       = require( "js-beautify" ).js_beautify;

let base         = "src"
,   templates    = [ base, "templates" ].join( "/" )
,   tmp          = [ base, "tmp" ].join( "/" )
,   translations = { "data": { "languages" : { "en":"en", "es":"es" } } }
,   documentId   = "0AnRyC36d2KeKdE12Q3ZkdkhkWTZ0MDFBcEtSNEEyUFE"
,   spreadsheet  = new GS( documentId );

DEBUG && LOG( "process.versions.node" , process.versions.node );
DEBUG && LOG( "process.versions.v8"   , process.versions.v8 );
DEBUG && LOG( "process.argv"          , process.argv );

function parser( rows ) {

  rows.forEach( function( row ) {
    translations.data[ row.key ] = {};
    Object.keys(translations.data.languages).forEach( function( language ) {
      translations.data[row.key][language] = row[language].replace(/\n/,"");
    });
  });

  let unusedKeys = translations.data;

  function processTemplate( template ) {

    let transFile = ( tmp + "/translations.json" );

    FS.writeFile( transFile, jsB( JSON.stringify( translations.data ) ), function( err ) { console.log( err ? err : [ transFile, " saved!" ].join( "" ) ); });

    Object.keys(translations.data.languages).forEach( function( language ) {

      let copydata  = template
      ,   indexFile = ( tmp + "/index." + language + ".html" ).replace( ".en", "" );

      for ( let key in translations.data ) {
        let regexpr       = new RegExp( "##" + key + "##", "g" )
        ,   localizedText = translations.data[ key ][ language ] || translations.data[ key ].en;

        if (copydata.includes("##" + key + "##")) { // remove used keys to provide unused list after processing
         delete unusedKeys[key];
        }
        copydata = copydata.replace( regexpr , localizedText );
      }
      FS.writeFile( indexFile, copydata, function( err ) { console.log( err ? err : [ indexFile, " saved!" ].join( "" ) ); });
    });
    DEBUG && LOG("unused:\n",unusedKeys);
  }
   FS.readFile(  [templates, "/index.template"].join("/"), "utf8", function( err, template ) { err ? console.error( err ) :  processTemplate( template ); } );
}

spreadsheet.getRows( WORKSHEET , function( err , rows ) { err ? console.error( err ) :  parser( rows ); } );
//spreadsheet.getRows( WORKSHEET , ( err, rows ) => err ? throw( err ) :  parser( rows ) );
//
