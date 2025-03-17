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
const caregiverVerification = {
  registerCaregiver: vi.fn(),
  updateCaregiver: vi.fn(),
  updateCaregiverStatus: vi.fn(),
  addQualification: vi.fn(),
  verifyQualification: vi.fn(),
  recordBackgroundCheck: vi.fn(),
  updateAvailability: vi.fn(),
  getCaregiver: vi.fn(),
  getQualification: vi.fn(),
  getBackgroundCheck: vi.fn(),
  getAvailability: vi.fn(),
  isCaregiverVerified: vi.fn(),
}

describe("Caregiver Verification Contract", () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks()
    
    // Setup default mock implementations
    caregiverVerification.registerCaregiver.mockReturnValue({ type: "ok", value: true })
    caregiverVerification.updateCaregiver.mockReturnValue({ type: "ok", value: true })
    caregiverVerification.updateCaregiverStatus.mockReturnValue({ type: "ok", value: true })
    caregiverVerification.addQualification.mockReturnValue({ type: "ok", value: true })
    caregiverVerification.verifyQualification.mockReturnValue({ type: "ok", value: true })
    caregiverVerification.recordBackgroundCheck.mockReturnValue({ type: "ok", value: true })
    caregiverVerification.updateAvailability.mockReturnValue({ type: "ok", value: true })
    caregiverVerification.isCaregiverVerified.mockReturnValue({ value: true })
    
    caregiverVerification.getCaregiver.mockReturnValue({
      value: {
        name: "Jane Smith",
        contactInfo: "jane.smith@example.com, (555) 987-6543",
        professionalId: "RN-12345",
        specializations: "Geriatric care, Diabetes management",
        yearsExperience: 8,
        registrationDate: mockClarity.block.time - 2592000, // 30 days ago
        lastUpdated: mockClarity.block.time,
        status: "verified",
      },
    })
    
    caregiverVerification.getQualification.mockReturnValue({
      value: {
        qualificationType: "Registered Nurse",
        issuer: "State Nursing Board",
        issueDate: mockClarity.block.time - 31536000, // 1 year ago
        expiryDate: mockClarity.block.time + 31536000, // 1 year later
        verificationStatus: "verified",
        verifiedBy: { value: mockClarity.tx.sender },
        verificationDate: { value: mockClarity.block.time - 2592000 }, // 30 days ago
        documentHash: Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex"),
      },
    })
    
    caregiverVerification.getBackgroundCheck.mockReturnValue({
      value: {
        checkType: "Criminal Background",
        performedBy: "National Background Check Service",
        checkDate: mockClarity.block.time - 2592000, // 30 days ago
        expiryDate: mockClarity.block.time + 31536000, // 1 year later
        result: "passed",
        verifiedBy: mockClarity.tx.sender,
        verificationDate: mockClarity.block.time - 2592000, // 30 days ago
        documentHash: Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex"),
      },
    })
    
    caregiverVerification.getAvailability.mockReturnValue({
      value: {
        schedule: "Monday-Friday, 9am-5pm",
        maxPatients: 8,
        currentPatients: 5,
        serviceArea: "Downtown, North Side",
        lastUpdated: mockClarity.block.time,
      },
    })
  })
  
  describe("registerCaregiver", () => {
    it("should register a new caregiver successfully", () => {
      const caregiverId = "caregiver-001"
      const name = "Jane Smith"
      const contactInfo = "jane.smith@example.com, (555) 987-6543"
      const professionalId = "RN-12345"
      const specializations = "Geriatric care, Diabetes management"
      const yearsExperience = 8
      
      const result = caregiverVerification.registerCaregiver(
          caregiverId,
          name,
          contactInfo,
          professionalId,
          specializations,
          yearsExperience,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(caregiverVerification.registerCaregiver).toHaveBeenCalledWith(
          caregiverId,
          name,
          contactInfo,
          professionalId,
          specializations,
          yearsExperience,
      )
    })
  })
  
  describe("addQualification", () => {
    it("should add a qualification successfully", () => {
      const caregiverId = "caregiver-001"
      const qualificationId = "qual-001"
      const qualificationType = "Registered Nurse"
      const issuer = "State Nursing Board"
      const issueDate = mockClarity.block.time - 31536000 // 1 year ago
      const expiryDate = mockClarity.block.time + 31536000 // 1 year later
      const documentHash = Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex")
      
      const result = caregiverVerification.addQualification(
          caregiverId,
          qualificationId,
          qualificationType,
          issuer,
          issueDate,
          expiryDate,
          documentHash,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(caregiverVerification.addQualification).toHaveBeenCalledWith(
          caregiverId,
          qualificationId,
          qualificationType,
          issuer,
          issueDate,
          expiryDate,
          documentHash,
      )
    })
  })
  
  describe("verifyQualification", () => {
    it("should verify a qualification successfully", () => {
      const caregiverId = "caregiver-001"
      const qualificationId = "qual-001"
      const verificationStatus = "verified"
      
      const result = caregiverVerification.verifyQualification(caregiverId, qualificationId, verificationStatus)
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(caregiverVerification.verifyQualification).toHaveBeenCalledWith(
          caregiverId,
          qualificationId,
          verificationStatus,
      )
    })
  })
  
  describe("recordBackgroundCheck", () => {
    it("should record a background check successfully", () => {
      const caregiverId = "caregiver-001"
      const checkId = "check-001"
      const checkType = "Criminal Background"
      const performedBy = "National Background Check Service"
      const checkDate = mockClarity.block.time - 2592000 // 30 days ago
      const expiryDate = mockClarity.block.time + 31536000 // 1 year later
      const result = "passed"
      const documentHash = Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef", "hex")
      
      const checkResult = caregiverVerification.recordBackgroundCheck(
          caregiverId,
          checkId,
          checkType,
          performedBy,
          checkDate,
          expiryDate,
          result,
          documentHash,
      )
      
      expect(checkResult.type).toBe("ok")
      expect(checkResult.value).toBe(true)
      expect(caregiverVerification.recordBackgroundCheck).toHaveBeenCalledWith(
          caregiverId,
          checkId,
          checkType,
          performedBy,
          checkDate,
          expiryDate,
          result,
          documentHash,
      )
    })
  })
  
  describe("getCaregiver", () => {
    it("should retrieve caregiver information", () => {
      const caregiverId = "caregiver-001"
      
      const result = caregiverVerification.getCaregiver(caregiverId)
      
      expect(result.value).toEqual({
        name: "Jane Smith",
        contactInfo: "jane.smith@example.com, (555) 987-6543",
        professionalId: "RN-12345",
        specializations: "Geriatric care, Diabetes management",
        yearsExperience: 8,
        registrationDate: mockClarity.block.time - 2592000,
        lastUpdated: mockClarity.block.time,
        status: "verified",
      })
      expect(caregiverVerification.getCaregiver).toHaveBeenCalledWith(caregiverId)
    })
  })
  
  describe("isCaregiverVerified", () => {
    it("should check if a caregiver is verified", () => {
      const caregiverId = "caregiver-001"
      
      const result = caregiverVerification.isCaregiverVerified(caregiverId)
      
      expect(result.value).toBe(true)
      expect(caregiverVerification.isCaregiverVerified).toHaveBeenCalledWith(caregiverId)
    })
  })
})

