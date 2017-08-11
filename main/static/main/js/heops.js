$('#breadcrumb').html('<b>Head of Operations Deployments</b>');

$.ajax({ 
    type: 'GET', 
    url: '/data/heops', 
    dataType: 'json',
    success:function(result){
    	var data = processData(result);
    	init(data);
    }
});

function processData(data){

	data.forEach(function(d){
		d['year'] = d.startdate.substring(0,4);
	});
	return data;
}

function init(data){

	console.log(data);
	var yearChart = dc.rowChart('#year');
	var regionChart = dc.rowChart('#region');
	var disastertypeChart = dc.rowChart('#disastertype');
	var roleChart = dc.rowChart('#role');

	var cf = crossfilter(data);

	cf.yearDim = cf.dimension(function(d){ return d['year']; });
	cf.regionDim = cf.dimension(function(d){ return d['zone']; });
	cf.disastertypeDim = cf.dimension(function(d){ return d['disaster']; });
	cf.roleDim = cf.dimension(function(d){ return d['deployed_role']; });

	cf.yearGroup = cf.yearDim.group();
	cf.regionGroup = cf.regionDim.group();
	cf.disastertypeGroup = cf.disastertypeDim.group();
	cf.roleGroup = cf.roleDim.group();

    yearChart.width($('#year').width()).height(350)
        .dimension(cf.yearDim)
        .group(cf.yearGroup)
        .elasticX(true)
        .colors(['#CCCCCC', '#E57373'])
        .colorDomain([0,1])
        .colorAccessor(function(d, i){return 1;})
        .xAxis().ticks(5);

    regionChart.width($('#region').width()).height(350)
        .dimension(cf.regionDim)
        .group(cf.regionGroup)
        .elasticX(true)
        .colors(['#CCCCCC', '#E57373'])
        .colorDomain([0,1])
        .colorAccessor(function(d, i){return 1;})
        .xAxis().ticks(5);

    disastertypeChart.width($('#disastertype').width()).height(350)
        .dimension(cf.disastertypeDim)
        .group(cf.disastertypeGroup)
        .elasticX(true)
        .colors(['#CCCCCC', '#E57373'])
        .colorDomain([0,1])
        .colorAccessor(function(d, i){return 1;})
        .ordering(function(d){ return -d.value })
        .xAxis().ticks(5);

    roleChart.width($('#role').width()).height(350)
        .dimension(cf.roleDim)
        .group(cf.roleGroup)
        .elasticX(true)
        .colors(['#CCCCCC', '#E57373'])
        .colorDomain([0,1])
        .colorAccessor(function(d, i){return 1;})
        .ordering(function(d){ return -d.value })
        .xAxis().ticks(5);

    dc.dataTable("#data-table")
         .dimension(cf.yearDim)                
         .group(function (d) {
             return d['year'];
         })
         .ordering(function(d){ return -d.value })
         .size(650)
         .columns([
             function(d){
                return d['startdate']; 
             },
             function(d){
                return d['enddate']; 
             },
             function(d){
                return d['zone']; 
             },
             function(d){
                return d['country']; 
             },
             function(d){
                return d['disaster']; 
             },
             function(d){
                return d['name']; 
             },
             function(d){
                return d['deployed_role'];
             },
             function(d){
                return d['comments'];
             }
         ]);         

    dc.renderAll();

    var g = d3.selectAll('#year').select('svg').append('g');
    
    g.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', $('#year').width()/2)
        .attr('y', 345)
        .text('Deployments');

    var g = d3.selectAll('#region').select('svg').append('g');
    
    g.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', $('#region').width()/2)
        .attr('y', 345)
        .text('Deployments');

    var g = d3.selectAll('#disastertype').select('svg').append('g');
    
    g.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', $('#disastertype').width()/2)
        .attr('y', 345)
        .text('Deployments');

    var g = d3.selectAll('#role').select('svg').append('g');
    
    g.append('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', $('#role').width()/2)
        .attr('y', 345)
        .text('Deployments');                
}

    $('#reset').on('click',function(){
        dc.filterAll();
        dc.redrawAll();
    });     