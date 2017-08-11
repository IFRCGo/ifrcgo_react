function getReport(id,geom){
	$.ajax({url: "../data/report/"+id,
		dataType:'json',
		success: function(result){
			$('#breadcrumb').html('<a href="/fieldreports">Field Reports</a> > <b>'+result.summary+'</b>');
			$('#title').html(result.summary);
			$('#countryname').html(result.countryname);
			$('#summary').html(result.briefsummary.replace(/\r?\n/g, '<br />'));
			$('#actiontaken').html(result.actiontaken.replace(/\r?\n/g, '<br />'));
			$('#actiontakenbyothers').html(result.actiontakenbyothers.replace(/\r?\n/g, '<br />'));
			$('#actiontakenbypns').html(result.actiontakenbypns.replace(/\r?\n/g, '<br />'));
			$('#actiontakenbyfederation').html(result.actiontakenbyfederation.replace(/\r?\n/g, '<br />'));
			$('#overview').html(genFieldReportOverview(result));
			initMap(geom,result.countryid);
    	}
    });
}

function initMap(geom,countryID){
	console.log(countryID);
	var width = $('#mapfr').width(),
    height =  $('#mapfr').height();

	var svg = d3.select("#mapfr").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .append('g');

	var projection = d3.geo.mercator()
	    .center([0, 0])
	    .scale(width/6.2)
	    .translate([width / 2, height / 2]);

	var path = d3.geo.path().projection(projection);    

	svg.selectAll("path")
      .data(geom.features)
      .enter().append("path")
      .attr("d", path)
      .attr('class',function(d){
      	if(d.properties.ISO_A3 == countryID){
      		return 'country selected'
      	} else {
      		return 'country'
      	}
      })
      .attr('id',function(d){
      	return 'country'+d.properties.ISO_A3;
      });

      var bounds = d3.select('#country'+countryID).node().getBBox()
	      dx = bounds.width,
	      dy = bounds.height,
	      x = bounds.x+bounds.width/2,
	      y = bounds.y+bounds.height/2,
	      scale = .15 / Math.max(dx / width, dy / height),
	      translate = [width / 2 - scale * x, height / 2 - scale * y];

	  svg.transition()
	      .duration(750)
	      .style("stroke-width", 1.5 / scale + "px")
	      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}

function genFieldReportOverview(fr){
	var html = '';
	var cls="col-sm-2 col-xs-4 keyfiguretitle";
	html+='<p class="titledesc">'+fr.date+'</p>';
	html+='<p class="titledesc">'+fr.disastertype+'</p>';
    html+='<div class="row">';
    html+='<div class="'+cls+'"><p>Injured</p><p class="keyfigure">'+niceFormatNumber(fr.injured)+'</p></div><div class="'+cls+'"><p>Casualties</p><p class="keyfigure">'+niceFormatNumber(fr.casualties)+'</p></div><div class="'+cls+'"><p>Affected</p><p class="keyfigure">'+niceFormatNumber(fr.affected)+'</p></div><div class="'+cls+'"><p>Displaced</p><p class="keyfigure">'+niceFormatNumber(fr.displaced)+'</p></div><div class="'+cls+'"><p>Missing</p><p class="keyfigure">'+niceFormatNumber(fr.missing)+'</p></div>';
    html+='</div><div class="row"><div class="col-md-12"><p>Response</p></div></div><div class="row">';
    html+='<div class="'+cls+'"><p>Staff</p><p class="keyfigure">'+niceFormatNumber(fr.staff)+'</p></div><div class="'+cls+'"><p>Volunteers</p><p class="keyfigure">'+niceFormatNumber(fr.volunteers)+'</p></div><div class="'+cls+'"><p>Assisted</p><p class="keyfigure">'+niceFormatNumber(fr.assisted)+'</p></div><div class="'+cls+'"><p>Delegates</p><p class="keyfigure">'+niceFormatNumber(fr.delegates)+'</p></div>';
    html+='</div></div>';
    return html;
}

function niceFormatNumber(num,round){
	if(isNaN(num)){
		return num;
	} else {
		if(!round){
			var format = d3.format("0,000");
			return format(num);
		} else {
			var output = d3.format(".4s")(num);
	        if(output.slice(-1)=='k'){
	            output = Math.round(output.slice(0, -1) * 1000);
	            output = d3.format("0,000")(output);
	        } else if(output.slice(-1)=='M'){
	            output = d3.format(".1f")(output.slice(0, -1))+' million';
	        } else if (output.slice(-1) == 'G') {
	            output = output.slice(0, -1) + ' billion';
	        } else {
	            output = ''+d3.format(".3s")(num);
	        }            
	        return output;
		}
	}
}

$.ajax({url: geomurl,
		dataType:'json',
		success: function(result){
			var geom = topojson.feature(result,result.objects.geom);
			getReport(id,geom);			
    	}
    });

