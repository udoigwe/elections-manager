$(function () {
	'use strict';

	let token = sessionStorage.getItem('token');

	$(document).ready(function(){

        newElection();

		updateElection()

        dashboard();

		pollsCharts();

		handleChangeElection();

		loadElections();

		loadElection();

		deleteElection();
	});

    function newElection()
    {
        $('#new-election').on('submit', function(e){
            e.preventDefault();
            var form = $(this);
            var fields = form.find('input.required, select.required');

            $('#addOrderModal').find('.btn-close').click();
            
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
            
            $.ajax({
                type: 'POST',
                url: API_URL_ROOT+'/elections',
                data: JSON.stringify(form.serializeObject()),
                dataType: 'json',
                contentType: 'application/json',
                headers:{'x-access-token':token},
                success: function(response)
                {
                    if(response.error === false)
                    {
                        showSimpleMessage("Success", response.message, "success");
                        window.location.reload();
                        unblockUI();
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
        });
    }

	function updateElection()
    {
        $('#update-election').on('submit', function(e){
            e.preventDefault();
            var form = $(this);
			var electionID = form.find('#election-id').val();
            var fields = form.find('input.required, select.required');

            $('#updateElectionModal').find('.btn-close').click();
            
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
            
            $.ajax({
                type: 'PUT',
                url: `${API_URL_ROOT}/elections/${electionID}`,
                data: JSON.stringify(form.serializeObject()),
                dataType: 'json',
                contentType: 'application/json',
                headers:{'x-access-token':token},
                success: function(response)
                {
                    if(response.error === false)
                    {
                        showSimpleMessage("Success", response.message, "success");
                        window.location.reload();
                        unblockUI();
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
        });
    }

	async function deleteElection()
	{
		$('#elections').on('click', '.btn-delete', async function(){

			swal({
                title: "Attention",
                text: "Are you sure you want to delete this election?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes!",
                cancelButtonText: "No!"
                /*closeOnConfirm: false,
                closeOnCancel: false*/
            }).then(async function(result){

				if(result.value)
				{
					const electionID = $(this).attr('data-id');
					
					blockUI();
		
					try
					{
						const response = await $.ajax({
							url: `${API_URL_ROOT}/elections/${electionID}`,
							method: 'DELETE',
							dataType: 'json',
							headers:{'x-access-token':token},
						});
		
						showSimpleMessage("Success", response.message, "success");
						window.location.reload();
						unblockUI();
					}
					catch(e)
					{
						console.log(e.message);
						unblockUI();
					}
				}
				else
				{
					showSimpleMessage('Canceled', 'Process Abborted', 'error');
				}
			})
		})
	}

	function dashboard()
	{
		$.ajax({
			type:'GET',
			url:`${API_URL_ROOT}/dashboard`,
			dataType:'json',
			headers:{'x-access-token':token},
			success:function(response)
			{
				if(response.error === false)
				{
					var dashboard = response.dashboard;

					$('.active-users').text(formatNumber(parseInt(dashboard.activeUsers) || 0));
					$('.active-elections').text(formatNumber(parseInt(dashboard.activeElections) || 0));
					$('.active-candidates').text(formatNumber(parseInt(dashboard.activeCandidates) || 0));
					$('.total-votes').text(formatNumber(parseInt(dashboard.total_votes) || 0));
				}
				else
				{
					showSimpleMessage("Attention", response.message, "error");
				}
			},
			error:function(req, err, status)
			{
				showSimpleMessage("Attention", "ERROR - "+req.status+" : "+req.statusText, "error");
			}
		})
	}

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

	async function loadElections()
	{
		//fetch all active elections
		const response = await $.ajax({
			url: `${API_URL_ROOT}/elections`,
			method: 'GET',
			dataType: 'json',
			headers:{'x-access-token':token},
		});

		const elections = response.data;
		let html = '';
		let serial = 1;

		for(let i=0; i < elections.length; i++) 
		{
			const election = elections[i];

			html += `
				<tr>
					<td>${serial}</td>
					<td>${election.election_title}</td>
					<td>${moment.unix(election.election_created_at).format('MMMM Do YYYY, h:mm:ss a')}</td>
					<td>${election.election_status}</td>
					<td>
						<div class="d-flex">
							<a href="javascript:void(0)" class="btn btn-primary shadow btn-xs sharp me-1 btn-edit" data-id="${election.election_id}" data-bs-toggle="modal" data-bs-target="#updateElectionModal"><i class="fa fa-pencil"></i></a>
							<a href="javascript:void(0)" class="btn btn-danger shadow btn-xs sharp btn-delete" data-id="${election.election_id}"><i class="fa fa-trash"></i></a>
						</div>												
					</td>
				</tr>
			`;

			serial++;
		}

		$('#elections tbody').html(html);
		$('#elections').DataTable({
			columnDefs: [
                { orderable: false, targets: [1,2,3,4] }
            ],
		});
	}

	async function loadElection()
	{
		$('#elections').on('click', '.btn-edit', async function(){
			const electionID = $(this).attr('data-id');
			
			blockUI();

			try
			{
				const response = await $.ajax({
					url: `${API_URL_ROOT}/elections/${electionID}`,
					method: 'GET',
					dataType: 'json',
					headers:{'x-access-token':token},
				});

				const election = response.election;

				$('#updateElectionModal .modal-title').text(election.election_title)
				$('#updateElectionModal').find('#election-title').val(election.election_title);
				$('#updateElectionModal').find('#election-id').val(election.election_id);
				$('#updateElectionModal').find('#election-status').selectpicker('val', election.election_status);

				unblockUI();
			}
			catch(e)
			{
				console.log(e.message);
			}
		})
	}
});