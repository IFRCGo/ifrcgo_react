$('#breadcrumb').html('<b>ERU Readiness</b>');

$.ajax({
	url:'https://proxy.hxlstandard.org/data.json?strip-headers=on&url=https%3A//docs.google.com/spreadsheets/d/1n1SDhAOYxeMXqjlFZccV0G8bZJIy_tkE3KOP8dKhBNg/edit%23gid%3D1810148653',
	dataType: 'json',
    success: function(data) {
    	initGrid(hxlProxyToJSON(data,false));
    }
});

function hxlProxyToJSON(input,headers){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            keys = e;
        }
        if(headers==true && i>1){
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
        if(headers!=true && i>0){
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}

function getUniques(data,key){
	var uniques = [];
	data.forEach(function(d){
		if(uniques.indexOf(d[key])==-1){
			uniques.push(d[key]);
		}
	});
	return uniques
}

function findMatch(data,country,sector){
	found=false;
	data.forEach(function(d){
		if(d['#org']==country&&d['#sector']==sector){
			found=true;
		}
	});
	return found;
}

function initGrid(data){
	var countries = getUniques(data,'#org');
	var sectors = getUniques(data,'#sector');
	var rows = countries.length;
	var columns = sectors.length;
	var html = '<table>';
	for(c=0;c<columns;c++){
		if(c==0){
			html+='<tr><th>National Society</th>';
		}
		html+='<th>'+sectors[c]+'</th>';
	}
	html+='</tr>';	
	for(r=0;r<rows;r++){
		html+='<tr><td>'+countries[r]+'</td>';
		for(c=0;c<columns;c++){
			if(findMatch(data,countries[r],sectors[c])==true){
				html+='<td><div class="match"></div></td>';
			} else {
				html+='<td class="nomatch"></td>';
			}
			
		}
		html+='</tr>';
	}
	$('#grid').html(html);
}