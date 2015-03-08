/*
	Copyright (c) 2014, Zhaofeng Li
	All rights reserved.
	Redistribution and use in source and binary forms, with or without
	modification, are permitted provided that the following conditions are met:
	* Redistributions of source code must retain the above copyright notice, this
	list of conditions and the following disclaimer.
	* Redistributions in binary form must reproduce the above copyright notice,
	this list of conditions and the following disclaimer in the documentation
	and/or other materials provided with the distribution.
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
	FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
	DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
	SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
	CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
	OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*
	Common code for all browsers
*/

var rlServer = "https://tools.wmflabs.org/refill";
var cgDefaultFormat = "CiteTemplateGenerator";

function CiteGen() {
	this.server = typeof rlServer !== 'undefined' ? rlServer
	            : "https://tools.wmflabs.org/fengtools/reflinks";
	this.format = "CiteTemplateGenerator";

	this.showPanel = function( panel ) {
		var panels = [ "confirmation", "loading", "error", "result" ];
		for ( var i = 0; i < panels.length; i++ ) {
			if ( panels[i] != panel ) {
				var id = "#panel-" + panels[i];
				$( id ).hide();
			}
		}
		var id = "#panel-" + panel;
		$( id ).show();
	}

	this.run = function( url ) {
		this.showPanel( "loading" );
		var api = this.server + "/api.php?action=citegen&format=" + encodeURIComponent( this.format ) + "&url=" + encodeURIComponent( url ) + "&callback=?";
		var obj = this;
		$.getJSON( api, function ( result ) {
			if ( result['success'] ) {
				$( "#result" ).val( result['citation'] );
				obj.showPanel( "result" );
			} else {
				$( "#error-description" ).text( result['description'] );
				obj.showPanel( "error" );
			}
		} );
	}
}

var cgObject = null;
$( document ).ready( function() {
	cgObject = new CiteGen();

	var format = localStorage.getItem( "format" );
	if ( format ) {
		$( "#format" ).val( format );
		cgObject.format = format;
	}
	$( "#format" ).change( function() {
		cgObject.format = $( this ).val();
		localStorage.setItem( "format", $( this ).val() );
	} );

	cgObject.showPanel( "confirmation" );

	$( "#run" ).click( function() {
		cgGlue.dispatch( cgObject );
	} );
	$( "#copytoclipboard" ).click( function() {
		cgGlue.copyToClipboard( $( "#result" ) );
	} );

	cgGlue.init( cgObject );
} );
