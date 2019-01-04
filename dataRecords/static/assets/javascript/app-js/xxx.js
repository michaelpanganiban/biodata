$("#sign-in").submit(function(e){
	e.preventDefault();
	var email = $("#email").val();
	var pass  = $("#password").val();
	$.post("login", {email:email, pass:pass}, function(r){
	    alert(r);
//		if(r == 0)
//		{
//			alertify.success("Log in successful.");
//			setTimeout(function(){
//				window.location = "Admin/home";
//			}, 1500);
//		}
//		else
//		{
//			alertify.error("Log in denied.");
//		}
	});
});

$("#add-position").click(function(e){
	var html = '<div class="row"><div class="col-md-12"><form action=""><div class="panel-body"><div class="form-group"><div class="row"><div class="col-sm-6 col-sm-offset-3"><label class="control-label">Position Name</label><input autofocus type="text" class="form-control col-sm-6" id="position-id" placeholder="Position Name"></div></div></div>';
	BootstrapDialog.show({
							title: "Add Position",
							draggable: true,
				            message: html,
				            buttons:[
						            	{
							                label: 		'Reset',
							                cssClass: 	'btn-sm pull-left',
							                action: function()
							                {
							                	$("#position-id").val(null);
							                }
							            }, 
							            {
							                label: 		'Proceed',
							                cssClass: 	'btn-sm btn-primary',
							                id      : 	'add-position-id',
							                action: function(){
							                	var position = $("#position-id").val();
							                    if(position != "")
							                    {
							                    	$("#add-position-id").attr("disabled",'true');
								                    Pace.restart();
													Pace.track(function(){
														var add = "true";
								                    	$.post("position", {position_name:position, add:add}, function(r){
								                    		if(r == 0)
								                    		{
								                    			alertify.success("Position added.");
								                    			setTimeout(function(){
													                    				window.location = "position";
													                    			}, 1500);
								                    		}
								                    		else
								                    		{
								                    			alertify.error("Please try again. With luck.");
								                    		}
								                    	});
								                    });
							                    }
							                    else
							                    {
							                    	alertify.error("Please fill up the position name.");
							                    }
							                }
							            }
						            ]
				        });
        
}); //Add Position

$("#position").change(function(e){
	var position_id = $("#position").val();
	var html 		= "";
	if(position_id != 'null')
	{
		$("#edit-position").removeAttr('disabled');
		Pace.restart();
		Pace.track(function(){
			loadPositionLine(position_id);
		});
	}
	else
	{
		var html = "<span>No available module..</span>";
		$("#table-append").html(html);
		$("#edit-position").attr('disabled', 'true');
	}
}); //Manage Position

$(document).on('ifChecked','.bk-module',function(e){
	var position_id = $("#position").val();
	if(position_id == 'null')
	{
		alertify.error("Please choose a position.");
		checkbox.iCheck('destroy');
	}
	else
	{
		var module_no 	= $(this).data('pk');
		var set_module = "true";
		Pace.restart();
		Pace.track(function(){
			$.post("setModule", {position_id:position_id, module_no:module_no, set_module:set_module}, function(r){
				if(r == 0)
				{
					alertify.success("Module set.");
					waitingDialog.show('Updating list. Please Wait..', {dialogSize: 'sm', progressType: 'success'});
					loadPositionLine(position_id);
					waitingDialog.hide();
				}
				else
				{
					alertify.error("Error setting the module.");
				}
			});
		});
	}
}); //add module to position

$(document).on('ifUnchecked', '.bk-module', function(event){
	var position_id = $("#position").val();
	if(position_id == 'null')
	{
		alertify.error("Please choose a position.");
		checkbox.iCheck('destroy');
	}
	else
	{
		var gen_id 	   = $(this).data('value');
		var set_module = "false";
		Pace.restart();
		Pace.track(function(){
			$.post("setModule", {gen_id:gen_id, set_module:set_module, position_id:position_id}, function(r){
				if(r == 0)
				{
					alertify.success("Module reset.");
					waitingDialog.show('Updating list. Please Wait..', {dialogSize: 'sm', progressType: 'success'});
					loadPositionLine(position_id);
					waitingDialog.hide();
				}
				else
				{
					alertify.error("Error setting the module.");
				}
			});
		});
	}
}); //delete module to position

$("#edit-position").click(function(e){
	var position_id  = $("#position").val();
	var get_position = "true"; 
	$.post("position", {get_position:get_position, position_id:position_id}, function(r){
		var html = '<div class="row"><div class="col-md-12"><form action=""><div class="panel-body"><div class="form-group"><div class="row"><div class="col-sm-6 col-sm-offset-3"><label class="control-label">Position Name</label><input autofocus type="text" class="form-control col-sm-6" id="position-id" placeholder="Position Name"></div></div></div>';
				BootstrapDialog.show({
					title: "Edit Position",
					draggable: true,
		            message: html,
		            onshown: function(e)
		            {
		            	var position_title = "";
		            	var data = jQuery.parseJSON(r);
		            	$.each(data, function(key, val){
		            		position_title	= this.POSITION_NAME;	
		            		position_id 	= this.POSITION_ID;
		            	});
		            	$("#position-id").val(position_title);
		            },
		            buttons:[
				            	{
					                label: 		'Delete',
					                cssClass: 	'btn-sm pull-left btn-danger',
					                action: function()
					                {
					                	$.confirm({
												    title: 'Warning!',
												    content: 'Are you sure you want to delete this position?',
												    type: 'red',
												    typeAnimated: true,
												    buttons: {
												        tryAgain: {
												            text: 'Confirm',
												            btnClass: 'btn-red',
												            action: function()
												            {
													            Pace.restart();
																Pace.track(function(){
													            	var del = "true";
													            	$.post('position', {position_id:position_id, del:del}, function(r){
																		if(r == 0)
																		{
																			alertify.success('Postion deleted!');
																			setTimeout(function(){
															                	window.location = "position";
															                }, 1500);
																		}
																		else
																		{
																			alertify.error('Error deleting the position!');
																		}
																	});
																});
															}
												        },
												        close: function () {
												        }
												    }
												});
					                }
					            }, 
					            {
					                label: 		'Save Changes',
					                cssClass: 	'btn-sm btn-primary',
					                id      : 	'edit-position-id',
					                action: function(){
					                	var position = $("#position-id").val();
					                    if(position != "")
					                    {
					                    	$("#edit-position-id").attr("disabled",'true');
						                    Pace.restart();
											Pace.track(function(){
												var edit = "true";
						                    	$.post("position", {position_name:position, position_id:position_id, edit:edit}, function(r){
						                    		if(r == 0)
						                    		{
						                    			alertify.success("Position successfully updated.");
						                    			setTimeout(function(){
											                    				window.location = "position";
											                    			}, 1500);
						                    		}
						                    		else
						                    		{
						                    			alertify.error("Please try again. With luck.");
						                    		}
						                    	});
						                    });
					                    }
					                    else
					                    {
					                    	alertify.error("Please fill up the position name.");
					                    }
					                }
					            }
				            ]
		        });
	});
}); //end edit/delete position

/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx END POSITION MODULE xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/

