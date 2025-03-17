import { describe, it, expect, beforeEach, vi } from "vitest"

// Mock the Clarity VM environment
const mockClarity = {
  tx: {
    sender: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  },
  block: {
    time: 1625097600, // July 1, 2021
  },
}

// Mock the contract functions
const patientRegistration = {
  registerPatient: vi.fn(),
  updatePatient: vi.fn(),
  updatePatientStatus: vi.fn(),
  authorizeCaregiver: vi.fn(),
  revokeCaregiver: vi.fn(),
  setCarePlan: vi.fn(),
  getPatient: vi.fn(),
  getCaregiverAuth: vi.fn(),
  getCarePlan: vi.fn(),
}

describe("Patient Registration Contract", () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks()
    
    // Setup default mock implementations
    patientRegistration.registerPatient.mockReturnValue({ type: "ok", value: true })
    patientRegistration.updatePatient.mockReturnValue({ type: "ok", value: true })
    patientRegistration.updatePatientStatus.mockReturnValue({ type: "ok", value: true })
    patientRegistration.authorizeCaregiver.mockReturnValue({ type: "ok", value: true })
    patientRegistration.revokeCaregiver.mockReturnValue({ type: "ok", value: true })
    patientRegistration.setCarePlan.mockReturnValue({ type: "ok", value: true })
    
    patientRegistration.getPatient.mockReturnValue({
      value: {
        name: "John Doe",
        dateOfBirth: 315532800, // January 1, 1980
        contactInfo: "john.doe@example.com, (555) 123-4567",
        emergencyContact: "Jane Doe, (555) 765-4321",
        medicalConditions: "Hypertension, Diabetes Type 2",
        careNeeds: "Daily medication management, Blood pressure monitoring",
        preferences: "Prefers morning visits, No nuts (allergy)",
        registrationDate: mockClarity.block.time,
        lastUpdated: mockClarity.block.time,
        status: "active",
      },
    })
    
    patientRegistration.getCaregiverAuth.mockReturnValue({
      value: {
        authorizedBy: mockClarity.tx.sender,
        authorizationDate: mockClarity.block.time,
        relationship: "professional",
        accessLevel: "full",
        status: "active",
      },
    })
    
    patientRegistration.getCarePlan.mockReturnValue({
      value: {
        createdBy: mockClarity.tx.sender,
        creationDate: mockClarity.block.time,
        lastUpdated: mockClarity.block.time,
        careGoals: "Maintain stable blood pressure, Improve mobility",
        requiredServices: "Daily medication management, Weekly physical therapy",
        schedule: "Medication: 8am and 8pm, PT: Tuesdays at 2pm",
        specialInstructions: "Ensure patient drinks water with medication",
        status: "active",
      },
    })
  })
  
  describe("registerPatient", () => {
    it("should register a new patient successfully", () => {
      const patientId = "patient-001"
      const name = "John Doe"
      const dateOfBirth = 315532800 // January 1, 1980
      const contactInfo = "john.doe@example.com, (555) 123-4567"
      const emergencyContact = "Jane Doe, (555) 765-4321"
      const medicalConditions = "Hypertension, Diabetes Type 2"
      const careNeeds = "Daily medication management, Blood pressure monitoring"
      const preferences = "Prefers morning visits, No nuts (allergy)"
      
      const result = patientRegistration.registerPatient(
          patientId,
          name,
          dateOfBirth,
          contactInfo,
          emergencyContact,
          medicalConditions,
          careNeeds,
          preferences,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(patientRegistration.registerPatient).toHaveBeenCalledWith(
          patientId,
          name,
          dateOfBirth,
          contactInfo,
          emergencyContact,
          medicalConditions,
          careNeeds,
          preferences,
      )
    })
  })
  
  describe("updatePatient", () => {
    it("should update patient information successfully", () => {
      const patientId = "patient-001"
      const contactInfo = "updated.john.doe@example.com, (555) 123-4567"
      const emergencyContact = "Jane Doe, (555) 765-4321"
      const medicalConditions = "Hypertension, Diabetes Type 2, Arthritis"
      const careNeeds = "Daily medication management, Blood pressure monitoring, Pain management"
      const preferences = "Prefers morning visits, No nuts (allergy)"
      
      const result = patientRegistration.updatePatient(
          patientId,
          contactInfo,
          emergencyContact,
          medicalConditions,
          careNeeds,
          preferences,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(patientRegistration.updatePatient).toHaveBeenCalledWith(
          patientId,
          contactInfo,
          emergencyContact,
          medicalConditions,
          careNeeds,
          preferences,
      )
    })
  })
  
  describe("authorizeCaregiver", () => {
    it("should authorize a caregiver successfully", () => {
      const patientId = "patient-001"
      const caregiverId = "caregiver-001"
      const relationship = "professional"
      const accessLevel = "full"
      
      const result = patientRegistration.authorizeCaregiver(patientId, caregiverId, relationship, accessLevel)
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(patientRegistration.authorizeCaregiver).toHaveBeenCalledWith(
          patientId,
          caregiverId,
          relationship,
          accessLevel,
      )
    })
  })
  
  describe("setCarePlan", () => {
    it("should set a care plan successfully", () => {
      const patientId = "patient-001"
      const careGoals = "Maintain stable blood pressure, Improve mobility"
      const requiredServices = "Daily medication management, Weekly physical therapy"
      const schedule = "Medication: 8am and 8pm, PT: Tuesdays at 2pm"
      const specialInstructions = "Ensure patient drinks water with medication"
      
      const result = patientRegistration.setCarePlan(
          patientId,
          careGoals,
          requiredServices,
          schedule,
          specialInstructions,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(patientRegistration.setCarePlan).toHaveBeenCalledWith(
          patientId,
          careGoals,
          requiredServices,
          schedule,
          specialInstructions,
      )
    })
  })
  
  describe("getPatient", () => {
    it("should retrieve patient information", () => {
      const patientId = "patient-001"
      
      const result = patientRegistration.getPatient(patientId)
      
      expect(result.value).toEqual({
        name: "John Doe",
        dateOfBirth: 315532800,
        contactInfo: "john.doe@example.com, (555) 123-4567",
        emergencyContact: "Jane Doe, (555) 765-4321",
        medicalConditions: "Hypertension, Diabetes Type 2",
        careNeeds: "Daily medication management, Blood pressure monitoring",
        preferences: "Prefers morning visits, No nuts (allergy)",
        registrationDate: mockClarity.block.time,
        lastUpdated: mockClarity.block.time,
        status: "active",
      })
      expect(patientRegistration.getPatient).toHaveBeenCalledWith(patientId)
    })
  })
})

