$(function () {
	'use strict';

	let token = sessionStorage.getItem('token');
	/*const ps = new PerfectScrollbar(document.querySelector('.mt-container'));
	const secondUpload = new FileUploadWithPreview('mySecondImage')*/

	/* Query(window).on('load',function(){
		setTimeout(function(){
			dzChartlist.load();
		}, 1000); 
		
	}); */

	$(document).ready(function(){

        newElection();

        dashboard();

		pollsCharts();

		handleChangeElection();

		loadElections();
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

            $('.elections-select').html(html);

			setTimeout(function() {
				$('.elections-select').addClass('default-select');
				$('.elections-select').selectpicker();
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
		$('.elections-select').on('change', async function(){
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
							<a href="#" class="btn btn-primary shadow btn-xs sharp me-1"><i class="fa fa-pencil"></i></a>
							<a href="#" class="btn btn-danger shadow btn-xs sharp"><i class="fa fa-trash"></i></a>
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

	function loadActivities(activities)
	{
		var activitiesHTML = '';

		//user activity log
		for(var i=0; i < activities.length; i++)
		{
			activitiesHTML += `
                <div class="inbox-item">
                    <a href="#">
                        <p class="inbox-item-text">`+activities[i].activity.toUpperCaseWords()+`</p>
                        <p class="inbox-item-author">`+activities[i].action+`</p>
                        <p class="inbox-item-date">`+moment.unix(activities[i].created_at).fromNow()+`</p>
                    </a>
                </div>
            `;
		}

		$('.timeline-line').html(activitiesHTML);
	}

	function loadRecentLisitings(places)
    {
    	var formHTML = '';

		if ( $.fn.dataTable.isDataTable( '#recent-listings' ) ) {
		    $('#recent-listings').DataTable().destroy();
		}

		$('#recent-listings').DataTable ({
            autoWidth: false,
			paging: false,
    		searching: false,
	        data : places,
	       	columns : [
	            { 
	            	data : "place_id",
	            	render: function (data, type, row, meta) 
                    {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
	            },
	            { data : "host" },
	            { data : "category" },
	            { data : "place_type" },
                { data : "place_name" },
	            { data : "place_contact_address" },
	            { data : "place_phone" },
	            { 
	            	data : "place_visibility_expiration_timestamp",
	            	render: function(data, type, row, meta)
	            	{
	            		return moment.unix(data).format('MMMM Do YYYY') 
	            	}
	            },
	            { 
	            	data : "place_visibility_expiration_timestamp",
	            	render:function(data, type, row, meta)
                    {
                        var status = data < Math.floor(Date.now() / 1000) ? `<span class="badge badge-danger"> Yes </span>` : `<span class="badge badge-success"> No </span>`;
                        return status;
                    }
	            },
	            { 
	            	data : "place_status",
	            	render:function(data, type, row, meta)
                    {
                        var status = data == "Unpublished" ? `<span class="badge badge-danger"> `+data+` </span>` : `<span class="badge badge-success"> `+data+` </span>`;
                        return status;
                    }
	            }
	        ],
	        columnDefs: [ { orderable: false, targets: [1, 2, 3, 4, 5, 6, 7, 8, 9] } ]
	    });
    }

    //sum of multiple arrays
	function sum_array(arr) {
	  
	  	// store our final answer
	  	var sum = 0;
	  
	  	// loop through entire array
	  	for (var i = 0; i < arr.length; i++) {
	    
	    	/*// loop through each inner array
	    	for (var j = 0; j < arr[i].length; j++) {
	      
	      		// add this number to the current final sum
	      		sum += arr[i][j];
	      
	    	}*/
	    	sum += arr[i];
	  	}
	  
	  	return sum;
	  
	}

	function monthlyListingChart(data)
	{
		var lisitingCount = sum_array(data.datasets.businessesCountArray);

        var options2 = {
		  	chart: {
				fontFamily: 'Nunito, sans-serif',
				height: 365,
				type: 'area',
				zoom: {
					enabled: false
				},
				dropShadow: {
			  		enabled: true,
				  	opacity: 0.3,
				  	blur: 5,
				  	left: -7,
				  	top: 22
				},
				toolbar: {
			  		show: true
				},
				events: {
			  		mounted: function(ctx, config) {
						const highest1 = ctx.getHighestValueInSeries(0);
						/*const highest2 = ctx.getHighestValueInSeries(1);
						const highest3 = ctx.getHighestValueInSeries(2);*/

						ctx.addPointAnnotation({
				  			x: new Date(ctx.w.globals.seriesX[0][ctx.w.globals.series[0].indexOf(highest1)]).getTime(),
				  			y: highest1,
				  			label: {
								style: {
					  				cssClass: 'd-none'
								}
				  			},
				  			customSVG: {
					  			SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#009688" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>',
					  			cssClass: undefined,
					  			offsetX: -8,
					  			offsetY: 5
				  			}
						})

						/*ctx.addPointAnnotation({
				  			x: new Date(ctx.w.globals.seriesX[1][ctx.w.globals.series[1].indexOf(highest2)]).getTime(),
				  			y: highest2,
				  			label: {
								style: {
					  				cssClass: 'd-none'
								}
				  			},
				  			customSVG: {
					  			SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#1b55e2" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>',
					  			cssClass: undefined,
					  			offsetX: -8,
					  			offsetY: 5
				  			}
						})

						ctx.addPointAnnotation({
				  			x: new Date(ctx.w.globals.seriesX[2][ctx.w.globals.series[2].indexOf(highest3)]).getTime(),
				  			y: highest3,
				  			label: {
								style: {
					  				cssClass: 'd-none'
								}
				  			},
				  			customSVG: {
					  			SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="#009688" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>',
					  			cssClass: undefined,
					  			offsetX: -8,
					  			offsetY: 5
				  			}
						})*/
			  		},
				}
		  	},
			colors: [/*'#e7515a', '#1b55e2',*/ '#009688'],
			dataLabels: {
				enabled: false
			},
			markers: {
				discrete: [
					{
						seriesIndex: 0,
						dataPointIndex: 7,
						fillColor: '#000',
						strokeColor: '#000',
						size: 5
					}, 
					{
						seriesIndex: 1,
						dataPointIndex: 11,
						fillColor: '#000',
						strokeColor: '#000',
						size: 4
			  		},
					{
						seriesIndex: 2,
						dataPointIndex: 11,
						fillColor: '#000',
						strokeColor: '#000',
						size: 4
			  		}
			  	]
			},
			subtitle: {
				text: 'Directory Listings This Year',
				align: 'left',
				margin: 0,
				offsetX: -10,
				offsetY: 35,
				floating: false,
				style: {
				  	fontSize: '14px',
				  	color:  '#888ea8'
				}
			},
			title: {
				text: formatNumber(lisitingCount),
				align: 'left',
				margin: 0,
				offsetX: -10,
				offsetY: 0,
				floating: false,
				style: {
			  		fontSize: '25px',
				  	color:  '#bfc9d4'
				},
			},
			stroke: {
				show: true,
				curve: 'smooth',
				width: 2,
				lineCap: 'square'
			},
			series: [
				{
					name: 'Listings',
					data: data.datasets.businessesCountArray
				}/*, 
				{
				  	name: 'Expenditure',
				  	data: data.datasets.expenditureArray
			 	},
			 	{
				  	name: 'Balance',
				  	data: data.datasets.balanceArray
			 	}*/
		 	],
			labels: data.labels,
			xaxis: {
				axisBorder: {
				  	show: false
				},
				axisTicks: {
						show: false
				},
				crosshairs: {
						show: true
				},
				labels: {
					offsetX: 0,
					offsetY: 5,
					style: {
						fontSize: '12px',
						fontFamily: 'Nunito, sans-serif',
						cssClass: 'apexcharts-xaxis-title',
					},
				}
			},
			yaxis: {
				labels: {
				  	formatter: function(value, index) {
						//return (value / 1000) + 'K'
						return (value / 1)
				  	},
				  	offsetX: -22,
				  	offsetY: 0,
				  	style: {
				  		fontSize: '12px',
					  	fontFamily: 'Nunito, sans-serif',
					  	cssClass: 'apexcharts-yaxis-title',
				  	},
				}
			},
			grid: {
				borderColor: '#191e3a',
				strokeDashArray: 5,
				xaxis: {
					lines: {
						show: true
					}
				},   
				yaxis: {
					lines: {
						show: false,
					}
				},
				padding: {
				  	top: 0,
				  	right: 0,
				  	bottom: 0,
				  	left: -10
				}, 
			}, 
			legend: {
				position: 'top',
				horizontalAlign: 'right',
				offsetY: -50,
				fontSize: '16px',
				fontFamily: 'Nunito, sans-serif',
				markers: {
				  	width: 10,
				  	height: 10,
				  	strokeWidth: 0,
				  	strokeColor: '#fff',
				  	fillColors: undefined,
				  	radius: 12,
				  	onClick: undefined,
				  	offsetX: 0,
				  	offsetY: 0
				},    
				itemMargin: {
				  	horizontal: 0,
				  	vertical: 20
				}
			},
			tooltip: {
				theme: 'dark',
				marker: {
			  		show: true,
				},
				x: {
				  	show: true,
				}
			},
			fill: {
				type:"gradient",
				gradient: {
					type: "vertical",
					shadeIntensity: 1,
					inverseColors: !1,
					opacityFrom: .28,
					opacityTo: .05,
					stops: [45, 100]
				}
			},
			responsive: [{
				breakpoint: 575,
				options: {
					legend: {
						offsetY: -30,
					},
				},
			}]
		}

		var chart2 = new ApexCharts(
			document.querySelector("#monthly-listings"),
			options2
		);

		chart2.render();
	}
});