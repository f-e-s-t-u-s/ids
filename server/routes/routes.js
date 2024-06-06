import express from 'express';
import alertsController from '../controllers/alerts.controller.js';

const router = express.Router();



router.post(
    '/sendAlert',
    alertsController.handleSendAlert,
)

router.get(
    '/anomalies',
    alertsController.handleGetAnomalies,
)

router.post(
    '/register',
    alertsController.handleRegisterUser,
)
router.post(
    '/login',
    alertsController.handleLoginUser,
)
router.post(
    '/forgot-password',
    alertsController.handleForgotPassword,
)


export default router;