$("#add-user").click(function(e){
	var html = '<div class="row"><div class="col-md-12"><ul class="nav nav-tabs"><li class="active"><a href="#popular" data-toggle="tab" id="ind-tab"><b>Individual</b></a></li><li><a href="#comments" id="upload-tab" data-toggle="tab"><b>Upload Group</b></a></li></ul><div class="tab-content panel"><div class="tab-pane active" id="popular"><div class="media-list"><div class="row"><div class="col-md-12"><form action=""><div class="panel-body"><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Fullname</label><input autofocus type="text" class="form-control col-sm-6" id="fullname" placeholder="Fullname"></div><div class="col-sm-6"><label class="control-label">Contact No.</label><input type="text" class="form-control col-sm-6" id="contact" placeholder="Contact No."></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Email</label><input type="email" class="form-control col-sm-6" id="email" placeholder="Email"></div><div class="col-sm-6"><label class="control-label">Position</label><select class="form-control col-sm-6" id="position"></select></div></div></div><hr><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Address</label><input type="text" class="form-control col-sm-6" id="address" placeholder="Address"></div><div class="col-sm-6"></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Password</label><input type="password" class="form-control col-sm-6" id="password" placeholder="Password"></div><div class="col-sm-6"><label class="control-label">Confirm Password</label><input type="password" class="form-control col-sm-6" id="confirm-password" placeholder="Confirm Password"></div></div></div></div></form></div></div></div></div><div class="tab-pane" id="comments"><div class="media-list"><br>Please download the template <a href="#" id="download-template">here.</a><br><br><div class="col-md-12"><div class="alert alert-dismissable alert-info"><strong>Note: </strong> Please make sure to save as .csv (Comma delimited) file before uploading.</div></div><div class="row"><div class="col-md-12"><form action=""><div class="form-group"><label class="col-sm-3 control-label">File Upload</label><div class="col-sm-9"><div class="input-group"><input type="file" class="form-control" name="user_file" id="upload-user-file"></div></span></div></div></div></div></form></div></div></div></div></div></div>';
	BootstrapDialog.show({
		title: 'Add User',
		draggable: 'true',
		message: html,
		onshown: function()
		{
			var get_position = "true";
			$("#create-user-btn").val("individual");
			$(".bootstrap-dialog").removeAttr("tabindex");
			$.post("position", {get_position:get_position}, function(r){
				var data 		= jQuery.parseJSON(r);
				var string_data = "<option value='null'>Select Position..</option>";
				$.each(data, function(key, val){
					string_data += "<option value="+this.POSITION_ID+">"+ this.POSITION_ID + " - "+ this.POSITION_NAME +"</option>";
				});
				$("#position").append(string_data);
				$("#position").select2();
			});

			$("#confirm-password").keyup(function(e){
				if($(this).val() != $("#password").val())
				{
					$("#confirm-password").attr('style','border:1px solid red');
					$("#create-user-btn").attr('disabled','true');
				}
				else
				{
					$("#confirm-password").removeAttr('style');
					$("#create-user-btn").removeAttr('disabled');
				}
			});
			$("#password").keyup(function(e){
				if($(this).val() != $("#confirm-password").val())
				{
					$("#confirm-password").attr('style','border:1px solid red');
					$("#create-user-btn").attr('disabled','true');
				}
				else
				{
					$("#confirm-password").removeAttr('style');
					$("#create-user-btn").removeAttr('disabled');
				}
			});

			$("#download-template").click(function(e){
				window.location = "downloadUserTemplate";
			});
			$("#ind-tab").click(function(e){
				$("#create-user-btn").val("individual");
			});
			$("#upload-tab").click(function(e){
				$("#create-user-btn").val("upload");
			});
		},
		buttons: [
					{
						label: 'Proceed',
						id: 	'create-user-btn',
						cssClass:'btn btn-sm btn-primary',
						action: function()
						{
							var fullname = $("#fullname").val();
							var contact  = $("#contact").val();
							var email 	 = $("#email").val();
							var position = $("#position").val();
							var address  = $("#address").val();
							var password = $("#password").val();
							var tab_type = $(this).val();
							if(tab_type == 'individual')
							{
								if(fullname == "" || contact == "" || email == "" || position == "null" || address == "" || password == "")
								{
									alertify.error("All fields are required.");
								}
								else
								{
									Pace.restart();
									Pace.track(function(){
										$("#create-user-btn").attr('disabled','true');
										var add_user = "true";
											$.post("users", {fullname:fullname, contact:contact, email:email, position:position, address:address, password:password, add_user:add_user}, function(r){
												if(r == 0)
												{
													alertify.success("User has been added");
													setTimeout(function(){
														window.location = "users";
													}, 1500);
												}
												else
												{
													alertify.error("Error adding new user. Please try again.");
												}
											});
									});
								}
							}
							else if(tab_type = 'upload')
							{
								Pace.restart();
								Pace.track(function(){
									$("#create-user-btn").attr('disabled','true');
									var upload = "true";
									var data = new FormData();
											$.each($("#upload-user-file")[0].files, function(i, file){
												data.append("user_file", file);
											});
											$.ajax({
														url: "uploadUser",
														type: "POST",
														processData: false,
														data: data,
														contentType: false,
														success:function(r)
														{
															if(r == 0)
															{
																alertify.success("Users were successfully uploaded");
																setTimeout(function(){
																	                	window.location = "users";
																	                }, 1500);
															}
															else
															{
																alertify.error("Error uploading");
																$("#create-user-btn").removeAttr('disabled');
															}
														}
													});
								});				
							}
						}
					},
					{
						label: 'Reset',
						cssClass: 'btn btn-sm btn-default pull-left',
						action: function()
						{

						}
					}
				]
	});
}); //end add/upload user

$(".edit-user").click(function(e){
	var user_id = $(this).data('pk');
	var get_user_per_id = "true";
	var get_position = "true";
	var fullname = "";
	var contact = "";
	var email = "";
	var pos_id = "";
	var address = "";
	var status = "";
	$.post("users", {get_user_per_id:get_user_per_id, user_id:user_id}, function(r){
		var data = jQuery.parseJSON(r);
		$.each(data, function(key, val){
			fullname = this.FULLNAME;
			contact  = this.CONTACT_NUMBER;
			email 	 = this.EMAIL;
			pos_id 	 = this.POSITION_ID;
			address  = this.ADDRESS;
			status   = this.STATUS;
		});
	});
	var html = '<div class="row"><div class="col-md-12"><form action=""><div class="panel-body"><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Fullname</label><input autofocus type="text" class="form-control col-sm-6" id="fullname" placeholder="Fullname"></div><div class="col-sm-6"><label class="control-label">Contact No.</label><input type="text" class="form-control col-sm-6" id="contact" placeholder="Contact No."></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Email</label><input type="email" class="form-control col-sm-6" id="email" placeholder="Email"></div><div class="col-sm-6"><label class="control-label">Position</label><select class="form-control col-sm-6" id="position"></select></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Address</label><input type="text" class="form-control col-sm-6" id="address" placeholder="Address"></div><div class="col-sm-6"><label class="control-label">Status</label><select class="form-control col-sm-6" id="status"><option value="null">Select Status..</option><option value="ACTIVE">ACTIVE</option><option value="SUSPENDED">SUSPENDED</option></select></div></div></div></div></form></div></div></div>';
	BootstrapDialog.show({
		title: user_id + " - Edit user",
		draggable: 'true',
		message: html,
		onshown: function()
		{
			$.post("position", {get_position:get_position}, function(r){
				waitingDialog.show('Updating list. Please Wait..', {dialogSize: 'sm', progressType: 'success'});
					var data 		= jQuery.parseJSON(r);
					var string_data = "<option value='null'>Select Position..</option>";
					$.each(data, function(key, val){
						string_data += "<option value="+this.POSITION_ID+">"+ this.POSITION_ID + " - "+ this.POSITION_NAME +"</option>";
					});
					$("#position").append(string_data);
					$("#position").select2();
					$("#position").val(pos_id).trigger('change');
					$("#fullname").val(fullname);
					$("#contact").val(contact);
					$("#email").val(email);
					$("#address").val(address);
					$("#status").val(status);
				waitingDialog.hide();
			});
			$(".bootstrap-dialog").removeAttr("tabindex");
		},
		buttons: [
					{
						label: 'Delete',
						cssClass: 'btn-danger btn btn-sm pull-left',
						action: function()
						{
							$.confirm({
									    title: 'Warning!',
									    content: 'Are you sure you want to delete this user?',
									    type: 'red',
									    typeAnimated: true,
									    buttons: {
									        tryAgain: {
									            text: 'Confirm',
									            btnClass: 'btn-red',
									            action: function()
									            {
									            	Pace.restart();
									            	Pace.track(function(){
										            	$.post("users", {delete_user:'true', user_id:user_id}, function(r){
										            		if(r== 0)
										            		{
										            			alertify.success("User successfully deleted");
										            			setTimeout(function(){
										            				window.location = "users";
										            			}, 1500);
										            		}
										            		else if(r == 1)
										            		{
										            			alertify.error("Error deleting user");
										            		}
										            		else
										            		{
										            			alertify.error(r);
										            		}
										            	})
										            });
												}
									        },
									        close: function () {
									        }
									    }
									});
						}
					},
					{
						label: 'Save Changes',
						cssClass: 'btn-primary btn btn-sm',
						id: 	'save-changes-btn',
						action: function()
						{
							Pace.restart();
							Pace.track(function(){
								var fullname = $("#fullname").val();
								var contact  = $("#contact").val();
								var email 	 = $("#email").val();
								var position = $("#position").val();
								var address  = $("#address").val();
								var status   = $("#status").val();
								var edit_user= "true";
									if(fullname == "" || contact == "" || email == "" || position == "null" || address == "" || status == "")
									{
										alertify.error("All fields are required.");
									}
									else
									{
										$("#save-changes-btn").attr('disabled', 'true');
										$.post("users", {fullname:fullname, contact:contact, email:email, position:position, address:address, status:status, edit_user:edit_user, user_id:user_id}, function(r){
											if(r == 0)
											{
												alertify.success(fullname + "'s profile updated");
												setTimeout(function(){
													window.location = "users";
												}, 1500);
											}
											else
											{
												alertify.error("Error updating profile");
											}
										});
									}
							});
						}
					}
				 ]
	});
}); //end edit/delete user

