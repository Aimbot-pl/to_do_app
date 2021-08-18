<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Requests\UserUpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
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
     * Register new user.
     *
     * @param  \App\Http\Requests\UserRequest  $userRequest
     * @return \Illuminate\Http\Response
     */
    public function register(UserRequest $userRequest)
    {
        $fields = $userRequest->validated();
        User::create([
            'nick' => $fields['nick'],
            'email' => $fields['email'],
            'gender' => $fields['gender'],
            'first_name' => $fields['first_name'],
            'last_name' => $fields['last_name'],
            'password' => bcrypt($fields['password']),
        ]);
        $response = [
            'message' => 'You has been signed up, now you can sign in!'
        ];
        return response($response, 201);
    }

    /**
     * Sign in a user.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|email|max:30',
            'password' => 'required|string|max:60'
        ]);
        $user = User::where('email', $fields['email'])->first();

        if (!$user || !password_verify($fields['password'], $user->password)) {
            return response(['message' => 'Bad creds'], 422);
        }
        $response = [
            'id' => $user->id,
            'token' => $user->createToken('myapptoken')->plainTextToken
        ];
        return response($response, 201);
    }
    

    /**
     * Display the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::where('id', $id)->first();
        if (!$user) {
            return response('User not exists.', 404);
        }
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UserUpdateProfileRequest  $userUpdateProfileRequest
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UserUpdateProfileRequest $userUpdateProfileRequest, User $user)
    {
        $fields = $userUpdateProfileRequest->validated();
        if (!$user) {
            return response('This user does not exists.', 404);
        }
        // return $userUpdateProfileRequest->all();
        $user->update($userUpdateProfileRequest->all());
        return response('Changes confirmed', 201);
        return 'ok';
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
