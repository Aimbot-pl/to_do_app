<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TasksResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => (string)$this->id,
            'type' => 'Tasks',
            'attributes' => [
                'name' => $this->name,
                'description' => $this->description,
                'when' => $this->when,
                'reminder' => $this->reminder
            ]
        ];
    }
}
