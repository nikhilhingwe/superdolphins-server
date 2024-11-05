import { Router } from 'express'
import hrController from '../controllers/hrController'
import { uploadFiles } from '../services/fileUploadService'

const router = Router()

// Applicants
router.route('/create-applicant').post(uploadFiles, hrController.createApplicant)
router.route('/get-applicants').get(hrController.getApplicants)
router.route('/applicant-status-update/:id').post(hrController.updateApplicantStatus)
router.route('/applicant-delete/:id').delete(hrController.deleteApplicant)

// Joining Form
router.route('/joining-form-create').post(hrController.createJoiningForm)



export default router
