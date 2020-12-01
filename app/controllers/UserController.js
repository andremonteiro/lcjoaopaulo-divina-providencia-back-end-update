const bcryptjs = require('bcryptjs');
const fs = require('fs');

module.exports = function (app) {
    const _self = {};
    const User = app.models.User;

    /**
     * createUser
     * @param {Object} req
     * @param {Object} res
     * @route /api/upload
     * @method POST
     */
    _self.updateAvatar = async (req, res, next) => {
        try{
            const user = req.body.userinfo;
            const date = Date.now();
            fs.writeFile(`./public/profile_photo/${user.name}_${date}.png`, req.body.imgsource, "base64", (err) => {
                if (err) {
                    throw err;
                }
                else{
                    res.status(200);
                }
            })   
            User.update(
                { avatar: `/profile_photo/${user.name}_${date}.png` },
                { where: { 'email': user.email } }
            )
            .then( result=> {
                return res.status(200).json({ filename: `${user.name}_${date}` });
            })
            .catch( err=> {
                return res.status(500).json({
                    errors: err,
                });
            })

        }
        catch(e){
            return res.status(500).json({
                errors: e.message,
            });
        }
    }
    /**
     * createUser
     * @param {Object} req
     * @param {Object} res
     * @route /api/user
     * @method POST
     */
    _self.createUser = async (req, res) => {
        console.log("I am here");
        try {
            const exituser = await User.findOne({ where: { 'email': req.body.email } });
            if(!exituser){
                const salt = await bcryptjs.genSalt(10);
                const hash = await bcryptjs.hash(req.body.password, salt);
                req.body.senha = hash;
                req.body.avatar = '';
                req.body.subscription = '';
                const newUser = await User.create(req.body);
                const { id, nome, email, avatar } = newUser;

                return res.status(200).json({ id, nome, email, avatar });
            }
            else{
                
                return res.status(401).json({
                    errors: 'This user is already registered',
                });
            }
        } catch (e) {
            console.log(e);
            return res.status(500).json({
                errors: e.message,
            });
        }
    }

    /**
     * getAvatar
     * @param {Object} req
     * @param {Object} res
     * @route /api/getAvatar
     * @method POST
    */
    _self.getAvatar = async (req, res, next) => {
        try{
            const exituser = await User.findOne({ where: { 'email': req.body.email } });
            return res.status(200).json({ uri: exituser.avatar });
        }catch(e){
            return res.status(500).json({
                errors: e.message,
            });
        }
    }

    
    _self.updatePassword = async (req, res, next) => {
        try{
            const exituser = await User.findOne({ where: { 'email': req.body.email } });
            if(exituser){
                const salt = await bcryptjs.genSalt(10);
                const hash = await bcryptjs.hash(req.body.password, salt);
                User.update(
                    { senha: hash },
                    { where: { 'email': req.body.email } }
                )
                return res.status(200).json({ message: "success!" });
            }else{
                return res.status(500).json({ message: "error!" });
            }
        }catch(e){
            return res.status(500).json({
                errors: e,
            });
        }
    }
    /**
     * authorizeRequest
     * @param {Object} req
     * @param {Object} res
    */
    _self.authorizeRequest = async (req, res, next) => {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({
                errors: ['Login required'],
            });
        }

        const [, token] = authorization.split(' ');

        try {
            const dados = jwt.verify(token, process.env.TOKEN_SECRET);
            const { id, email } = dados;

            const user = await User.findOne({
                where: {
                    id,
                    email,
                },
            });

            if (!user) {
                return res.status(401).json({
                    errors: ['Usuário inválido'],
                });
            }

            req.userId = id;
            req.userEmail = email;
            return next();
        } catch (e) {
            return res.status(401).json({
                errors: ['Token expirado ou inválido.'],
            });
        }

    }

    

    return _self;
}