const express = require('express');
const {
    planController
} = require('../controllers');

const router = express.Router();

router
    .route('/')
    .post(planController.createPlan);

router
    .route('/:objectId')
    .get(planController.getPlan)
    .delete(planController.deletePlan)

module.exports = router;