$("#profile").click(function(e){
	var user_id = $(this).data('pk');
	Pace.restart();
	Pace.track(function(){
		var get_user_per_id = "true";
		var fullname = "";
		var contact = "";
		var email = "";
		var position = "";
		var address = "";
		var status = "";
		var created= "";
		var image_src = "";
		var pos_name ="";
		var change_pass = "false";
		var url = "../Admin/users";
        var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
        if(segments != "")
        {
            var url = "../../Admin/users"
        }
		$.post(url, {get_user_per_id:get_user_per_id, user_id:user_id}, function(r){
			var data = jQuery.parseJSON(r);
			$.each(data, function(key, val){
				fullname = this.FULLNAME;
				contact  = this.CONTACT_NUMBER;
				email 	 = this.EMAIL;
				status   = this.STATUS;
				image_src= this.PROFILE_PIC;
				position = this.POSITION_ID;
				pos_name = this.POSITION_NAME;
				address  = this.ADDRESS;
				created  = this.CREATED;
			});
		});
		var html = '<div class="row"><div class="col-md-12"><form action=""><div class="panel-body"><div class="form-group"><div class="row"><div class="col-sm-12" id="photo-holder" align="center"></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Fullname</label><input autofocus type="text" class="form-control col-sm-6" id="fullname" placeholder="Fullname"></div><div class="col-sm-6"><label class="control-label">Contact No.</label><input type="text" class="form-control col-sm-6" id="contact" placeholder="Contact No."></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Email</label><input type="email" class="form-control col-sm-6" id="email" placeholder="Email"></div><div class="col-sm-6"><label class="control-label">Position</label><input type="text" class="form-control col-sm-6" id="position" placeholder="Position" disabled></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Address</label><input type="text" class="form-control col-sm-6" id="address" placeholder="Address"></div><div class="col-sm-6"><label class="control-label">Status</label><input type="text" class="form-control col-sm-6" id="status" disabled placeholder="Status"></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Created</label><input type="text" class="form-control col-sm-6" id="created" placeholder="Created" disabled></div><div class="col-sm-6"></div></div></div></div></form></div></div></div>';
		BootstrapDialog.show({
			title: "Edit Profile",
			draggable: 'true',
			message: $(html),
			onshown: function()
			{
			    waitingDialog.show('Updating data. Please Wait..', {dialogSize: 'sm', progressType: 'success'});
				$("#position").val(pos_name);
				$("#fullname").val(fullname);
				$("#contact").val(contact);
				$("#email").val(email);
				$("#address").val(address);
				$("#status").val(status);
				$("#created").val(created);
				var data = "";
				if(image_src != null && image_src.length > 0)
                {
                    var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
			        if(segments != "")
			        {
			        	var photo = '<img src="../../assets/book-keeping/uploads/profile/'+image_src+'" style="cursor:pointer;" height="220" width="220" id="user-photo"  class="img-circle img-bordered"><input type="file" name="user_photo" id="upload-user" style="display: none;">';
			        }
			        else
			        {
                    	var photo = '<img src="../assets/book-keeping/uploads/profile/'+image_src+'" style="cursor:pointer;" height="220" width="220" id="user-photo"  class="img-circle img-bordered"><input type="file" name="user_photo" id="upload-user" style="display: none;">';
                    }
                    $("#photo-holder").html(photo);
                }
                else
                {
			        var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
			        if(segments != "")
			        {
			            var photo = '<img title="Click to change picture.." style="cursor:pointer;" class="profile-user-img img-responsive img-circle" src="../../assets/book-keeping/dist/img/avatar.png" alt="User profile picture" style="width:40%; height:40%; cursor:pointer" id="user-photo"><input type="file" name="user_photo" id="upload-user" style="display: none;  cursor:pointer;">';
			        }
			        else
			        {
                    	var photo = '<img title="Click to change picture.." style="cursor:pointer;" class="profile-user-img img-responsive img-circle" src="../assets/book-keeping/dist/img/avatar.png" alt="User profile picture" style="width:40%; height:40%; cursor:pointer" id="user-photo"><input type="file" name="user_photo" id="upload-user" style="display: none;  cursor:pointer;">';
                    }
                    $("#photo-holder").html(photo);
                }
                $("#user-photo").click(function(e){
                    e.preventDefault();
                    $("#upload-user:hidden").trigger('click');
                });
                $("#upload-user").change(function(e){
                        var img = document.createElement('img');
                        var files = !!this.files ? this.files : [];

                        if (!files.length || !window.FileReader) return; // Check if File is selected, or no FileReader support
                        if (/^image/.test( files[0].type)) //  Allow only image upload
                        { 
                            var ReaderObj = new FileReader(); // Create instance of the FileReader
                                ReaderObj.readAsDataURL(files[0]); // read the file uploaded
                                ReaderObj.onloadend = function() // set uploaded image data 
                                { 
                                    img.src = this.result;
                                    $("#user-photo").attr('src', img.src);
                                    $("#user-photo").height(220);
                                    $("#user-photo").width(220);
                                } 
                        }
                });
            waitingDialog.hide();
			},
			buttons: [
						{
							label: 'Change Password',
							id: 	'change-password-btn',
							cssClass: 'btn btn-sm btn-success pull-left',
							action: function(dialog)
							{
								change_pass = "true";
								$("#save-changes-btn").attr('disabled', 'true');
								var html2 = '<div class="row"><div class="col-md-12"><form action=""><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Old Password</label><input type="password" class="form-control col-sm-6" id="old-password" placeholder="Old Password"></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">New Password</label><input type="password" class="form-control col-sm-6" id="new-password" placeholder="New Password" disabled></div><div class="col-sm-6"><label class="control-label">Confirm Password</label><input type="password" class="form-control col-sm-6" id="confirm-password" disabled placeholder="Confirm Password"></div></div></div></div></form></div></div></div>';
								dialog.setMessage(html2);
								dialog.setTitle('Change Password');

								$("#old-password").keyup(function(e){
									var url = "../Admin/changePassword";
									if(segments != "")
									{
										var url = "../../Admin/changePassword";
									}
									var old_password = $(this).val();
									var check_password = "true";
										$.post(url, {check_password:check_password, old_password:old_password}, function(r){
											if(r == 0)
											{
												$("#new-password").removeAttr('disabled');
												$("#confirm-password").removeAttr('disabled');
											}
											else
											{
												$("#new-password").attr('disabled','true');
												$("#confirm-password").attr('disabled','true');
												$("#save-changes-btn").attr('disabled','true');
											}
										});
								});
								$("#confirm-password").keyup(function(e){
				                    var new_password  = $("#new-password").val();
				                    var conf_password = $("#confirm-password").val();
				                        if(new_password != conf_password)
				                        {
				                            $("#confirm-password").attr('style','border:1px solid red');
				                            $("#confirm-change-pass").attr('disabled','true');
				                            $("#save-changes-btn").attr('disabled','true');
				                        }
				                        else
				                        {
				                            $("#confirm-password").removeAttr('style');
				                            $("#confirm-change-pass").removeAttr('disabled');
				                            $("#save-changes-btn").removeAttr('disabled');
				                        }
				                });

				                $("#new-password").keyup(function(e){
				                    var new_password  = $("#new-password").val();
				                    var conf_password = $("#confirm-password").val();
				                        if(new_password != conf_password)
				                        {
				                            $("#confirm-password").attr('style','border:1px solid red');
				                            $("#confirm-change-pass").attr('disabled','true');
				                            $("#save-changes-btn").attr('disabled','true');
				                        }
				                        else
				                        {
				                            $("#confirm-password").removeAttr('style');
				                            $("#confirm-change-pass").removeAttr('disabled');
				                            $("#save-changes-btn").removeAttr('disabled');
				                        }
				                });
							}
						},
						{
							label: 'Save Changes',
							id: 	'save-changes-btn',
							cssClass: 'btn btn-sm btn-primary',
							action: function(dialog)
							{
							    waitingDialog.show('Updating data. Please Wait..', {dialogSize: 'sm', progressType: 'success'});
								if(change_pass == "false")
								{
									var data = new FormData();
	                                $.each($("#upload-user")[0].files, function(i, file){
	                                    data.append("user_photo", file);
	                                });
	                                if($("#fullname").val() == "" || $("#contact").val() == "" || $("#email").val() == "" || $("#address").val() == "")
									{
										alertify.error("All fields are required.");
									}
									else
									{
										var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
										var url = "../Admin/updateProfileSettings";
										if(segments != "")
										{
											var url = "../../Admin/updateProfileSettings";
										}
	                                    document.cookie = "contact=" + $("#contact").val()+ "; path = /";
	                                    document.cookie = "email="      + $("#email").val()+ "; path = /";
	                                    document.cookie = "fullname="   + $("#fullname").val()+ "; path = /";
	                                    document.cookie = "address="   + $("#address").val()+ "; path = /";
		                                $.ajax({
		                                        url: url,
		                                        type: "POST",
		                                        processData: false,
		                                        data: data,
		                                        contentType: false,
		                                        success: function(response){
		                                            var date = new Date();
		                                            var day = date.getDay();
		                                            var weekday = new Array(7);
		                                            weekday[0] = "Sun";
		                                            weekday[1] = "Mon";
		                                            weekday[2] = "Tue";
		                                            weekday[3] = "Wed";
		                                            weekday[4] = "Thu";
		                                            weekday[5] = "Fri";
		                                            weekday[6] = "Sat";

		                                            var today = new Date();
		                                            var dd = today.getDate();
		                                            var mm = today.getMonth();
		                                            var yyyy = today.getFullYear();
		                                            if(dd<10)
		                                                dd='0'+dd;
		                                            var monthNames = [
		                                                                "January", "February", "March",
		                                                                "April", "May", "June", "July",
		                                                                "August", "September", "October",
		                                                                "November", "December"
		                                                              ];
		                                                var current_date = dd + ' ' + monthNames[mm] + ' ' + yyyy;
		                                               
		                                                document.cookie = "contact=;expires="+weekday[day]+"," + current_date +" 00:00:00 UTC;";
		                                                document.cookie = "email=;expires="+weekday[day]+"," + current_date +" 00:00:00 UTC;";
		                                                document.cookie = "fullname=;expires="+weekday[day]+"," + current_date +" 00:00:00 UTC;";
		                                                document.cookie = "address=;expires="+weekday[day]+"," + current_date +" 00:00:00 UTC;";

		                                            alertify.success('Your profile was updated!');
		                                        },
		                                        error:function(e)
		                                        {
		                                            alertify.error('Error updating profile info! Image too large.');
		                                        }
		                                });
		                            }
		                        }
		                        else
		                        {
		                        	var change_password = "true";
		                        	var new_password    = $("#new-password").val();
		                        	var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
		                        	var url = "changePassword";
									if(segments != "")
									{
										var url = "../../Admin/changePassword";
									}
		                        	$.post(url, {change_password:change_password, new_password:new_password}, function(r){
		                        		if(r == 0)
		                        		{
		                        			alertify.success("Password changed.");
		                        			change_pass = "true";
											$("#save-changes-btn").attr('disabled', 'true');
											$("#old-password").val(null);
											$("#new-password").val(null).attr('disabled','true');
											$("#confirm-password").val(null).attr('disabled','true');
		                        		}
		                        		else
		                        		{
		                        			alertify.error("Error changing password");
		                        		}
		                        	});
		                        }
		                        waitingDialog.hide();
							}
						}
					]
		});
	});
}); //edit profile

