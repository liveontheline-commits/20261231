// backend/src/controllers/OfferController.js
const Offer = require('../models/Offer');
const Job = require('../models/Job');

exports.submitOffer = async (req, res) => {
  const { jobId, price, message } = req.body;
  const carrierId = req.user.companyId;

  // 1. İşin hala aktif olup olmadığını kontrol et
  const job = await Job.findById(jobId);
  if (job.status !== 'published') {
    return res.status(400).json({ error: "Bu iş artık tekliflere açık değil." });
  }

  // 2. Teklifi kaydet
  const newOffer = await Offer.create({
    jobId,
    carrierCompanyId: carrierId,
    price,
    message,
    status: 'pending'
  });

  res.status(201).json(newOffer);
};