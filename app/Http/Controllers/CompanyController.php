<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Company;
use App\City;
use Gate;
use DB;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource with parameters.
     *
     * @return \Illuminate\Http\Response
     */
    public function enlist(Request $request)
    {
        $company = Company::find(1);

        if(isset($request->with))
        {
            foreach ($request->with as $query) {
                $company->load($query);
            }
        }

        return $company;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if(Gate::allows('update-company'))
        {
            $this->validate($request, [
                'name' => 'required',
                'address' => 'required',
                'city' => 'required',
                'province_id' => 'required|numeric',
                'postal_code' => 'required',
                'contact_number' => 'required',
                'pagibig' => 'required',
                'philhealth' => 'required',
                'sss' => 'required',
                'tin' => 'required',
            ]);

            DB::transaction(function() use ($request, $id){
                $company = Company::where('id', $id)->first();

                $company->name = $request->name;
                $company->address = $request->address;
                $company->city_id = City::where('name', $request->city)->where('province_id', $request->province_id)->firstOrFail()->id;
                $company->province_id = $request->province_id;
                $company->postal_code = $request->postal_code;
                $company->contact_number = $request->contact_number;
                $company->pagibig = $request->pagibig;
                $company->philhealth = $request->philhealth;
                $company->sss = $request->sss;
                $company->tin = $request->tin;

                $company->save();
            });
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
