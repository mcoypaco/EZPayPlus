<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PayrollPeriod extends Model
{
    public function payroll()
    {
    	return $this->belongsTo('App\Payroll');
    }
}
