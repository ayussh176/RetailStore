const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized: Please log in' });
};

const hasRole = (role) => {
    return (req, res, next) => {
        if (req.session.user && req.session.user.role === role) {
            return next();
        }
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    };
};

module.exports = { isAuthenticated, hasRole };
