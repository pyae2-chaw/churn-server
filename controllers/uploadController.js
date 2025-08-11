export const uploadCSV = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // File info
    const filePath = req.file.path;
    console.log("Uploaded file path:", filePath);

    // TODO: Here you can load and process the file with your ML model

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      filePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
