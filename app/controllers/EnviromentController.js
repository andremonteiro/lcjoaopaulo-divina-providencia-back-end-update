
module.exports = function (app) {
    const _self = {};
    const Key = app.models.Enviroment;

    /**
     * createUser
     * @param {Object} req
     * @param {Object} res
     * @route /api/upload
     * @method GET
     */
    _self.getKey = async (req, res, next) => {
        try{
            const keys = await Key.findAll();
            return res.status(200).json({ data: keys });
        }
        catch(e){
            return res.status(500).json({
                errors: e.message,
            });
        }
    }

    return _self;
}