import express from 'express';
import {
  getAllCertificates,
  getAllCertificatesByUser,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate
} from '../controllers/auth/certificateController.js';
import { checkAuth } from "../middlewares/checkAuth.js";


const router = express.Router();

// Route to get all certificates
router.get('/', getAllCertificates);

// Route to get all certificates by user
router.get('/user', checkAuth, getAllCertificatesByUser);

// Route to get a single certificate by ID
router.get('/:id', getCertificateById);

// Route to create a new certificate
router.post('/', createCertificate);

// Route to update a certificate by ID
router.put('/:id', updateCertificate);

// Route to delete a certificate by ID
router.delete('/:id', deleteCertificate);

export default router;
