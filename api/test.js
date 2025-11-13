module.exports = async (req, res) => {
    res.json({ message: 'API is working!', method: req.method, body: req.body });
};
