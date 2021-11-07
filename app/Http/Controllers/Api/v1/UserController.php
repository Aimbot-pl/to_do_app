<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Requests\UserUpdateProfileRequest;
use App\Http\Requests\UserChangePasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\DB;

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
        $refreshToken = bin2hex(random_bytes(32));
        $user->remember_token = $refreshToken;
        $user->save();

        if (!$user || !password_verify($fields['password'], $user->password)) {
            return response(['message' => 'Incorect email or/and password'], 422);
        }

        $user->tokens()->delete();
        $response = [
            'user' => new UserResource($user),
            'accessToken' => $user->createToken('myapptoken')->plainTextToken,
            'refreshToken' => $refreshToken
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
        $validate = $userUpdateProfileRequest->validated();
        if (!$user) {
            return response(['message' => 'This user does not exists.'], 404);
        }
        $user->update($userUpdateProfileRequest->all());
        return response([
                            'message' => 'Changes confirmed',
                            'user' => new UserResource($user)
                        ], 201);
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

    /**
     * Logout user.
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        auth()->user()->tokens()->delete();
        
        return [
            'message' => 'Logged out.'
        ];
    }

    public function refreshToken(Request $request) 
    {
        if (!$request['refreshToken']) {
            return response(['message' => 'Session expired. Log in again.'], 403);
        }
        $user = User::find($request['userId']);
        // TODO For now, I don't use this functionality, cuz I can't verify tokens. Fix that later!
        // if ($request['accessToken']) {
        //     $match = false;
        //     foreach ($user->tokens as $token) {
        //         if ($token->plainTextToken == $request['accessToken']) {
        //             $match = true;
        //         }
        //     }
        //     if ($match) {
        //         return response([
        //             'accessToken' => $request['accessToken'],
        //             'refreshToken' => $request['refreshToken'],
        //             'user' => new UserResource($user)
        //         ], 200);
        //     }
        // } else {
            $user->tokens()->delete();
            return response([
                'accessToken' => $user->createToken('myapptoken')->plainTextToken,
                'refreshToken' => $request['refreshToken'],
                'user' => new UserResource($user)
            ], 200);
        // }
        return response(['message' => 'Credentials are invalid. Log in again.'], 401);
    }

}
