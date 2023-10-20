$(function () {

    'use strict';

    let token = sessionStorage.getItem('token');

	$(document).ready(function(){

        loadUsers();

        $('#users').on('click', '.btn-edit', function(){
            var userID = $(this).attr('data-id');
            var editModal = $('#editModal');

            //fetch user details
            $.ajax({
                url: `${API_URL_ROOT}/users/${userID}`,
                type: 'GET',
                dataType: 'json',
                headers:{'x-access-token':token},
                success: function(response)
                {
                    if(response.error === false)
                    {
                        var user = response.user;
                        //var avatarLabel = user.user_image_url ? `Change User Avatar (Optional)` : `Upload User Avatar`;
                        editModal.find('.modal-title').text(`${user.user_firstname} ${user.user_lastname}`);
                        editModal.find('.user_firstname').val(user.user_firstname);
                        editModal.find('.user_lastname').val(user.user_lastname);
                        editModal.find('.user_email').val(user.user_email);
                        editModal.find('.user_status').selectpicker('val', user.user_status);
                        editModal.find('.user_role').selectpicker('val', user.user_role);
                        editModal.find('.user_id').val(user.user_id);
                        //editModal.find('.election_id').selectpicker('refresh');
                    }
                    else
                    {
                        showSimpleMessage("Attention", response.message, "error");   
                    }
                },
                error: function(req, status, error)
                {
                    showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.responseText, "error");
                }
            });
        }); 

        $('#users').on('click', '.btn-delete', function(){
            var userID = $(this).attr('data-id');
            deleteUser(userID);  
        }); 

        //submit new user
        $('#new-user').on('submit', function(e){
            e.preventDefault();
            newUser();
        });

        //edit user
        $('#update-user').on('submit', function(e){
            e.preventDefault();
            updateUser();
        });

        $("#user-filter").on("submit", function(event){

            event.preventDefault();
            
            var form = $(this);
            var status = form.find('.user_status').find('option:selected').val();
            var role = form.find('.user_role').find('option:selected').val();
            var fields = form.find('input.required, select.required');

            blockUI();         

            for(var i=0;i<fields.length;i++)
            {
                if(fields[i].value == "")
                {
                    /*alert(fields[i].id);*/
                    unblockUI();  
                    showSimpleMessage("Attention", `${fields[i].name} is required`, "error");
                    $('#'+fields[i].id).focus();
                    return false;
                }
            }

            loadUsers(status, role);
            unblockUI();                 
        });
    });

    //internal function to register new user
    function newUser() 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to add this user?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!"
            /*closeOnConfirm: false,
            closeOnCancel: false*/
        }).then(function(result){

            if (result.value) 
            {
                //name vairables
                var form = $('#new-user'); //form
                var password = form.find('.password').val();
                var repassword = form.find('.re-password').val();
                var table = $('#users').DataTable();
                var fields = form.find('input.required, select.required, textarea.required');

                blockUI();         

                for(var i=0;i<fields.length;i++)
                {
                    if(fields[i].value == "")
                    {
                        /*alert(fields[i].id);*/
                        unblockUI();  
                        showSimpleMessage("Attention", `${fields[i].name} is required`, "error");
                        $('#'+fields[i].id).focus();
                        return false;
                    }
                }

                if(password !== repassword)
                {
                    unblockUI();
                    showSimpleMessage("Attention", `Passwords dont match`, "error");
                    return false;
                }

                $.ajax({
                    type: 'POST',
                    url: `${API_URL_ROOT}/users`,
                    data: new FormData(form[0]),
                    dataType: 'json',
                    processData: false,
                    contentType: false,
                    cache: false,
                    headers:{'x-access-token':token},
                    success: function(response)
                    {
                        if(response.error === false)
                        {
                            unblockUI(); 
                            showSimpleMessage("Success", response.message, "success");
                            table.ajax.reload(null, false);
                            form.get(0).reset();
                            $('#new-user').find('.default-select').selectpicker('refresh');
                            //window.location.reload();
                        }
                        else
                        {
                            unblockUI();   
                            showSimpleMessage("Attention", response.message, "error");
                        }
                    },
                    error: function(req, status, error)
                    {
                        unblockUI();  
                        showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.responseText, "error");
                    }
                });   
            } 
            else 
            {
                showSimpleMessage('Canceled', 'Process Abborted', 'error');
            }
        });
    }

    //internal function to update user
    function updateUser() 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to update this user?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!"
            /*closeOnConfirm: false,
            closeOnCancel: false*/
        }).then(function(result){

            if (result.value) 
            {
                //name vairables
                var form = $('#update-user'); //form
                var userID = form.find('.user_id').val();
                var table = $('#users').DataTable();
                var fields = form.find('input.required, select.required, textarea.required');

                blockUI();

                for(var i=0;i<fields.length;i++)
                {
                    if(fields[i].value == "")
                    {
                        /*alert(fields[i].id);*/
                        unblockUI();  
                        showSimpleMessage("Attention", `${fields[i].name} is required`, "error");
                        $('#'+fields[i].id).focus();
                        return false;
                    }
                }
                    
                $.ajax({
                    type: 'PUT',
                    url: `${API_URL_ROOT}/users/${userID}`,
                    data: new FormData(form[0]),
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    cache: false,
                    headers:{'x-access-token':token},
                    success: function(response)
                    {
                        if(response.error == false)
                        {
                            unblockUI();
                            showSimpleMessage("Success", response.message, "success");
                            table.ajax.reload(null, false);
                            $('#editModal').find('.btn-close').click();
                            //window.location.reload();
                        }
                        else
                        {
                            unblockUI();
                            showSimpleMessage("Attention", response.message, "error");
                        }   
                    },
                    error: function(req, status, error)
                    {
                        unblockUI();
                        showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.responseText, "error");
                    }
                });
            } 
            else 
            {
                showSimpleMessage('Canceled', 'Process Abborted', 'error');
            }
        });
    }

    //internal function to delete user
    function deleteUser(userID) 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to delete this user?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!"
            /*closeOnConfirm: false,
            closeOnCancel: false*/
        }).then(function(result){

            if (result.value) 
            {
                blockUI();         

                $.ajax({
                    type: 'DELETE',
                    url: `${API_URL_ROOT}/users/${userID}`,
                    dataType: 'json',
                    headers: {'x-access-token':token},
                    success: function(response)
                    {
                        if(response.error == false)
                        {
                            unblockUI();
                            showSimpleMessage("Success", response.message, "success");
                            $('#users').DataTable().ajax.reload(null, false);
                            //window.location.reload(); 
                        }
                        else
                        {
                            unblockUI();
                            showSimpleMessage("Attention", response.message, "error");
                        }
                    },
                    error: function(req, status, error)
                    {
                        showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.statusText, "error");
                    }
                });
            } 
            else 
            {
                showSimpleMessage('Canceled', 'Process Abborted', 'error');
            }
        });
    }

    //load users
    function loadUsers(status = '', role = '')
    {
        var table = $('#users');

        table.DataTable({
            lengthMenu: [7, 10, 20, 50, 100, 500, 1000],
            stripeClasses: [],
            drawCallback: function () { $('.dataTables_paginate > .pagination').addClass(' pagination-style-13 pagination-bordered mb-5'); },
            language: {
                infoEmpty: "<span style='color:red'><b>No records found</b></span>"
            },
            processing: true,
            serverSide: false,
            destroy: true,
            autoWidth: false,
            pageLength: 100,
            ajax: {
                type: 'GET',
                url: `${API_URL_ROOT}/users?user_status=${status}&user_role=${role}`,
                dataType: 'json',
                headers:{'x-access-token':token},
                async: true,
                error: function(xhr, error, code)
                {
                    console.log(xhr);
                    console.log(code);
                }
            },
            columnDefs: [
                { orderable: false, targets: [1, 2, 3,5,6,7,8] }
            ],
            order: [[0, "asc"]],
            columns: [
                {
                    data: 'user_id',
                    render: function (data, type, row, meta) 
                    {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {data: 'user_firstname'},
                {data: 'user_lastname'},
                {data: 'user_email'},
                {data: 'user_ssn'},
                {data: 'user_role'},
                {
                    data: 'user_created_at',
                    render: function(data, type, row, meta)
                    {
                        var createdAt = moment.unix(data).format('MMMM Do YYYY, h:mm:ss a');
                        return createdAt;
                    }
                },
                {
                    data: 'user_status',
                    render: function(data, type, row, meta)
                    {
                        var status = data == "Active" ? `<span class="badge outline-badge-success">${data}</span>` : `<span class="badge outline-badge-danger">${data}</span>`;
                        return status;
                    }
                },
                {
                    data: 'user_id',
                    render: function(data, type, row, meta)
                    {
                        var actions = `
                            <div class="d-flex">
                                <a href="javascript:void(0)" class="btn btn-primary shadow btn-xs sharp me-1 btn-edit" data-id="${data}" data-bs-toggle="modal" data-bs-target="#editModal"><i class="fa fa-pencil"></i></a>
                                <a href="javascript:void(0)" class="btn btn-danger shadow btn-xs sharp btn-delete" data-id="${data}"><i class="fa fa-trash"></i></a>
                            </div>
                        `;

                        return actions;
                    }
                }
            ] 
        });
    }
});  