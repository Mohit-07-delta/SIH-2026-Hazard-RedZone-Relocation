import { Router } from 'express';
import { getHazards, getHabitations, getSafeZones } from '../data/store';
import { getVulnerableHabitations, generateRelocationPlan } from '../utils/spatial';

const router = Router();

router.get('/hazards', (req, res) => {
  res.json(getHazards());
});

router.get('/habitations', (req, res) => {
  res.json(getHabitations());
});

router.get('/habitations/vulnerable', (req, res) => {
  res.json(getVulnerableHabitations());
});

router.get('/safezones', (req, res) => {
  res.json(getSafeZones());
});

router.get('/relocation-plan', (req, res) => {
  const plan = generateRelocationPlan();
  res.json(plan);
});

export default router;