$("#assign-company").click(function(e){
	var html = '<div class="row"><div class="col-md-12"><form action=""><div class="form-group"><div class="row"><div class="col-md-1 col-md-offset-2"><label class="control-label">Users: </label></div><div class="col-md-7"  align="center"><select class="form-control select2" id="user-list"></select></div></div><div class="form-group"></form></div><div class="box-body"  style="background-color:#b8c7ce;" id="table-append-company"></div></div></div>';
	BootstrapDialog.show({
		title: 'Assign Company',
		draggable: true,
		message: html,
		onshown: function()
		{
			$(".bootstrap-dialog").removeAttr("tabindex");
			Pace.restart();
			Pace.track(function(){
				$.post("users", {get_user_list:'true'}, function(r){
					var users = jQuery.parseJSON(r);
					var option = "<option value='null'>Select user..</option>";
					$.each(users, function(key, val){
						option += "<option value='"+this.USER_ID+"'>"+this.USER_ID+' - '+this.FULLNAME+"</option>";
					});
					$("#user-list").append(option).select2();					
				});
			});
			$("#user-list").change(function(e){
				var user_id = $(this).val();
				waitingDialog.show('Updating list. Please Wait..', {dialogSize: 'sm', progressType: 'success'});
				appendCompany(user_id);
				waitingDialog.hide();
			});

			$(document).on('ifChecked','.bk-cus',function(e){
				var user_id = $("#user-list").val();
				if(user_id == 'null')
				{
					alertify.error("Please choose a user.");
					checkbox.iCheck('destroy');
				}
				else
				{
					var company_id 	= $(this).data('pk');
					var set_company = "true";
					Pace.restart();
					Pace.track(function(){
						$.post("assignCompany", {user_id:user_id, company_id:company_id, set_company:set_company}, function(r){
							if(r == 0)
							{
								alertify.success("Company set.");
								waitingDialog.show('Updating list. Please Wait..', {dialogSize: 'sm', progressType: 'success'});
								appendCompany(user_id);
								waitingDialog.hide();
							}
							else
							{
								alertify.error("Error setting the company.");
							}
						});
					});
				}
			}); //assign company to user

			$(document).on('ifUnchecked','.bk-cus',function(e){
				var gen_id = $(this).data('value');
				var user_id = $("#user-list").val();
				var unset_company = "true";
				Pace.restart();
				Pace.track(function(){
					$.post("assignCompany", {gen_id:gen_id, unset_company:unset_company}, function(r){
						if(r == 0)
						{
							alertify.success("Company unset.");
							waitingDialog.show('Updating list. Please Wait..', {dialogSize: 'sm', progressType: 'success'});
							appendCompany(user_id);
							waitingDialog.hide();
						}
						else
						{
							alertify.error("Error unsetting the company.");
						}
					});
				});
			}); //remove company to user
		},
		buttons: [
					{
						label: 'Close',
						cssClass: 'btn btn-sm btn-default',
						action: function(e)
						{
							e.close();
						}
					}
				]
	});
});

/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx END USER MODULE xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/

$("#upload-click").click(function(e){
	e.preventDefault();
    $("#upload-company:hidden").trigger('click');
});

$("#upload-company").change(function(e){
	    var img = document.createElement('img');
	    var files = !!this.files ? this.files : [];

	   	if (!files.length || !window.FileReader) return; // Check if File is selected, or no FileReader support
	   	if (/^image/.test( files[0].type)) //  Allow only image upload
	   	{ 
		    var ReaderObj = new FileReader(); // Create instance of the FileReader
		    	ReaderObj.readAsDataURL(files[0]); // read the file uploaded
		    	ReaderObj.onloadend = function() // set uploaded image data 
		    	{ 
			    	img.src = this.result;
			    	$("#company-image").attr('src', img.src);
			    	$("#company-image").height(34);
			    	$("#image-main").attr('src',img.src);
			    	$("#image-main").height(65);
		     	} 
		}
});

$("#save-changes-company").click(function(e){
	var gen_id = $(this).data('pk');
	Pace.restart();
	Pace.track(function(){
		var data = new FormData();
        $.each($("#upload-company")[0].files, function(i, file){
			data.append("userfile", file);
		});
		
        if($("#save-changes-company").val() == 'false')
		{
			var url = "../Admin/addCompanyDetails";
		}
		else
		{
			var url = "../Admin/updateCompanyDetails";
		}
		
		document.cookie = "gen_id=" 		+ gen_id+ "; path = /";
		document.cookie = "website=" 		+ $("#website").val()+ "; path = /";
        document.cookie = "add_details="	+ "true; path = /";
		document.cookie = "company_name=" 	+ $("#company-name").val()+ "; path = /";
		document.cookie = "address=" 		+ $("#address").val()+ "; path = /";
		document.cookie = "contact_no=" 	+ $("#contact").val()+ "; path = /";
		document.cookie = "telephone=" 		+ $("#telephone").val()+ "; path = /";
		document.cookie = "tin=" 			+ $("#tin").val()+ "; path = /";
		document.cookie = "company_bio=" 	+ $("#company-bio").val()+ "; path = /";
		$.ajax({
                url: url,
                type: "POST",
                processData: false,
                data: data,
                contentType: false,
                success: function(response){
					alertify.success('Your profile was updated!');
                    setTimeout(function(){
                    	window.location = "companyDetails";
                    }, 1500);
                },
                error:function(e)
                {	
                	alertify.error('Error updating profile info! Image too large.');
                }
        });
	});
		var date = new Date();
        var day = date.getDay();
        var weekday = new Array(7);
        weekday[0] = "Sun";
        weekday[1] = "Mon";
        weekday[2] = "Tue";
        weekday[3] = "Wed";
        weekday[4] = "Thu";
        weekday[5] = "Fri";
        weekday[6] = "Sat";

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth();
        var yyyy = today.getFullYear();
        if(dd<10)
            dd='0'+dd;
        var monthNames = [
                            "January", "February", "March",
                            "April", "May", "June", "July",
                            "August", "September", "October",
                            "November", "December"
                          ];
        var current_date = dd + ' ' + monthNames[mm] + ' ' + yyyy;
    	
    	document.cookie = "gen_id=; expires="+weekday[day]+"," + current_date +" 00:00:00 UTC;";
    	document.cookie = "add_details=; expires="+weekday[day]+"," + current_date +" 00:00:00 UTC;";   
		document.cookie = "telephone=; expires="+weekday[day]+"," + current_date +" 00:00:00 UTC;";
		document.cookie = "company_name=; expires="+weekday[day]+"," + current_date +" 00:00:00 UTC;";
		document.cookie = "address=; expires="+weekday[day]+"," + current_date +" 00:00:00 UTC;";
		document.cookie = "contact_no=; expires="+weekday[day]+"," + current_date +" 00:00:00 UTC;";
		document.cookie = "website=; expires="+weekday[day]+"," + current_date +" 00:00:00 UTC;";
		document.cookie = "tin=; expires="+weekday[day]+"," + current_date +" 00:00:00 UTC;";
		document.cookie = "company_bio=; expires="+weekday[day]+"," + current_date +" 00:00:00 UTC;";
}); // end add/update company details

$("#remove-pic").click(function(e){
	var gen_id = $(this).data('pk');
	var remove_pic = "true";
	Pace.restart();
	Pace.track(function(){
		$.confirm({
				    title: 'Warning!',
				    content: 'Remove profile picture?',
				    type: 'red',
				    typeAnimated: true,
				    buttons: {
				        tryAgain: {
				            text: 'Confirm',
				            btnClass: 'btn-red',
				            action: function()
				            {
					            $.post("../Admin/updateCompanyDetails", {remove_pic: remove_pic, gen_id:gen_id}, function(r){
									if(r == 0)
									{
										alertify.success("Profile picture removed");
										setTimeout(function(){
											window.location = "companyDetails";
										}, 1500);
									}
									else
									{
										alertify.error("An error has occured.");
									}
								});
							}
				        },
				        close: function () {
				        }
				    }
				});
	});
});

