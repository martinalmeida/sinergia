<?php

namespace App\Services;

use App\Models\Patient;
use Illuminate\Pagination\LengthAwarePaginator;

class PatientService
{
    public function getAllPatients(): LengthAwarePaginator
    {
        return Patient::with(['documentType', 'gender', 'department', 'municipality'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);
    }

    public function createPatient(array $data): Patient
    {
        return Patient::create($data);
    }

    public function updatePatient(Patient $patient, array $data): Patient
    {
        $patient->update($data);
        return $patient->fresh(['documentType', 'gender', 'department', 'municipality']);
    }

    public function deletePatient(Patient $patient): void
    {
        $patient->delete();
    }
}