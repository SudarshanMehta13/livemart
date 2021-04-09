const Menu = require('../../models/menu')
function homeController() {
    return {
        async index(req, res) {
            res.render('home')
            console.log(req.session)
        }
    }
}

module.exports = homeController