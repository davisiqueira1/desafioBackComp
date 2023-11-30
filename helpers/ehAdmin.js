module.exports = {
    ehAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.ehAdmin === 1) return next();
        req.flash(
            "errorMessage",
            "Você não tem permissão para entrar nesta página"
        );

        res.redirect("/");
    },
};
