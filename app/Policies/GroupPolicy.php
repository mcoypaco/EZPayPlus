<?php

namespace App\Policies;

use App\User;
use App\Group;
use Illuminate\Auth\Access\HandlesAuthorization;

class GroupPolicy
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
     * Determine whether the user can view the group.
     *
     * @param  App\User  $user
     * @param  App\Group  $group
     * @return mixed
     */
    public function view(User $user, Group $group)
    {
        //
    }

    /**
     * Determine whether the user can create groups.
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
     * Determine whether the user can update the group.
     *
     * @param  App\User  $user
     * @param  App\Group  $group
     * @return mixed
     */
    public function update(User $user, Group $group)
    {
        return $user->group_id === $group->id;
    }

    /**
     * Determine whether the user can delete the group.
     *
     * @param  App\User  $user
     * @param  App\Group  $group
     * @return mixed
     */
    public function delete(User $user, Group $group)
    {
        return $user->group_id === $group->id;
    }
}
