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
	socket.on('send_messages', function(data) {
	    for (var j in data) {
		$('#'+j.replace('/','_')).text(data[j]).html();
	    }	    
	});

	socket.on('send_status', function(status) {
		if (status['LNAV']==1) { $('#fmc_71').addClass('fmcBtnAct'); } else { $('#fmc_71').removeClass('fmcBtnAct'); }
		if (status['VNAV']==1) { $('#fmc_70').addClass('fmcBtnAct'); } else { $('#fmc_70').removeClass('fmcBtnAct'); }
		if (status['ATH']==1) { $('#fmc_69').addClass('fmcBtnAct'); } else { $('#fmc_69').removeClass('fmcBtnAct'); }
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