var app=angular.module("app",["sharedModule","hris","payroll","timekeeping","settings"]);app.config(["$stateProvider",function(e){e.state("main",{url:"/",views:{"":{templateUrl:"/app/shared/views/main.view.html",controller:"mainViewController"},"content-container@main":{templateUrl:"/app/shared/views/content-container.view.html"},"toolbar@main":{templateUrl:"/app/shared/templates/toolbar.template.html"},"left-sidenav@main":{templateUrl:"/app/shared/templates/sidenavs/main-left-sidenav.template.html"},"content@main":{}}}).state("main.hris",{url:"hris",resolve:{authorization:["Helper","$state",function(e,t){e.get("/module/2").success(function(e){}).error(function(){return t.go("page-not-found")})}]},views:{"content-container":{templateUrl:"/app/shared/views/content-container.view.html",controller:"hrisContentContainerController"},"toolbar@main.hris":{templateUrl:"/app/shared/templates/toolbar.template.html",controller:"hrisToolbarController"},"left-sidenav@main.hris":{templateUrl:"/app/shared/templates/sidenavs/main-left-sidenav.template.html"},"subheader@main.hris":{templateUrl:"/app/components/hris/templates/subheaders/hris-subheader.template.html",controller:"hrisSubheaderController"},"content@main.hris":{templateUrl:"/app/components/hris/templates/content/hris-content.template.html"}}}).state("main.manage-employee",{url:"employee/{employeeID}",params:{employeeID:null},resolve:{authorization:["Helper","$state",function(e,t){e.get("/module/2").success(function(e){}).error(function(){return t.go("page-not-found")})}]},views:{"content-container":{templateUrl:"/app/shared/views/content-container.view.html",controller:"manageEmployeeContentContainerController"},"toolbar@main.manage-employee":{templateUrl:"/app/shared/templates/toolbar.template.html",controller:"manageEmployeeToolbarController"},"left-sidenav@main.manage-employee":{templateUrl:"/app/shared/templates/sidenavs/main-left-sidenav.template.html"},"content@main.manage-employee":{templateUrl:"/app/components/hris/templates/content/manage-employee-content.template.html"}}}).state("main.admin-settings",{url:"settings/admin",resolve:{authorization:["Helper","$state",function(e,t){e.get("/module/1").success(function(e){}).error(function(){return t.go("page-not-found")})}]},views:{"content-container":{templateUrl:"/app/shared/views/content-container.view.html",controller:"adminSettingsContentContainerController"},"toolbar@main.admin-settings":{templateUrl:"/app/shared/templates/toolbar.template.html",controller:"adminSettingsToolbarController"},"left-sidenav@main.admin-settings":{templateUrl:"/app/shared/templates/sidenavs/main-left-sidenav.template.html"},"subheader@main.admin-settings":{templateUrl:"/app/components/settings/templates/subheaders/admin-settings-subheader.template.html",controller:"adminSettingsSubheaderController"},"content@main.admin-settings":{templateUrl:"/app/components/settings/templates/content/admin-settings-content.template.html"}}}).state("main.hris-settings",{url:"settings/hris",resolve:{authorization:["Helper","$state",function(e,t){e.get("/module/1").success(function(e){}).error(function(){return t.go("page-not-found")})}]},views:{"content-container":{templateUrl:"/app/shared/views/content-container.view.html",controller:"hrisSettingsContentContainerController"},"toolbar@main.hris-settings":{templateUrl:"/app/shared/templates/toolbar.template.html",controller:"hrisSettingsToolbarController"},"left-sidenav@main.hris-settings":{templateUrl:"/app/shared/templates/sidenavs/main-left-sidenav.template.html"},"subheader@main.hris-settings":{templateUrl:"/app/components/settings/templates/subheaders/hris-settings-subheader.template.html",controller:"hrisSettingsSubheaderController"},"content@main.hris-settings":{templateUrl:"/app/components/settings/templates/content/hris-settings-content.template.html"}}}).state("main.profile-settings",{url:"settings/profile",resolve:{authorization:["Helper","$state",function(e,t){e.get("/module/1").success(function(e){}).error(function(){return t.go("page-not-found")})}]},views:{"content-container":{templateUrl:"/app/shared/views/content-container.view.html",controller:"profileSettingsContentContainerController"},"toolbar@main.profile-settings":{templateUrl:"/app/shared/templates/toolbar.template.html"},"left-sidenav@main.profile-settings":{templateUrl:"/app/shared/templates/sidenavs/main-left-sidenav.template.html"},"content@main.profile-settings":{templateUrl:"/app/shared/templates/content/profile-settings-content.template.html"}}})}]),app.controller("mainViewController",["$scope","$state","$mdDialog","$mdSidenav","$mdToast","Helper",function(e,t,n,a,l,o){e.toggleSidenav=function(e){a(e).toggle()},e.menu={},e.menu["static"]=[{state:"main",icon:"mdi-view-dashboard",label:"Dashboard"}],e.setActive=function(e){angular.element($('[aria-label="section-'+e+'"]').closest("li").toggleClass("active")),angular.element($('[aria-label="section-'+e+'"]').closest("li").siblings().removeClass("active"))},e.logout=function(){o.post("/user/logout").success(function(){window.location.href="/"})},e.changePassword=function(){n.show({controller:"changePasswordDialogController",templateUrl:"/app/shared/templates/dialogs/change-password-dialog.template.html",parent:angular.element(document.body),fullscreen:!0}).then(function(){o.notify("Password changed.")})},o.post("/user/check").success(function(n){angular.forEach(n.group.modules,function(n){if("HRIS"==n.name){var a={state:"main.hris",icon:"mdi-account-multiple",label:"HRIS"};e.menu["static"].push(a)}else if("Payroll"==n.name){var l={state:"main.payroll",icon:"mdi-currency-usd",label:"Payroll"};e.menu["static"].push(l)}else"Settings"==n.name&&(e.menu.section=[{name:"Settings",icon:"mdi-settings"}],e.menu.pages=[[{label:"Admin",action:function(){t.go("main.admin-settings")}},{label:"HRIS",action:function(){t.go("main.hris-settings")}},{label:"Payroll",action:function(){t.go("main.payroll-settings")}},{label:"Profile",action:function(){t.go("main.profile-settings")}}]])}),e.user=n,o.setAuthUser(n)}),e.$on("closeSidenav",function(){a("left").close()})}]);