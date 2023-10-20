$(function () {

    'use strict';

    let token = sessionStorage.getItem('token');

	$(document).ready(function(){

        loadElections();
        loadCandidates();

        $('#candidates').on('click', '.btn-edit', function(){
            var candidateID = $(this).attr('data-id');
            var editModal = $('#editModal');

            //fetch user details
            $.ajax({
                url: `${API_URL_ROOT}/candidates/${candidateID}`,
                type: 'GET',
                dataType: 'json',
                headers:{'x-access-token':token},
                success: function(response)
                {
                    if(response.error === false)
                    {
                        var candidate = response.candidate;
                        //var avatarLabel = user.user_image_url ? `Change User Avatar (Optional)` : `Upload User Avatar`;
                        editModal.find('.modal-title').text(candidate.candidate_fullname);
                        editModal.find('.candidate_image').attr('src', `${API_HOST_NAME}/images/avatars/${candidate.candidate_avatar}`);
                        editModal.find('.election_id').val(candidate.election_id);
                        editModal.find('.candidate_fullname').val(candidate.candidate_fullname);
                        editModal.find('.candidate_status').selectpicker('val', candidate.candidate_status);
                        editModal.find('.candidate_bio').val(candidate.candidate_bio);
                        editModal.find('.candidate_id').val(candidate.candidate_id);
                        editModal.find('.election_id').selectpicker('refresh');
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

        $('#candidates').on('click', '.btn-delete', function(){
            var candidateID = $(this).attr('data-id');
            deleteCandidate(candidateID);  
        }); 

        //submit new candidate
        $('#new-candidate').on('submit', function(e){
            e.preventDefault();
            newCandidate();
        });

        //edit candidate
        $('#update-candidate').on('submit', function(e){
            e.preventDefault();
            updateCandidate();
        });

        $("#candidate-filter").on("submit", function(event){

            event.preventDefault();
            
            var form = $(this);
            var status = form.find('.candidate_status').find('option:selected').val();
            var electionID = form.find('.election_id').find('option:selected').val();
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

            loadCandidates(electionID, status);
            unblockUI();                 
        });
    });

    //internal function to register new candidate
    function newCandidate() 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to add this candidate?",
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
                var form = $('#new-candidate'); //form
                var table = $('#candidates').DataTable();
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
                    type: 'POST',
                    url: `${API_URL_ROOT}/candidates`,
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
                            $('.election_id').selectpicker('refresh');
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

    //internal function to update candidate
    function updateCandidate() 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to update this candidate?",
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
                var form = $('#update-candidate'); //form
                var candidateID = form.find('.candidate_id').val();
                var table = $('#candidates').DataTable();
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
                    url: `${API_URL_ROOT}/candidates/${candidateID}`,
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
                            $('#editModal').find('.avatar').val('');
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

    //internal function to delete candidate
    function deleteCandidate(candidateID) 
    {
        swal({
            title: "Attention",
            text: "Are you sure you want to delete this candidate?",
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
                    url: `${API_URL_ROOT}/candidates/${candidateID}`,
                    dataType: 'json',
                    headers: {'x-access-token':token},
                    success: function(response)
                    {
                        if(response.error == false)
                        {
                            unblockUI();
                            showSimpleMessage("Success", response.message, "success");
                            $('#candidates').DataTable().ajax.reload(null, false);
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

    //load candidates
    function loadCandidates(electionID = '', candidateStatus = '')
    {
        var table = $('#candidates');

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
                url: `${API_URL_ROOT}/candidates?election_id=${electionID}&candidate_status=${candidateStatus}`,
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
                { orderable: false, targets: [1, 2, 3,5,6,7] }
            ],
            order: [[0, "asc"]],
            columns: [
                {
                    data: 'candidate_id',
                    render: function (data, type, row, meta) 
                    {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {
                    data: 'candidate_avatar',
                    render: function(data, type, row, meta)
                    {
                        return `<img src="${API_HOST_NAME}/images/avatars/${data}" height="50" width="50" />`;
                    }
                },
                {data: 'election_title'},
                {data: 'candidate_fullname'},
                {data: 'votes'},
                {
                    data: 'candidate_created_at',
                    render: function(data, type, row, meta)
                    {
                        var createdAt = moment.unix(data).format('MMMM Do YYYY, h:mm:ss a');
                        return createdAt;
                    }
                },
                {
                    data: 'candidate_status',
                    render: function(data, type, row, meta)
                    {
                        var status = data == "Active" ? `<span class="badge outline-badge-success">${data}</span>` : `<span class="badge outline-badge-danger">${data}</span>`;
                        return status;
                    }
                },
                {
                    data: 'candidate_id',
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

    async function loadElections()
	{
		//fetch all active elections
		const response = await $.ajax({
			url: `${API_URL_ROOT}/elections?election_status=Active`,
			method: 'GET',
			dataType: 'json',
			headers:{'x-access-token':token},
		});

		const elections = response.data;
		let html = '';

		for(let i=0; i < elections.length; i++) 
		{
			const election = elections[i];

			html += `
                <option value="${election.election_id}">${election.election_title}</option>
			`;
		}

		$('.election_id').append(html);
        $('.election_id').selectpicker('refresh');
	}
});  