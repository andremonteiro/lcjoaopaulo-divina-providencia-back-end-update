const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

module.exports = function (app) {
    const _self = {};
    const User = app.models.User;

    /**
     * get
     * @param {Object} req
     * @param {Object} res
     * @route /api/token
     * @method GET
     */
    _self.get = async (req, res) => {
        try {
            const { email = '', senha = '' } = req.body;

            if (!email || !senha) {
                return res.status(401).json({
                    errors: ['Credenciais inválidas'],
                });
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(401).json({
                    errors: ['Usuário não existe'],
                });
            }

            if (!(passwordIsValid(senha, user.senha))) {
                return res.status(401).json({
                    errors: ['Senha inválida'],
                });
            }

            const { id } = user;
            const token = jwt.sign({ id, email }, 'mega_hack_3.0', {});

            return res.json({ token, user: { nome: user.nome, id, email } });

        } catch (e) {
            console.log(e);
            return res.status(500).json({
                errors: e.message,
            });
        }
    }

        /**
     * signin
     * @param {Object} req
     * @param {Object} res
     * @route /api/sessions
     * @method POST
     */
    _self.signin = async (req, res) => {
        try{
            const { email, password} = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    errors: 'Usuário não existe'
                });
            }
            if (!(passwordIsValid(password, user.senha))) {
                return res.status(401).json({
                    errors: 'Senha inválida',
                });
            }

            const { id } = user;
            const token = jwt.sign({ id, email }, 'mega_hack_3.0', {});
            return res.json({ token, user: user.dataValues });
        }
        catch(e){
            return res.status(500).json({
                errors: e.message,
            });
        }
    }


    const passwordIsValid = (password, hash) => bcryptjs.compareSync(password, hash);

    return _self;
}
