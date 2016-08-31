<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Position extends Model
{
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    public function department()
    {
    	return $this->belongsTo('App\Department');
    }

    public function job_category()
    {
    	return $this->belongsTo('App\JobCategory');
    }

    public function labor_type()
    {
    	return $this->belongsTo('App\LaborType');
    }

    public function deployment()
    {
        return $this->hasMany('App\Deployment');
    }
}