/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx END COMPANY DETAILS xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/

$("#add-company").click(function(e){
	
	var html = '<div class="row"><div class="col-md-12"><form action=""><div class="panel-body"><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Company Name</label><input autofocus type="text" class="form-control col-sm-6" id="company-name" placeholder="Company Name"></div><div class="col-sm-6"><label class="control-label">TIN</label><input type="number" class="form-control col-sm-6" id="tin" placeholder="Tin"></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Industry</label><input type="text" class="form-control col-sm-6" id="industry" placeholder="Industry"></div><div class="col-sm-6"><label class="control-label">Address</label><input type="text" class="form-control col-sm-6" id="address" placeholder="Address"></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Contact No.</label><input type="number" class="form-control col-sm-6" id="contact" placeholder="Contact No."></div><div class="col-sm-6"><label class="control-label">Email</label><input type="text" class="form-control col-sm-6" id="email" placeholder="Email"></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Website</label><input type="text" class="form-control col-sm-6" id="website" placeholder="Website"></div><div class="col-sm-6"></div></div></div></form></div></div></div>';
	
	BootstrapDialog.show({
		title: 'Add Company',
		draggable: true,
		message: html,
		onshown: function()
		{

		},
		buttons: [
					{
						label: 'Proceed',
						cssClass: 'btn btn-sm btn-primary',
						id: 	'add-company-btn',
						action: function(e)
						{
							$("#add-company-btn").attr('disabled', 'true');
							Pace.restart();
							Pace.track(function(){
								var company_name = $("#company-name").val();
								var tin 		 = $("#tin").val();
								var industry 	 = $("#industry").val();
								var address 	 = $("#address").val();
								var contact_no 	 = $("#contact").val();
								var email 		 = $("#email").val();
								var website 	 = $("#website").val();
								var error 		 = 1;
								if(company_name == "")
								{
									alertify.error("Company Name is required.");
									error = 0;
								}
								if(address == "")
								{
									alertify.error("Address is required.");
									error = 0;
								}
								if(industry == "")
								{
									alertify.error("Industry is required.");
									error = 0;
								}
								if(error == 1)
								{
									waitingDialog.show('Creating Company. Please Wait..', {dialogSize: 'sm', progressType: 'primary'});
            						e.close();
            						$("#add-company-btn").attr("disabled", 'true');
									$.post("customerCompany", {company_name:company_name, tin:tin, industry:industry, address:address, contact_no:contact_no, email:email, website:website, add_company:'true'}, function(r){
										if(r == 0)
										{
											waitingDialog.hide();
                							alertify.success("Company successfully created.");
											setTimeout(function(){
												window.location = "customerCompany";
											},1500);
										}
										else
										{
											Pace.restart();
											Pace.track( function(){
												waitingDialog.show('Error Creating Company. Cleaning Database. Please wait..', {dialogSize: 'sm', progressType: 'danger'});
												var company_id = r;
	            								$.post("customerCompany", {clean_db: 'true', company_id:company_id}, function(clean_result){
	            									if(clean_result == 0)
	            									{
														alertify.success("Database cleaned. Create another company.");
	            										waitingDialog.hide();
	                									setTimeout(function(){
															window.location = "customerCompany";
														},1500);
	            									}
	            									else
	            									{
	            										var company_id = clean_result;
			            								$.post("customerCompany", {clean_db: 'true', company_id:company_id}, function(clean_result){
			            									if(clean_result == 0)
			            									{
																alertify.success("Database cleaned. Please try again.");
																waitingDialog.hide();
	                											setTimeout(function(){
																	window.location = "customerCompany";
																},1500);
			            									}
			            									else
			            									{
			            										alertify.error("Cleaning Failed.");
			            									}
			            								});
	            									}
	            								});
	            							});
										}
									});
								}
							});
						}
					},
					{
						label: 'Reset',
						cssClass: 'btn btn-sm btn-default pull-left',
						id: 	'add-company-btn',
						action: function()
						{
							
						}
					}
				]
	});
});

$(".edit-customer-company").click(function(e){
	var company_id = $(this).data('pk');
	var html = '<div class="row"><div class="col-md-12"><form action=""><div class="panel-body"><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Company Name</label><input autofocus type="text" class="form-control col-sm-6" id="company-name" placeholder="Company Name"></div><div class="col-sm-6"><label class="control-label">TIN</label><input type="number" class="form-control col-sm-6" id="tin" placeholder="Tin"></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Industry</label><input type="text" class="form-control col-sm-6" id="industry" placeholder="Industry"></div><div class="col-sm-6"><label class="control-label">Address</label><input type="text" class="form-control col-sm-6" id="address" placeholder="Address"></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Contact No.</label><input type="number" class="form-control col-sm-6" id="contact" placeholder="Contact No."></div><div class="col-sm-6"><label class="control-label">Email</label><input type="text" class="form-control col-sm-6" id="email" placeholder="Email"></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Website</label><input type="text" class="form-control col-sm-6" id="website" placeholder="Website"></div><div class="col-sm-6"><label class="control-label">Status</label><select class="form-control col-sm-6" id="status"><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option></select></div></div></div></form></div></div></div>';
	BootstrapDialog.show({
		title: 'Edit '+ company_id,
		draggable: true,
		message: html,
		onshown: function()
		{
			Pace.restart();
			Pace.track(function(){
				$.post("customerCompany", {get_company_per_id: 'true', company_id:company_id}, function(r){
					var data = jQuery.parseJSON(r);
					$.each(data, function(key, val){
						var company_name = $("#company-name").val(this.COMPANY_NAME);
						var tin 		 = $("#tin").val(this.TIN);
						var industry 	 = $("#industry").val(this.INDUSTRY);
						var address 	 = $("#address").val(this.ADDRESS);
						var contact_no 	 = $("#contact").val(this.CONTACT_NUMBER);
						var email 		 = $("#email").val(this.EMAIL);
						var website 	 = $("#website").val(this.WEBSITE);
						var status 		 = $("#status").val(this.STATUS);
					});
				});
			});
		},
		buttons: [
					{
						label: 'Chart Of Accounts',
						cssClass: 'btn btn-sm btn-success',
						id: 'company-coa',
						action: function()
						{
							window.location = "chartOfAccounts/" + company_id;
						}
					},
					{
						label: 'Save Changes',
						cssClass: 'btn btn-sm btn-primary',
						id: 'edit-company-proceed',
						action: function()
						{
							Pace.restart();
							Pace.track(function(){
								var company_name = $("#company-name").val();
								var tin 		 = $("#tin").val();
								var industry 	 = $("#industry").val();
								var address 	 = $("#address").val();
								var contact_no 	 = $("#contact").val();
								var email 		 = $("#email").val();
								var website 	 = $("#website").val();
								var status 		 = $("#status").val();
								$.post("customerCompany", {company_id:company_id, company_name:company_name, tin:tin, industry:industry, address:address, contact_no:contact_no, email:email, website:website, edit_company:'true', status:status}, function(r){
									if(r == 0)
									{
										alertify.success("Company successfully updated.");
										setTimeout(function(){
											window.location = "customerCompany";
										},1500);
									}
									else
									{
										alertify.error("Error updating company.");
									}
								});
							});
						}
					},
					{
						label: 'Delete',
						cssClass: 'btn btn-sm btn-danger pull-left',
						id: 'delete-company-proceed',
						action: function(e)
						{
							Pace.restart();
							Pace.track(function(){
								$.confirm({
										    title: 'Warning!',
										    content: 'Delete this company?',
										    type: 'red',
										    typeAnimated: true,
										    buttons: {
										        tryAgain: {
										            text: 'Confirm',
										            btnClass: 'btn-red',
										            action: function()
										            {
										            	waitingDialog.show('Cleaning Database. Please wait..', {dialogSize: 'sm', progressType: 'danger'});
	            										e.close();
											            $.post("customerCompany", {clean_db: 'true', company_id:company_id}, function(clean_result){
			            									if(clean_result == 0)
			            									{
																alertify.success("Company deleted.");
																waitingDialog.hide();
	                											setTimeout(function(){
																	window.location = "customerCompany";
																},1500);
			            									}
			            									else
			            									{
			            										alertify.error("Cleaning Failed.");
			            									}
			            								});
													}
										        },
										        close: function () {
										        }
										    }
										});
							});
						}
					}
				]
	});
});

/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx END CUSTOMER COMPANY xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/

