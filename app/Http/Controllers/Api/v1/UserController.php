<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Requests\UserUpdateProfileRequest;
use App\Http\Requests\UserChangePasswordRequest;
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
            'user' => $user,
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
            return response(['message' => 'User not exists.'], 404);
        }
        return new UserResource($user);
    }

    /**
     * Update the user's data in database.
     *
     * @param  \App\Http\Requests\UserUpdateProfileRequest  $userUpdateProfileRequest
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(UserUpdateProfileRequest $userUpdateProfileRequest, User $user)
    {
        $userUpdateProfileRequest->validated();
        if (!$user) {
            return response(['message' => 'This user does not exists.'], 404);
        }
        $user->update($userUpdateProfileRequest->all());
        return response(['message' => 'Changes confirmed'], 201);
    }

    /**
     * Update password of the user in database.
     *
     * @param  \App\Http\Requests\UserChangePasswordRequest $userChangePasswordRequest
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function changePassword(UserChangePasswordRequest $userChangePasswordRequest, User $user)
    {
        $userChangePasswordRequest->validated();
        if (!password_verify($userChangePasswordRequest->old_password, $user->password)) {
            $response = [
                'errors' => [

                    'old_password' => ['Password is invalid']
                ],
                'message' => 'The given data was invalid'
            ];
            return response($response, 422);
        }
        $user->update(['password' => password_hash($userChangePasswordRequest->new_password, PASSWORD_BCRYPT)]);
        return response(['message' => 'Password has been changed']);
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
