$(function () {

    'use strict';

    let token = sessionStorage.getItem('token');

	$(document).ready(function(){

        loadVotes();
        loadElections();
        loadCandidates();
        loadVoters();

        $("#votes-filter").on("submit", function(event){

            event.preventDefault();
            
            var form = $(this);
            var candidateID = form.find('.candidate_id').find('option:selected').val();
            var electionID = form.find('.election_id').find('option:selected').val();
            var voterID = form.find('.voter_id').find('option:selected').val();
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

            loadVotes(electionID, candidateID, voterID);
            unblockUI();                 
        });
    });

    //load votes
    function loadVotes(electionID = '', candidateID = '', voterID = '')
    {
        var table = $('#votes');

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
                url: `${API_URL_ROOT}/votes?election_id=${electionID}&candidate_id=${candidateID}&voter_id=${voterID}`,
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
                { orderable: false, targets: [1, 2, 3, 4, 5,6] }
            ],
            order: [[0, "asc"]],
            columns: [
                {
                    data: 'vote_id',
                    render: function (data, type, row, meta) 
                    {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                },
                {data: 'election_title'},
                {data: 'candidate_fullname'},
                {data: 'voter_name'},
                {
                    data: 'vote_timestamp',
                    render: function(data, type, row, meta)
                    {
                        var createdAt = moment.unix(data).format('MMMM Do YYYY, h:mm:ss a');
                        return createdAt;
                    }
                },
                {data: 'ip_address'},
                {data: 'user_agent'}
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

    async function loadCandidates()
	{
		//fetch all candidates
		const response = await $.ajax({
			url: `${API_URL_ROOT}/candidates`,
			method: 'GET',
			dataType: 'json',
			headers:{'x-access-token':token},
		});

		const candidates = response.data;
		let html = '';

		for(let i=0; i < candidates.length; i++) 
		{
			const candidate = candidates[i];

			html += `
                <option value="${candidate.candidate_id}">${candidate.candidate_fullname}</option>
			`;
		}

		$('.candidate_id').append(html);
        $('.candidate_id').selectpicker('refresh');
	}

    async function loadVoters()
	{
		//fetch all users
		const response = await $.ajax({
			url: `${API_URL_ROOT}/users`,
			method: 'GET',
			dataType: 'json',
			headers:{'x-access-token':token},
		});

		const voters = response.data;
		let html = '';

		for(let i=0; i < voters.length; i++) 
		{
			const voter = voters[i];

			html += `
                <option value="${voter.user_id}">${voter.user_firstname} ${voter.user_lastname}</option>
			`;
		}

		$('.voter_id').append(html);
        $('.voter_id').selectpicker('refresh');
	}
});  