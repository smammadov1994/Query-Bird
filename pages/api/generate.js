import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const formData = new FormData();
      req.files.forEach((file) => formData.append("recordings", file));

      const response = await axios.post(
        "https://your-external-server.com/api/endpoint",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      res.status(200).json(response.data);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error while sending the audio recording: " + error.message,
        });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