$("#add-parent").click(function(e){
	var html = '<div class="row"><div class="col-md-12"><form action=""><div class="panel-body"><div class="form-group"><div class="row"><div class="col-sm-3"><label class="control-label">Account Code</label><input type="number" class="form-control col-sm-3" id="p-account-code" placeholder="Account Code"></div><div class="col-sm-4"><label class="control-label">Account Name</label><input type="text" class="form-control col-sm-4" id="p-account-name" placeholder="Account Name"></div><div class="col-sm-4"><label class="control-label">Account Group</label><select class="form-control col-sm-4 account-group"></select></div><div class="col-sm-1 pull-right"><label class="control-label">&nbsp;</label><button type="button" class="btn btn-sm btn-primary pull-right" id="add-p-accnt-btn"><i class="fa fa-plus"></i></button></div></div></div></form></div></div></div><div id="append"></div></div>';
	BootstrapDialog.show({
		title: 'Parent Accounts List',
		draggable: 'true',
		message: html,
		onshown: function(eDialog)
		{
			$(".modal-body").addClass('scroll-modal');
			Pace.restart();
			Pace.track(function(){
				appendAccountGroup(); // get account group
				$(".account-group").select2();
				$(".bootstrap-dialog").removeAttr('tabindex');
				appendParentAccounts();
			});

			$("#add-p-accnt-btn").click(function(e){
				var account_name = $("#p-account-name").val();
				var account_grp  = $(".account-group").val();
				var account_code = $("#p-account-code").val();
				var account_grp2 = parseFloat(account_grp) + 1000;
				if(account_grp == "NULL" || account_name == "" || account_code == "")
				{
					alertify.error("All fields are required.");
				}
				else if(account_code < account_grp || account_code >= (account_grp2) || account_code == account_grp)
				{
					alertify.error("Invalid Account Code.");
				}
				else
				{
					$("#add-p-accnt-btn").attr('disabled','true');
					Pace.restart();
					Pace.track(function(){
						var url = "../Admin/parentAccounts";
						var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
					    if(segments != "")
					    {
					        var url = "../../Admin/parentAccounts"
					    }
						$.post(url, {account_code:account_code, account_name:account_name, account_grp:account_grp, add_p_accnt:'true', segments:segments}, function(r){
							if(r == 0)
							{
								waitingDialog.show('Adding Parent Account...', {dialogSize: 'sm', progressType: 'primary'});
								$("#p-account-name").val(null);
								$("#p-account-code").val(null);
								$(".account-group").val('').trigger('change');
								appendParentAccounts();	
								waitingDialog.hide();
								alertify.success("Parent Account added.");
								$("#add-p-accnt-btn").removeAttr('disabled');
							}
							else if(r == 0)
							{
								alertify.error("An error has occured");
							}
							else
							{
								alertify.error(r);
							}
						});
					});
				}
			}); //add btn parent accounts
		}
	});	
});

$(document).on('click', '.edit-account', function(e){ 
	var p_account_code = $(this).val();
	var p_account_name = $(this).data('name');
	var html = '<div class="row"><div class="col-md-12"><form action=""><div class="panel-body"><div class="form-group"><div class="row"><div class="col-sm-12"><label class="control-label">Account Name</label><input type="text" class="form-control col-sm-12" id="p-account-name2" placeholder="Account Name" value="'+p_account_name+'"></div></div></div></form></div></div></div></div>';
	Pace.restart();
	Pace.track(function(){
		BootstrapDialog.show({
			title: 'Edit Account - ' + p_account_code,
			draggable: true,
			message: html,
			onshown: function(dialog){
				dialog.setSize(BootstrapDialog.SIZE_SMALL);
			},
			buttons: [	
						{
							label: 'Close',
							cssClass: 'btn btn-sm btn-default pull-left',
							action: function(e)
							{
								e.close();
							}
						},
						{
							label: 'Save Changes',
							cssClass: 'btn btn-sm btn-primary pull-right',
							id: 'save-changes-p-account',
							action: function(edit_event)
							{
								var account_name = $("#p-account-name2").val();
								if(account_name == "")
								{
									alertify.error("All fields are required.");
								}
								else
								{
									Pace.restart();
									Pace.track(function(){
										var url = "../Admin/parentAccounts";
										var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
									    if(segments != "")
									    {
									        var url = "../../Admin/parentAccounts"
									    }
										$.post(url, {segments:segments,account_code:p_account_code, account_name:account_name, edit_p_accnt:'true'}, function(r){
											if(r == 0)
											{
												edit_event.close();
												waitingDialog.show('Updating Parent Account...', {dialogSize: 'sm', progressType: 'primary'});
												appendParentAccounts();	
												waitingDialog.hide();
												alertify.success("Parent Account updated.");
											}
											else if(r == 0)
											{
												alertify.error("An error has occured");
											}
											else
											{
												alertify.error(r);
											}
										});
									});
								}
							}
						}
					 ]
		});
	});
}); // edit account

$(document).on('click', '.delete-account', function(e){ 
	var account_code = $(this).val();
	$.confirm({
		title: 'Warning!',
	    content: 'Are you sure you want to delete this account?',
	    type: 'red',
	    typeAnimated: true,
	    buttons:{
			        tryAgain: {
			            text: 'Confirm',
			            btnClass: 'btn-red',
			            action: function()
			            {
				            Pace.restart();
							Pace.track(function(){
								var url = "../Admin/parentAccounts";
								var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
							    if(segments != "")
							    {
							        var url = "../../Admin/parentAccounts"
							    }
								$.post(url, {delete_acc:'true', account_code:account_code, segments:segments}, function(r){
									if(r == 0)
									{
										alertify.success("Parent Account deleted.");
										waitingDialog.show('Updating Parent Account...', {dialogSize: 'sm', progressType: 'primary'});
										appendParentAccounts();	
										waitingDialog.hide();
									}
									else if(r == 1)
									{
										alertify.error("Error deleting this account.");
									}
									else
									{
										alertify.error(r);
									}
								});
							});
						}
					},
					close: function () {
									    }
				}
	});
});

