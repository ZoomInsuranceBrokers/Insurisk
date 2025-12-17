<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Application;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Home');
    }

    public function loginView(Request $request)
    {
        return Inertia::render('Auth/Login');
    }

}
