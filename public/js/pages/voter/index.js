$(function () {
	'use strict';

	let token = sessionStorage.getItem('token');

	$(document).ready(function(){

		pollsCharts();

		handleChangeElection();

		loadElections();

        loadCandidates();

        loadBio();

        vote();

        loadMyVotes();
	});

    async function pollsCharts()
    {
        try
        {
            //fetch all active elections
            const response = await $.ajax({
                url: `${API_URL_ROOT}/elections?election_status=Active`,
                method: 'GET',
                dataType: 'json',
                headers:{'x-access-token':token},
            });

            const elections = response.data;

            let candidates = [];
            let polls = [];
            let html = '';

			if(elections.length > 0)
			{
				//get the last election polls
				const response1 = await $.ajax({
					url: `${API_URL_ROOT}/ranks?election_id=${elections[0].election_id}`,
					method: 'GET',
					dataType: 'json',
					headers:{'x-access-token':token},
				});
	
				const selectedElectionID = elections[0].election_id;
				const votes = response1.data;
	
				for(let i = 0; i < votes.length; i++)
				{
					const vote = votes[i];
	
					candidates.push(vote.candidate_fullname);
					polls.push(vote.entry_count);
				}
	
				for(let i = 0; i < elections.length; i++)
				{
					const election = elections[i];
					const selected = election.election_id === selectedElectionID ? 'selected' : '';
	
					html += `
						<option value="${election.election_id} ${selected}">${election.election_title}</option>
					`
				}
			}

           $('.elections-dropdown').html(html);

			setTimeout(function() {
				$('.elections-dropdown').addClass('default-select');
				$('.elections-dropdown').selectpicker();
			}, 3000);

            //$('.polls').find(".default-select").selectpicker('refresh')

            displayPollsChart(candidates, polls)
        }
        catch(e)
        {
            console.log(e.message)
        }
    }

    function displayPollsChart(candidates, polls)
    {
		
		var options  = {
			series: [
				{
					name: 'Polls',
					data: polls
				}
			],
			chart: {
				type: 'bar',
				height: 370,
				
				
				toolbar: {
					show: false,
				},
				
			},
			plotOptions: {
				bar: {
					horizontal: false,
					endingShape:'rounded',
					columnWidth: '45%',
					
				},
			},
			colors:['#1E33F2', /* '#FF5045' */],
			dataLabels: {
				enabled: false,
			},
			markers: {
				shape: "circle",
			},
			legend: {
				show: false,
				fontSize: '12px',
				labels: {
					colors: '#000000',
				},
				markers: {
					width: 18,
					height: 18,
					strokeWidth: 0,
					strokeColor: '#fff',
					fillColors: undefined,
					radius: 15,	
				}
			},
			stroke: {
				show: true,
				width: 6,
				colors: ['transparent']
			},
			grid: {
				borderColor: '#eee',
			},
			xaxis: {
				
				categories: candidates,
				labels: {
					style: {
						colors: '#787878',
						fontSize: '13px',
						fontFamily: 'poppins',
						fontWeight: 100,
						cssClass: 'apexcharts-xaxis-label',
					},
				},
				crosshairs: {
					show: false,
				}
			},
			yaxis: {
				labels: {
					offsetX:-16,
					style: {
						colors: '#787878',
						fontSize: '13px',
						fontFamily: 'poppins',
						fontWeight: 100,
						cssClass: 'apexcharts-xaxis-label',
					},
				},
			},
			fill: {
				opacity: 1,
				colors:['#1E33F2', /* '#FF5045' */],
			},
			tooltip: {
				y: {
					formatter: function (val) {
						//return "$ " + val + " thousands"
						return val;
					}
				}
			},
			responsive: [{
				breakpoint: 575,
				options: {
					plotOptions: {
						bar: {
							columnWidth: '80%',
						},
					},
					chart:{
						height:250,
					}
				}
			}]
		};

		var chart = new ApexCharts(document.querySelector("#chartBarRunning"), options);
		chart.render(); 
    }

	function handleChangeElection()
	{
		$('.elections-dropdown').on('change', async function(){
			const electionID = $(this).val();
			
			let candidates = [];
            let polls = [];

            //get the selected election polls
            const response = await $.ajax({
                url: `${API_URL_ROOT}/ranks?election_id=${electionID}`,
                method: 'GET',
                dataType: 'json',
                headers:{'x-access-token':token},
            });

            const votes = response.data;

            for(let i = 0; i < votes.length; i++)
            {
                const vote = votes[i];

                candidates.push(vote.candidate_fullname);
                polls.push(vote.entry_count);
            } 

			var options  = {
                series: [
                    {
                        name: 'Polls',
                        data: []
                    }
                ],
                chart: {
                    type: 'bar',
                    height: 370,
                    
                    
                    toolbar: {
                        show: false,
                    },
                    
                },
                plotOptions: {
                    bar: {
                        horizontal: false,
                        endingShape:'rounded',
                        columnWidth: '45%',
                        
                    },
                },
                colors:['#1E33F2', /* '#FF5045' */],
                dataLabels: {
                    enabled: false,
                },
                markers: {
                    shape: "circle",
                },
                legend: {
                    show: false,
                    fontSize: '12px',
                    labels: {
                        colors: '#000000',
                    },
                    markers: {
                        width: 18,
                        height: 18,
                        strokeWidth: 0,
                        strokeColor: '#fff',
                        fillColors: undefined,
                        radius: 15,	
                    }
                },
                stroke: {
                    show: true,
                    width: 6,
                    colors: ['transparent']
                },
                grid: {
                    borderColor: '#eee',
                },
                xaxis: {
                    
                    categories: [],
                    labels: {
                        style: {
                            colors: '#787878',
                            fontSize: '13px',
                            fontFamily: 'poppins',
                            fontWeight: 100,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    },
                    crosshairs: {
                        show: false,
                    }
                },
                yaxis: {
                    labels: {
                        offsetX:-16,
                        style: {
                            colors: '#787878',
                            fontSize: '13px',
                            fontFamily: 'poppins',
                            fontWeight: 100,
                            cssClass: 'apexcharts-xaxis-label',
                        },
                    },
                },
                fill: {
                    opacity: 1,
                    colors:['#1E33F2', /* '#FF5045' */],
                },
                tooltip: {
                    y: {
                        formatter: function (val) {
                            //return "$ " + val + " thousands"
							return val;
                        }
                    }
                },
                responsive: [{
                    breakpoint: 575,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: '80%',
                            },
                        },
                        chart:{
                            height:250,
                        }
                    }
                }]
            };
    
            var chart = new ApexCharts(document.querySelector("#chartBarRunning"), options);
            chart.render();

			chart.updateOptions({
				series: [
				  {
					name: 'Polls',
					data: polls,
				  },
				],
				xaxis: {
				  categories: candidates,
				},
			});
		})
	}
    
    function loadCandidates()
	{
		$('.elections-list').on('change', async function(){
			const electionID = $(this).val();
			
            let html = '';

            if(electionID !== "")
            {
                //get the selected election candidates
                const response = await $.ajax({
                    url: `${API_URL_ROOT}/candidates?candidate_status=Active&election_id=${electionID}`,
                    method: 'GET',
                    dataType: 'json',
                    headers:{'x-access-token':token},
                });
    
                const candidates = response.data;
    
                for(let i = 0; i < candidates.length; i++)
                {
                    const candidate = candidates[i];
    
                    html += `
                        <div class="col-xl-3 col-xxl-3 col-md-4 col-sm-6">
                            <div class="card">
                                <div class="card-body product-grid-card">
                                    <div class="new-arrival-product">
                                        <div class="new-arrivals-img-contnent">
                                            <img class="img-fluid" src="${API_HOST_NAME}/images/avatars/${candidate.candidate_avatar}" alt="${candidate.candidate_fullname}">
                                        </div>
                                        <div class="new-arrival-content text-center mt-3">
                                            <h4>${candidate.candidate_fullname}</h4>
                                            <button type="button" class="btn btn-info btn-rounded btn-bio light" data-bs-toggle="modal" data-bs-target="#bioModal" data-id="${candidate.candidate_id}">Bio</button>
                                            <button type="submit" class="btn btn-success btn-rounded btn-vote light" data-id="${candidate.candidate_id}">Vote</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                } 

                $('.candidate-list').html(html)
            }
            else
            {
                $('.candidate-list').html("")
            }
		})
	}

    function loadBio()
    {
        $('.candidate-list').on('click', '.btn-bio', async function(){
			const candidateID = $(this).attr('data-id');
            const bioModal = $('#bioModal');
			
            //get the selected candidate's info
            const response = await $.ajax({
                url: `${API_URL_ROOT}/candidates/${candidateID}`,
                method: 'GET',
                dataType: 'json',
                headers:{'x-access-token':token},
            });
    
            if(response.error === false)
            {
                const candidate = response.candidate;

                bioModal.find('.modal-title').text(candidate.candidate_fullname);
                bioModal.find('.modal-body').text(candidate.candidate_bio);
            }
            else
            {
                bioModal.find('.modal-body').text("");
            }
		}) 
    }

    function vote()
    {
        $('.candidate-list').on('click', '.btn-vote', async function(){

            const candidate_id = $(this).attr('data-id');
            const election_id = $('.elections-list').find('option:selected').val();

            console.log({election_id, candidate_id})

            swal({
                title: "Attention",
                text: "Are you sure you want to vote this candidate? Your selection will be irreversible",
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
    
                    blockUI();

                    if(!election_id || !candidate_id)
                    {
                        unblockUI();
                        showSimpleMessage("Attention", "Invalid Request", "error");
                        return false;
                    }
                        
                    $.ajax({
                        type: 'POST',
                        url: `${API_URL_ROOT}/votes`,
                        data: JSON.stringify({election_id, candidate_id}),
                        dataType: 'json',
                        contentType: 'application/json',
                        headers:{'x-access-token':token},
                        success: function(response)
                        {
                            if(response.error == false)
                            {
                                unblockUI();
                                showSimpleMessage("Success", response.message, "success");
                                window.location.reload();
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
		}) 
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
        
        $('.elections-select').append(html);

        setTimeout(function() {
            $('.elections-select').addClass('default-select');
            $('.elections-select').selectpicker();
        }, 1000);
	}

    //load my votes
    function loadMyVotes()
    {
        var table = $('#my-votes');
        var userID = payloadClaim(token, 'user_id');

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
                url: `${API_URL_ROOT}/votes?voter_id=${userID}`,
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
                { orderable: false, targets: [1, 2, 3,4,5,6] }
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
});