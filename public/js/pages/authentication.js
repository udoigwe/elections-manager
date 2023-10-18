$(function () {

    'use strict';

	$(document).ready(function($) {

        //check if user is already logged in
        //loggedinCheck();
        //remember me
        rememberMe();
        //login
        login();
        //register
        register();
    });

    function login()
    {
        $('#login-form').on('submit', function(e){
            e.preventDefault();
            var form = $(this);
            var email = $("#email").val();
            var password = $("#password").val();
            var fields = form.find('input.required, select.required');
            
            blockUI();

            for(var i=0;i<fields.length;i++)
            {
                if(fields[i].value === "")
                {
                    /*alert(fields[i].id)*/
                    unblockUI();
                    showSimpleMessage("Attention", `${fields[i].name} is required`, "error");
                    $('#'+fields[i].id).focus();
                    return false;
                }
            }
            
            if(!validateEmail(email))
            {
                //alert("All fields are required");
               showSimpleMessage("Attention", "Please provide a valid email address", "error");
               unblockUI();
               return false;
            }
            else
            {
                $.ajax({
                    type: 'POST',
                    url: API_URL_ROOT+'/login',
                    data: JSON.stringify(form.serializeObject()),
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function(response)
                    {
                        if(response.error == false)
                        {
                            var token = response.token; //generated access token from request
                            var role = payloadClaim(token, "user_role"); //the user section from access token
                            var redirectTo = role === 'Admin' ? '/admin/dashboard' : role === "Voter" ? '/voter' : '/observer';

                            setRememberMe(); //store login details to hardrive if any
                            sessionStorage.setItem('token', token); //set access token 

                            //redirect to the user's dashboard
                            window.location = redirectTo;
                        }
                        else
                        {
                            showSimpleMessage("Attention", response.message, "error");
                            unblockUI();
                        }
                    },
                    error: function(req, status, err)
                    {
                        showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.responseText, "error");
                        unblockUI();
                    }
                });
            }
        });
    }

    function register()
    {
        $('#register-form').on('submit', function(e){
            e.preventDefault();
            var form = $(this);
            var email = form.find("#user_email").val();
            var password = form.find("#password").val();
            var repassword = form.find("#re_password").val();
            var fields = form.find('input.required, select.required, textarea.required');
            
            blockUI();

            for(var i=0; i < fields.length; i++)
            {
                if(fields[i].value == "")
                {
                    /*alert(fields[i].id)*/
                    unblockUI();
                    form.find('#'+fields[i].id).focus();
                    showSimpleMessage("Attention", `${fields[i].name} is required`, "error");
                    return false;
                }
            }
            
            if(!validateEmail(email))
            {
                //alert("All fields are required");
                unblockUI();
                showSimpleMessage("Attention", "Please provide a valid email address", "error");
                return false;
            }
            
            if(password !== repassword)
            {
                unblockUI();
                showSimpleMessage("Attention", "Passwords don't match", "error");
                return false;
            } 
            
            $.ajax({
                type: 'POST',
                url: `${API_URL_ROOT}/sign-up`,
                data: JSON.stringify(form.serializeObject()),
                dataType: 'json',
                contentType: 'application/json',
                success: function(response)
                {
                    if(response.error == false)
                    {
                        unblockUI();
                        showSimpleMessage("Success", response.message, "success");
                        form.get(0).reset();
                        window.location = '/signin';
                    }
                    else
                    {
                        unblockUI();
                        showSimpleMessage("Attention", response.message, "error");
                    }
                },
                error: function(req, status, err)
                {
                    showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.responseText, "error");
                    unblockUI();
                }
            });
        });
    }

    function loadStates()
    {
        $.getJSON( "assets/js/nigeria-state-and-lgas.json", function( data ) {
            var html = `<option value="">Please select</option>`;
            
            $.each( data, function( key, val ) {
                html += `<option value="${data[key].state}">${data[key].state}</option>`;
            });

            $('.state').html(html);
            $('.state').niceSelect('update');
        });
    }

    function onchangeState()
    {
        $('.state').on('change', function(){
            var parentForm = $(this).parents('form');
            var value = $(this).val();
            
            if(value !== '')
            {
                $.getJSON( "assets/js/nigeria-state-and-lgas.json", function( data ) {
                    var html = `<option value="">Please select</option>`;
                    var stateKey;

                    for (let i = 0; i < data.length; i++)
                    {
                        if(data[i].state === value)
                        {
                            stateKey = i;
                            break;
                        }
                    }
                    
                    $.each( data[stateKey].lgas, function( key, val ) {

                        html += `<option value="${val}">${val}</option>`;
                    });

                    parentForm.find('.lg').html(html);
                    parentForm.find('.lg').niceSelect('update');
                });
            }
            else
            {
                parentForm.find('.lg').html(`<option value="">Local Government</option>`);
                parentForm.find('.lg').niceSelect('update');
            }
        });
    }

    /*function onUserRoleChange()
    {
        $('#user_role').on('change', function(){
            var userRole = $(this).val();
            
            if(userRole == "Customer")
            {
                $('.applicant-div').slideUp(1000);
                $('.applicant-div').find('.required').removeClass('required');
            }
            else
            {
                $('.applicant-div').slideDown(1000);
                $('.applicant-div').find('#next_of_kin, #next_of_kin_phone').addClass('required');
            }
        });
    }*/
}); 