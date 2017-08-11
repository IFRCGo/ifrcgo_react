function getReports(id,geom){
	$.ajax({url: "/data/country/"+id,
		dataType:'json',
		success: function(result){
			console.log(result);
			$('#breadcrumb').html('<a href="/fieldreports">Field Reports</a> > <b>'+name+'</b>');
			$('#title').html(result.summary);
			$('#countryname').html(result.countryname);
			initMap(geom,iso);
			disasterSeverity(result);
			disasterTypeAffected(result);
			disasterTypeCasInj(result);
			disasterTypeAssist(result);
			keystats(result);
			timeline(result);
    	}
    });
}

function keystats(data){
	$('#totalreports').html(data.length);
	var maxaffected = d3.max(data,function(d){return d.affected});
	$('#max').html(niceFormatNumber(maxaffected));
	var m = data.map(function(d) {
        return d.affected;
    }).sort(function(a, b) {
        return a - b;
    });
	var middle = Math.floor((m.length - 1) / 2);
    if (m.length % 2) {
        var median = m[middle];
    } else {
        var median = (m[middle] + m[middle + 1]) / 2.0;
    }
    $('#median').html(niceFormatNumber(median));

    var parseDate = d3.time.format("%Y-%m-%d").parse

    var maxdate = d3.max(data,function(d){return parseDate(d.date)});
    var mindate = d3.min(data,function(d){return parseDate(d.date)});
    var oneDay = 24*60*60*1000;
    var diffDays = Math.round(Math.abs((maxdate.getTime() - mindate.getTime())/(oneDay)));
    var peryear = data.length/(diffDays/365);
    $('#peryear').html(peryear.toFixed(1));
}

function timeline(data){

	var parseDate = d3.time.format("%Y-%m-%d").parse;

	var maxdate = new Date();
    var mindate = d3.min(data,function(d){return parseDate(d.date)});
    var maxyear = d3.max(data,function(d){return parseDate(d.date).getFullYear()});
    var minyear = d3.min(data,function(d){return parseDate(d.date).getFullYear()});

    var allyears = [];

    for (var i = minyear; i <= maxyear+1; i++) {
    	allyears.push(i);
	}

    var height = 1500+25*data.length;
    var width = $('#timeline').width();

    var scale = d3.time.scale()
            .range([0, height])    
            .domain([maxdate,mindate]);

    var svg = d3.select("#timeline")
            .append("svg")
            .attr("width", width)
            .attr("height", height+50)
            .append("g");     
            
    svg.append("line")
        .attr("x1", width/2)
        .attr("y1", 0)
        .attr("x2", width/2)
        .attr("y2", height)
        .attr("stroke-width", 2)
        .attr("stroke", "black");

    svg.selectAll(".ticks")
    	.data(allyears)
        .enter()
        .append("line")
        .attr("x1", width/2)
        .attr("y1", function(d){return scale(new Date(d,1,1))})
        .attr("x2", width/2+20)
        .attr("y2", function(d){return scale(new Date(d,1,1))})
        .attr("stroke-width", 2)
        .attr("stroke", "black");

	svg.selectAll(".ticks")
        .data(allyears)
        .enter()
        .append("text")
        .attr("x", width/2+30)
        .attr("y", function(d){return scale(new Date(d,1,1))})
        .attr("dy", ".35em")
        .attr("class","ticklabel")
        .text(function(d) {
                return d;
        });


    svg.selectAll('.reports')
    	.data(data)
    	.enter()
    	.append("circle")
        .attr("cx", function(d) {
            return width/2
        })
        .attr("cy", function(d) {
            return scale(parseDate(d.date));
        })
        .attr("r", function(d){
        	return Math.log(d.affected+1)*2+10;
        })
        .attr("opacity",0.5)
        .attr("fill","#D33F49");

    var lastleft = 0;
    var lastright = 0;

    var lines = [];

    svg.selectAll('.reports')
    	.data(data)
    	.enter()
        .append("text")
        .attr("x", function(d,i){return width/2-80+160*(i % 2)})
        .attr("y", function(d,i){
        	var y= scale(parseDate(d.date));
        	if(i % 2==1){
        		var last = lastright;
        	} else {
        		var last = lastleft;
        	}
        	if(y<last+20){
        		y=last+20
        	}
        	if(i % 2==1){
        		lastright = y;
        	} else {
        		lastleft = y;
        	}
        	lines.push({'y':scale(parseDate(d.date)),'newy':y, 'affected': d.affected})
        	return y
        })
        .attr("dy", ".35em")
        .attr("class","reporttitle")
        .attr("text-anchor",function(d,i){
        	if(i % 2 ==1){
        		return "start";
        	} else {
        		return "end";
        	}
        	
        })
        .text(function(d) {
                return d.summary + ' (Affected: '+niceFormatNumber(d.affected)+', Assisted: '+niceFormatNumber(d.assisted)+')';
        })
        .on('click',function(d){
        	//need to fix this when in final system to pic url up from backend
        	var url = 'https://'+document.location.hostname+'/fieldreport/'+d.id;
        	window.open(url, '_blank');
        });

        svg.selectAll('.reports')
        	.data(lines)
        	.enter()
        	.append('line')
        	.attr('x1',function(d,i){
        		return (width/2)-(Math.log(d.affected+1)*2+10)+(Math.log(d.affected+1)*2+10)*2*(i % 2);
        	})
        	.attr('x2',function(d,i){
        		return width/2-70+140*(i % 2);
        	})
        	.attr('y1',function(d,i){
        		return d.y
        	})
        	.attr('y2',function(d,i){
        		return d.newy
        	})
        	.attr("stroke-width", 1)
			.attr("stroke", "#cccccc");
}

