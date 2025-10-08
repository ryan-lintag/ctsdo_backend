import express from 'express';
import { 
  getAllApplications,
  createApplication,
  getApplicationById, 
  getApplicationsByUser,
  updateApplication, 
  deleteApplication, 
  approveApplication,
  rejectApplication
} from '../controllers/auth/applicationController.js';
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

router.post('/', checkAuth, createApplication);
router.get('/', getAllApplications);
router.get('/user', checkAuth, getApplicationsByUser);                                   
router.get('/:id', getApplicationById);             
router.put('/:id', updateApplication);              
router.delete('/:id', deleteApplication);  

router.put('/:id/approve', approveApplication);
router.put('/:id/reject', rejectApplication);
    

export default router;
