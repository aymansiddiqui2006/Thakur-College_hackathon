import asyncHandler from "express-async-handler";

app.get(
  "/",
  asyncHandler(async (req, res) => {
    const files = await File.find();
    res.json(files);
  })
);
