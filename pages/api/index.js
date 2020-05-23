import message from "./test";

export default async (req, res) => {
	return res.end(`
    db user: ${process.env.DB_USER}
    message: ${message}
    `);
};
