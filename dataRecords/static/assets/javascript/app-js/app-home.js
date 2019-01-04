$("#submit-me").submit(function(e){
	e.preventDefault();
	if($("#username").val() != "" && $("#password").val() != "")
	{
		var username = $("#username").val();
		var password = $("#password").val();
		$.post("login/authenticate", {username:username, password:password, csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value}, function(r){
			if(r == 1)
			{
				alertify.success("Log in success.");
				setTimeout(function(){
					location.reload();
				}, 1500);
			}
			else
			{
				alertify.error("Log in denied.");
			}
		});
	}
	else
	{
		alertify.error("Log in denied.");
	}
});

$("#add-user").click(function(e){
	window.open("addCriminal", "_blank");
});

$(document).ready(function(e){
	var html = "";
	var val_array = Array();
	var content  = Array();
	var code = "";
	$("#choose-case").click(function(e){
		var value = $(".city").val();
		
		if(value != "")
		{
			code = value.split("-");
			if(val_array.includes(code[0]))
			{
				alertify.error("Double entry.");
			}
			else
			{
				val_array.push(code[0]);
				content.push(Array('<li class="form-control col-sm-6 list" title="remove on list" data-value="'+value+'">'+value+'</li>'));
				$("#case-list").html(content.join(''));
			}
		}
		else
		{
			alertify.error("No criminal case chosen.");
		}
		$(".city").val("");
	});

	$(document).on('hover', '.list', function(e){
		$(this).css('cursor','pointer');
        $(this).css("background-color","red");
        $(this).css("color","white");
	});

	$(document).on('mouseout', '.list', function(e){
		$(this).css("background-color","white");
        $(this).css("color","black");
	});

	$(document).on('click', '.list', function(e){
		var counter = $(".list").index($(this));
		content.splice(counter,1);
		val_array.splice(counter,1);
		$("#case-list").html(content.join(''));
	});

	$(document).on('click', '#proceed-add', function(e){
		
		var fullname = $("#fullname").val();
    	var body_mark= $("#body-marks").val();
    	var home_town= $("#home-town").val();
    	var reward 	 = $("#reward").val();

    	document.cookie = "fullname=" + fullname + "; path = /";
    	document.cookie = "body_marks=" + body_mark + "; path = /";
    	document.cookie = "home_town=" + home_town + "; path = /";
    	document.cookie = "reward=" + reward + "; path = /";
    	document.cookie = "data_cases=" + val_array + "; path = /";
    	var i = 0;
    	var data = new FormData();
    	$(".qq-thumbnail-selector").each(function(e){
    		var image = $(this).attr('src');
    		var file = dataURLtoFile(image, i+'.*');
    		data.append('sample-file[]', file);
    		i++;
    	});
	    if(fullname == "" || body_mark == "" || home_town == "" || reward == "" || val_array.length == 0)
	    {
	    	alertify.error("All fields are required.");
	    }
	    else
	    {
	    	waitingDialog.show('Processing data...', {dialogSize: 'sm', progressType: 'primary'});
	    	$.ajax({
					url: "proceedAddCriminal",
					type: "POST",
					processData: false,
					data: data,
					contentType: false,
					success:function(r)
					{
						if(r == 0)
						{
							waitingDialog.hide();
							alertify.success("Criminal Added to list.");
							setTimeout(function(){
								location.reload();
							}, 1500);
						}
						else
						{
							alertify.error("Theres an error in adding criminal to list.");
						}
					}
				});
	    }

	});
});






















