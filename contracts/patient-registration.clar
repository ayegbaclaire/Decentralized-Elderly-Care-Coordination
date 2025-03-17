;; Patient Registration Contract
;; Manages care recipient profiles and needs

(define-data-var admin principal tx-sender)

;; Map of registered patients
(define-map patients
  { patient-id: (string-ascii 32) }
  {
    name: (string-ascii 64),
    date-of-birth: uint,
    contact-info: (string-ascii 128),
    emergency-contact: (string-ascii 128),
    medical-conditions: (string-ascii 256),
    care-needs: (string-ascii 256),
    registration-date: uint,
    status: (string-ascii 16)
  }
)

;; Map of patient authorized caregivers
(define-map patient-caregivers
  {
    patient-id: (string-ascii 32),
    caregiver-id: (string-ascii 32)
  }
  {
    authorized-by: principal,
    authorization-date: uint,
    relationship: (string-ascii 32),
    status: (string-ascii 16)
  }
)

;; Map of patient care plans
(define-map care-plans
  { patient-id: (string-ascii 32) }
  {
    created-by: principal,
    creation-date: uint,
    care-goals: (string-ascii 256),
    required-services: (string-ascii 256),
    schedule: (string-ascii 256),
    status: (string-ascii 16)
  }
)

;; Register a new patient
(define-public (register-patient
    (patient-id (string-ascii 32))
    (name (string-ascii 64))
    (date-of-birth uint)
    (contact-info (string-ascii 128))
    (emergency-contact (string-ascii 128))
    (medical-conditions (string-ascii 256))
    (care-needs (string-ascii 256)))
  (let ((current-time (unwrap-panic (get-block-info? time u0))))
    (asserts! (not (is-some (map-get? patients { patient-id: patient-id }))) (err u403))

    (map-insert patients
      { patient-id: patient-id }
      {
        name: name,
        date-of-birth: date-of-birth,
        contact-info: contact-info,
        emergency-contact: emergency-contact,
        medical-conditions: medical-conditions,
        care-needs: care-needs,
        registration-date: current-time,
        status: "active"
      }
    )
    (ok true)
  )
)

;; Update patient information
(define-public (update-patient
    (patient-id (string-ascii 32))
    (contact-info (string-ascii 128))
    (emergency-contact (string-ascii 128))
    (medical-conditions (string-ascii 256))
    (care-needs (string-ascii 256)))
  (let ((patient (unwrap! (map-get? patients { patient-id: patient-id }) (err u404))))
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))

    (map-set patients
      { patient-id: patient-id }
      (merge patient {
        contact-info: contact-info,
        emergency-contact: emergency-contact,
        medical-conditions: medical-conditions,
        care-needs: care-needs
      })
    )
    (ok true)
  )
)

;; Update patient status
(define-public (update-patient-status
    (patient-id (string-ascii 32))
    (status (string-ascii 16)))
  (let ((patient (unwrap! (map-get? patients { patient-id: patient-id }) (err u404))))
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))

    (map-set patients
      { patient-id: patient-id }
      (merge patient { status: status })
    )
    (ok true)
  )
)

;; Authorize a caregiver for a patient
(define-public (authorize-caregiver
    (patient-id (string-ascii 32))
    (caregiver-id (string-ascii 32))
    (relationship (string-ascii 32)))
  (let ((patient (unwrap! (map-get? patients { patient-id: patient-id }) (err u404)))
        (current-time (unwrap-panic (get-block-info? time u0))))
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))

    (map-insert patient-caregivers
      {
        patient-id: patient-id,
        caregiver-id: caregiver-id
      }
      {
        authorized-by: tx-sender,
        authorization-date: current-time,
        relationship: relationship,
        status: "active"
      }
    )
    (ok true)
  )
)

;; Revoke caregiver authorization
(define-public (revoke-caregiver
    (patient-id (string-ascii 32))
    (caregiver-id (string-ascii 32)))
  (let ((caregiver-auth (unwrap! (map-get? patient-caregivers { patient-id: patient-id, caregiver-id: caregiver-id }) (err u404))))
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))

    (map-set patient-caregivers
      {
        patient-id: patient-id,
        caregiver-id: caregiver-id
      }
      (merge caregiver-auth { status: "revoked" })
    )
    (ok true)
  )
)

;; Create or update a care plan
(define-public (set-care-plan
    (patient-id (string-ascii 32))
    (care-goals (string-ascii 256))
    (required-services (string-ascii 256))
    (schedule (string-ascii 256)))
  (let ((patient (unwrap! (map-get? patients { patient-id: patient-id }) (err u404)))
        (current-time (unwrap-panic (get-block-info? time u0)))
        (existing-plan (map-get? care-plans { patient-id: patient-id })))
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))

    (if (is-some existing-plan)
      (map-set care-plans
        { patient-id: patient-id }
        (merge (unwrap-panic existing-plan) {
          care-goals: care-goals,
          required-services: required-services,
          schedule: schedule
        })
      )
      (map-insert care-plans
        { patient-id: patient-id }
        {
          created-by: tx-sender,
          creation-date: current-time,
          care-goals: care-goals,
          required-services: required-services,
          schedule: schedule,
          status: "active"
        }
      )
    )
    (ok true)
  )
)

;; Get patient details
(define-read-only (get-patient (patient-id (string-ascii 32)))
  (map-get? patients { patient-id: patient-id })
)

;; Get caregiver authorization
(define-read-only (get-caregiver-auth (patient-id (string-ascii 32)) (caregiver-id (string-ascii 32)))
  (map-get? patient-caregivers { patient-id: patient-id, caregiver-id: caregiver-id })
)

;; Get care plan
(define-read-only (get-care-plan (patient-id (string-ascii 32)))
  (map-get? care-plans { patient-id: patient-id })
)

;; Check if a caregiver is authorized for a patient
(define-read-only (is-authorized-caregiver (patient-id (string-ascii 32)) (caregiver-id (string-ascii 32)))
  (let ((auth (map-get? patient-caregivers { patient-id: patient-id, caregiver-id: caregiver-id })))
    (if (is-some auth)
      (is-eq (get status (unwrap-panic auth)) "active")
      false
    )
  )
)

;; Transfer admin rights
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (var-set admin new-admin)
    (ok true)
  )
)
