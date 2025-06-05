<?php

namespace App\Policies;

use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class AdminPolicy
{
    /**
     * Create a new policy instance.
     */
    public function viewAdminDashboard(User $user): bool
    {
        return $user->isAdmin();
    }

      public function viewUserData(User $user): bool
    {
        return $user->isAdmin();
    }

    public function accessAdminCategory(User $user): bool
    {
        return $user->isAdmin();
    }

    public function createCateogory(User $user): bool
    {
        return $user->isAdmin();
    }

    public function updateCategory(User $user): bool
    {
        return $user->isAdmin();
    }

    public function deleteCategory(User $user): bool
    {
        return $user->isAdmin();
    }
}
