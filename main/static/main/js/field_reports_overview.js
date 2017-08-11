function getLatest(length){
	$('#days').html(length);
	$.ajax({url: "data/latest/"+length,
		dataType:'json',
		success: function(results){
			var html ='';
			countries = [];
			var frs;
        	results.forEach(function(fr,i){
        		if(i==0){
        			frs=fr
        		} else {
        			for(key in frs){
        				frs[key] +=parseInt(fr[key]);
        			}
        		}
        		html+=genFieldReportOverview(fr,true);
        		countries.push(fr.countryid);
        	});
        	console.log(frs);
        	if(frs){
        		$('#keyfiguresoverview').html(genFieldReportOverview(frs,false));
        	} else {
        		$('#keyfiguresoverview').html();
        	}
        	$('#latest').html(html);
        	updateMap(countries);
    	}
    });
}

function genFieldReportOverview(fr,all){
	var html = '';
	var cls="col-sm-2 col-xs-4 keyfiguretitle";
	if(all){
		html+='<div class="fieldreportoverview"></div><h4><a href="fieldreport/'+fr.id+'">'+fr.summary+'</a></h4>';
	    html+='<p><a href="fieldreport/country/'+fr.countryid+'">'+fr.countryname+'</a> - '+fr.disastertype+' - '+fr.date+'</p></div>';
	    html+='<p>'+fr.briefsummary.substr(0,255)+'... <a href="fieldreport/'+fr.id+'">Read more</a></p>'
	}
    html+='<div class="row">';
    html+='<div class="'+cls+'"><p>Injured</p><p class="keyfigure">'+niceFormatNumber(fr.injured)+'</p></div><div class="'+cls+'"><p>Casualties</p><p class="keyfigure">'+niceFormatNumber(fr.casualties)+'</p></div><div class="'+cls+'"><p>Affected</p><p class="keyfigure">'+niceFormatNumber(fr.affected)+'</p></div><div class="'+cls+'"><p>Displaced</p><p class="keyfigure">'+niceFormatNumber(fr.displaced)+'</p></div><div class="'+cls+'"><p>Missing</p><p class="keyfigure">'+niceFormatNumber(fr.missing)+'</p></div>';
    html+='</div><div class="row"><div class="col-md-12"><p>Response</p></div></div><div class="row">';
    html+='<div class="'+cls+'"><p>Staff</p><p class="keyfigure">'+niceFormatNumber(fr.staff)+'</p></div><div class="'+cls+'"><p>Volunteers</p><p class="keyfigure">'+niceFormatNumber(fr.volunteers)+'</p></div><div class="'+cls+'"><p>Assisted</p><p class="keyfigure">'+niceFormatNumber(fr.assisted)+'</p></div><div class="'+cls+'"><p>Delegates</p><p class="keyfigure">'+niceFormatNumber(fr.delegates)+'</p></div>';
    html+='</div></div>';
    return html;
}


function initMap(geom){
	console.log(geom);
	var width = $('#mapfroverview').width(),
    height =  $('#mapfroverview').height();

	var svg = d3.select("#mapfroverview").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	var projection = d3.geo.mercator()
	    .center([0, 0])
	    .scale(width/6.2)
	    .translate([width / 2, height / 2]);    

	svg.selectAll("path")
      .data(geom.features)
      .enter().append("path")
      .attr("d", d3.geo.path().projection(projection))
      .attr('class','country')
      .attr('id',function(d){
      	return 'country'+d.properties.ISO_A3;
      });
}
function updateMap(countries){
	$('.country').removeClass('selected');

	countries.forEach(function(d){
		console.log('#country'+d);
		$('#country'+d).addClass('selected');
	});
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


$('#last7').on('click',function(){
	getLatest(7);
});

$('#last30').on('click',function(){
	getLatest(30);
});

$('#breadcrumb').html('<b>Field Reports</b>');

$.ajax({url: geomurl,
		dataType:'json',
		success: function(result){
			var geom = topojson.feature(result,result.objects.geom);
			initMap(geom);
			getLatest(7);
    	}
    });
