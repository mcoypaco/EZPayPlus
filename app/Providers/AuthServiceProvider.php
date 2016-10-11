<?php

namespace App\Providers;

use App\Branch;
use App\Group;
use App\HouseBank;
use App\Policies\BranchPolicy;
use App\Policies\GroupPolicy;
use App\Policies\HouseBankPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Model' => 'App\Policies\ModelPolicy',
        'App\Branch' => 'App\Policies\BranchPolicy',
        'App\Group' => 'App\Policies\GroupPolicy',
        'App\HouseBank' => 'App\Policies\HouseBankPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('update-company', function($user){
            return $user->group_id === 1 || $user->group_id === 2; // Admin or Human Resource Only
        });
    }
}
