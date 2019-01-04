$("#add-case").click(function(e){
	var html = '<div class="row"><div class="col-md-12"><form action=""><div class="panel-body"><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Crime Title</label><input autofocus type="text" class="form-control col-sm-6" id="crime-title" placeholder="Crime Title"></div><div class="col-sm-6"></div></div></div><hr><div class="form-group"><div class="row"><div class="col-sm-12"><label class="control-label">Crime Description</label><textarea class="form-control" id="crime-desc" rows="4"></textarea></div><div class="col-sm-6"></div></div></div><div class="form-group"><div class="row"><div class="col-sm-12"><label class="control-label">Penalties</label><textarea class="form-control" id="crime-penalties" rows="4"></textarea></div><div class="row"><div class="col-sm-6"></div><div class="col-sm-6"></div></div></div>';
	BootstrapDialog.show({
            title: 'Add case',
            message: html,
            buttons: [
            			{
			                label: 'Proceed',
			                cssClass: 'btn btn-sm btn-primary',
			                id		: 'proceed-add-case',
			                action: function(dialog) 
			                {
			                	$("#proceed-add-case").attr('disabled', 'true');
			                	var crime_title = $("#crime-title").val();
			                	var crime_desc  = $("#crime-desc").val();
			                	var crime_pnlts = $("#crime-penalties").val();
			                		$.post("cases", {add_crime: 'true', crime_title: crime_title, crime_desc: crime_desc, crime_penalties: crime_pnlts}, function(r){
			                			if(r == 0)
			                			{
			                				alertify.success('Case added.');
			                				setTimeout(function(){
			                					location.reload();
			                				}, 1500);
			                			}
			                			else
			                			{
			                				alertify.error('Error adding case.');
			                			}
			                		}); 
			                }
			            }
            		]
        });
}); // add new case

$(".edit-case").click(function(e){
	var code 	  = $(this).data('code');
	var title 	  = $(this).data('title');
	var desc 	  = $(this).data('desc');
	var penalties = $(this).data('penalties');

	var html = '<div class="row"><div class="col-md-12"><form action=""><div class="panel-body"><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Crime Title</label><input autofocus type="text" class="form-control col-sm-6" id="crime-title" value="'+title+'" placeholder="Crime Title"></div><div class="col-sm-6"></div></div></div><hr><div class="form-group"><div class="row"><div class="col-sm-12"><label class="control-label">Crime Description</label><textarea class="form-control" id="crime-desc" rows="4">'+desc+'</textarea></div><div class="col-sm-6"></div></div></div><div class="form-group"><div class="row"><div class="col-sm-12"><label class="control-label">Penalties</label><textarea class="form-control" id="crime-penalties" rows="4">'+penalties+'</textarea></div><div class="row"><div class="col-sm-6"></div><div class="col-sm-6"></div></div></div>';
		BootstrapDialog.show({
	            title: 'Edit case',
	            message: html,
	            buttons: [
	            			{
				                label: 'Save Changes',
				                cssClass: 'btn btn-sm btn-primary',
				                id		: 'save-case',
				                action: function(dialog) 
				                {
				                	var crime_title = $("#crime-title").val();
				                	var crime_desc  = $("#crime-desc").val();
				                	var crime_pnlts = $("#crime-penalties").val();
				                	$.post("cases", {edit_crime: 'true', crime_title: crime_title, crime_desc: crime_desc, crime_penalties: crime_pnlts, code:code}, function(r){
			                			if(r == 0)
			                			{
			                				alertify.success('Crime edited.');
			                				setTimeout(function(){
			                					location.reload();
			                				}, 1500);
			                			}
			                			else
			                			{
			                				alertify.error('Error updating crime.');
			                			}
			                		}); 
				                }
				            },
				            {
				            	label: 'Delete',
				            	cssClass: 'btn btn-sm btn-danger pull-left',
				            	action: function(e)
				            	{
				            		$.confirm({
											    title: 'Warning!',
											    content: 'Are you sure you want to delete this case?',
											    type: 'red',
											    typeAnimated: true,
											    buttons: {
											        tryAgain: {
											            text: 'Confirm',
											            btnClass: 'btn-red',
											            action: function()
											            {
												            $.post("cases", {delete_crime:'true', code:code}, function(r){
												            	if(r == 0)
												            	{
												            		alertify.success("Crime deleted.");
												            		setTimeout(function(e){
												            			location.reload();
												            		}, 1500);
												            	}
												            	else
												            	{
												            		alertify.error("Error deleting this crime.");
												            	}
												            });
														}
											        },
											        close: function () {
											        }
											    }
											});
				            	}
				            }
	            		]
	        });
});