function disasterSeverity(reports){
	var disastersize = new Array(6).fill(0);
	reports.forEach(function(r){
		if(r.affected==0){
			disastersize[0]+=1;
		} else if (r.affected<100){
			disastersize[1]+=1;
		}  else if (r.affected<1000){
			disastersize[2]+=1;
		}  else if (r.affected<10000){
			disastersize[3]+=1;
		}  else if (r.affected<100000){
			disastersize[4]+=1;
		} else {
			disastersize[5]+=1;
		}
	});
	var chart = c3.generate({
        bindto: '#disastersize',
        padding: {
            left: 60
        },
        data: {
            x: 'x',
            columns:
            [
                ['x', '0', '1 - 99','100 - 999', '100 - 9,999', '10,000 - 99,999','100,000+'],
                ['count'].concat(disastersize)
            ],
            type: 'bar'
        },
        axis: {
            rotated: true,
            x: {
                type: 'category'
            }
        },
        color: {pattern:['#D33F49']}
	});

}

function disasterTypeAffected(reports){
	var distype = {};
	reports.forEach(function(r){
		if(r.disastertype in distype){
			distype[r.disastertype]+=r.affected;
		} else {
			distype[r.disastertype]=r.affected;
		}
	});
	var keys =['x'];
	var values = ['value'];
	for (key in distype){
		keys.push(key);
		values.push(distype[key]);
	}
	var chart = c3.generate({
        bindto: '#disastertypeAffected',
        padding: {
            left: 80
        },
        data: {
            x: 'x',
            columns:
            [
                keys,
                values
            ],
            type: 'bar'
        },
        axis: {
            rotated: true,
            x: {
                type: 'category'
            }
        },
        color: {pattern:['#D33F49']}
	});
	var i=0
	d3.select('#disastertypeAffected').select('.c3-axis-y').selectAll('.tick').selectAll('text').attr('opacity',function(d){
		i++
		if(i % 3==0){
			return 1;
		} else {
			return 0;
		}
	})

}

function disasterTypeCasInj(reports){
	var distype = {};
	reports.forEach(function(r){
		if(r.disastertype in distype){
			distype[r.disastertype]+=r.casualties+r.injured;
		} else {
			distype[r.disastertype]=r.casualties+r.injured;
		}
	});
	var keys =['x'];
	var values = ['value'];
	for (key in distype){
		keys.push(key);
		values.push(distype[key]);
	}
	var chart = c3.generate({
        bindto: '#disastertypeCasInj',
        padding: {
            left: 80
        },
        data: {
            x: 'x',
            columns:
            [
                keys,
                values
            ],
            type: 'bar'
        },
        axis: {
            rotated: true,
            x: {
                type: 'category'
            }
        },
        color: {pattern:['#D33F49']}
	});
	var i=0
	d3.select('#disastertypeCasInj').select('.c3-axis-y').selectAll('.tick').selectAll('text').attr('opacity',function(d){
		i++
		if(i % 3==0){
			return 1;
		} else {
			return 0;
		}
	});

}


function disasterTypeAssist(reports){
	var distype = {};
	reports.forEach(function(r){
		if(r.disastertype in distype){
			distype[r.disastertype]+=r.assisted;
		} else {
			distype[r.disastertype]=r.assisted;
		}
	});
	var keys =['x'];
	var values = ['value'];
	for (key in distype){
		keys.push(key);
		values.push(distype[key]);
	}
	var chart = c3.generate({
        bindto: '#disastertypeAssist',
        padding: {
            left: 80
        },
        data: {
            x: 'x',
            columns:
            [
                keys,
                values
            ],
            type: 'bar'
        },
        axis: {
            rotated: true,
            x: {
                type: 'category'
            },
            y: {
            	count: 4
            }
        },
        color: {pattern:['#D33F49']}
	});
	var i=0
	d3.select('#disastertypeAssist').select('.c3-axis-y').selectAll('.tick').selectAll('text').attr('opacity',function(d){
		i++
		if(i % 3==0){
			return 1;
		} else {
			return 0;
		}
	})

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
			getReports(id,geom);			
    	}
    });