const clientSchema = {
  name: String,
  phoneNumber: String, // Unique identifier
  status: String,
  chatHandover: { type: Boolean, default: false }, // New field for handover status
};
export default clientSchema;