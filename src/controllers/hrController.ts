/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import { Applicant, JoiningForm } from '../types/types'
import db from '../config/mysqlConnection'
import responseMessage from '../constants/responseMessage'
import httpError from '../util/httpError'
import { Client } from 'basic-ftp'
import { Readable } from 'stream'
import { OkPacket } from 'mysql2'

const ftpClient = new Client()

const bufferToReadable = (buffer: Buffer): Readable => {
    const readable = new Readable()
    readable.push(buffer)
    readable.push(null) // Indicates the end of the stream
    return readable
}

const uploadToFTP = async (fileBuffer: Buffer, fileName: string): Promise<void> => {
    const fileStream = bufferToReadable(fileBuffer)
    await ftpClient.uploadFrom(fileStream, fileName)
}

export default {
    createApplicant: async (req: Request, res: Response, nextFunc: NextFunction) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const applicant: Applicant = req.body

        if (!applicant.email || !applicant.name) {
            return httpResponse(req, res, 400, 'Name and email are required.')
        }

        try {
            await ftpClient.access({
                host: '173.231.207.59',
                user: 'superdolphin@superdolphins.com',
                password: 'K-A%HAgad1a2',
                secure: false
            })

            // Assert the type of req.files
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined

            const cvFile = files?.['cv'] ? files['cv'][0] : null
            const portfolioFile = files?.['portfolio'] ? files['portfolio'][0] : null

            if (cvFile) {
                await uploadToFTP(cvFile.buffer, cvFile.originalname)
            }

            if (portfolioFile) {
                await uploadToFTP(portfolioFile.buffer, portfolioFile.originalname)
            }

            const [result] = await db.query(
                'INSERT INTO applicants (name, email, phone_no, address, department,total_exp, current_ctc, expected_ctc, ctc_rate, cv, cover_letter, portfolio,status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    applicant.name,
                    applicant.email,
                    applicant.phone_no,
                    applicant.address,
                    applicant.department,
                    applicant.total_exp,
                    applicant.current_ctc,
                    applicant.expected_ctc,
                    applicant.ctc_rate,
                    cvFile ? cvFile.originalname : null,
                    applicant.cover_letter,
                    portfolioFile ? portfolioFile.originalname : null,
                    (applicant.status = 'Application Submitted')
                ]
            )

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
            httpResponse(req, res, 201, 'Application Created', { id: (result as any).insertId })
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        } finally {
            ftpClient.close()
        }
    },

    getApplicants: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const [rows] = await db.query('SELECT * FROM applicants')
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    updateApplicantStatus: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const applicantId = req.params.id // Get applicant ID from the URL
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { status } = req.body // Get new status from the request body

        // eslint-disable-next-line no-console
        console.log(applicantId)
        // eslint-disable-next-line no-console
        console.log(status)

        if (!status) {
            return httpResponse(req, res, 400, 'Status is required.')
        }

        try {
            const [result] = await db.query<OkPacket>('UPDATE `applicants` SET `status` = ? WHERE `applicants`.`id` = ?', [status, applicantId])

            if (result.affectedRows === 0) {
                return httpResponse(req, res, 404, 'Applicant not found.')
            }

            httpResponse(req, res, 200, 'Applicant status updated successfully.')
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    deleteApplicant: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const applicantId = req.params.id // Get applicant ID from the URL

        if (!applicantId) {
            return httpResponse(req, res, 400, 'Applicant ID is required.')
        }

        try {
            const [result] = await db.query<OkPacket>('DELETE FROM applicants WHERE id = ?', [applicantId])

            if (result.affectedRows === 0) {
                return httpResponse(req, res, 404, 'Applicant not found.')
            }

            httpResponse(req, res, 200, 'Applicant deleted successfully.')
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    createJoiningForm: async (req: Request, res: Response, nextFunc: NextFunction) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const joiningFormData: JoiningForm = req.body;
    
        // Validate required fields
        if (!joiningFormData.full_name || !joiningFormData.email_address) {
            return httpResponse(req, res, 400, 'Full name and email address are required.');
        }
    
        try {
            const [result] = await db.query<OkPacket>(
                `INSERT INTO joining_form (
                    full_name, gender, date_of_birth, nationality, marital_status, 
                    permanent_address, current_address, telephone_number, email_address, 
                    emergency_contact_name, emergency_relationship, emergency_telephone, 
                    emergency_email, emergency_address, parent_name, parent_contact_number, 
                    parent_job_profile, parent_address, education_school_university, 
                    education_degree_diploma, education_year_of_graduation,previous_company,
                    previous_position,previous_position_type,previous_dates_of_employment,
                    previous_reason_for_leaving,bank_name,account_number,account_holder_name,bank_branch,
                    blood_group,medical_conditions,medical_insurance,reference_name,reference_relationship,
                    reference_telephone,reference_email,declaration_signature, declaration_date,status

                ) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                    joiningFormData.full_name,
                    joiningFormData.gender,
                    joiningFormData.date_of_birth,
                    joiningFormData.nationality,
                    joiningFormData.marital_status,
                    joiningFormData.permanent_address,
                    joiningFormData.current_address,
                    joiningFormData.telephone_number,
                    joiningFormData.email_address,
                    joiningFormData.emergency_contact_name,
                    joiningFormData.emergency_relationship,
                    joiningFormData.emergency_telephone,
                    joiningFormData.emergency_email,
                    joiningFormData.emergency_address,
                    joiningFormData.parent_name,
                    joiningFormData.parent_contact_number,
                    joiningFormData.parent_job_profile,
                    joiningFormData.parent_address,
                    joiningFormData.education_school_university,
                    joiningFormData.education_degree_diploma,
                    joiningFormData.education_year_of_graduation,
                    joiningFormData.previous_company,
                    joiningFormData.previous_position,
                    joiningFormData.previous_position_type,
                    joiningFormData.previous_dates_of_employment,
                    joiningFormData.previous_reason_for_leaving,
                    joiningFormData.bank_name,
                    joiningFormData.account_number,
                    joiningFormData.account_holder_name,
                    joiningFormData.bank_branch,
                    joiningFormData.blood_group,
                    joiningFormData.medical_conditions,
                    joiningFormData.medical_insurance,
                    joiningFormData.reference_name,
                    joiningFormData.reference_relationship,
                    joiningFormData.reference_telephone,
                    joiningFormData.reference_email,
                    joiningFormData.declaration_signature,
                    joiningFormData.declaration_date,
                    joiningFormData.status = 'pending'
                ]
            );
    
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
            httpResponse(req, res, 201, 'Joining form created successfully.', { id: (result as any).insertId });
        } catch (err) {
            httpError(nextFunc, err, req, 500);
        }
    }
    


}



