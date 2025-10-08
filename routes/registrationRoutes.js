import express from 'express';
import {
  getAllRegistrations,
  getRegistrationsByUser,
  getRegistrationById,
  createRegistration,
  updateRegistration,
  deleteRegistration,
  approveRegistration,
  rejectRegistration
} from '../controllers/auth/registrationController.js';
import { checkAuth } from "../middlewares/checkAuth.js";


const router = express.Router();

// Add debugging middleware
router.use((req, res, next) => {
  console.log(`Registration route: ${req.method} ${req.path}`);
  next();
});

router.post('/', checkAuth, createRegistration);

// Route to get all registrations
router.get('/', getAllRegistrations);

// IMPORTANT: /user route MUST come before /:id route
router.get('/user', checkAuth, getRegistrationsByUser);

// Route to get a single registration by ID
router.get('/:id', getRegistrationById);

// Route to update a registration by ID
router.put('/:id', updateRegistration);

// Route to delete a registration by ID
router.delete('/:id', deleteRegistration);

// Approval and rejection routes
router.put('/:id/approve', approveRegistration);
router.put('/:id/reject', rejectRegistration);


export default router;