$("#add-coa").click(function(e){
	var cash 		  = 1;
	var bank 		  = 1;
	var other_exp	  = 1;
	var other_inc	  = 1;
	var accounts_rec  = 1;
	var accounts_pay  = 1;
	var upload 		  = 1;
	var html = '<div class="row"><div class="col-md-12"><ul class="nav nav-tabs"><li class="active"><a href="#popular" data-toggle="tab" id="ind-tab"><b>Individual</b></a></li><li><a href="#comments" id="upload-tab" data-toggle="tab"><b>Upload Group</b></a></li></ul><div class="tab-content panel"><div class="tab-pane active" id="popular"><div class="media-list"><div class="row"><div class="col-md-12"><form action=""><div class="panel-body"><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Account Group</label><input type="text" class="form-control col-sm-6 " id="account-group" placeholder="Account Group" readonly></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Parent Account</label><select class="form-control col-sm-6 parent-account"></select></div><div class="col-sm-6"><label class="control-label">Account Name</label><input type="text" class="form-control col-sm-6" id="account-name" placeholder="Account Name"></div></div></div><div class="form-group"><div class="row"><div class="col-sm-3"><label class="control-label">Cash</label><br><input type="checkbox" class="flat-red form-control col-sm-3" id="cash" name="module_check" ></div><div class="col-sm-3"><label class="control-label">Bank</label><br><input type="checkbox" class="flat-red form-control col-sm-3" name="module_check" id="bank"></div><div class="col-sm-3"><label class="control-label">Other Expense</label><br><input type="checkbox" class="flat-red form-control col-sm-3" name="module_check" id="other-expense"></div><div class="col-sm-3"><label class="control-label">Other Income</label><br><input type="checkbox" class="flat-red form-control" name="module_check" id="other-income"></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Accounts Recievables</label><br><input type="checkbox" class="flat-red form-control col-sm-3" name="module_check" id="accounts-receivables"></div><div class="col-sm-3"><label class="control-label">Accounts Payable</label><br><input type="checkbox" class="flat-red form-control" name="module_check" id="accounts-payable"></div></div></div></div></form></div></div></div></div><div class="tab-pane" id="comments"><div class="media-list"><br>Please download the template <a style="cursor:pointer" id="download-template-coa">here.</a><br><br><div class="col-md-12"><div class="alert alert-dismissable alert-info"><strong>Note: </strong> Please make sure to save as .csv (Comma delimited) file before uploading.</div></div><div class="row"><div class="col-md-12"><form action=""><div class="form-group"><label class="col-sm-3 control-label">File Upload</label><div class="col-sm-9"><div class="input-group"><input type="file" class="form-control" name="coa_file" id="upload-coa-file"></div></span></div></div></div></div></form></div></div></div></div></div></div>';
	BootstrapDialog.show({
		title: 'Add Account',
		draggable: true,
		message: html,
		onshown: function()
		{
			$("#upload-tab").click(function(e){
				upload = 0;
			});
			$("#ind-tab").click(function(e){
				upload = 1;
			});
			$('.flat-red').iCheck({
			   	checkboxClass: 'icheckbox_flat-green'
			});
			getParentAccountsList(); //get Parent account for dropdown
			$(".bootstrap-dialog").removeAttr('tabindex');
			$(".parent-account").select2();

			$(".parent-account").change(function(e){
				var account_code = $(this).val();
				var group_code 	 = $(this).find(":selected").data('value');
				var group_name 	 = $(this).find(":selected").data('pk');
				if(account_code == 'null')
				{
					$("#account-group").val(null);
				}
				else
				{
					$("#account-group").val(group_code +' - '+ group_name);
					$("#account-group").attr('data-code',group_code);
				}
			});
			$(document).on('ifChecked','#cash',function(e){
				cash = 0;
			});
			$(document).on('ifUnchecked','#cash',function(e){
				cash = 1;
			});
			$(document).on('ifChecked','#bank',function(e){
				bank = 0;
			});
			$(document).on('ifUnchecked','#bank',function(e){
				bank = 1;
			});
			$(document).on('ifChecked','#other-expense',function(e){
				other_exp = 0;
			});
			$(document).on('ifUnchecked','#other-expense',function(e){
				other_exp = 1;
			});
			$(document).on('ifChecked','#other-income',function(e){
				other_inc = 0;
			});
			$(document).on('ifUnchecked','#other-income',function(e){
				other_inc = 1;
			});

			$(document).on('ifChecked','#accounts-receivables',function(e){
				accounts_rec = 0;
			});
			$(document).on('ifUnchecked','#accounts-receivables',function(e){
				accounts_rec = 1;
			});

			$(document).on('ifChecked','#accounts-payable',function(e){
				accounts_pay = 0;
			});
			$(document).on('ifUnchecked','#accounts-payable',function(e){
				accounts_pay = 1;
			});

			$("#download-template-coa").click(function(e){
				var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
			    window.location = "../chartOfAccounts/"+segments+"/download_template";
			});
		},
		buttons:[
					{
						label: 'Proceed',
						cssClass: 'btn btn-sm btn-primary pull-right',
						id: 'btn-add-account',
						action: function()
						{
							if(upload == 0)
							{
								$.confirm({
									title: 'Warning!',
								    content: 'The old chart of accounts will be replaced.',
								    type: 'red',
								    typeAnimated: true,
								    buttons:{
										        tryAgain: {
										            text: 'Confirm',
										            btnClass: 'btn-red',
										            action: function()
										            {
											            waitingDialog.show('Uploading Chart of Account...', {dialogSize: 'sm', progressType: 'primary'});
														Pace.restart();
														Pace.track(function(){
															$("#btn-add-account").attr('disabled','true');
															var data = new FormData();
															$.each($("#upload-coa-file")[0].files, function(i, file){
																data.append("coa_file", file);
															});
															var url = "../uploadChartOfAccounts";
															var url2 = "../chartOfAccounts/";
															var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
														    if(segments != "")
														    {
														        var url = "../../Admin/uploadChartOfAccounts"
														        var url2 = "../../Admin/chartOfAccounts/"+segments;
														    }
															document.cookie = "segments=" + segments+ "; path = /";
															$.ajax({
																		url: url,
																		type: "POST",
																		processData: false,
																		data: data,
																		contentType: false,
																		success:function(r)
																		{
																			if(r == 0)
																			{
																				waitingDialog.hide();
																				alertify.success("Chart of Account were successfully uploaded");
																				setTimeout(function(){
																					                	window.location = url2;
																					                }, 1500);
																			}
																			else
																			{
																				alertify.error("Error uploading");
																				$("#create-user-btn").removeAttr('disabled');
																			}
																		}
																	});
														});		
													}
												},
												close: function () {
																    }
											}
								});
							}
							else
							{
								var account_group = $("#account-group").attr('data-code');
								var parent_accnt  = $(".parent-account").val();
								var account_name  = $("#account-name").val();
								if(account_name == "" || parent_accnt == "null" || account_group == "")
								{
									alertify.error("Some fields are required.");
								}
								else
								{
									$("#btn-add-account").attr('disabled','true');
									var url2 = "../Admin/chartOfAccounts";
									var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
								    if(segments != "")
								    {
								        var url = "../../Admin/chartOfAccounts"
								        var url2 = "../../Admin/chartOfAccounts/"+segments;
								    }
									$.post(url, {segments:segments, add_coa:'true', account_name: account_name, parent_accnt:parent_accnt, account_group:account_group, cash:cash, bank:bank, other_inc:other_inc, other_exp:other_exp, accounts_pay:accounts_pay, accounts_rec, accounts_rec}, function(r){
										if(r == 0)
										{
											alertify.success("Account added.");
											setTimeout(function(){
												window.location = url2;
											}, 1500);
										}
										else
										{
											alertify.error("Error adding account.");
											$("#btn-add-account").removeAttr('disabled');
										}
									});
								}
							}
						}
					},
					{
						label: 'Close',
						cssClass: 'btn btn-sm btn-default pull-left',
						action: function(e)
						{
							e.close();
						}
					}
				]

	});
}); // Add chart of accounts

