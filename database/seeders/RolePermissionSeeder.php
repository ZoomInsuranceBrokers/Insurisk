<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $roles = [
                ['name' => 'superadmin', 'description' => 'Full system access'],
                ['name' => 'admin', 'description' => 'Administrative users'],
                ['name' => 'claims', 'description' => 'Claims handlers'],
                ['name' => 'user', 'description' => 'Regular users'],
            ];

            $permissions = [
                'manage_users',
                'manage_roles',
                'manage_permissions',
                'manage_claims',
                'view_claims',
                'create_claims',
                'view_reports',
                'manage_settings',
            ];

            foreach ($roles as $r) {
                Role::firstOrCreate(['name' => $r['name']], $r);
            }

            foreach ($permissions as $p) {
                Permission::firstOrCreate(['name' => $p], ['description' => null]);
            }

            // Assign permissions to roles
            $super = Role::where('name', 'superadmin')->first();
            $admin = Role::where('name', 'admin')->first();
            $claims = Role::where('name', 'claims')->first();
            $user = Role::where('name', 'user')->first();

            $allPermissionIds = Permission::pluck('id')->all();
            if ($super) $super->permissions()->sync($allPermissionIds);

            $adminPerms = Permission::whereIn('name', ['manage_users','manage_roles','view_reports','manage_settings','manage_claims'])->pluck('id')->all();
            if ($admin) $admin->permissions()->sync($adminPerms);

            $claimsPerms = Permission::whereIn('name', ['manage_claims','view_claims','create_claims'])->pluck('id')->all();
            if ($claims) $claims->permissions()->sync($claimsPerms);

            $userPerms = Permission::whereIn('name', ['create_claims','view_claims'])->pluck('id')->all();
            if ($user) $user->permissions()->sync($userPerms);
        });
    }
}
