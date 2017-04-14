settings
	.controller('editProfileDialogController', ['$scope', '$filter', 'Helper', function($scope, $filter, Helper){
		$scope.company = {};
		$scope.company.country_id = 177; //Philippines

		$scope.busy = false;

		var busy = false;

		$scope.cancel = function(){
			Helper.cancel();
		}

		$scope.checkCity = function(){
			var query = {};
			query.search = $scope.company.city;
			query.strict_search = true;

			Helper.post('/city/enlist', query)
				.success(function(data){
					$scope.cities = data;
					$scope.showError = data.length ? false : true;

					if($scope.company.province_id)
					{
						$scope.checkProvince();
					}
				})
		}

		$scope.fetchProvinces = function(){
			Helper.post('/province/enlist', $scope.company)
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
					'value': $scope.company.province_id
				}
			];
			query.city = $scope.company.city;
			query.result = 'first';

			Helper.post('/province/enlist', query)
				.success(function(data){
					$scope.noMatches = data.cities.length ? false : true;
				})
		}

		$scope.formatPagIBIG = function(){
			if($scope.companyForm.PagIBIG.$valid)
			{
				var first = $scope.pagibig.slice(0,4);
				var second = $scope.pagibig.slice(4,8);
				var third = $scope.pagibig.slice(8,12);

				$scope.company.pagibig = first + '-' + second + '-' + third;
			}
		}

		$scope.formatPhilHealth = function(){
			if($scope.companyForm.PhilHealth.$valid)
			{
				var first = $scope.philhealth.slice(0,2);
				var second = $scope.philhealth.slice(2,11);
				var third = $scope.philhealth.slice(11,12);

				$scope.company.philhealth = first + '-' + second + '-' + third;
			}
		}

		$scope.formatSSS = function(){
			if($scope.companyForm.SSS.$valid)
			{
				var first = $scope.sss.slice(0,2);
				var second = $scope.sss.slice(2,9);
				var third = $scope.sss.slice(9,10);

				$scope.company.sss = first + '-' + second + '-' + third;
			}
		}	

		$scope.formatTIN = function(){
			if($scope.companyForm.TIN.$valid)
			{
				var first = $scope.tin.slice(0,3);
				var second = $scope.tin.slice(3,6);
				var third = $scope.tin.slice(6,9);

				$scope.company.tin = first + '-' + second + '-' + third;
			}
		}		

		$scope.submit = function(){
			if($scope.companyForm.$invalid){
				angular.forEach($scope.companyForm.$error, function(field){
					angular.forEach(field, function(errorField){
						errorField.$setTouched();
					});
				});

				return;
			}
			
			$scope.busy = true;
			Helper.put('/company/1', $scope.company)
				.success(function(duplicate){
					Helper.stop();
				})
				.error(function(){
					$scope.busy = false;
					$scope.error = true;
				});
		}

		$scope.init = function()
		{
			var query = {};

			query.with = ['city'];

			Helper.post('/company/enlist', query)
				.success(function(data){
					$scope.company = data;

					$scope.company.city = $scope.company.city.name;

					$scope.pagibig = $scope.company.pagibig.replace(/-/g, '');
					$scope.philhealth = $scope.company.philhealth.replace(/-/g, '');
					$scope.sss = $scope.company.sss.replace(/-/g, '');
					$scope.tin = $scope.company.tin.replace(/-/g, '');


					$scope.checkCity();
					$scope.fetchProvinces();
				})
		}();
	}]);