$(".edit-coa").click(function(e){
	var html = '<div class="row"><div class="col-md-12"><form action=""><div class="panel-body"><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Account Group</label><input type="text" class="form-control col-sm-6 " id="account-group" placeholder="Account Group" readonly></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Parent Account</label><input type="text" class="form-control col-sm-6 " id="parent-account" placeholder="Parent Account" readonly></div><div class="col-sm-6"><label class="control-label">Account Name</label><input type="text" class="form-control col-sm-6" id="account-name" placeholder="Account Name"></div></div></div><div class="form-group"><div class="row"><div class="col-sm-3"><label class="control-label">Cash</label><br><input type="checkbox" class="flat-red form-control col-sm-3" id="cash" name="module_check" ></div><div class="col-sm-3"><label class="control-label">Bank</label><br><input type="checkbox" class="flat-red form-control col-sm-3" name="module_check" id="bank"></div><div class="col-sm-3"><label class="control-label">Other Expense</label><br><input type="checkbox" class="flat-red form-control col-sm-3" name="module_check" id="other-expense"></div><div class="col-sm-3"><label class="control-label">Other Income</label><br><input type="checkbox" class="flat-red form-control" name="module_check" id="other-income"></div></div></div><div class="form-group"><div class="row"><div class="col-sm-6"><label class="control-label">Accounts Recievables</label><br><input type="checkbox" class="flat-red form-control col-sm-3" name="module_check" id="accounts-receivables"></div><div class="col-sm-3"><label class="control-label">Accounts Payable</label><br><input type="checkbox" class="flat-red form-control" name="module_check" id="accounts-payable"></div></div></div></form></div></div>';
	var account_code  = $(this).data('value');
	var account_name  = $(this).data('name');
	var group_name 	  = $(this).data('grpname');
	var group_code 	  = $(this).data('grpcode');
	var parent_code   = $(this).data('parentcode');
	var parent_name   = $(this).data('parentname');
	var cash 	      = $(this).data('cash');
	var bank 		  = $(this).data('bank');
	var other_inc     = $(this).data('otherinc');
	var other_exp     = $(this).data('otherexp');
	var accounts_rec  = $(this).data('acct_rec');
	var accounts_pay  = $(this).data('acct_pay');
	BootstrapDialog.show({
		title: 'Edit Account - '+ account_code,
		draggable: true,
		message: html,
		onshown: function()
		{
			$("#account-group").val(group_code +' - '+ group_name);
			$("#account-group").attr('data-grpcode',group_code);
			$("#parent-account").val(parent_code +' - '+ parent_name);
			$("#parent-account").attr('data-grpcode',parent_code);
			$("#account-name").val(account_name);
			if(cash == 0)
			{
				$("#cash").attr('checked', 'true');
			}
			if(bank == 0)
			{
				$("#bank").attr('checked', 'true');
			}
			if(other_inc == 0)
			{
				$("#other-income").attr('checked', 'true');
			}
			if(other_exp == 0)
			{
				$("#other-expense").attr('checked', 'true');
			}
			if(accounts_rec == 0)
			{
				$("#accounts-receivables").attr('checked', 'true');
			}
			if(accounts_pay == 0)
			{
				$("#accounts-payable").attr('checked', 'true');
			}

			$(document).on('ifChecked','#cash',function(e){
				cash = 0;
			});
			$(document).on('ifUnchecked','#cash',function(e){
				cash = 1;
			});
			$(document).on('ifChecked','#bank',function(e){
				bank = 0;
			});
			$(document).on('ifUnchecked','#bank',function(e){
				bank = 1;
			});
			$(document).on('ifChecked','#other-expense',function(e){
				other_exp = 0;
			});
			$(document).on('ifUnchecked','#other-expense',function(e){
				other_exp = 1;
			});
			$(document).on('ifChecked','#other-income',function(e){
				other_inc = 0;
			});
			$(document).on('ifUnchecked','#other-income',function(e){
				other_inc = 1;
			});
			$(document).on('ifChecked','#accounts-receivables',function(e){
				accounts_rec = 0;
			});
			$(document).on('ifUnchecked','#accounts-receivables',function(e){
				accounts_rec = 1;
			});
			$(document).on('ifChecked','#accounts-payable',function(e){
				accounts_pay = 0;
			});
			$(document).on('ifUnchecked','#accounts-payable',function(e){
				accounts_pay = 1;
			});
			$('.flat-red').iCheck({
			   	checkboxClass: 'icheckbox_flat-green'
			});
		},
		buttons: [
					{
						label: 'Save Changes',
						cssClass: 'btn btn-sm btn-primary pull-right',
						action: function()
						{
							account_name = $("#account-name").val();
							Pace.restart();
							Pace.track(function(){
								var url = "../Admin/chartOfAccounts";
								var url2 = "../Admin/chartOfAccounts";
								var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
							    if(segments != "")
							    {
							        var url = "../../Admin/chartOfAccounts"
							        var url2 = "../../Admin/chartOfAccounts/"+segments;
							    }
								$.post(url, {edit_coa: 'true', account_name:account_name, cash:cash, bank:bank, other_exp:other_exp, other_inc:other_inc, account_code:account_code, segments:segments, accounts_rec:accounts_rec, accounts_pay:accounts_pay}, function(r){
									if(r == 0)
									{
										alertify.success("Account updated.");
										setTimeout(function(){
											window.location = url2;
										}, 1500);
									}
									else
									{
										alertify.error("Error updating.");
									}
								});
							});
						}
					},
					{
						label: 'Delete',
						cssClass: 'btn btn-sm btn-danger pull-left',
						action: function()
						{
							$.confirm({
								    title: 'Warning!',
								    content: 'Are you sure you want to delete this account?',
								    type: 'red',
								    typeAnimated: true,
								    buttons: {
								        tryAgain: {
								            text: 'Confirm',
								            btnClass: 'btn-red',
								            action: function()
								            {
									            Pace.restart();
												Pace.track(function(){
													var url2 = "../chartOfAccounts";
													var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
												    if(segments != "")
												    {
												        var url = "../../Admin/chartOfAccounts"
												        var url2 = "../../Admin/chartOfAccounts/"+segments;
												    }
									            	$.post(url, {account_code:account_code, del_coa:'true', segments:segments}, function(r){
														if(r == 0)
														{
															alertify.success('Account deleted!');
															setTimeout(function(){
											                	window.location = url2;
											                }, 1500);
														}
														else
														{
															alertify.error('Error deleting the account!');
														}
													});
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

$("#reset-password").click(function(e){
	var html = '<div class="row"><div class="col-md-12"><form action=""><div class="panel-body"><div class="form-group"><div class="row"><div class="col-sm-12"><label class="control-label">Email Address</label><input type="text" class="form-control col-sm-12" id="email-add" placeholder="Email Address"></div></div></div></form></div></div></div></div>';
	BootstrapDialog.show({
		title: 'Reset Password',
		draggable: true,
		message: html,
		onshown: function(dialog){
			dialog.setSize(BootstrapDialog.SIZE_MEDIUM);
		},
		buttons: [
					{
						label: 'Submit',
						id: 'reset-btn-id',
						cssClass: 'btn btn-sm btn-primary',
						action: function(e)
						{
							var email = $("#email-add").val();
							if(email == "")
							{
								alertify.error("Email address is required.");
							}
							else
							{
								waitingDialog.show('Reseting your Password. Please Wait..', {dialogSize: 'sm', progressType: 'primary'});
								$.post("Admin/resetPassword", {email_add:email}, function(r){
									if(r == 0)
									{
										alertify.success("Password reset. Please check your email.");
										waitingDialog.hide();
										setTimeout(function(){
											location.reload();
										}, 1000);
									}
									else
									{
										alertify.error("Error reseting password. Please try again.");
										waitingDialog.hide();
									}
								});
							}
						}
					},
				 ]
	});
});

//===================================== FUNCTION ===========================================
function appendAccountGroup()
{
	var accnts = "";
	var url = "../Admin/parentAccounts";
	var get_account_group = "true";
    var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
    if(segments != "")
    {
        var url = "../../Admin/parentAccounts"
    }
	$.post(url, {get_account_group:'true'}, function(r){
		var data  = jQuery.parseJSON(r);
		accnts= "<option value='NULL'>Select Account Group..</option>";
		$.each(data, function(key, val){
			accnts += "<option value='"+this.ACCOUNT_CODE+"'>"+this.ACCOUNT_CODE +" - "+this.ACCOUNT_NAME+"</option>";
		});
		$(".account-group").append(accnts);
	});
} //account Group

function appendParentAccounts()
{
	var url = "../Admin/parentAccounts";
	var get_p_accounts = 'company';
    var segments = "";
    segments = $(location).attr('href').split("/").splice(6, 7).join("/");
    if(segments != "")
    {
        var url = "../../Admin/parentAccounts";
        get_p_accounts = 'customer';
    }
	$.post(url, {get_p_accounts:get_p_accounts, segments:segments}, function(r){
		var data = jQuery.parseJSON(r);
		html = '<hr><table id="example1" class="table table-bordered table-striped "><thead><tr><th>Parent Account Name</th><th>Account Group</th><th></th></tr></thead><tbody>';
		$.each(data, function(key, val){
			html += "<tr><td>"+this.PARENT_ACCT_CODE+" - "+this.PARENT_ACCT_NAME+"<input type='text' hidden></td><td>"+this.ACCOUNT_GROUP+" - "+this.ACCOUNT_NAME+"</td><td><button class='btn btn-sm btn-primary edit-account' title='Edit Account' value='"+this.PARENT_ACCT_CODE+"' data-name='"+this.PARENT_ACCT_NAME+"'><i class='fa fa-edit'></i></button><button class='btn btn-sm btn-danger pull-right delete-account' value='"+this.PARENT_ACCT_CODE+"' title='Delete Account'><i class='fa fa-trash'></i></button></td></tr>";
		});
		html += "</tbody></table>";
		$("#append").html(html);
		$("#example1").DataTable();
	});
} //Parent Accounts

function getParentAccountsList()
{
	var url = "../Admin/parentAccounts";
	var segments = $(location).attr('href').split("/").splice(6, 7).join("/");
	get_p_accounts = 'company';
    if(segments != "")
    {
        var url = "../../Admin/parentAccounts";
        get_p_accounts = 'customer';
    }
	$.post(url, {get_p_accounts:get_p_accounts, segments:segments}, function(r){
		var data = jQuery.parseJSON(r);
		var html = "<option value='null'>Select Parent Account..</option>";
		$.each(data, function(key, val){
			html += "<option data-pk='"+this.ACCOUNT_NAME+"' data-value='"+this.ACCOUNT_GROUP+"' value='"+this.PARENT_ACCT_CODE+"'>"+this.PARENT_ACCT_CODE+" - "+this.PARENT_ACCT_NAME+"</option>";
		});
		$(".parent-account").append(html);
	});
}

function appendCompany(user_id)
{
	Pace.restart();
	Pace.track(function(){
		var get_user_customer_line = "true";
		html = '<table id="example1" class="table table-bordered table-striped"><thead><tr><th colspan="2"   style="text-align:center;">Set</th><th  style="text-align:center;">Company Name</th></tr></thead><tbody>';
		$.post("assignCompany", {user_id:user_id, get_user_customer_line:get_user_customer_line}, function(r){
			var data = jQuery.parseJSON(r);
			$.each(data, function(key, val){
				if(this.CUSTOMER_SET == 'TRUE')
				{
					html +="<tr align='center'><td></td><td><input type='checkbox' class='bk-cus flat-red' data-pk="+this.CUSTOMER_ID+"  data-value="+this.GEN_ID+" checked></td><td>"+this.CUSTOMER_ID+" - "+this.COMPANY_NAME+"</td></tr>";
				}
				else
				{
					html +="<tr align='center'><td></td><td><input type='checkbox' class='bk-cus flat-red' data-pk="+this.CUSTOMER_ID+"  data-value="+this.GEN_ID+" ></td><td>"+this.CUSTOMER_ID+" - "+this.COMPANY_NAME+"</td></tr>";
				}
			});	
			html += '</tbody></table>';
			$("#table-append-company").html(html);
			$("#example1").DataTable();
			$('.flat-red').iCheck({
			   	checkboxClass: 'icheckbox_flat-green'
			});
		});
	});
}

function loadPositionLine(position_id)
{
	var getPosLine = "true";
	html = '<table id="example1" class="table table-bordered table-striped"><thead><tr><th></th><th>PARENT MODULE</th><th>MODULE NAME</th></tr></thead><tbody>';
	$.post("position", {position_id:position_id, getPosLine:getPosLine}, function(r){
		var data = jQuery.parseJSON(r);
		
		$.each(data, function(key, val){
			if(this.POS_SET == 'TRUE')
			{
				html +="<tr><td><input type='checkbox' class='bk-module flat-red' name='module_check' data-pk="+this.MODULE_NO+"  data-value="+this.GEN_ID+" checked></td><td>"+this.PARENT_MODULE+"</td><td>"+this.MODULE_NAME+"</td></tr>";
			}
			else
			{
				html +="<tr><td><input type='checkbox' class='bk-module flat-red' name='module_check' data-pk="+this.MODULE_NO+"  data-value="+this.GEN_ID+" ></td><td>"+this.PARENT_MODULE+"</td><td>"+this.MODULE_NAME+"</td></tr>";
			}
		});	
		html += '</tbody></table>';
		$("#table-append").html(html);
		$('.flat-red').iCheck({
		   	checkboxClass: 'icheckbox_flat-green'
		});
		$("#example1").DataTable().$("input:checkbox");
	});
}