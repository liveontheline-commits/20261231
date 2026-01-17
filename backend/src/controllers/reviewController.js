const db = require('../db');

function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function getQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

exports.addReview = async (req, res) => {
    const { loadId, revieweeCompanyId, score, comment } = req.body;
    const reviewerId = req.user.id;

    try {
        // Check if load is completed ? (Optional business logic, skip for now to simplify testing)

        await runQuery(
            `INSERT INTO reviews (reviewer_id, reviewee_company_id, load_id, score, comment) VALUES (?, ?, ?, ?, ?)`,
            [reviewerId, revieweeCompanyId, loadId, score, comment]
        );
        res.json({ message: 'Review submitted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to submit review' });
    }
};

exports.getCompanyReviews = async (req, res) => {
    const { companyId } = req.params;
    try {
        const row = await getQuery(
            `SELECT AVG(score) as average_score, COUNT(*) as count FROM reviews WHERE reviewee_company_id = ?`,
            [companyId]
        );
        res.json(row);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};
