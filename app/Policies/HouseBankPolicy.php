<?php

namespace App\Policies;

use App\User;
use App\HouseBank;
use Illuminate\Auth\Access\HandlesAuthorization;

class HouseBankPolicy
{
    use HandlesAuthorization;

    /**
     * Allow permissions for super-admin users
     *
     */
    public function before($user)
    {
        if ($user->group_id === 1) {
            return true;
        }
    }
    /**
     * Determine whether the user can view the houseBank.
     *
     * @param  App\User  $user
     * @param  App\HouseBank  $houseBank
     * @return mixed
     */
    public function view(User $user, HouseBank $houseBank)
    {
        //
    }

    /**
     * Determine whether the user can create houseBanks.
     *
     * @param  App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        $user = User::with('group.modules')->where('id', $user->id)->first();

        foreach ($user->group->modules as $module) {
            if($module->name == 'Settings')
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine whether the user can update the houseBank.
     *
     * @param  App\User  $user
     * @param  App\HouseBank  $houseBank
     * @return mixed
     */
    public function update(User $user, HouseBank $houseBank)
    {
        //
    }

    /**
     * Determine whether the user can delete the houseBank.
     *
     * @param  App\User  $user
     * @param  App\HouseBank  $houseBank
     * @return mixed
     */
    public function delete(User $user, HouseBank $houseBank)
    {
        //
    }
}
