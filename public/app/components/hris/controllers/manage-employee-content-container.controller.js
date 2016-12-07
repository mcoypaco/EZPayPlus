hris
	.controller('manageEmployeeContentContainerController', ['$scope', '$filter', '$state', '$stateParams', '$mdMedia', 'Helper', function($scope, $filter, $state, $stateParams, $mdMedia, Helper){
		if($mdMedia('xs') || $mdMedia('sm') || $mdMedia('md')){
			$scope.$emit('closeSidenav');
		}

		$scope.form = {}

		$scope.employee = {};

		$scope.employee.allowance_types = [];
		$scope.employee.deduction_types = [];

		/*
		 * Object for toolbar
		 *
		*/
		$scope.toolbar = {};

		$scope.calculateAge = function(birthday){
			var ageDifMs = Date.now() - birthday.getTime();
		    var ageDate = new Date(ageDifMs);
		    $scope.employee.age = Math.abs(ageDate.getUTCFullYear() - 1970);
		}

		if($stateParams.employeeID)
		{
			var request = {}

			request.with = [
				{
					'relation': 'allowance_types',
					'withTrashed': false,
				},
				{
					'relation': 'deduction_types',
					'withTrashed': false,
				},
				{
					'relation': 'batch',
					'withTrashed': true,
				},
				{
					'relation': 'branch',
					'withTrashed': true,
				},
				{
					'relation': 'cost_center',
					'withTrashed': true,
				},
				{
					'relation': 'position',
					'withTrashed': true,
				},
				{
					'relation': 'city',
					'withTrashed': false,
				},
				{
					'relation': 'province',
					'withTrashed': false,
				},
				{
					'relation': 'tax_code',
					'withTrashed': false,
				},
				{
					'relation': 'time_interpretation',
					'withTrashed': false,
				},
			]

			request.withTrashed = true;

			request.first = true;

			Helper.post('/employee/enlist', request)
				.success(function(data){
					$scope.employee = data;
					$scope.employee.birthdate = new Date(data.birthdate);
					$scope.employee.date_hired = new Date(data.date_hired);
					$scope.employee.city = data.city.name;
					$scope.employee.province = data.province.name;

					$scope.tin = data.tin.replace(/-/g, '');
					$scope.sss = data.sss.replace(/-/g, '');
					$scope.pagibig = data.pagibig.replace(/-/g, '');
					$scope.philhealth = data.philhealth.replace(/-/g, '');

					angular.forEach($scope.employee.allowance_types, function(item, key){
						$scope.employee.allowance_types[key] = item.pivot;
					})

					angular.forEach($scope.employee.deduction_types, function(item, key){
						$scope.employee.deduction_types[key] = item.pivot;
					})

					$scope.toolbar.childState = data.last_name + ', ' + data.first_name;
				})
				.error(function(){
					Helper.error();
				});
		}
		else{
			$scope.toolbar.childState = 'Employee';

			$scope.employee.sex = 'Male';

			$scope.employee.date_hired = new Date();

			$scope.calculateAge(new Date());
		}

		$scope.today = new Date();

		$scope.civil_status = ['Single', 'Married', 'Widowed'];
		$scope.employment_status = ['Probationary', 'Project Based', 'Regular'];

		$scope.addEarnings = function(){
			$scope.employee.allowance_types.push({});
		}

		$scope.addDeductions = function(){
			$scope.employee.deduction_types.push({});
		}

		$scope.removeEarnings = function(item){
			var index = $scope.employee.allowance_types.indexOf(item);

			$scope.employee.allowance_types.splice(index, 1);
		}

		$scope.removeDeduction = function(item){
			var index = $scope.employee.deduction_types.indexOf(item);

			$scope.employee.deduction_types.splice(index, 1);
		}


		$scope.checkDuplicate = function(){
			Helper.post('/employee/check-duplicate', $scope.employee)
				.success(function(data){
					$scope.duplicate = data;
				})
		}

		$scope.checkCity = function(){
			var query = {};
			query.search = $scope.employee.city;
			query.strict_search = true;

			Helper.post('/city/enlist', query)
				.success(function(data){
					$scope.cities = data;
					$scope.showError = data.length ? false : true;

					if($scope.employee.province_id)
					{
						$scope.checkProvince();
					}
				})
		}

		$scope.fetchProvinces = function(){
			Helper.post('/province/enlist', $scope.employee)
				.success(function(data){
					$scope.provinces = data;
				})
		}

		$scope.checkProvince = function(){
			var query = {};
			query.where = [
				{
					'label': 'id',
					'condition': '=',
					'value': $scope.employee.province_id
				}
			];
			query.city = $scope.employee.city;
			query.result = 'first';

			Helper.post('/province/enlist', query)
				.success(function(data){
					$scope.noMatches = data.cities.length ? false : true;
				})
		}
		
		$scope.formatPagIBIG = function(pagibig){
			if($scope.form.employeeForm.PagIBIG.$valid)
			{
				var first = pagibig.slice(0,4);
				var second = pagibig.slice(4,8);
				var third = pagibig.slice(8,12);

				$scope.employee.pagibig = first + '-' + second + '-' + third;
			}
		}

		$scope.formatPhilHealth = function(philhealth){
			if($scope.form.employeeForm.PhilHealth.$valid)
			{
				var first = philhealth.slice(0,2);
				var second = philhealth.slice(2,11);
				var third = philhealth.slice(11,12);

				$scope.employee.philhealth = first + '-' + second + '-' + third;
			}
		}

		$scope.formatSSS = function(sss){
			if($scope.form.employeeForm.SSS.$valid)
			{
				var first = sss.slice(0,2);
				var second = sss.slice(2,9);
				var third = sss.slice(9,10);

				$scope.employee.sss = first + '-' + second + '-' + third;
			}
		}	

		$scope.formatTIN = function(tin){
			if($scope.form.employeeForm.TIN.$valid)
			{
				var first = tin.slice(0,3);
				var second = tin.slice(3,6);
				var third = tin.slice(6,9);

				$scope.employee.tin = first + '-' + second + '-' + third;
			}
		}

		$scope.checkDeMinimis = function(data){
			var allowance_type = $filter('filter')($scope.allowance_types, {'id': data.allowance_type_id})[0];

			data.de_minimis = allowance_type.de_minimis_id ? allowance_type.de_minimis : null;

			data.max = allowance_type.de_minimis_id ? $filter('filter')($scope.de_minimis, {'id': allowance_type.de_minimis_id})[0].maximum_amount_per_month : null;

			console.log(data.max);
		}

		$scope.checkLimit = function(data){
			var total = data.checked ? (data.first_cut_off ? data.amount : 0) + (data.second_cut_off ? data.amount : 0) + (data.third_cut_off ? data.amount : 0) + (data.fourth_cut_off ? data.amount : 0) : 0;

			var de_minimis = $filter('filter')($scope.de_minimis, {'id': data.de_minimis.id})[0];

			var index = $scope.de_minimis.indexOf(de_minimis);

			$scope.de_minimis[index].maximum_amount_per_month = data.de_minimis.maximum_amount_per_month - total;

			console.log($scope.de_minimis[index].maximum_amount_per_month);

			data.limit = $scope.de_minimis[index].maximum_amount_per_month - data.amount < 0 ? true : false;
		}

		$scope.checkFrequency = function(data, hold){
			data.checked = data.first_cut_off || data.second_cut_off || data.third_cut_off || data.fourth_cut_off || data.on_hold ? true : false;

			$scope.checkLimit(data);
		}

		/*
		 * Object for fab
		 *
		*/
		$scope.fab = {};
		$scope.fab.icon = 'mdi-check';
		$scope.fab.label = 'Submit';
		$scope.fab.show = true;

		$scope.fab.action = function(){
			if($scope.form.employeeForm.$invalid){
				angular.forEach($scope.form.employeeForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				Helper.alert('Oops!', 'Kindly check form for errors.')

				return;
			}

			if(!$scope.duplicate)
			{
				$scope.busy = true;
				Helper.preload();

				$scope.employee.birthdate = $scope.employee.birthdate.toLocaleDateString();
				$scope.employee.date_hired = $scope.employee.date_hired.toDateString();

				if(!$stateParams.employeeID)
				{
					Helper.post('/employee', $scope.employee)
						.success(function(duplicate){
							Helper.stop();

							if(duplicate){
								$scope.duplicate = duplicate;
								$scope.busy = false;
								return;
							}

							$state.go('main.hris');
						})
						.error(function(){
							$scope.employee.birthdate = new Date($scope.employee.birthdate);
							$scope.employee.date_hired = new Date($scope.employee.date_hired);

							$scope.busy = false;
							$scope.error = true;

							Helper.error();
						});
				}
				else
				{
					Helper.put('/employee/' + $stateParams.employeeID, $scope.employee)
						.success(function(duplicate){
							Helper.stop();

							if(duplicate){
								$scope.duplicate = duplicate;
								$scope.busy = false;
								return;
							}

							$state.go('main.hris');
						})
						.error(function(){
							$scope.employee.birthdate = new Date($scope.employee.birthdate);
							$scope.employee.date_hired = new Date($scope.employee.date_hired);

							$scope.busy = false;
							$scope.error = true;

							Helper.error();
						});
				}
			}
		}

		$scope.test = function(){
			$scope.employee.employee_number = 10071128;
			$scope.employee.first_name = 'Marco Chrisitan';
			$scope.employee.middle_name = 'Santillan';
			$scope.employee.last_name = 'Paco';
			$scope.employee.birthdate = new Date('12/30/1993');
			$scope.employee.age = 22;
			$scope.employee.civil_status = 'Single';
			$scope.employee.batch_id = 1;
			$scope.employee.branch_id = 1;
			$scope.employee.cost_center_id = 1;
			$scope.employee.position_id = 1;
			$scope.employee.employment_status = 'Regular';
			$scope.employee.date_hired = new Date('07/29/2015');
			$scope.employee.street_address = 'B3 L8 Terry Town Subdivision';
			$scope.employee.city = 'Santa Rosa City';
			$scope.employee.province_id = 40;
			$scope.employee.postal_code = 4026;
			$scope.employee.email = 'marcopaco1230@gmail.com';
			$scope.employee.mobile_number = '09364589106';
			$scope.employee.telephone_number = '(049) 543-1704';
			$scope.employee.tax_code_id = 2;
			$scope.tin = '012345678';
			$scope.sss = '0123456789';
			$scope.pagibig = '012345678901';
			$scope.philhealth = '012345678901';

			$scope.employee.tin = '012-345-678';
			$scope.employee.sss = '01-2345678-9';
			$scope.employee.pagibig = '0123-4567-8901';
			$scope.employee.philhealth = '01-234567890-1';
			$scope.employee.time_interpretation_id = 1;
			$scope.employee.basic_salary = 14000;
			$scope.employee.allowance_types = [
				{
					'allowance_type_id': 1,
					'amount': 100,
					'first_cut_off': true,
					'second_cut_off': true,
				}
			]
			$scope.employee.deduction_types = [
				{
					'deduction_type_id': 5,
					'amount': 100,
					'first_cut_off': true,
					'second_cut_off': true,
				}
			]
		}

		$scope.init = function(){
			Helper.get('/batch')
				.success(function(data){
					$scope.batches = data;
				})

			Helper.get('/branch')
				.success(function(data){
					$scope.branches = data;
				})

			Helper.get('/cost-center')
				.success(function(data){
					$scope.cost_centers = data;
				})

			Helper.get('/position')
				.success(function(data){
					$scope.positions = data;
				})

			Helper.get('/tax-code')
				.success(function(data){
					$scope.tax_codes = data;
				})

			Helper.get('/de-minimis')
				.success(function(data){
					$scope.de_minimis = data;
				})

			var allowance_type_request = {
				'with': [
					{
						'relation': 'de_minimis',
						'withTrashed': false,
					}
				]
			}

			Helper.post('/allowance-type/enlist', allowance_type_request)
				.success(function(data){
					$scope.allowance_types = data;
				})

			var deduction_type_request = {
				'where': [
					{
						'label': 'government_deduction',
						'condition': '=',
						'value': false,
					}
				]
			}

			Helper.post('/deduction-type/enlist', deduction_type_request)
				.success(function(data){
					$scope.deduction_types = data;
				})

			Helper.get('/time-interpretation')
				.success(function(data){
					$scope.time_interpretations = data;
				})

			$scope.checkCity();
			$scope.fetchProvinces();

			var request = {};

			request.orderBy = [
				{
					'label': 'employee_number',
					'sort' : 'desc'
				}
			]

			request.first = true;
			request.withTrashed = true;

			Helper.post('/employee/enlist', request)
				.success(function(data){
					$scope.last_employee_number = data.employee_number;
				})
		}();
	}]);