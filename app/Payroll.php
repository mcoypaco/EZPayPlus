<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payroll extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    public function time_interpretation()
    {
    	return $this->belongsTo('App\TimeInterpretation');
    }

    public function employees()
    {
    	return $this->hasMany('App\Employee');
    }

    public function payroll_periods()
    {
        return $this->hasMany('App\PayrollPeriod');
    }

    public function government_contributions()
    {
        return $this->hasMany('App\GovernmentContribution');
    }

    public function payroll_process()
    {
        return $this->hasMany('App\PayrollProcess');
    }
}
