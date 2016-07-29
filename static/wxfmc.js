var socket = null

function fmc_click(w)
{
	var id=this.id;
	a=id.split('_');
	b=a[1];
	
	if (b&&a[0]=='fmc')
	{
		vibrate();
		$(this).addClass('fmcBtnCli');
		setTimeout(function (){$('#'+id).removeClass('fmcBtnCli');}, 300);
		//alert(b);
		//console.log(b);
		socket.emit('key_event', {data: b});
		
	}
	return false;
}



function fmc_init()
{
	socket = io.connect('http://' + document.domain + ':' + location.port);
	$("#fmc div").bind("click",this,fmc_click);
	socket.on('send_messages', function(data) 
	{
		for (var j in data)
		{
			line=fmc_line_decode(data[j]);
			$('#'+j.replace('/','_')).text(line).html();
		}
	});

	socket.on('send_status', function(status) {
		if (status['LNAV']==1) { $('#fmc_71').addClass('fmcBtnAct'); } else { $('#fmc_71').removeClass('fmcBtnAct'); }
		if (status['VNAV']==1) { $('#fmc_72').addClass('fmcBtnAct'); } else { $('#fmc_72').removeClass('fmcBtnAct'); }
		if (status['ATH']==1) { $('#fmc_69').addClass('fmcBtnAct'); } else { $('#fmc_69').removeClass('fmcBtnAct'); }
		if (status['Execute']==1) { $('#fmc_22').addClass('fmcBtnAct'); } else { $('#fmc_22').removeClass('fmcBtnAct'); }
		if (status['XFMC']==1) { 
		    $('#fmc_15').addClass('fmcBtnAct'); 
		    $('#fmc_15').removeClass('fmcBtnDis');
		} else {
		    $('#fmc_15').removeClass('fmcBtnAct');
		    $('#fmc_15').addClass('fmcBtnDis'); 
		}
	});

	socket.on('send_position', function(position){
	    //console.log(position['lat']);
	    //console.log(position['lon']);
	    //console.log(position['hdg']);
	});

	socket.on('connect', function(){
	    socket.emit('connect');
	});

	$(document).keydown(function(e)
	{
		key=e.which;
		console.log(key);
		send_key=false;
		if ((key>63)&&(key<91))
		{
			send_key=key-38;
		}

		if ((key>48)&&(key<58))
		{
			send_key=key+8;
		}

		if ((key>96)&&(key<106))
		{
			send_key=key-40;
		}

		switch (key)
		{
			case 32: send_key=53; break; // [space]
			case 48: send_key=67; break; // 0
			case 96: send_key=67; break; // 0
			case 190: send_key=66; break; // .
			case 110: send_key=66; break; // .
			case 191: send_key=55; break; // /
			case 111: send_key=55; break; // /
			case 187: send_key=68; break; // +
		}

		if (send_key)
		{
			socket.emit('key_event', {data: send_key});
			e.preventDefault();
		}
	});
}


function fmc_line_decode(s)
{
	r='                                           ';
	a=s.replace(/[0-9]*\//,'').split(';');
	for (i=0;i<a.length-1;++i)
	{
		b=a[i].match(/([0-9]*),([0-9]*),(.*)/)
		r=stringReplace(r,b[2],b[3]);
	}
	return r;
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


function stringReplace(str, pos, repl)
{
	pos=Math.ceil(pos/7);
	console.log(str, pos, repl);
	return str.substring(0,pos)+repl+str.substring(pos+repl.length,str.length);
}
