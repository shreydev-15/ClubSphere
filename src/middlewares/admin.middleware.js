function adminAuth(req, res, next) {
	if (!req.user) {
		return res.status(401).json({
			success: false,
			message: "Unauthorized access"
		});
	}

	if (req.user.role !== "admin") {
		return res.status(403).json({
			success: false,
			message: "Only admins can perform this action"
		});
	}

	next();
}

module.exports = { adminAuth };
