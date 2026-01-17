const db = require('../db');

// Helper to check permission
const checkPermission = (permissionKey) => {
    return async (req, res, next) => {
        const userId = req.user.id;

        // 1. Check if user is Company Owner (Bypass check or have implied all permissions)
        // For now, let's query DB
        try {
            // Simplified RBAC query
            // Check if user has a role that has the permission
            const query = `
                SELECT 1 FROM user_roles ur
                JOIN role_permissions rp ON ur.role_id = rp.role_id
                JOIN permissions p ON rp.permission_id = p.id
                WHERE ur.user_id = ? AND p.key = ?
            `;

            db.get(query, [userId, permissionKey], (err, row) => {
                if (err) return res.status(500).json({ error: 'Auth Check Failed' });

                // Also allow if user is 'ADMIN' role in users table (Legacy compatibility) or Owner
                if (row || req.user.role === 'ADMIN' || req.user.role.endsWith('_MAIN')) {
                    next();
                } else {
                    return res.status(403).json({ error: 'Access Denied: Missing Permission ' + permissionKey });
                }
            });
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    };
};

module.exports = checkPermission;
