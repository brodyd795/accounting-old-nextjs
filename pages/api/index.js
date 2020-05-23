export default async (req, res) => {
	return res.end(`
    db user: ${process.env.DB_USER}
    `);
};
