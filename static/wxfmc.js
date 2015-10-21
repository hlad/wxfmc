var socket = null

function fmc_click(w)
{
	console.log(this.id);
	var id=this.id;
	a=id.split('_');
	b=a[1];
	
	if (b&&a[0]=='fmc')
	{
		vibrate();
		if (b=='14')
		{
			$(this).toggleClass('fmcBtnAct');
		} else
		{
			$(this).addClass('fmcBtnCli');
			setTimeout(function (){$('#'+id).removeClass('fmcBtnCli');}, 300);
		}
		//alert(b);
		console.log(b);
		socket.emit('key_event', {data: b});
		
	}
	return false;
}



function fmc_init()
{
	socket = io.connect('http://' + document.domain + ':' + location.port);
	$("#fmc div").bind("click",this,fmc_click);
	socket.on('my response', function(data) {
	    //alert(JSON.stringify(data));
	    //alert ($("").text(‘<IDENT’).html());
	    for (var j in data) {
		//alert(data[j]);
		//alert(j.replace('/','_'));
		d=document.getElementById(j.replace('/','_'));
		d.innerHTML=data[j];
	    }	    
	});
}


function vibrate()
{
	navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
	if (navigator.vibrate) 
	{
		navigator.vibrate(150);
	}
}


function menuClick(item)
{
	$('#fmc').hide();
	$('#radio').hide();
	$('#'+item).show();
}