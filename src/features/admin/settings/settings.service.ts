import axios from "axios";
import { SettingsSchema } from "./schema";

export const updateSettings = async (data: SettingsSchema) => {
  try {
    const response = await axios.put("/api/admin/settings", data);
    return response;
  } catch (error) {
    throw error;
  }
};
