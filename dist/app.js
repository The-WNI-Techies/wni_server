import express from "express";
const app = express();
app.get("/", (req, res) => {
    res.send("Ready for some server-side shit!");
});
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
});
