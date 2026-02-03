<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Models\Patient;
use App\Services\PatientService;
use Illuminate\Http\JsonResponse;

class PatientController extends Controller
{
    protected PatientService $patientService;

    public function __construct(PatientService $patientService)
    {
        $this->patientService = $patientService;
    }

    public function index(): JsonResponse
    {
        $patients = $this->patientService->getAllPatients();
        return response()->json($patients);
    }

    public function store(StorePatientRequest $request): JsonResponse
    {
        $patient = $this->patientService->createPatient($request->validated());
        return response()->json([
            'message' => 'Paciente creado exitosamente',
            'patient' => $patient->load(['documentType', 'gender', 'department', 'municipality'])
        ], 201);
    }

    public function show(Patient $patient): JsonResponse
    {
        return response()->json($patient->load(['documentType', 'gender', 'department', 'municipality']));
    }

    public function update(UpdatePatientRequest $request, Patient $patient): JsonResponse
    {
        $updatedPatient = $this->patientService->updatePatient($patient, $request->validated());
        return response()->json([
            'message' => 'Paciente actualizado exitosamente',
            'patient' => $updatedPatient
        ]);
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $this->patientService->deletePatient($patient);
        return response()->json(['message' => 'Paciente eliminado exitosamente']);
    }
}